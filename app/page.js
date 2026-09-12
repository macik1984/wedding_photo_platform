import Link from 'next/link';
import { currentUser } from '@/lib/session';
import { resolveLocale } from '@/lib/locale';
import { tx } from './ui-strings';
import Backdrop from './components/Backdrop';
import PhoneMock from './components/PhoneMock';
import LangToggle from './components/LangToggle';

export const dynamic = 'force-dynamic';

/** Bodkami oddeleny riadok drobnych slubov pod tlacidlom. */
function TrustLine({ items }) {
  return (
    <ul className="ui-trust">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

export default async function Landing({ searchParams }) {
  const [user, locale, params] = await Promise.all([
    currentUser(),
    resolveLocale(),
    searchParams,
  ]);
  const t = tx(locale);
  const L = t.landing;
  const error = params?.error;

  return (
    <div className="ui">
      <Backdrop />

      <nav className="ui-nav">
        <div className="inner">
          <Link href="/" className="mark">
            Paparazzi
          </Link>
          <div className="right">
            <LangToggle locale={t.code} other={t.other} otherLabel={t.otherLabel} />
            {user ? (
              <Link className="ui-btn" href="/admin">
                {t.nav.myEvents}
              </Link>
            ) : (
              <a className="ui-btn ui-btn--glass" href="/api/auth/google/start">
                {t.nav.signIn}
              </a>
            )}
          </div>
        </div>
      </nav>

      <main className="ui-page">
        {/* 1 - hlavicka */}
        <section className="ui-hero">
          <span className="ui-pill">
            <span className="dot" />
            {L.eyebrow}
          </span>

          <h1>
            {L.h1a}
            <br />
            <span className="grad">{L.h1b}</span>
          </h1>

          <p className="lead">{L.lead}</p>

          {error && (
            <div className="ui-alert" style={{ maxWidth: 460, margin: '24px auto 0' }}>
              {error}
            </div>
          )}

          <div className="ui-cta">
            <a className="ui-btn ui-btn--big" href="/api/auth/google/start">
              {L.ctaPrimary}
            </a>
            <a className="ui-btn ui-btn--glass ui-btn--big" href="#ako">
              {L.ctaSecondary}
            </a>
          </div>

          <TrustLine items={L.trust} />
        </section>

        <section className="ui-stage" aria-hidden="true">
          <div className="ui-chip ui-chip--l">
            <span className="ic">◎</span>
            <span>
              <b>{L.chipMissions.t}</b>
              <span>{L.chipMissions.s}</span>
            </span>
          </div>

          <PhoneMock t={L.phone} />

          <div className="ui-chip ui-chip--r">
            <span className="ic">☁︎</span>
            <span>
              <b>{L.chipDrive.t}</b>
              <span>{L.chipDrive.s}</span>
            </span>
          </div>
        </section>

        {/* 2 - problem */}
        <section className="ui-section">
          <div className="ui-problem">
            <h2>
              {L.problem.h1}
              <br />
              <span className="grad">{L.problem.h2}</span>
            </h2>
            <p>{L.problem.body}</p>
            <p className="closing">{L.problem.closing}</p>
          </div>
        </section>

        {/* 3 - ako to funguje */}
        <section className="ui-section" id="ako">
          <h2>{L.how.title}</h2>
          <div className="ui-steps" style={{ marginTop: 30 }}>
            {L.how.steps.map(([h, p], i) => (
              <div className="ui-step" key={h}>
                <div className="n">{i + 1}</div>
                <h3>{h}</h3>
                <p>{p}</p>
              </div>
            ))}
          </div>
          <p className="ui-after">{L.how.after}</p>
        </section>

        {/* 4 - foto ulohy */}
        <section className="ui-section">
          <h2>{L.missions.title}</h2>
          <p className="intro">{L.missions.lead}</p>

          <div className="ui-split">
            <ul className="ui-missioncards">
              {L.missions.items.map((m, i) => (
                <li className="ui-missioncard" key={m} style={{ '--i': i }}>
                  <span className="tick" aria-hidden="true" />
                  {m}
                </li>
              ))}
            </ul>

            <div className="ui-splitphone" aria-hidden="true">
              <PhoneMock t={L.phone} missions={L.missions.items} variant="missions" />
            </div>
          </div>

          <p className="ui-benefit">{L.missions.benefit}</p>
        </section>

        {/* 5 - vlastnictvo fotiek */}
        <section className="ui-section">
          <h2>{L.drive.title}</h2>
          <p className="intro">{L.drive.body}</p>

          <div className="ui-features">
            {L.drive.benefits.map(([ic, h, p]) => (
              <div className="ui-feature" key={h}>
                <span className="ic" aria-hidden="true">
                  {ic}
                </span>
                <h3>{h}</h3>
                <p>{p}</p>
              </div>
            ))}
          </div>

          <p className="ui-highlight">{L.drive.highlight}</p>
        </section>

        {/* 6 - pre aké príležitosti */}
        <section className="ui-section">
          <h2>{L.cases.title}</h2>
          <ul className="ui-cases">
            {L.cases.items.map(([ic, label]) => (
              <li className="ui-case" key={label}>
                <span className="ic" aria-hidden="true">
                  {ic}
                </span>
                <span className="lb">{label}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* 7 - záverečná výzva */}
        <section className="ui-final">
          <h2>
            {L.final.h1}
            <br />
            <span className="grad">{L.final.h2}</span>
          </h2>
          <a className="ui-btn ui-btn--big" href="/api/auth/google/start">
            {L.final.cta}
          </a>
          <TrustLine items={L.final.trust} />
        </section>

        <p className="ui-foot">
          <Link href="/privacy">{L.footPrivacy}</Link>
          {' · '}
          <Link href="/terms">{L.footTerms}</Link>
        </p>
      </main>
    </div>
  );
}
