/**
 * Texty samotnej aplikacie (uvod, administracia, pravne stranky).
 * Texty pre hostov su v app/i18n.js, tie riadi prehliadac hosta.
 */

export const strings = {
  sk: {
    code: 'sk',
    other: 'en',
    otherLabel: 'English',

    nav: { signIn: 'Prihlásiť sa', myEvents: 'Moje akcie', signOut: 'Odhlásiť' },

    landing: {
      eyebrow: 'Fotky priamo do vášho Google Drive',
      h1a: 'Vaši hostia robia tie najlepšie fotky.',
      h1b: 'Teraz ich môžete dostať všetky.',
      lead:
        'Hostia naskenujú QR kód a fotky nahrajú priamo do vášho Google Drive. Bez aplikácie. Bez registrácie. Bez naháňania hostí po akcii.',
      ctaPrimary: 'Začať zdarma',
      ctaSecondary: 'Ako to funguje',
      trust: ['Bez aplikácie', 'Bez registrácie hostí', 'Originálna kvalita', 'Váš Google Drive'],

      chipMissions: { t: 'Foto úlohy', s: 'Dajte hosťom čo zachytiť' },
      chipDrive: { t: 'Váš Google Drive', s: 'Fotky v originálnej kvalite' },

      problem: {
        h1: 'Viete, že tie fotky existujú.',
        h2: 'Problém je dostať sa k nim.',
        body:
          'Po každej svadbe, oslave alebo evente ostanú stovky fotiek v telefónoch vašich hostí. Niečo príde cez WhatsApp. Niečo cez Messenger. A veľa fotiek neuvidíte nikdy.',
        closing: 'Paparazzi to vyrieši ešte pred začiatkom udalosti.',
      },

      how: {
        title: 'Jeden QR kód. To je celé.',
        steps: [
          [
            'Vytvorte udalosť',
            'Prepojte Google Drive, upravte stránku udalosti a vytvorte QR kód.',
          ],
          [
            'Zdieľajte QR kód',
            'Umiestnite ho na stoly, pozvánky, obrazovku, plagát alebo kdekoľvek ho hostia uvidia.',
          ],
          [
            'Hostia nahrajú fotky',
            'Bez účtu a bez aplikácie. Naskenujú, vyberú fotky a nahrajú.',
          ],
        ],
        after: 'Fotky sa objavia priamo vo vašom Google Drive.',
      },

      missions: {
        title: 'Premeňte hostí na vašich paparazzi.',
        lead:
          'Nepýtajte si len fotky. Dajte hosťom zábavné foto úlohy a nechajte ich zachytiť momenty, ktoré by vám inak unikli.',
        items: [
          'Selfie s mladomanželmi',
          'Zachyť najlepší prípitok',
          'Odfoť niekoho, kto ovládol parket',
          'Selfie s niekým, koho si dnes spoznal',
          'Zachyť moment, ktorý mladomanželia nevideli',
        ],
        benefit: 'Viac fotiek. Lepšie fotky. Viac zábavy.',
      },

      drive: {
        title: 'Vaše fotky. Váš Drive. Navždy.',
        body:
          'Fotky sa ukladajú priamo do priečinka vo vašom Google Drive. Nemusíte ich po udalosti sťahovať z cudzej galérie, presúvať ani riešiť, kedy album prestane fungovať.',
        benefits: [
          ['☁︎', 'Vaše úložisko', 'Fotky zostávajú vo vašom Google Drive.'],
          ['◫', 'Originálne súbory', 'Fotky ostávajú v pôvodnej kvalite.'],
          ['⚯', 'Bez závislosti', 'Vaše spomienky nie sú uzamknuté v Paparazzi.'],
        ],
        highlight: 'My pomôžeme fotky zozbierať. Vy si ich necháte.',
      },

      cases: {
        title: 'Pre chvíle, ktoré sa oplatí zachovať.',
        items: [
          ['♥', 'Svadby'],
          ['✦', 'Oslavy'],
          ['▦', 'Firemné eventy'],
          ['▤', 'Konferencie'],
          ['❋', 'Festivaly'],
          ['⌂', 'Rodinné udalosti'],
        ],
      },

      final: {
        h1: 'Vaši hostia už fotia.',
        h2: 'Postarajte sa, aby ste tie fotky dostali.',
        cta: 'Vytvoriť udalosť',
        trust: ['Bez aplikácie', 'Bez účtu pre hostí', 'Jeden QR kód', 'Váš Google Drive'],
      },

      phone: {
        eyebrow: 'Svadobná foto misia',
        names: 'Kika a Miro',
        kicker: 'Svadobní paparazzi',
        sub: 'Zachyťte náš deň aj vašimi očami',
        nameLabel: 'Vaše meno',
        pick: 'Vybrať fotky',
        send: 'Odoslať',
        missionsTitle: 'Foto úlohy',
      },

      footPrivacy: 'Ochrana údajov',
      footTerms: 'Podmienky',
    },

    admin: {
      title: 'Moje akcie',
      sub: 'Každá akcia má vlastnú adresu, vlastný priečinok na Drive a vlastné nastavenia.',
      settings: 'Nastavenia',
      open: 'Otvoriť',
      slideshow: 'Premietanie',
      newEvent: 'Nová akcia',
      nameLabel: 'Mená alebo názov akcie',
      nameHint: 'Zobrazí sa hosťom v hlavičke stránky.',
      slugLabel: 'Adresa',
      slugHint: 'pôjde na QR kód, takže čím kratšie, tým lepšie.',
      create: 'Vytvoriť akciu',
      creating: 'Zakladám…',
      cancel: 'Zrušiť',
      createNote: 'Vo vašom Google Drive sa založí nový priečinok pre túto akciu.',
      errors: {
        too_short: 'Adresa musí mať aspoň tri znaky.',
        reserved: 'Túto adresu si drží samotná aplikácia, zvoľte inú.',
        invalid: 'Použite iba písmená bez diakritiky, číslice a pomlčky.',
        taken: 'Takúto adresu už niekto používa.',
        drive_failed: 'Nepodarilo sa vytvoriť priečinok na Google Drive.',
        drive_api_off:
          'V Google Cloud projekte nie je zapnuté Google Drive API. Zapnite ho v APIs & Services → Library a skúste to o minútu znova.',
        drive_full: 'Google účet nemá voľné miesto, priečinok sa nedal vytvoriť.',
        scope_missing:
          'Aplikácia nemá povolenie k vášmu Disku. Odhláste sa, prihláste znova a na obrazovke so súhlasom zaškrtnite prístup k súborom Google Drive.',
        google_reauth: 'Prístup ku Google vypršal. Odhláste sa a prihláste znova.',
        generic: 'Nepodarilo sa vytvoriť akciu.',
        network: 'Nepodarilo sa spojiť so serverom.',
      },
    },

    editor: {
      back: 'Moje akcie',
      sub: 'Zmeny sa prejavia hneď po uložení.',

      linkGroup: 'Adresa pre hostí',
      copy: 'Skopírovať odkaz',
      copied: 'Skopírované',
      qr: 'QR kód',
      qrHide: 'Skryť QR kód',
      qrDownload: 'Stiahnuť na tlač',
      qrNote: 'Vygenerované priamo tu, adresa sa nikam neposiela.',

      basicGroup: 'Základné údaje',
      names: 'Mená alebo názov',
      date: 'Dátum',
      dateHintEmpty: 'Nepovinné. Zobrazí sa v pätičke stránky.',
      dateHintCustom: 'Vlastný text má prednosť pred vybraným dátumom.',
      dateToText: 'Napísať vlastný text',
      dateToPicker: 'Vybrať z kalendára',
      eyebrow: 'Riadok nad menami',
      headline: 'Nadpis',
      lead: 'Podnadpis',
      thanks: 'Poďakovanie po odoslaní',
      thanksHint: 'Zobrazí sa veľkým písaným písmom.',

      lookGroup: 'Vzhľad',
      theme: 'Téma',
      accent: 'Hlavná farba',
      accentHintCustom: 'Prepisuje farbu z témy.',
      accentHintTheme: 'Podľa zvolenej témy.',
      font: 'Písmo',
      ornaments: 'Botanické ozdoby',
      ornamentsDesc: 'Kreslené vetvičky v rohoch stránky.',

      missionsGroup: 'Úlohy foto misie',
      missionsTitle: 'Nadpis zoznamu',
      addMission: 'Pridať úlohu',
      missionsClosing: 'Veta na záver',
      missionsClosingHint: 'Píše sa písaným písmom pod zoznamom.',
      up: 'posunúť hore',
      down: 'posunúť dole',
      remove: 'zmazať',

      optionsGroup: 'Možnosti',
      gallery: 'Živá galéria',
      galleryDesc: 'Hostia uvidia fotky ostatných.',
      slideshow: 'Premietanie',
      slideshowDesc: 'Celoobrazovkové striedanie fotiek na projektor.',
      video: 'Prijímať aj videá',
      videoDesc: 'Videá zaberú násobne viac miesta než fotky.',
      requireName: 'Vyžadovať meno',
      requireNameDesc: 'Bez mena nie je vidieť, kto čo poslal.',

      contactGroup: 'Kontakt',
      contactLabel: 'E-mail na stránkach o ochrane údajov',
      contactHint:
        'Sem sa môžu hostia obrátiť so žiadosťou o zmazanie fotiek. Nepovinné.',

      dangerGroup: 'Nebezpečná zóna',
      dangerNote:
        'Zmazaním prestane adresa fungovať. Priečinok a fotky na vašom Google Drive zostávajú nedotknuté.',
      remove_event: 'Zmazať akciu',
      confirmDelete: 'Naozaj zmazať túto akciu? Fotky na Google Drive zostanú nedotknuté.',

      save: 'Uložiť zmeny',
      saving: 'Ukladám…',
      saved: 'Uložené',
      saveFailed: 'Uloženie sa nepodarilo. Skúste to prosím znova.',
      deleteFailed: 'Zmazanie sa nepodarilo.',
    },

    notFound: {
      title: 'Táto stránka tu nie je',
      body:
        'Adresa akcie možno zanikla, alebo je v nej preklep. Skontrolujte odkaz na kartičke alebo sa opýtajte organizátora.',
      home: 'Na úvod',
    },

    legal: {
      back: 'Späť',
      privacyTitle: 'Ochrana osobných údajov',
      updated: 'Naposledy aktualizované: september 2026',
      contact: 'Kontakt',
      privacy: [
        [
          'Kto službu prevádzkuje',
          'Paparazzi je nástroj, ktorým si organizátor súkromnej oslavy vytvorí stránku pre svojich hostí. Prevádzkovateľom konkrétnej akcie je vždy jej organizátor; my poskytujeme technické riešenie.',
        ],
        [
          'Čo zbierame od hostí',
          'Meno, ktoré hosť dobrovoľne zadá do formulára, a súbory, ktoré sám nahrá. Nič iné. Nepoužívame sledovacie cookies, analytické nástroje ani reklamné skripty a nevyžadujeme registráciu.',
        ],
        [
          'Kam sa súbory ukladajú',
          'Priamo na Google Drive organizátora, do priečinka vytvoreného pre danú akciu. Naše servery súbory neuchovávajú, len ich prepúšťajú z telefónu hosťa do cieľového úložiska. Zadané meno je súčasťou názvu súboru, aby bolo zrejmé, kto ho poslal.',
        ],
        [
          'Čo ukladáme my',
          'O organizátorovi jeho e-mail, meno z Google účtu a prístupový token k Drive, ktorý je v databáze uložený zašifrovaný. Ďalej nastavenia jeho akcií. O hosťoch neuchovávame nič.',
        ],
        [
          'Aké oprávnenie máme ku Google Drive',
          'Výhradne rozsah drive.file. Ten dovoľuje pracovať iba so súbormi a priečinkami, ktoré aplikácia sama vytvorila. Na ostatný obsah Drive organizátora nevidíme.',
        ],
        [
          'Ako dlho to trvá',
          'Nastavenia akcie zostávajú, kým ich organizátor nezmaže. Súbory sú v jeho Drive a nakladá s nimi on. Organizátor môže kedykoľvek odobrať aplikácii prístup v nastaveniach svojho Google účtu.',
        ],
        [
          'Práva hostí',
          'Hosť môže požiadať o vymazanie svojich súborov alebo mena. Obráťte sa na organizátora akcie, prípadne na kontakt nižšie.',
        ],
      ],
      termsTitle: 'Podmienky používania',
      terms: [
        [
          'Na čo služba slúži',
          'Na zdieľanie fotiek a videí medzi hosťami jednej súkromnej akcie. Nie je to verejné úložisko ani sociálna sieť.',
        ],
        [
          'Zodpovednosť organizátora',
          'Organizátor zodpovedá za obsah svojej stránky, za to, komu odkaz rozdá, a za nakladanie so súbormi vo svojom Google Drive.',
        ],
        [
          'Čo sem nepatrí',
          'Nezákonný, urážlivý alebo cudzí obsah, ku ktorému nemáte práva. Takýto obsah môže byť odstránený a prístup zrušený bez upozornenia.',
        ],
        [
          'Dostupnosť',
          'Služba je poskytovaná tak, ako je, bez záruky nepretržitej dostupnosti. Neručíme za stratu nahraných súborov; originály zostávajú v zariadeniach hostí a v Drive organizátora.',
        ],
        [
          'Úložisko',
          'Súbory sa počítajú do kapacity Google účtu organizátora. Sledovanie voľného miesta je na ňom.',
        ],
        [
          'Ukončenie',
          'Organizátor môže akciu kedykoľvek zmazať a odobrať aplikácii prístup ku Google Drive. Súbory, ktoré už v jeho Drive sú, tým nezmiznú.',
        ],
      ],
    },
  },

  en: {
    code: 'en',
    other: 'sk',
    otherLabel: 'Slovensky',

    nav: { signIn: 'Sign in', myEvents: 'My events', signOut: 'Sign out' },

    landing: {
      eyebrow: 'Straight into your own Google Drive',
      h1a: 'Your guests take the photos.',
      h1b: 'You get every one.',
      lead:
        'Guests scan a QR code and upload photos straight to your Google Drive. No app. No registration. No chasing people afterwards.',
      ctaPrimary: 'Start free',
      ctaSecondary: 'See how it works',
      trust: ['No app', 'No guest registration', 'Original quality', 'Your Google Drive'],

      chipMissions: { t: 'Photo missions', s: 'Give guests something to capture' },
      chipDrive: { t: 'Your Google Drive', s: 'Photos in original quality' },

      problem: {
        h1: 'You know the photos exist.',
        h2: 'Getting them is the hard part.',
        body:
          'After every wedding, party or event, hundreds of photos stay on your guests phones. Some arrive through WhatsApp. Some through Messenger. Some never arrive at all.',
        closing: 'Paparazzi fixes that before the event even starts.',
      },

      how: {
        title: 'One QR code. That is it.',
        steps: [
          [
            'Create your event',
            'Connect your Google Drive, customize your event page and generate your QR code.',
          ],
          [
            'Share the QR code',
            'Put it on tables, invitations, screens, posters or anywhere your guests can see it.',
          ],
          ['Guests upload', 'No account. No app. They simply scan, choose photos and upload.'],
        ],
        after: 'Photos appear directly in your Google Drive.',
      },

      missions: {
        title: 'Turn your guests into your paparazzi.',
        lead:
          'Do not just ask for photos. Give guests fun missions and inspire them to capture moments you would otherwise miss.',
        items: [
          'Take a selfie with the bride & groom',
          'Capture the best toast',
          'Photograph someone owning the dance floor',
          'Take a selfie with someone you met today',
          'Capture a moment the couple probably missed',
        ],
        benefit: 'More photos. Better photos. More fun.',
      },

      drive: {
        title: 'Your photos. Your Drive. Forever.',
        body:
          'Photos go directly into a folder in your own Google Drive. You do not need to download your gallery later, move files somewhere else or worry about your event album expiring.',
        benefits: [
          ['☁︎', 'Your storage', 'Photos live in your Google Drive.'],
          ['◫', 'Original files', 'Keep the photos in their original quality.'],
          ['⚯', 'No lock-in', 'Your memories do not depend on Paparazzi staying online forever.'],
        ],
        highlight: 'We help collect the photos. You keep them.',
      },

      cases: {
        title: 'Made for moments worth keeping.',
        items: [
          ['♥', 'Weddings'],
          ['✦', 'Birthday parties'],
          ['▦', 'Company events'],
          ['▤', 'Conferences'],
          ['❋', 'Festivals'],
          ['⌂', 'Family celebrations'],
        ],
      },

      final: {
        h1: 'Your guests are already taking the photos.',
        h2: 'Make sure you get them.',
        cta: 'Create your event',
        trust: ['No app', 'No guest account', 'One QR code', 'Your Google Drive'],
      },

      phone: {
        eyebrow: 'Wedding photo mission',
        names: 'Kika & Miro',
        kicker: 'Wedding paparazzi',
        sub: 'Capture our day through your eyes',
        nameLabel: 'Your name',
        pick: 'Choose photos',
        send: 'Send',
        missionsTitle: 'Photo missions',
      },

      footPrivacy: 'Privacy',
      footTerms: 'Terms',
    },

    admin: {
      title: 'My events',
      sub: 'Each event has its own address, its own Drive folder and its own settings.',
      settings: 'Settings',
      open: 'Open',
      slideshow: 'Slideshow',
      newEvent: 'New event',
      nameLabel: 'Names or event title',
      nameHint: 'Shown to guests at the top of the page.',
      slugLabel: 'Address',
      slugHint: 'this goes on the QR code, so shorter is better.',
      create: 'Create event',
      creating: 'Creating…',
      cancel: 'Cancel',
      createNote: 'A new folder for this event will be created in your Google Drive.',
      errors: {
        too_short: 'The address needs at least three characters.',
        reserved: 'That address is reserved by the app itself, please pick another.',
        invalid: 'Use plain letters, digits and hyphens only.',
        taken: 'Someone is already using that address.',
        drive_failed: 'The Google Drive folder could not be created.',
        drive_api_off:
          'Google Drive API is not enabled in your Google Cloud project. Enable it under APIs & Services → Library and try again in a minute.',
        drive_full: 'The Google account has no free space, the folder could not be created.',
        scope_missing:
          'The app has no permission for your Drive. Sign out, sign in again and tick the Google Drive file access box on the consent screen.',
        google_reauth: 'Google access has expired. Sign out and sign in again.',
        generic: 'The event could not be created.',
        network: 'Could not reach the server.',
      },
    },

    editor: {
      back: 'My events',
      sub: 'Changes go live as soon as you save.',

      linkGroup: 'Address for guests',
      copy: 'Copy link',
      copied: 'Copied',
      qr: 'QR code',
      qrHide: 'Hide QR code',
      qrDownload: 'Download for print',
      qrNote: 'Generated right here, the address is not sent anywhere.',

      basicGroup: 'Basics',
      names: 'Names or title',
      date: 'Date',
      dateHintEmpty: 'Optional. Shown in the page footer.',
      dateHintCustom: 'Custom text overrides the picked date.',
      dateToText: 'Write custom text',
      dateToPicker: 'Pick from calendar',
      eyebrow: 'Line above the names',
      headline: 'Headline',
      lead: 'Subheading',
      thanks: 'Thank you message',
      thanksHint: 'Shown in large script type.',

      lookGroup: 'Appearance',
      theme: 'Theme',
      accent: 'Accent colour',
      accentHintCustom: 'Overrides the theme colour.',
      accentHintTheme: 'Following the chosen theme.',
      font: 'Type',
      ornaments: 'Botanical ornaments',
      ornamentsDesc: 'Drawn sprigs in the page corners.',

      missionsGroup: 'Photo mission tasks',
      missionsTitle: 'List heading',
      addMission: 'Add task',
      missionsClosing: 'Closing line',
      missionsClosingHint: 'Set in script type under the list.',
      up: 'move up',
      down: 'move down',
      remove: 'delete',

      optionsGroup: 'Options',
      gallery: 'Live gallery',
      galleryDesc: 'Guests can see everyone else photos.',
      slideshow: 'Slideshow',
      slideshowDesc: 'Full-screen rotation for a projector.',
      video: 'Accept video too',
      videoDesc: 'Video takes many times more space than photos.',
      requireName: 'Require a name',
      requireNameDesc: 'Without it you cannot tell who sent what.',

      contactGroup: 'Contact',
      contactLabel: 'Email shown on the privacy page',
      contactHint: 'Where guests can ask for their photos to be removed. Optional.',

      dangerGroup: 'Danger zone',
      dangerNote:
        'Deleting stops the address from working. The folder and photos in your Google Drive are left untouched.',
      remove_event: 'Delete event',
      confirmDelete: 'Delete this event? Photos in Google Drive will be left untouched.',

      save: 'Save changes',
      saving: 'Saving…',
      saved: 'Saved',
      saveFailed: 'Saving failed. Please try again.',
      deleteFailed: 'Deleting failed.',
    },

    notFound: {
      title: 'This page is not here',
      body:
        'The event address may be gone, or there is a typo in it. Check the link on the card or ask the organiser.',
      home: 'Go to start',
    },

    legal: {
      back: 'Back',
      privacyTitle: 'Privacy policy',
      updated: 'Last updated: September 2026',
      contact: 'Contact',
      privacy: [
        [
          'Who runs the service',
          'Paparazzi is a tool with which the organiser of a private celebration builds a page for their guests. The controller for any given event is always its organiser; we provide the technical means.',
        ],
        [
          'What we collect from guests',
          'The name a guest voluntarily types into the form, and the files they upload themselves. Nothing else. We use no tracking cookies, no analytics and no advertising scripts, and we require no sign-up.',
        ],
        [
          'Where files are stored',
          'Directly in the organiser Google Drive, in a folder created for that event. Our servers keep no copy; they only pass the bytes from the guest phone to the destination. The name entered becomes part of the file name so it is clear who sent it.',
        ],
        [
          'What we store',
          'For the organiser: their email, the name from their Google account, and the Drive access token, which is stored encrypted. Plus the settings of their events. About guests we store nothing.',
        ],
        [
          'Our Google Drive permission',
          'The drive.file scope only. It permits working solely with files and folders the app itself created. The rest of the organiser Drive is invisible to us.',
        ],
        [
          'How long it lasts',
          'Event settings remain until the organiser deletes them. The files are in their Drive and under their control. The organiser can withdraw the app access at any time in their Google account settings.',
        ],
        [
          'Guest rights',
          'A guest may ask for their files or name to be removed. Contact the event organiser, or the address below.',
        ],
      ],
      termsTitle: 'Terms of use',
      terms: [
        [
          'What the service is for',
          'Sharing photos and video among the guests of one private celebration. It is not public storage and not a social network.',
        ],
        [
          'Organiser responsibility',
          'The organiser is responsible for the content of their page, for who receives the link, and for the files in their Google Drive.',
        ],
        [
          'What does not belong here',
          'Unlawful or offensive content, or content you hold no rights to. Such content may be removed and access revoked without notice.',
        ],
        [
          'Availability',
          'The service is provided as is, with no guarantee of uninterrupted availability. We are not liable for the loss of uploaded files; originals remain on guest devices and in the organiser Drive.',
        ],
        [
          'Storage',
          'Files count against the storage of the organiser Google account. Watching the free space is up to them.',
        ],
        [
          'Ending',
          'The organiser may delete an event at any time and withdraw the app access to Google Drive. Files already in their Drive do not disappear.',
        ],
      ],
    },
  },
};

export function tx(locale) {
  return strings[locale] ?? strings.sk;
}
