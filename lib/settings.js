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
    label: { sk: 'Papier', en: 'Paper' },
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
    label: { sk: 'Šalvia', en: 'Sage' },
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
    label: { sk: 'Púder', en: 'Blush' },
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
    label: { sk: 'Bridlica', en: 'Slate' },
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
    label: { sk: 'Polnoc', en: 'Midnight' },
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
    label: { sk: 'Klasika', en: 'Classic' },
    script: "'Alex Brush', cursive",
    body: "'Cormorant Garamond', Georgia, serif",
    href: 'https://fonts.googleapis.com/css2?family=Alex+Brush&family=Cormorant+Garamond:wght@300;400;500;600&display=swap',
  },
  editorial: {
    label: { sk: 'Redakčné', en: 'Editorial' },
    script: "'Playfair Display', Georgia, serif",
    body: "'Lora', Georgia, serif",
    href: 'https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,600;1,500&family=Lora:wght@400;500&display=swap',
  },
  romantic: {
    label: { sk: 'Romantické', en: 'Romantic' },
    script: "'Parisienne', cursive",
    body: "'Lora', Georgia, serif",
    href: 'https://fonts.googleapis.com/css2?family=Parisienne&family=Lora:wght@400;500&display=swap',
  },
  clean: {
    label: { sk: 'Bez ozdôb', en: 'Plain' },
    script: "'Inter', system-ui, sans-serif",
    body: "'Inter', system-ui, sans-serif",
    href: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap',
  },
};

/**
 * Symbol v hlavicke stranky pre hosti. Botanicke vetvicky sedia na svadbu,
 * firemnej akcii pristane logo a na vacsinu ostatneho staci emoji alebo nic.
 */
export const SYMBOLS = ['ornaments', 'emoji', 'monogram', 'logo', 'none'];

export const EMOJI_CHOICES = [
  '💍',
  '🥂',
  '🎉',
  '🎂',
  '💐',
  '🎄',
  '🏕️',
  '⛰️',
  '🎓',
  '👶',
  '🎸',
  '📸',
];

/**
 * Sablony podla typu akcie. Jedno kliknutie nastavi vzhlad, texty aj ulohy,
 * takze organizator nezacina na prazdnej svadobnej stranke, aj ked robi
 * firemny vecierok.
 *
 * Texty pisane organizatorom sa hostovi neprekladaju - hostia citaju to, co
 * napisal. Preto tu kazda sablona existuje v oboch jazykoch a pri zalozeni
 * akcie sa berie ten, v ktorom ma organizator administraciu.
 */
