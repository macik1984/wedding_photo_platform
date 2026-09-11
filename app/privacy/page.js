import Link from 'next/link';

export const metadata = { title: 'Ochrana osobných údajov' };

const CONTACT = process.env.NEXT_PUBLIC_CONTACT_EMAIL || '';

const SECTIONS = [
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
];

export default function Privacy() {
  return (
    <main className="wrap wrap--narrow">
      <h1 className="h1">Ochrana osobných údajov</h1>
      <p className="note">Naposledy aktualizované: september 2026</p>

      <div className="section legal" style={{ marginTop: 20 }}>
        {SECTIONS.map(([h, p]) => (
          <section key={h}>
            <h2>{h}</h2>
            <p>{p}</p>
          </section>
        ))}
        {CONTACT && (
          <section>
            <h2>Kontakt</h2>
            <p>
              <a href={`mailto:${CONTACT}`}>{CONTACT}</a>
            </p>
          </section>
        )}
      </div>

      <p className="foot">
        <span className="links">
          <Link href="/">← Späť</Link>
        </span>
      </p>
    </main>
  );
}
