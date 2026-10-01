import 'reflect-metadata';

import { CommercialCategory, DayName } from '@thaieconomap/contracts';

import { ITamsangTamsongShopResponse } from '../../../shared/interfaces';

import { CachingMapper } from './caching.mapper';

const SHOP: ITamsangTamsongShopResponse = {
  id: '3f2a91c4-7b18-4e6d-9a03-5c8e1d720b64',
  name: 'ร้านข้าวมันไก่',
  type: 'restaurant' as ITamsangTamsongShopResponse['type'],
  baseId: 'b7d4e0a1-2c95-4f38-8e6b-1d0a3c72f594',
  imageUrl: '',
  locationAddress: null,
  latitude: 13.756331,
  longitude: 100.501765,
  ownerUser: { id: '9f1c8b42', firstname: 'สมชาย', lastname: 'ใจดี', phone: null },
  hours: [
    { day: 'monday', enabled: true, openTime: 480, closeTime: 1080 },
    { day: 'tuesday', enabled: true, openTime: 1080, closeTime: 120 },
    { day: 'wednesday', enabled: true, openTime: 0, closeTime: 1440 },
    { day: 'thursday', enabled: false, openTime: 0, closeTime: 0 },
  ],
};

describe('CachingMapper.transformTamsangTamsongShopToShop', () => {
  const shop = CachingMapper.transformTamsangTamsongShopToShop(SHOP);

  it('derives a stable ObjectId from the upstream uuid and keeps the uuid', () => {
    expect(String(shop._id)).toMatch(/^[0-9a-f]{24}$/);
    expect(String(shop._id)).toBe(
      String(CachingMapper.transformTamsangTamsongShopToShop(SHOP)._id),
    );
    expect(String(shop._id)).not.toBe(String(shop.base));
    expect(shop.sourceId).toBe(SHOP.id);
  });

  it('maps the shop type to a commercial category', () => {
    expect(shop.category).toBe(CommercialCategory.RESTAURANT);
  });

  it('survives a shop with no photo, address or owner phone', () => {
    expect(shop.imageUrl).toBe('');
    expect(shop.address).toBeUndefined();
    expect(shop.phoneNumber).toBeUndefined();
    expect(shop.commercialOwner).toBe('สมชาย ใจดี');
  });

  it('emits all seven days sunday-first, so opening[getDay()] lines up', () => {
    expect(shop.opening.map(({ day }) => day)).toEqual([
      DayName.Sunday,
      DayName.Monday,
      DayName.Tuesday,
      DayName.Wednesday,
      DayName.Thursday,
      DayName.Friday,
      DayName.Saturday,
    ]);
  });

  it('cuts an overnight window at midnight and carries the rest onto the next day', () => {
    const [, monday, tuesday, wednesday, thursday] = shop.opening;

    expect(monday).toEqual({
      day: DayName.Monday,
      enable: true,
      hours: [{ open: 480, close: 1080 }],
    });
    expect(tuesday.hours).toEqual([{ open: 1080, close: 1440 }]);
    // wednesday keeps its own 24h window plus tuesday's spill-over
    expect(wednesday.hours).toEqual([
      { open: 0, close: 120 },
      { open: 0, close: 1440 },
    ]);
    expect(thursday).toEqual({ day: DayName.Thursday, enable: false, hours: [] });
  });

  it('treats a day missing from the payload as closed', () => {
    const [sunday] = shop.opening;

    expect(sunday).toEqual({ day: DayName.Sunday, enable: false, hours: [] });
  });

  it('keeps an overnight window whole for display', () => {
    expect(shop.displayOpening).toEqual([
      { days: 'วันจันทร์', time: [{ open: '08.00', close: '18.00' }] },
      { days: 'วันอังคาร', time: [{ open: '18.00', close: '02.00' }] },
      { days: 'วันพุธ', time: [{ open: '00.00', close: '24.00' }] },
    ]);
  });
});

describe('CachingMapper.transformTamsangTamsongBaseShopToBase', () => {
  it('maps a node without a LINE channel without inventing one', () => {
    const base = CachingMapper.transformTamsangTamsongBaseShopToBase({
      id: 'b7d4e0a1-2c95-4f38-8e6b-1d0a3c72f594',
      name: null,
      signature: 'BKL',
      tamsangEnabled: true,
      tamsongPassengerEnabled: true,
      tamsongParcelEnabled: false,
      latitude: 18.633331,
      longitude: 98.883331,
      serviceRadiusKm: 10,
      locationAddress: null,
      adminPhone: null,
      botInfo: null,
    });

    expect(base.sourceId).toBe('b7d4e0a1-2c95-4f38-8e6b-1d0a3c72f594');
    expect(base.name).toBeUndefined();
    expect(base.botInfo).toBeUndefined();
    expect(base.location.coordinates).toEqual([98.883331, 18.633331]);
    expect(base.serviceRadiusKm).toBe(10);
  });

  it('is the id a shop points at through baseId', () => {
    const base = CachingMapper.transformTamsangTamsongBaseShopToBase({
      id: SHOP.baseId,
      name: 'ตำบลบ้านกลาง',
      signature: 'BKL',
      tamsangEnabled: true,
      tamsongPassengerEnabled: false,
      tamsongParcelEnabled: false,
      latitude: null,
      longitude: null,
      serviceRadiusKm: 10,
      locationAddress: null,
      adminPhone: null,
      botInfo: {
        basicId: '@tamsang-banklang',
        displayName: 'ตามสั่ง-ตามส่ง บ้านกลาง',
        lineImageUrl: 'https://profile.line-scdn.net/0h9Xk2/preview.png',
      },
    });

    expect(String(base._id)).toBe(
      String(CachingMapper.transformTamsangTamsongShopToShop(SHOP).base),
    );
    expect(base.botInfo.basicId).toBe('@tamsang-banklang');
    expect(base.location).toBeNull();
  });
});
