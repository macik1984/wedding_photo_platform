import { cookies, headers } from 'next/headers';

export const LOCALES = ['sk', 'en'];
export const LOCALE_COOKIE = 'pp_ui_lang';

/**
 * Jazyk aplikacie sa urcuje na serveri, nie az v prehliadaci. Vdaka tomu
 * pride uz prva vykreslena stranka v spravnom jazyku a text nepreblikne.
 *
 * Poradie: rucna volba z cookie, potom hlavicka Accept-Language, nakoniec
 * slovencina. Cesi dostanu slovencinu, ostatni anglictinu.
 */
export async function resolveLocale() {
  try {
    const jar = await cookies();
    const saved = jar.get(LOCALE_COOKIE)?.value;
    if (LOCALES.includes(saved)) return saved;
  } catch {
    /* mimo requestu sa cookies citat nedaju */
  }

  try {
    const h = await headers();
    const header = (h.get('accept-language') ?? '').toLowerCase();
    for (const part of header.split(',')) {
      const code = part.split(';')[0].trim();
      if (!code) continue;
      if (code.startsWith('sk') || code.startsWith('cs')) return 'sk';
      return 'en';
    }
  } catch {
    /* ignorujeme */
  }

  return 'sk';
}
