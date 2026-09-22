import { UserRole } from '../../../shared/enums';
import { roleFromGroups } from './authentik-oauth.service';

describe('roleFromGroups', () => {
  it('maps <prefix>-<role> per service', () => {
    const groups = ['thaieconomap-manager', 'csc-admin'];
    expect(roleFromGroups(groups, 'thaieconomap')).toBe(UserRole.MANAGER);
    expect(roleFromGroups(groups, 'csc')).toBe(UserRole.ADMIN);
  });

  it('gives the most privileged role when several match', () => {
    expect(roleFromGroups(['csc-manager', 'csc-dev'], 'csc')).toBe(UserRole.DEVELOPER);
    expect(roleFromGroups(['csc-manager', 'csc-admin'], 'csc')).toBe(UserRole.ADMIN);
  });

  it('is undefined when the service has no group, and does not match across services', () => {
    expect(roleFromGroups(['csc-admin'], 'thaieconomap')).toBeUndefined();
    expect(roleFromGroups([], 'csc')).toBeUndefined();
    // "thaieconomap-admin" must not satisfy the "csc" prefix
    expect(roleFromGroups(['thaieconomap-admin'], 'csc')).toBeUndefined();
  });
});
