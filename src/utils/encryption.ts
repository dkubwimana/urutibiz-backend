// Encryption utilities placeholder
import crypto from 'crypto';

export const hashPassword = (password: string): string => {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
  return salt + ':' + hash;
};

export const verifyPassword = (password: string, hashedPassword: string): boolean => {
  const parts = hashedPassword.split(':');
  const salt = parts[0];
  const hash = parts[1];
  const newHash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
  return hash === newHash;
};

export const generateRandomString = (length: number = 32): string => {
  return crypto.randomBytes(length).toString('hex');
};
