import { decrypt } from './crypto';

const TOKEN_URL = 'https://oauth2.googleapis.com/token';
const AUTH_URL = 'https://accounts.google.com/o/oauth2/v2/auth';

export const SCOPES = [
  'openid',
  'email',
  'profile',
  // Najuzsi mozny rozsah: aplikacia vidi vylucne subory a priecinky,
  // ktore sama vytvorila. K zvysku Drive organizatora sa nedostane.
  'https://www.googleapis.com/auth/drive.file',
].join(' ');

export function appUrl() {
  const raw = process.env.APP_URL;
  if (!raw) throw new Error('Chyba konfiguracie: APP_URL nie je nastavena');
  return raw.replace(/\/+$/, '');
}

export function redirectUri() {
  return `${appUrl()}/api/auth/google/callback`;
}

export function authorizeUrl(state) {
  const params = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID ?? '',
    redirect_uri: redirectUri(),
    response_type: 'code',
    scope: SCOPES,
    access_type: 'offline',
    include_granted_scopes: 'true',
    // Bez tohto Google pri opakovanom prihlaseni refresh token neposle
    // a organizator by po zmene uctu zostal bez pristupu k Drive.
    prompt: 'consent',
    state,
  });
  return `${AUTH_URL}?${params}`;
}

export async function exchangeCode(code) {
  const res = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code,
      client_id: process.env.GOOGLE_CLIENT_ID ?? '',
      client_secret: process.env.GOOGLE_CLIENT_SECRET ?? '',
      redirect_uri: redirectUri(),
      grant_type: 'authorization_code',
    }),
    cache: 'no-store',
  });
  if (!res.ok) throw new Error(`google token ${res.status}: ${await res.text()}`);
  return res.json();
}

/** Z id_tokenu si vezmeme len identitu; podpis overil Google pri vydani. */
export function readIdToken(idToken) {
  const part = String(idToken ?? '').split('.')[1];
  if (!part) throw new Error('chybny id_token');
  return JSON.parse(Buffer.from(part, 'base64url').toString('utf8'));
}

// Access tokeny si drzime v pamati funkcie, kym platia. Setri to jeden
// kolobeh na Google pri kazdej nahravanej fotke.
const cache = new Map();

export async function accessTokenFor(encryptedRefreshToken) {
  const hit = cache.get(encryptedRefreshToken);
  if (hit && Date.now() < hit.expiresAt) return hit.token;

  const res = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID ?? '',
      client_secret: process.env.GOOGLE_CLIENT_SECRET ?? '',
      refresh_token: decrypt(encryptedRefreshToken),
      grant_type: 'refresh_token',
    }),
    cache: 'no-store',
  });

  if (!res.ok) throw new Error(`google refresh ${res.status}: ${await res.text()}`);

  const data = await res.json();
  cache.set(encryptedRefreshToken, {
    token: data.access_token,
    expiresAt: Date.now() + (data.expires_in ?? 3600) * 1000 - 5 * 60 * 1000,
  });
  return data.access_token;
}

export async function createFolder(accessToken, name) {
  const res = await fetch('https://www.googleapis.com/drive/v3/files?fields=id,name,webViewLink', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, mimeType: 'application/vnd.google-apps.folder' }),
  });
  if (!res.ok) throw new Error(`drive folder ${res.status}: ${await res.text()}`);
  return res.json();
}

/** Nazov podpriecinka, kam ide logo. Fotky od hosti tam nikdy nepadnu. */
const ASSET_FOLDER = 'Paparazzi - vzhlad';

/**
 * Priecinok na vzhlad akcie. Nedrzime jeho id v databaze, staci sa naň
 * opytat - je to jedno volanie a raz za nahranie loga to nikoho nezabije.
 */
export async function ensureAssetFolder(accessToken, parentId) {
  const q = encodeURIComponent(
    `name='${ASSET_FOLDER}' and '${parentId}' in parents and mimeType='application/vnd.google-apps.folder' and trashed=false`
  );
  const res = await fetch(
    `https://www.googleapis.com/drive/v3/files?q=${q}&fields=files(id)&pageSize=1&supportsAllDrives=true`,
    { headers: { Authorization: `Bearer ${accessToken}` }, cache: 'no-store' }
  );
  if (res.ok) {
    const data = await res.json();
    if (data.files?.[0]?.id) return data.files[0].id;
  }

  const created = await fetch('https://www.googleapis.com/drive/v3/files?fields=id', {
    method: 'POST',
    headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: ASSET_FOLDER,
      mimeType: 'application/vnd.google-apps.folder',
      parents: [parentId],
    }),
  });
  if (!created.ok) throw new Error(`drive asset folder ${created.status}: ${await created.text()}`);
  return (await created.json()).id;
}

/**
 * Nahra maly subor naraz (multipart). Na fotky od hosti sa to nehodi, tie idu
 * mimo server, ale logo ma par stoviek kilobajtov.
 */
export async function uploadSmallFile(accessToken, { name, mimeType, parentId, bytes }) {
  const boundary = `pp${crypto.randomUUID().replace(/-/g, '')}`;
  const meta = JSON.stringify({ name, parents: [parentId] });

  const head = Buffer.from(
    `--${boundary}\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n${meta}\r\n` +
      `--${boundary}\r\nContent-Type: ${mimeType}\r\n\r\n`,
    'utf8'
  );
  const tail = Buffer.from(`\r\n--${boundary}--\r\n`, 'utf8');

  const res = await fetch(
    'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id&supportsAllDrives=true',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': `multipart/related; boundary=${boundary}`,
      },
      body: Buffer.concat([head, Buffer.from(bytes), tail]),
    }
  );
  if (!res.ok) throw new Error(`drive upload ${res.status}: ${await res.text()}`);
  return res.json();
}

/** Do kosa, nie natvrdo - organizator si svoj subor vie vratit. */
export async function trashFile(accessToken, fileId) {
  await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}?supportsAllDrives=true`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ trashed: true }),
  }).catch(() => {});
}

export function slugifyName(input, fallback = 'Host') {
  const s = String(input ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 40);
  return s || fallback;
}

export function safeFilename(name) {
  const s = String(name ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[\\/:*?"<>|]+/g, '_')
    .replace(/\s+/g, '_')
    .slice(-80);
  return s || 'photo.jpg';
}

/** Autor a cas su v nazve suboru, takze o fotkach netreba viest evidenciu. */
export function buildDriveName(guest, originalName) {
  const d = new Date();
  const p = (n) => String(n).padStart(2, '0');
  const stamp = `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}_${p(d.getHours())}${p(d.getMinutes())}`;
  return `${stamp}__${slugifyName(guest)}__${safeFilename(originalName)}`;
}

export function guestFromDriveName(name) {
  const parts = String(name ?? '').split('__');
  if (parts.length < 3) return null;
  return parts[1].replace(/-/g, ' ');
}
