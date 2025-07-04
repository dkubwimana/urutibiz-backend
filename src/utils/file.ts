// File utilities placeholder
import fs from 'fs';
import path from 'path';

export const ensureDirectory = (dirPath: string): void => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

export const getFileExtension = (filename: string): string => {
  return path.extname(filename).toLowerCase();
};

export const isValidFileType = (filename: string, allowedTypes: string[]): boolean => {
  const ext = getFileExtension(filename);
  return allowedTypes.includes(ext);
};

export const formatFileSize = (bytes: number): string => {
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  if (bytes === 0) return '0 Bytes';
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
};
