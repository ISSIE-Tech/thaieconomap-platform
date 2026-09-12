import * as crypto from 'crypto';

export const generateMd5Hash = (data: string): string => {
  return generateHash('md5', data);
};

export const generateSha256Hash = (data: string): string => {
  return generateHash('sha256', data);
};

const generateHash = (
  algorithm: string,
  data: string,
  format: crypto.BinaryToTextEncoding = 'hex',
): string => {
  return crypto.createHash(algorithm).update(data).digest(format);
};

export const generateHmacSha256Hash = (data: string, secret: string): string => {
  return crypto.createHmac('sha256', secret).update(data).digest('hex');
};

export const verifySha256Hash = async (data: string, hash: string): Promise<boolean> => {
  const hashedData = generateSha256Hash(data);

  return verifyHash(hashedData, hash);
};

export const verifyHmacSha256Hash = (data: string, secret: string, hash: string): boolean => {
  const hashedData = generateHmacSha256Hash(data, secret);

  return verifyHash(hashedData, hash);
};

const verifyHash = (hashedData: string, hash: string): boolean => {
  if (Buffer.byteLength(hash) !== Buffer.byteLength(hashedData)) {
    return false;
  }

  return crypto.timingSafeEqual(
    new Uint8Array(Buffer.from(hash)),
    new Uint8Array(Buffer.from(hashedData)),
  );
};
