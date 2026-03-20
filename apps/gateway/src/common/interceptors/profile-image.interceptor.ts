import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';

import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { MinioClientService } from '../../modules/minio-client/minio-client.service';
import { UserDocument } from '../../modules/users/schemas';

@Injectable()
export class ProfileImageInterceptor implements NestInterceptor {
  constructor(private readonly minioClientService: MinioClientService) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<UserDocument | UserDocument[]> | Promise<Observable<UserDocument | UserDocument[]>> {
    return next.handle().pipe(
      switchMap(async (data: UserDocument | UserDocument[]) => {
        
        if (!data) {
          return data;
        }

        if (data instanceof Array) {

          return this.transformFileUrlsInArray(data);
        }

        return this.transformFileUrl(data as UserDocument);
      }),
    );
  }

  private transformFileUrlsInArray(data: UserDocument[]): Promise<UserDocument[]> {
    return Promise.all(data.map(item => this.transformFileUrl(item)));
  }

  private async transformFileUrl(data: UserDocument): Promise<UserDocument> {
    const fileUrl = data.profileImageUrl;
    const isExternalFileUrl = fileUrl?.startsWith('http');

    if (fileUrl && !isExternalFileUrl) {
      data.profileImageUrl = await this.minioClientService.getFileUrl(fileUrl);
    }

    return data;
  }
}
