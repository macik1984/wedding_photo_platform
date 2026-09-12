import Link from 'next/link';
import { resolveLocale } from '@/lib/locale';
import { tx } from '../ui-strings';
import Backdrop from '../components/Backdrop';

export const dynamic = 'force-dynamic';

export default async function Terms() {
  const locale = await resolveLocale();
  const t = tx(locale).legal;

  return (
    <div className="ui">
      <Backdrop />
      <main className="ui-page ui-page--narrow">
        <h1 className="ui-title">{t.termsTitle}</h1>

        <div className="ui-card" style={{ marginTop: 18 }}>
          {t.terms.map(([h, p]) => (
            <section key={h}>
              <h2>{h}</h2>
              <p>{p}</p>
            </section>
          ))}
        </div>

        <p className="ui-foot">
          <Link href="/">‹ {t.back}</Link>
        </p>
      </main>
    </div>
  );
}
