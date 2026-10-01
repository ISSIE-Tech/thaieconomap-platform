import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';

import { SiteContent, SiteContentKey } from './schemas/site-content.schema';
import { SITE_CONTENT_DEFAULTS } from './site-contents.defaults';

// Long enough for a full legal document in one field.
const MAX_VALUE_LENGTH = 50_000;

@Injectable()
export class SiteContentsService {
  constructor(@InjectModel(SiteContent.name) private readonly model: Model<SiteContent>) {}

  async get(key: SiteContentKey) {
    const doc = await this.model.findOne({ key }).lean();

    return {
      key,
      strings: {
        ...SITE_CONTENT_DEFAULTS[key],
        ...Object.fromEntries((doc?.entries ?? []).map(({ key: k, th, en }) => [k, { th, en }])),
      },
      updatedAt: doc?.updatedAt ?? null,
    };
  }

  async update(key: SiteContentKey, strings: unknown, userId: string) {
    await this.model.updateOne(
      { key },
      { $set: { entries: this.validate(key, strings), updatedBy: userId } },
      { upsert: true },
    );

    return this.get(key);
  }

  /** Only keys the page knows about, each a { th, en } pair of bounded strings. */
  private validate(key: SiteContentKey, strings: unknown): SiteContent['entries'] {
    if (!strings || typeof strings !== 'object' || Array.isArray(strings)) {
      throw new BadRequestException('strings must be an object');
    }

    const known = SITE_CONTENT_DEFAULTS[key];
    const clean: SiteContent['entries'] = [];

    for (const [k, v] of Object.entries(strings)) {
      if (!(k in known)) throw new BadRequestException(`unknown key: ${k}`);

      const { th, en } = (v ?? {}) as Record<string, unknown>;

      if (typeof th !== 'string' || typeof en !== 'string') {
        throw new BadRequestException(`${k} must have string th and en`);
      }

      if (th.length > MAX_VALUE_LENGTH || en.length > MAX_VALUE_LENGTH) {
        throw new BadRequestException(`${k} is too long`);
      }

      clean.push({ key: k, th, en });
    }

    return clean;
  }
}
