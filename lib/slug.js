/**
 * Adresa akcie je na korene domeny (napr. /kika-a-miro), aby sa zmestila
 * na QR kod aj na kartičku. Preto sa musi vyhnut nazvom, ktore uz aplikacia
 * pouziva pre svoje vlastne stranky.
 */
export const RESERVED = new Set([
  'admin',
  'api',
  'new',
  'login',
  'logout',
  'privacy',
  'terms',
  'health',
  'gallery',
  'slideshow',
  'favicon.ico',
  'icon.svg',
  'apple-icon.png',
  'manifest.webmanifest',
  'robots.txt',
  'sitemap.xml',
  '_next',
  'static',
  'public',
  'assets',
  'about',
  'help',
  'support',
  'settings',
  'account',
]);

export function toSlug(input) {
  return String(input ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 48);
}

export function slugProblem(slug) {
  if (!slug || slug.length < 3) return 'too_short';
  if (RESERVED.has(slug)) return 'reserved';
  if (!/^[a-z0-9][a-z0-9-]{1,46}[a-z0-9]$/.test(slug)) return 'invalid';
  return null;
}
