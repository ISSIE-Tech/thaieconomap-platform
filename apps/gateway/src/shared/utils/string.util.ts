export const generateUrlWithQuery = (url: string, queries: Record<string, string>): string => {
  const query = Object.entries(queries)
    .map(([key, value]) => encodeURIComponent(key) + '=' + encodeURIComponent(value))
    .join('&');

  return `${url}?${query}`;
};

export const generateRandomString = (
  length: number,
  chars: string = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ',
): string => {
  let result = '';

  for (let i = 0; i < length; ++i) result += chars[Math.floor(Math.random() * chars.length)];

  return result;
};

export const formatPhoneNumber = (phoneNumber: string): string => {
  if (!phoneNumber) return undefined;

  return phoneNumber.replace(/\D/g, '');
};

export const prettyObjectString = (obj: Object): string => {
  return `${JSON.stringify(obj, null, 2)}`;
};
