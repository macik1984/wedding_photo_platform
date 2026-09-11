import crypto from 'node:crypto';

/**
 * Jeden tajny kluc drzi dve veci: podpis session cookies a sifrovanie
 * refresh tokenov organizatorov. Token do Google Drive je to najcitlivejsie,
 * co v databaze je, takze tam nesmie lezat v citatelnej podobe.
 */
function key() {
  const raw = process.env.APP_SECRET;
  if (!raw) throw new Error('Chyba konfiguracie: APP_SECRET nie je nastaveny');
  const buf = Buffer.from(raw, 'base64');
  if (buf.length !== 32) {
    throw new Error('APP_SECRET musi byt 32 bajtov v base64 (npm run secret)');
  }
  return buf;
}

export function encrypt(plain) {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', key(), iv);
  const enc = Buffer.concat([cipher.update(String(plain), 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();
  return [iv.toString('base64url'), tag.toString('base64url'), enc.toString('base64url')].join('.');
}

export function decrypt(packed) {
  const [ivB, tagB, dataB] = String(packed).split('.');
  if (!ivB || !tagB || !dataB) throw new Error('poskodeny sifrovany udaj');
  const decipher = crypto.createDecipheriv('aes-256-gcm', key(), Buffer.from(ivB, 'base64url'));
  decipher.setAuthTag(Buffer.from(tagB, 'base64url'));
  return Buffer.concat([
    decipher.update(Buffer.from(dataB, 'base64url')),
    decipher.final(),
  ]).toString('utf8');
}

export function sign(payloadObj) {
  const body = Buffer.from(JSON.stringify(payloadObj), 'utf8').toString('base64url');
  const mac = crypto.createHmac('sha256', key()).update(body).digest('base64url');
  return `${body}.${mac}`;
}

export function verify(token) {
  const [body, mac] = String(token ?? '').split('.');
  if (!body || !mac) return null;
  const expected = crypto.createHmac('sha256', key()).update(body).digest('base64url');
  // porovnanie v konstantnom case, aby sa podpis nedal uhadnut po znakoch
  const a = Buffer.from(mac);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
  try {
    return JSON.parse(Buffer.from(body, 'base64url').toString('utf8'));
  } catch {
    return null;
  }
}

export function randomToken(bytes = 24) {
  return crypto.randomBytes(bytes).toString('base64url');
}
