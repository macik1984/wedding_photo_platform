/**
 * Ovladacie prvky pre hosta. Texty, ktore pise organizator (nadpis, ulohy,
 * podakovanie), sa nepreklada - tie idu tak, ako ich napisal.
 */
export const LANGS = ['sk', 'en'];

export const ui = {
  sk: {
    label: 'SLOVENSKY',

    nameLabel: 'Vaše meno',
    namePlaceholder: 'napr. Žofia Nováková',
    nameNote: 'Aby sme vedeli, komu poďakovať.',

    pickPhotos: 'Vybrať fotky',
    pickBoth: 'Vybrať fotky',
    pickMore: 'Pridať ďalšie',
    pickNotePhotos: 'Priamo z vášho albumu.',
    pickNoteBoth: 'Fotky aj videá, priamo z vášho albumu.',

    upload: 'Odoslať',
    uploading: 'Odosielam',
    keepOpen: 'Nechajte stránku otvorenú a obrazovku zapnutú, kým sa to nedokončí.',
    bigFile: 'Veľké video pošlite radšej na wifi, na mobilných dátach to potrvá.',
    retry: 'Skúsiť znova',
    retryNote: 'Odoslané súbory sa neposielajú druhýkrát.',
    offline: 'Zdá sa, že ste bez pripojenia. Skúste to prosím o chvíľu.',
    dupes: (n) => `${n} ${n === 1 ? 'súbor už bol' : 'súborov už bolo'} v zozname.`,
    selected: (n) => `${n} ${n === 1 ? 'súbor' : n < 5 ? 'súbory' : 'súborov'}`,

    thanksTitle: 'Máme to',
    thanksNote: (n) =>
      `${n} ${n === 1 ? 'súbor je' : n < 5 ? 'súbory sú' : 'súborov je'} v našom albume.`,
    more: 'Poslať ďalšie',

    gallery: 'Pozrieť galériu',
    back: 'Späť na odosielanie',
    galleryTitle: 'Živá galéria',
    galleryNote: 'Obnovuje sa každých 30 sekúnd.',
    empty: 'Zatiaľ nič. Buďte prví.',
    loadMore: 'Načítať ďalšie',
    close: 'Zavrieť',
    slideshow: 'Premietanie',
    slideshowEmpty: 'Čaká sa na prvé fotky.',

    errName: 'Najprv prosím zadajte meno.',
    errFiles: 'Vyberte aspoň jeden súbor.',
    errUpload: 'Odoslanie sa nepodarilo. Skúste to prosím znova.',

    privacy: 'Ochrana údajov',
    terms: 'Podmienky',
  },

  en: {
    label: 'ENGLISH',

    nameLabel: 'Your name',
    namePlaceholder: 'e.g. Sophie Novak',
    nameNote: 'So we know who to thank.',

    pickPhotos: 'Choose photos',
    pickBoth: 'Choose photos',
    pickMore: 'Add more',
    pickNotePhotos: 'Straight from your album.',
    pickNoteBoth: 'Photos and videos, straight from your album.',

    upload: 'Send',
    uploading: 'Sending',
    keepOpen: 'Keep this page open and your screen awake until it finishes.',
    bigFile: 'Large videos go faster on wifi than on mobile data.',
    retry: 'Try again',
    retryNote: 'Files already sent will not be sent twice.',
    offline: 'You seem to be offline. Please try again in a moment.',
    dupes: (n) => `${n} file${n === 1 ? ' was' : 's were'} already in the list.`,
    selected: (n) => `${n} file${n === 1 ? '' : 's'}`,

    thanksTitle: 'Got it',
    thanksNote: (n) => `${n} file${n === 1 ? '' : 's'} added to our album.`,
    more: 'Send more',

    gallery: 'View the gallery',
    back: 'Back to sending',
    galleryTitle: 'Live gallery',
    galleryNote: 'Refreshes every 30 seconds.',
    empty: 'Nothing yet. Be the first.',
    loadMore: 'Load more',
    close: 'Close',
    slideshow: 'Slideshow',
    slideshowEmpty: 'Waiting for the first photos.',

    errName: 'Please enter your name first.',
    errFiles: 'Pick at least one file.',
    errUpload: 'Sending failed. Please try again.',

    privacy: 'Privacy',
    terms: 'Terms',
  },
};

export function t(lang) {
  return ui[lang] ?? ui.sk;
}

/** Slovencina pre slovenske a ceske prehliadace, anglictina pre ostatne. */
export function detectLang() {
  if (typeof navigator === 'undefined') return 'sk';
  const list = navigator.languages?.length ? navigator.languages : [navigator.language];
  for (const raw of list) {
    const code = String(raw ?? '').toLowerCase();
    if (code.startsWith('sk') || code.startsWith('cs') || code.startsWith('cz')) return 'sk';
    if (code) return 'en';
  }
  return 'en';
}
