import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MinioClientService } from 'src/minio-client/minio-client.service';

// response fields that hold object paths in the DB and must go out as presigned URLs
export const FILE_FIELDS = new Set(['imageUrls', 'iconUrl']);

// legacy rows hold a host-qualified value with no scheme ("storage.thaieconomap.com/x.png");
// our own paths are "<uuid>.webp" or "recycle/<uuid>.webp", which never look like "host.tld/"
const isHostLike = (v: string) => /^[\w.-]+\.[a-z]{2,}\//i.test(v);
const isExternal = (v: string) => v.startsWith('http') || isHostLike(v);
const withScheme = (v: string) => (v.startsWith('http') ? v : `https://${v}`);

/**
 * Same idea as thaieconomap's transformFileUrl, applied to every response:
 * walks the (serialized) body and presigns any FILE_FIELDS value that is a
 * bare object path. Values already starting with http (LINE avatars, legacy
 * data) pass through untouched.
 */
@Injectable()
export class FileUrlInterceptor implements NestInterceptor {
  constructor(private readonly minio: MinioClientService) {}

  intercept(_: ExecutionContext, next: CallHandler): Observable<unknown> {
    return next.handle().pipe(map((body) => this.transform(body)));
  }

  async transform(body: unknown) {
    if (body === undefined || body === null || Buffer.isBuffer(body)) return body;
    // mongoose documents -> plain json first, then rewrite in place
    const plain = JSON.parse(JSON.stringify(body));
    await this.walk(plain);
    return plain;
  }

  private async walk(node: unknown): Promise<void> {
    if (Array.isArray(node)) {
      await Promise.all(node.map((item) => this.walk(item)));
      return;
    }
    if (!node || typeof node !== 'object') return;

    const record = node as Record<string, unknown>;
    for (const [key, value] of Object.entries(record)) {
      if (FILE_FIELDS.has(key)) {
        record[key] = await this.sign(value);
      } else {
        await this.walk(value);
      }
    }
  }

  private async sign(value: unknown): Promise<unknown> {
    if (typeof value === 'string') {
      if (!value) return value;
      return isExternal(value) ? withScheme(value) : this.minio.getFileUrl(value);
    }
    if (Array.isArray(value)) {
      return Promise.all(value.map((v) => this.sign(v)));
    }
    return value;
  }
}
