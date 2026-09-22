import { ConfigService } from '@nestjs/config';
import sharp from 'sharp';
import { MinioClientService, RECYCLE_PREFIX } from './minio-client.service';

describe('MinioClientService', () => {
  const put = jest.fn(), copy = jest.fn(), remove = jest.fn();
  const presignedUrl = jest.fn(async (_m: string, b: string, k: string) => `https://s3/${b}/${k}?sig`);
  const config = { get: (k: string) => ({ MINIO_BUCKET: 'b' })[k] };
  const service = new MinioClientService(
    { client: { putObject: put, copyObject: copy, removeObject: remove, presignedUrl } } as any,
    config as unknown as ConfigService,
  );

  it('stores every upload as webp in the bucket root and returns the path', async () => {
    const png = await sharp({ create: { width: 4, height: 4, channels: 3, background: '#f00' } }).png().toBuffer();
    const path = await service.uploadFile({ buffer: png, originalname: 'x.png', mimetype: 'image/png' } as any);
    expect(path).toMatch(/^[0-9a-f-]{36}\.webp$/);
    const [, key, body, , meta] = put.mock.calls[0];
    expect(key).toBe(path);
    expect(meta['Content-Type']).toBe('image/webp');
    expect((await sharp(body).metadata()).format).toBe('webp');
  });

  it('recycles under a prefix in the same bucket and restores from it', async () => {
    expect(await service.moveObjectToRecycleBin('a.webp')).toBe(`${RECYCLE_PREFIX}a.webp`);
    expect(copy).toHaveBeenCalledWith('b', `${RECYCLE_PREFIX}a.webp`, '/b/a.webp', expect.anything());
    expect(remove).toHaveBeenCalledWith('b', 'a.webp');
    expect(await service.restoreObjectFromRecycleBin(`${RECYCLE_PREFIX}a.webp`)).toBe('a.webp');
  });

  it('presigns a path for GET on the private bucket', async () => {
    expect(await service.getFileUrl('a.webp')).toBe('https://s3/b/a.webp?sig');
    expect(presignedUrl).toHaveBeenCalledWith('GET', 'b', 'a.webp', 7 * 24 * 60 * 60);
  });
});
