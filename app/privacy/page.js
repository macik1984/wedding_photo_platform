import Link from 'next/link';
import { resolveLocale } from '@/lib/locale';
import { tx } from '../ui-strings';
import Backdrop from '../components/Backdrop';

export const dynamic = 'force-dynamic';

const CONTACT = process.env.NEXT_PUBLIC_CONTACT_EMAIL || '';

export default async function Privacy() {
  const locale = await resolveLocale();
  const t = tx(locale).legal;

  return (
    <div className="ui">
      <Backdrop />
      <main className="ui-page ui-page--narrow">
        <h1 className="ui-title">{t.privacyTitle}</h1>
        <p className="ui-sub">{t.updated}</p>

        <div className="ui-card">
          {t.privacy.map(([h, p]) => (
            <section key={h}>
              <h2>{h}</h2>
              <p>{p}</p>
            </section>
          ))}
          {CONTACT && (
            <section>
              <h2>{t.contact}</h2>
              <p>
                <a href={`mailto:${CONTACT}`}>{CONTACT}</a>
              </p>
            </section>
          )}
        </div>

        <p className="ui-foot">
          <Link href="/">‹ {t.back}</Link>
        </p>
      </main>
    </div>
  );
}
