import { ConfigService } from '@nestjs/config';
import sharp from 'sharp';
import {
  MinioClientService,
  RECYCLE_PREFIX,
  isExternalFileValue,
} from './minio-client.service';

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

  it('keeps an svg icon as svg instead of rasterising it', async () => {
    put.mockClear();

    const svg = Buffer.from(
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/></svg>'
    );
    const path = await service.uploadFile({
      buffer: svg,
      originalname: 'icon.svg',
      mimetype: 'image/svg+xml',
    } as any);

    expect(path).toMatch(/^[0-9a-f-]{36}\.svg$/);

    const [, key, body, , meta] = put.mock.calls[0];
    expect(key).toBe(path);
    expect(meta['Content-Type']).toBe('image/svg+xml');
    expect(body.toString()).toBe(svg.toString());
  });

  it('recycles under a prefix in the same bucket and restores from it', async () => {
    expect(await service.moveObjectToRecycleBin('a.webp')).toBe(`${RECYCLE_PREFIX}a.webp`);
    expect(copy).toHaveBeenCalledWith('b', `${RECYCLE_PREFIX}a.webp`, '/b/a.webp', expect.anything());
    expect(remove).toHaveBeenCalledWith('b', 'a.webp');
    expect(await service.restoreObjectFromRecycleBin(`${RECYCLE_PREFIX}a.webp`)).toBe('a.webp');
  });

  it('leaves values that are not ours alone', async () => {
    // job posts seeded before this bucket still point at the retired storage host
    const legacy = 'storage.thaieconomap.com/chial-share-dev/old.jpg';

    expect(isExternalFileValue(legacy)).toBe(true);
    expect(isExternalFileValue('https://line.me/x.png')).toBe(true);
    expect(isExternalFileValue('a.webp')).toBe(false);
    expect(isExternalFileValue(`${RECYCLE_PREFIX}a.webp`)).toBe(false);

    copy.mockClear();
    remove.mockClear();

    expect(await service.moveObjectToRecycleBin(legacy)).toBe(legacy);
    expect(await service.restoreObjectFromRecycleBin(legacy)).toBe(legacy);
    await service.delete(legacy);

    expect(copy).not.toHaveBeenCalled();
    expect(remove).not.toHaveBeenCalled();
  });

  it('does not fail a delete when the object is already gone', async () => {
    remove.mockRejectedValueOnce(new Error('Key not found'));

    await expect(service.delete('missing.webp')).resolves.toBeUndefined();
  });

  it('maps a presigned url back to the stored object path', () => {
    expect(service.toObjectPath('https://s3/b/a.webp?X-Amz-Signature=xyz')).toBe('a.webp');
    expect(service.toObjectPath(`https://s3/b/${RECYCLE_PREFIX}a.webp?sig=1`)).toBe(
      `${RECYCLE_PREFIX}a.webp`
    );
    // already a path, or a url that was never ours
    expect(service.toObjectPath('a.webp')).toBe('a.webp');
    expect(service.toObjectPath('https://line.me/x.png')).toBe('x.png');
  });

  it('presigns a path for GET on the private bucket', async () => {
    expect(await service.getFileUrl('a.webp')).toBe('https://s3/b/a.webp?sig');
    expect(presignedUrl).toHaveBeenCalledWith('GET', 'b', 'a.webp', 7 * 24 * 60 * 60);
  });
});
