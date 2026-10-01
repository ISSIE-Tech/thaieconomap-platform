import { BadRequestException } from '@nestjs/common';

import { SiteContentKey } from './schemas/site-content.schema';
import { SITE_CONTENT_DEFAULTS } from './site-contents.defaults';
import { SiteContentsService } from './site-contents.service';

// In-memory stand-in for the mongoose model: just the two calls the service makes.
const fakeModel = () => {
  const docs = new Map<string, any>();

  return {
    findOne: ({ key }) => ({ lean: async () => docs.get(key) ?? null }),
    updateOne: async ({ key }, { $set }) => docs.set(key, { key, ...$set, updatedAt: new Date() }),
  };
};

describe('SiteContentsService', () => {
  let service: SiteContentsService;

  beforeEach(() => {
    service = new SiteContentsService(fakeModel() as any);
  });

  it('returns defaults until something is saved', async () => {
    const { strings, updatedAt } = await service.get(SiteContentKey.ABOUT);

    expect(strings).toEqual(SITE_CONTENT_DEFAULTS.about);
    expect(updatedAt).toBeNull();
  });

  it('merges saved dotted keys over defaults', async () => {
    await service.update(SiteContentKey.ABOUT, { 'hero.01': { th: 'ใหม่', en: 'New' } }, 'u1');

    const { strings } = await service.get(SiteContentKey.ABOUT);

    expect(strings['hero.01']).toEqual({ th: 'ใหม่', en: 'New' });
    expect(strings['hero.02']).toEqual(SITE_CONTENT_DEFAULTS.about['hero.02']);
  });

  it('rejects unknown keys, bad shapes and oversized values', async () => {
    const bad = [
      { nope: { th: '', en: '' } },
      { title: { th: 'x' } },
      { title: { th: 'x'.repeat(50_001), en: '' } },
      [],
    ];

    for (const strings of bad) {
      await expect(service.update(SiteContentKey.TERMS, strings, 'u1')).rejects.toThrow(BadRequestException);
    }
  });
});
