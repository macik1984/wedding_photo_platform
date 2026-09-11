import Link from 'next/link';

export const metadata = { title: 'Podmienky používania' };

const SECTIONS = [
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
];

export default function Terms() {
  return (
    <main className="wrap wrap--narrow">
      <h1 className="h1">Podmienky používania</h1>

      <div className="section legal" style={{ marginTop: 20 }}>
        {SECTIONS.map(([h, p]) => (
          <section key={h}>
            <h2>{h}</h2>
            <p>{p}</p>
          </section>
        ))}
      </div>

      <p className="foot">
        <span className="links">
          <Link href="/">← Späť</Link>
        </span>
      </p>
    </main>
  );
}
