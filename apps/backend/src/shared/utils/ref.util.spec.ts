import { Types } from 'mongoose';

import { toRef } from './ref.util';

describe('toRef', () => {
  it('stringifies bare ObjectIds and keeps populated refs as objects', () => {
    const id = new Types.ObjectId();
    const district = { _id: id, districtName: 'บางรัก', provinceName: 'กรุงเทพมหานคร' };

    expect(toRef(id)).toBe(id.toHexString());
    expect(toRef(id.toHexString())).toBe(id.toHexString());
    expect(toRef(district)).toBe(district);
    expect([id, district].map(toRef)).toEqual([id.toHexString(), district]);
    expect(toRef(undefined)).toBeUndefined();
    expect(toRef(null)).toBeUndefined();
  });
});
