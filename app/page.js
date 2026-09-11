import Link from 'next/link';
import { currentUser } from '@/lib/session';

export const dynamic = 'force-dynamic';

const STEPS = [
  {
    n: '1',
    h: 'Prihlásite sa Googlom',
    p: 'Jedným kliknutím. Aplikácia si založí vlastný priečinok vo vašom Drive a k ničomu inému sa nedostane.',
  },
  {
    n: '2',
    h: 'Nastavíte si stránku',
    p: 'Mená, dátum, texty, farby, písmo aj zoznam úloh foto misie. Všetko sa dá kedykoľvek zmeniť.',
  },
  {
    n: '3',
    h: 'Rozdáte QR kód',
    p: 'Hostia naskenujú, pošlú fotky a videá. Bez registrácie, bez inštalácie čohokoľvek.',
  },
];

export default async function Landing({ searchParams }) {
  const user = await currentUser();
  const params = await searchParams;
  const error = params?.error;

  return (
    <main className="wrap">
      <section className="hero">
        <p className="eyebrow">Foto misia pre vašich hostí</p>
        <h1>
          <span className="script" style={{ fontSize: '1.25em' }}>
            Paparazzi
          </span>
        </h1>
        <p>
          Hostia fotia, vy máte všetko na jednom mieste. Fotky idú priamo do vášho Google Drive,
          nie na cudzí server.
        </p>

        {error && (
          <div className="alert" style={{ maxWidth: 420, margin: '20px auto 0' }}>
            {error}
          </div>
        )}

        <div className="cta">
          {user ? (
            <Link className="btn" href="/admin">
              Moje akcie
            </Link>
          ) : (
            <a className="btn" href="/api/auth/google/start">
              Pokračovať cez Google
            </a>
          )}
        </div>
      </section>

      <section className="steps">
        {STEPS.map((s) => (
          <div className="step" key={s.n}>
            <div className="n">{s.n}</div>
            <h3>{s.h}</h3>
            <p>{s.p}</p>
          </div>
        ))}
      </section>

      <section className="section" style={{ marginTop: 34 }}>
        <h2>Čo to znamená pre vaše súkromie</h2>
        <p className="note" style={{ fontSize: 16 }}>
          Aplikácia žiada od Googlu jediné oprávnenie: <code>drive.file</code>. To jej dovolí
          pracovať výhradne so súbormi a priečinkami, ktoré sama vytvorila. Na zvyšok vášho Drive
          nevidí a nikdy ho ani neuvidí. Fotky sa nekopírujú nikam inam; server ich len prepúšťa
          z telefónu hosťa rovno do vášho úložiska.
        </p>
      </section>

      <p className="foot">
        <span className="links">
          <Link href="/privacy">Ochrana údajov</Link>
          {' · '}
          <Link href="/terms">Podmienky</Link>
        </span>
      </p>
    </main>
  );
}
