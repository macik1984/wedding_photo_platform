import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="wrap wrap--narrow">
      <section className="hero">
        <p className="eyebrow">404</p>
        <h1 style={{ fontSize: 'clamp(30px, 8vw, 46px)', margin: '10px 0 12px', fontWeight: 500 }}>
          Táto stránka tu nie je
        </h1>
        <p>
          Adresa akcie možno zanikla, alebo v nej je preklep. Skontrolujte odkaz na kartičke
          alebo sa opýtajte organizátora.
        </p>
        <p className="foot">
          <span className="links">
            <Link href="/">← Na úvod</Link>
          </span>
        </p>
      </section>
    </main>
  );
}