export const TEMPLATES = {
  wedding: {
    label: { sk: 'Svadba', en: 'Wedding' },
    look: { theme: 'sepia', fonts: 'classic', accent: '', symbol: 'ornaments', emoji: '💍' },
    sk: {
      eyebrow: 'Foto misia',
      headline: 'Fotolov',
      lead: 'Zachyťte náš deň aj vašimi očami',
      missionsTitle: 'Vypátrajte aspoň niečo z tohto',
      missionsClosing: 'Čím spontánnejšie, tým lepšie.',
      thanks: 'Ďakujeme!',
      missions: [
        'selfie s mladomanželmi',
        'skupinovú fotku pri vašom stole',
        'najväčší smiech večera',
        'niekoho, kto to na parkete prežíva naplno',
        'moment, ktorý by nám inak ušiel',
      ],
    },
    en: {
      eyebrow: 'Photo mission',
      headline: 'Photo hunt',
      lead: 'Capture our day through your eyes',
      missionsTitle: 'Hunt down at least a few of these',
      missionsClosing: 'The more spontaneous, the better.',
      thanks: 'Thank you!',
      missions: [
        'a selfie with the newlyweds',
        'a group shot at your table',
        'the biggest laugh of the night',
        'someone owning the dance floor',
        'a moment we would otherwise have missed',
      ],
    },
  },

  party: {
    label: { sk: 'Oslava', en: 'Party' },
    look: { theme: 'blush', fonts: 'romantic', accent: '', symbol: 'emoji', emoji: '🎉' },
    sk: {
      eyebrow: 'Foto misia',
      headline: 'Fotolov',
      lead: 'Pošlite nám dnešok aj vašimi očami',
      missionsTitle: 'Ulovte aspoň pár z týchto',
      missionsClosing: 'Čím spontánnejšie, tým lepšie.',
      thanks: 'Ďakujeme!',
      missions: [
        'selfie s oslávencom',
        'skupinovú fotku pri stole',
        'najväčší smiech večera',
        'prvého, kto sa dostal na parket',
        'moment, ktorý by nám inak ušiel',
      ],
    },
    en: {
      eyebrow: 'Photo mission',
      headline: 'Photo hunt',
      lead: 'Send us today through your eyes',
      missionsTitle: 'Catch at least a few of these',
      missionsClosing: 'The more spontaneous, the better.',
      thanks: 'Thank you!',
      missions: [
        'a selfie with the birthday host',
        'a group shot at your table',
        'the biggest laugh of the night',
        'the first person on the dance floor',
        'a moment we would otherwise have missed',
      ],
    },
  },

  company: {
    label: { sk: 'Firemná akcia', en: 'Company event' },
    look: { theme: 'slate', fonts: 'clean', accent: '', symbol: 'none', emoji: '🥂' },
    sk: {
      eyebrow: 'Foto misia',
      headline: 'Fotky z akcie',
      lead: 'Pomôžte nám poskladať fotky z dnešného dňa',
      missionsTitle: 'Na čo sa zamerať',
      missionsClosing: 'Vďaka za každú fotku.',
      thanks: 'Ďakujeme!',
      missions: [
        'skupinovú fotku vášho tímu',
        'niekoho pri práci na programe',
        'najlepší moment z pódia',
        'detail, ktorý sa oplatí ukázať',
        'záber, ktorý by inak nikto nespravil',
      ],
    },
    en: {
      eyebrow: 'Photo mission',
      headline: 'Photos from the event',
      lead: 'Help us put together the photos from today',
      missionsTitle: 'What to look for',
      missionsClosing: 'Thanks for every photo.',
      thanks: 'Thank you!',
      missions: [
        'a group shot of your team',
        'someone at work on the programme',
        'the best moment from the stage',
        'a detail worth showing',
        'a shot nobody else would take',
      ],
    },
  },

  teambuilding: {
    label: { sk: 'Teambuilding', en: 'Teambuilding' },
    look: { theme: 'sage', fonts: 'clean', accent: '', symbol: 'emoji', emoji: '🏕️' },
    sk: {
      eyebrow: 'Foto misia',
      headline: 'Fotolov',
      lead: 'Ukážte dnešok očami vášho tímu',
      missionsTitle: 'Ulovte aspoň pár z týchto',
      missionsClosing: 'Čím spontánnejšie, tým lepšie.',
      thanks: 'Vďaka!',
      missions: [
        'celý tím na jednej fotke',
        'selfie s niekým, s kým bežne nepracuješ',
        'najväčší smiech dňa',
        'víťaza disciplíny',
        'moment, na ktorý sa bude spomínať',
      ],
    },
    en: {
      eyebrow: 'Photo mission',
      headline: 'Photo hunt',
      lead: 'Show today through your team eyes',
      missionsTitle: 'Catch at least a few of these',
      missionsClosing: 'The more spontaneous, the better.',
      thanks: 'Thanks!',
      missions: [
        'the whole team in one shot',
        'a selfie with someone you rarely work with',
        'the biggest laugh of the day',
        'the winner of a challenge',
        'a moment people will keep bringing up',
      ],
    },
  },
};

/** Texty a ulohy jednej sablony v danom jazyku. */
export function templateContent(template = 'wedding', lang = 'sk') {
  const tpl = TEMPLATES[template] ?? TEMPLATES.wedding;
  return tpl[lang] ?? tpl.sk;
}

export const DEFAULT_MISSIONS = {
  sk: TEMPLATES.wedding.sk.missions,
  en: TEMPLATES.wedding.en.missions,
};

export const DEFAULT_TEXTS = {
  sk: TEMPLATES.wedding.sk,
  en: TEMPLATES.wedding.en,
};

export function defaultSettings(lang = 'sk', hostNames = '', template = 'wedding') {
  const key = TEMPLATES[template] ? template : 'wedding';
  const look = TEMPLATES[key].look;
  const c = templateContent(key, lang);

  return {
    template: key,
    hostNames,
    dateISO: '',
    dateText: '',
    eyebrow: c.eyebrow,
    headline: c.headline,
    lead: c.lead,
    thanks: c.thanks,
    theme: look.theme,
    accent: look.accent,
    fonts: look.fonts,
    symbol: look.symbol,
    emoji: look.emoji,
    logoFileId: '',
    missionsTitle: c.missionsTitle,
    missionsClosing: c.missionsClosing,
    missions: c.missions,
    galleryEnabled: true,
    slideshowEnabled: true,
    allowVideo: true,
    requireName: true,
    contactEmail: '',
  };
}

