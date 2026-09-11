/**
 * Vsetko, co si organizator nastavuje, zije v jednom JSON stlpci. Pri tomto
 * rozsahu je to jednoduchsie ako desat stlpcov a nova volba nevyzaduje
 * zasah do schemy.
 *
 * Texty od organizatora sa nepreklada - napise ich v jazyku svojich hosti.
 * Prekladame len ovladacie prvky (tlacidla, chybove hlasky), a to podla
 * nastavenia prehliadaca hosta.
 */

export const THEMES = {
  sepia: {
    label: 'Papier',
    vars: {
      '--paper': '#fbf7f0',
      '--paper-2': '#f4ece0',
      '--card': '#fffcf7',
      '--ink': '#4a3a2a',
      '--ink-soft': '#8b7355',
      '--line': '#e3d5c0',
      '--accent': '#b5966b',
    },
  },
  sage: {
    label: 'Šalvia',
    vars: {
      '--paper': '#f4f6f1',
      '--paper-2': '#e7ece1',
      '--card': '#fbfcf9',
      '--ink': '#2f3a30',
      '--ink-soft': '#6f7d6c',
      '--line': '#d6dfd0',
      '--accent': '#7c9070',
    },
  },
  blush: {
    label: 'Púder',
    vars: {
      '--paper': '#fdf5f3',
      '--paper-2': '#f7e7e3',
      '--card': '#fffaf9',
      '--ink': '#4a3033',
      '--ink-soft': '#8d6b6d',
      '--line': '#eed7d3',
      '--accent': '#c08d86',
    },
  },
  slate: {
    label: 'Bridlica',
    vars: {
      '--paper': '#f3f4f6',
      '--paper-2': '#e6e8ec',
      '--card': '#fbfbfc',
      '--ink': '#2b3038',
      '--ink-soft': '#697182',
      '--line': '#d6d9e0',
      '--accent': '#5b6b86',
    },
  },
  midnight: {
    label: 'Polnoc',
    dark: true,
    vars: {
      '--paper': '#171b21',
      '--paper-2': '#1f242c',
      '--card': '#1c2129',
      '--ink': '#eceff4',
      '--ink-soft': '#9aa3b0',
      '--line': '#2e353f',
      '--accent': '#c9a875',
    },
  },
};

export const FONTS = {
  classic: {
    label: 'Klasika',
    script: "'Alex Brush', cursive",
    body: "'Cormorant Garamond', Georgia, serif",
    href: 'https://fonts.googleapis.com/css2?family=Alex+Brush&family=Cormorant+Garamond:wght@300;400;500;600&display=swap',
  },
  editorial: {
    label: 'Redakčné',
    script: "'Playfair Display', Georgia, serif",
    body: "'Lora', Georgia, serif",
    href: 'https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,600;1,500&family=Lora:wght@400;500&display=swap',
  },
  romantic: {
    label: 'Romantické',
    script: "'Parisienne', cursive",
    body: "'Lora', Georgia, serif",
    href: 'https://fonts.googleapis.com/css2?family=Parisienne&family=Lora:wght@400;500&display=swap',
  },
  clean: {
    label: 'Bez ozdôb',
    script: "'Inter', system-ui, sans-serif",
    body: "'Inter', system-ui, sans-serif",
    href: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap',
  },
};

export const DEFAULT_MISSIONS = {
  sk: [
    'selfie s niekým, koho si dnes ešte nespoznal',
    'selfie s oslávencami',
    'skupinovú fotku pri stole',
    'najväčší smiech',
    'najdivokejší tanečný pohyb',
    'tajný útok na koláče',
    'romantický moment',
    'niekoho, kto to na parkete prežíva až priveľmi',
    'moment, ktorý by nám inak ušiel',
  ],
  en: [
    'a selfie with someone you met today',
    'a selfie with the hosts',
    'a group shot at your table',
    'the biggest laugh',
    'the wildest dance move',
    'a secret raid on the cake table',
    'a romantic moment',
    'someone enjoying the dance floor a little too much',
    'a moment we would otherwise have missed',
  ],
};

