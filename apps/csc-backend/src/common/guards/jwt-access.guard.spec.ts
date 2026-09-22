import { createHmac } from 'crypto';
import { mapGatewayRole, verifyApiKey } from './jwt-access.guard';

describe('gateway auth helpers', () => {
  const hash = createHmac('sha256', 'secret').update('key').digest('hex');

  it('verifies the gateway HMAC api-key', () => {
    expect(verifyApiKey('key', 'secret', hash)).toBe(true);
    expect(verifyApiKey('key', 'wrong', hash)).toBe(false);
    expect(verifyApiKey('key', 'secret', 'short')).toBe(false);
    expect(verifyApiKey(undefined, undefined, hash)).toBe(false);
  });

  it('maps gateway CSC roles', () => {
    expect(mapGatewayRole('DEVELOPER')).toBe('ADMIN');
    expect(mapGatewayRole('MANAGER')).toBe('MANAGER');
    expect(mapGatewayRole(undefined)).toBe('CUSTOMER');
    expect(mapGatewayRole('root')).toBe('CUSTOMER');
  });
});
