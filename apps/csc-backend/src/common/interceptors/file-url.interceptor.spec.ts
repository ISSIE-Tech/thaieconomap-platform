import { FileUrlInterceptor } from './file-url.interceptor';

describe('FileUrlInterceptor', () => {
  const minio = { getFileUrl: jest.fn(async (p: string) => `https://s3/b/${p}?sig`) };
  const interceptor = new FileUrlInterceptor(minio as any);

  it('presigns nested paths, keeps external urls, ignores other fields', async () => {
    const out: any = await interceptor.transform({
      jobPosts: {
        data: [
          {
            imageUrls: ['a.webp', 'https://line.me/x.png', 'storage.thaieconomap.com/old.png'],
            category: { iconUrl: 'recycle/i.webp' },
            createdBy: { profileImageUrl: 'p.webp' },
            title: 'a.webp',
          },
        ],
      },
    });
    const post = out.jobPosts.data[0];
    expect(post.imageUrls).toEqual([
      'https://s3/b/a.webp?sig',
      'https://line.me/x.png',
      'https://storage.thaieconomap.com/old.png',
    ]);
    expect(post.category.iconUrl).toBe('https://s3/b/recycle/i.webp?sig');
    expect(post.createdBy.profileImageUrl).toBe('p.webp');
    expect(post.title).toBe('a.webp');
  });

  it('passes through empty bodies', async () => {
    expect(await interceptor.transform(undefined)).toBeUndefined();
    expect(await interceptor.transform({ iconUrl: '' })).toEqual({ iconUrl: '' });
  });
});
