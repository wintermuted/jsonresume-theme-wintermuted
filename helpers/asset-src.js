import fs from 'node:fs';
import path from 'node:path';

const INLINE_CACHE = new Map();
const PASSTHROUGH_PREFIX = /^(?:[a-z]+:|\/\/|#)/i;
const MIME_TYPES = {
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.avif': 'image/avif',
};

export function assetSrc(src) {
  if (typeof src !== 'string' || src.length === 0) return src;
  if (PASSTHROUGH_PREFIX.test(src)) return src;

  const cached = INLINE_CACHE.get(src);
  if (cached) return cached;

  const [cleanSrc] = src.split(/[?#]/, 1);
  const absolutePath = path.isAbsolute(cleanSrc)
    ? cleanSrc
    : path.resolve(process.cwd(), cleanSrc);

  if (!fs.existsSync(absolutePath)) return src;

  const extension = path.extname(cleanSrc).toLowerCase();
  const mimeType = MIME_TYPES[extension];
  if (!mimeType) return src;

  const buffer = fs.readFileSync(absolutePath);
  const dataUrl = `data:${mimeType};base64,${buffer.toString('base64')}`;
  INLINE_CACHE.set(src, dataUrl);
  return dataUrl;
}