export const DEFAULT_TEXTS = {
  sk: {
    eyebrow: 'Foto misia',
    headline: 'Fotolov',
    lead: 'Zachyťte náš deň aj vašimi očami',
    missionsTitle: 'Vypátrajte aspoň niečo z tohto',
    missionsClosing: 'Čím spontánnejšie, tým lepšie.',
    thanks: 'Ďakujeme!',
  },
  en: {
    eyebrow: 'Photo mission',
    headline: 'Photo hunt',
    lead: 'Capture our day through your eyes',
    missionsTitle: 'Hunt down at least a few of these',
    missionsClosing: 'The more spontaneous, the better.',
    thanks: 'Thank you!',
  },
};

export function defaultSettings(lang = 'sk', hostNames = '') {
  const texts = DEFAULT_TEXTS[lang] ?? DEFAULT_TEXTS.sk;
  return {
    hostNames,
    dateText: '',
    eyebrow: texts.eyebrow,
    headline: texts.headline,
    lead: texts.lead,
    thanks: texts.thanks,
    theme: 'sepia',
    accent: '',
    fonts: 'classic',
    ornaments: true,
    missionsTitle: texts.missionsTitle,
    missionsClosing: texts.missionsClosing,
    missions: DEFAULT_MISSIONS[lang] ?? DEFAULT_MISSIONS.sk,
    galleryEnabled: true,
    slideshowEnabled: true,
    allowVideo: true,
    requireName: true,
    contactEmail: '',
  };
}

const HEX = /^#[0-9a-fA-F]{6}$/;

function text(value, fallback, max) {
  const s = typeof value === 'string' ? value.trim() : '';
  if (!s) return fallback;
  return s.slice(0, max);
}

/**
 * Vsetko, co pride z formulara, prejde tadeto. Do databazy sa nikdy nedostane
 * kluc, ktory nepozname, ani text bez obmedzenia dlzky.
 */
export function sanitizeSettings(input, base) {
  const b = base ?? defaultSettings();
  const raw = input && typeof input === 'object' ? input : {};

  const missions = Array.isArray(raw.missions)
    ? raw.missions
        .map((m) => (typeof m === 'string' ? m.trim().slice(0, 160) : ''))
        .filter(Boolean)
        .slice(0, 30)
    : b.missions;

  return {
    hostNames: text(raw.hostNames, b.hostNames, 80),
    dateText: text(raw.dateText, b.dateText, 40),
    eyebrow: text(raw.eyebrow, b.eyebrow, 60),
    headline: text(raw.headline, b.headline, 60),
    lead: text(raw.lead, b.lead, 200),
    thanks: text(raw.thanks, b.thanks, 60),

    theme: THEMES[raw.theme] ? raw.theme : b.theme,
    accent: HEX.test(raw.accent ?? '') ? raw.accent : '',
    fonts: FONTS[raw.fonts] ? raw.fonts : b.fonts,
    ornaments: typeof raw.ornaments === 'boolean' ? raw.ornaments : b.ornaments,

    missionsTitle: text(raw.missionsTitle, b.missionsTitle, 80),
    missionsClosing: text(raw.missionsClosing, b.missionsClosing, 120),
    missions,

    galleryEnabled: typeof raw.galleryEnabled === 'boolean' ? raw.galleryEnabled : b.galleryEnabled,
    slideshowEnabled:
      typeof raw.slideshowEnabled === 'boolean' ? raw.slideshowEnabled : b.slideshowEnabled,
    allowVideo: typeof raw.allowVideo === 'boolean' ? raw.allowVideo : b.allowVideo,
    requireName: typeof raw.requireName === 'boolean' ? raw.requireName : b.requireName,

    contactEmail: text(raw.contactEmail, b.contactEmail, 120),
  };
}

/** Premeni nastavenia na CSS premenne, ktore sa vlozia do stranky akcie. */
export function themeStyle(settings) {
  const theme = THEMES[settings.theme] ?? THEMES.sepia;
  const fonts = FONTS[settings.fonts] ?? FONTS.classic;
  const vars = { ...theme.vars };
  if (settings.accent && HEX.test(settings.accent)) vars['--accent'] = settings.accent;
  vars['--font-script'] = fonts.script;
  vars['--font-body'] = fonts.body;
  return vars;
}

export function fontHref(settings) {
  return (FONTS[settings.fonts] ?? FONTS.classic).href;
}

export function isDark(settings) {
  return Boolean((THEMES[settings.theme] ?? THEMES.sepia).dark);
}
