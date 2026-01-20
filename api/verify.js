// api/verify.js
import { createHmac } from 'crypto';

export function verifyInitData(initData, botToken) {
  if (!initData) return false;

  const searchParams = new URLSearchParams(initData);
  const hash = searchParams.get('hash');
  if (!hash) return false;

  searchParams.delete('hash');
  const dataCheckString = Array.from(searchParams.entries())
    .map(([key, value]) => `${key}=${value}`)
    .sort()
    .join('\n');

  const secretKey = createHmac('sha256', 'WebAppData')
    .update(botToken)
    .digest();

  const computedHash = createHmac('sha256', secretKey)
    .update(dataCheckString)
    .digest('hex');

  return computedHash === hash;
}
