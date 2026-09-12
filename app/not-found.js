import Link from 'next/link';
import { resolveLocale } from '@/lib/locale';
import { tx } from './ui-strings';
import Backdrop from './components/Backdrop';

export default async function NotFound() {
  const locale = await resolveLocale();
  const t = tx(locale).notFound;

  return (
    <div className="ui">
      <Backdrop />
      <main className="ui-page ui-page--narrow">
        <section className="ui-hero">
          <h1 style={{ fontSize: 'clamp(30px, 7vw, 46px)' }}>{t.title}</h1>
          <p className="lead">{t.body}</p>
          <p style={{ marginTop: 28 }}>
            <Link className="ui-btn ui-btn--glass" href="/">
              {t.home}
            </Link>
          </p>
        </section>
      </main>
    </div>
  );
}
