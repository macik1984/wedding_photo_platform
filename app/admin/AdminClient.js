'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { TEMPLATES } from '@/lib/settings';

function toSlug(input) {
  return String(input ?? '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 48);
}

export default function AdminClient({ events, baseUrl, locale, t }) {
  const router = useRouter();
  const [open, setOpen] = useState(events.length === 0);
  const [hostNames, setHostNames] = useState('');
  const [slug, setSlug] = useState('');
  const [touched, setTouched] = useState(false);
  const [template, setTemplate] = useState('wedding');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const effectiveSlug = touched ? toSlug(slug) : toSlug(hostNames);

  async function create(e) {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      const res = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hostNames, slug: effectiveSlug, lang: locale, template }),
      });
      const data = await res.json();
      if (!res.ok) {
        const base = t.errors[data.error] ?? t.errors.generic;
        setError(data.detail ? `${base} (${data.detail})` : base);
        return;
      }
      router.push(`/admin/${data.event.id}`);
    } catch {
      setError(t.errors.network);
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <h1 className="ui-title">{t.title}</h1>
      <p className="ui-sub">{t.sub}</p>

      {events.length > 0 && (
        <div className="ui-eventcards">
          {events.map((e) => (
            <div className="ui-card" key={e.id} style={{ marginBottom: 0 }}>
              <h3
                style={{
                  margin: '0 0 4px',
                  fontSize: 20,
                  fontWeight: 620,
                  letterSpacing: '-0.025em',
                }}
              >
                {e.settings.hostNames || e.slug}
              </h3>
              <div className="ui-url">{baseUrl ? `${baseUrl}/${e.slug}` : `/${e.slug}`}</div>
              <div className="ui-actions" style={{ marginTop: 16 }}>
                <Link className="ui-btn" href={`/admin/${e.id}`}>
                  {t.settings}
                </Link>
                <Link className="ui-btn ui-btn--glass" href={`/${e.slug}`} target="_blank">
                  {t.open}
                </Link>
                {e.settings.slideshowEnabled !== false && (
                  <Link
                    className="ui-btn ui-btn--glass"
                    href={`/${e.slug}/slideshow`}
                    target="_blank"
                  >
                    {t.slideshow}
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {open ? (
        <form className="ui-card" onSubmit={create} style={{ marginTop: 20 }}>
          <h3
            style={{ margin: '0 0 16px', fontSize: 18, fontWeight: 620, letterSpacing: '-0.02em' }}
          >
            {t.newEvent}
          </h3>

          {/* typ akcie urcuje vzhlad, texty aj ulohy, ktore organizator dostane */}
          <div className="ui-field">
            <label>{t.typeLabel}</label>
            <div className="ui-seg">
              {Object.entries(TEMPLATES).map(([key, tpl]) => (
                <button
                  key={key}
                  type="button"
                  data-on={template === key}
                  onClick={() => setTemplate(key)}
                >
                  {tpl.label[locale] ?? tpl.label.sk}
                </button>
              ))}
            </div>
            <p className="ui-hint">{t.typeHint}</p>
          </div>

          <div className="ui-field">
            <label htmlFor="hosts">{t.nameLabel}</label>
            <input
              id="hosts"
              className="ui-input"
              type="text"
              value={hostNames}
              onChange={(ev) => setHostNames(ev.target.value)}
              placeholder="Kika a Miro"
              autoComplete="off"
              required
            />
            <p className="ui-hint">{t.nameHint}</p>
          </div>

          <div className="ui-field">
            <label htmlFor="slug">{t.slugLabel}</label>
            <input
              id="slug"
              className="ui-input"
              type="text"
              value={touched ? slug : effectiveSlug}
              onChange={(ev) => {
                setTouched(true);
                setSlug(ev.target.value);
              }}
              placeholder="kika-a-miro"
              autoComplete="off"
              spellCheck={false}
            />
            <p className="ui-hint">
              {baseUrl ? `${baseUrl}/` : '/'}
              <strong style={{ color: 'var(--text)' }}>{effectiveSlug || 'adresa'}</strong>{' '}
              {t.slugHint}
            </p>
          </div>

          {error && <div className="ui-alert">{error}</div>}

          <div className="ui-actions" style={{ marginTop: 18 }}>
            <button className="ui-btn" disabled={busy || !hostNames.trim() || !effectiveSlug}>
              {busy ? t.creating : t.create}
            </button>
            {events.length > 0 && (
              <button
                type="button"
                className="ui-btn ui-btn--plain"
                onClick={() => setOpen(false)}
                disabled={busy}
              >
                {t.cancel}
              </button>
            )}
          </div>
          <p className="ui-hint">{t.createNote}</p>
        </form>
      ) : (
        <div style={{ marginTop: 20 }}>
          <button className="ui-btn ui-btn--glass" onClick={() => setOpen(true)}>
            {t.newEvent}
          </button>
        </div>
      )}
    </>
  );
}