/**
 * Ulozene nastavenia doplni o chybajuce kluce. Akcie zalozene skor maju
 * namiesto `symbol` este boolean `ornaments`, preto ho tu prelozime - inak by
 * sa vetvicky vratili tomu, kto si ich vypol.
 */
export function withDefaults(saved, lang = 'sk') {
  const base = defaultSettings(lang);
  const s = { ...base, ...(saved ?? {}) };
  if (saved && typeof saved.symbol !== 'string') {
    s.symbol = saved.ornaments === false ? 'none' : 'ornaments';
  }
  return s;
}

/** Monogram z mien: "Kika a Miro" -> "K & M". */
export function monogramOf(hostNames) {
  const skip = new Set(['a', 'and', '&', '+', 'i', 'y']);
  const letters = String(hostNames ?? '')
    .split(/[\s,]+/)
    .filter((w) => w && !skip.has(w.toLowerCase()))
    .map((w) => w[0].toUpperCase())
    .slice(0, 3);
  return letters.join(' & ');
}

const HEX = /^#[0-9a-fA-F]{6}$/;

const MONTHS_SK = [
  'januára',
  'februára',
  'marca',
  'apríla',
  'mája',
  'júna',
  'júla',
  'augusta',
  'septembra',
  'októbra',
  'novembra',
  'decembra',
];

/**
 * Datum sa v administracii vybera z kalendara a uklada ako ISO. Hostovi ho
 * vypiseme podla jeho jazyka. Kto chce nieco ine ("leto 2026"), napise si
 * vlastny text a ten ma prednost.
 */
export function displayDate(settings, lang = 'sk') {
  if (settings.dateText) return settings.dateText;
  const iso = settings.dateISO;
  if (!iso || !/^\d{4}-\d{2}-\d{2}$/.test(iso)) return '';

  const [y, m, d] = iso.split('-').map(Number);
  if (lang === 'sk') return `${d}. ${m}. ${y}`;

  const en = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  return `${d} ${en[m - 1]} ${y}`;
}

const MONTHS_EN = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

/** Dlhy tvar pre administraciu, nech je hned vidno, co sa vybralo. */
export function longDate(iso, locale = 'sk') {
  if (!iso || !/^\d{4}-\d{2}-\d{2}$/.test(iso)) return '';
  const [y, m, d] = iso.split('-').map(Number);
  return locale === 'sk' ? `${d}. ${MONTHS_SK[m - 1]} ${y}` : `${d} ${MONTHS_EN[m - 1]} ${y}`;
}

/** Zaloha pre akcie zalozene este pred vyberom symbolu. */
function symbolOf(raw, b) {
  if (SYMBOLS.includes(raw.symbol)) return raw.symbol;
  if (SYMBOLS.includes(b.symbol)) return b.symbol;
  return b.ornaments === false ? 'none' : 'ornaments';
}

/**
 * Emoji je jeden az dva znaky. Nechavame len to, co sa da bezpecne vypisat -
 * ziadne html, ziadne dlhe retazce.
 */
function emojiOf(value, fallback) {
  const s = typeof value === 'string' ? value.trim() : '';
  if (!s) return typeof fallback === 'string' ? fallback : '';
  const cleaned = s.replace(/[<>&"'\\]/g, '').slice(0, 8);
  return [...cleaned].slice(0, 2).join('');
}

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
    dateISO: /^\d{4}-\d{2}-\d{2}$/.test(raw.dateISO ?? '') ? raw.dateISO : '',
    dateText: typeof raw.dateText === 'string' ? raw.dateText.trim().slice(0, 40) : b.dateText,
    eyebrow: text(raw.eyebrow, b.eyebrow, 60),
    headline: text(raw.headline, b.headline, 60),
    lead: text(raw.lead, b.lead, 200),
    thanks: text(raw.thanks, b.thanks, 60),

    template: TEMPLATES[raw.template] ? raw.template : (b.template ?? 'wedding'),
    theme: THEMES[raw.theme] ? raw.theme : b.theme,
    accent: HEX.test(raw.accent ?? '') ? raw.accent : '',
    fonts: FONTS[raw.fonts] ? raw.fonts : b.fonts,
    symbol: symbolOf(raw, b),
    emoji: emojiOf(raw.emoji, b.emoji),
    // Id prideluje Drive pri nahrani, z formulara ho nikdy neberieme.
    logoFileId: typeof b.logoFileId === 'string' ? b.logoFileId : '',

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
