import { UserRole } from 'src/users/schemas/user-role.enum';

import { canEditJobPost } from './job-posts.service';

const postIn = (district: string) => ({ location: { address: { district } } }) as any;
const user = (role: UserRole, districts: unknown[] = []) => ({ role, districts }) as any;

describe('canEditJobPost', () => {
  it('lets an admin edit any post', () => {
    expect(canEditJobPost(user(UserRole.Admin), postIn('bangkok'))).toBe(true);
    expect(canEditJobPost(user(UserRole.Admin), {} as any)).toBe(true);
  });

  it('lets a manager edit only posts in their districts', () => {
    const manager = user(UserRole.Manager, ['bangkok', 'chiangmai']);

    expect(canEditJobPost(manager, postIn('chiangmai'))).toBe(true);
    expect(canEditJobPost(manager, postIn('phuket'))).toBe(false);
  });

  it('refuses a manager with no districts, or a post with no district', () => {
    expect(canEditJobPost(user(UserRole.Manager), postIn('bangkok'))).toBe(false);
    expect(canEditJobPost(user(UserRole.Manager, ['bangkok']), {} as any)).toBe(false);
  });

  it('compares ObjectId-like values by string', () => {
    const asObjectId = { toString: () => 'bangkok' };
    const manager = user(UserRole.Manager, [asObjectId]);

    expect(canEditJobPost(manager, postIn('bangkok'))).toBe(true);
  });
});
