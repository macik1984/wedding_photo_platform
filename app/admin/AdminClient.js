'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

function toSlug(input) {
  return String(input ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 48);
}

const ERRORS = {
  too_short: 'Adresa musí mať aspoň tri znaky.',
  reserved: 'Túto adresu si drží samotná aplikácia, zvoľte inú.',
  invalid: 'Použite iba písmená bez diakritiky, číslice a pomlčky.',
  taken: 'Takúto adresu už niekto používa.',
  drive_failed: 'Nepodarilo sa vytvoriť priečinok na Google Drive.',
  google_reauth: 'Prístup ku Google vypršal. Odhláste sa a prihláste znova.',
};

export default function AdminClient({ events, baseUrl }) {
  const router = useRouter();
  const [open, setOpen] = useState(events.length === 0);
  const [hostNames, setHostNames] = useState('');
  const [slug, setSlug] = useState('');
  const [touched, setTouched] = useState(false);
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
        body: JSON.stringify({ hostNames, slug: effectiveSlug, lang: 'sk' }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(ERRORS[data.error] ?? 'Nepodarilo sa vytvoriť akciu.');
        return;
      }
      router.push(`/admin/${data.event.id}`);
    } catch {
      setError('Nepodarilo sa spojiť so serverom.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <h1 className="h1">Moje akcie</h1>
      <p className="note" style={{ fontSize: 16 }}>
        Každá akcia má vlastnú adresu, vlastný priečinok na Drive a vlastné nastavenia.
      </p>

      {events.length > 0 && (
        <div className="cards">
          {events.map((e) => (
            <div className="card-row" key={e.id}>
              <h3>{e.settings.hostNames || e.slug}</h3>
              <div className="url">
                {baseUrl ? `${baseUrl}/${e.slug}` : `/${e.slug}`}
              </div>
              <div className="row-actions">
                <Link className="btn" href={`/admin/${e.id}`}>
                  Nastavenia
                </Link>
                <Link className="btn btn--quiet" href={`/${e.slug}`} target="_blank">
                  Otvoriť
                </Link>
                {e.settings.slideshowEnabled !== false && (
                  <Link className="btn btn--quiet" href={`/${e.slug}/slideshow`} target="_blank">
                    Premietanie
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {open ? (
        <form className="section" onSubmit={create} style={{ marginTop: 24 }}>
          <h2>Nová akcia</h2>

          <div className="field">
            <label htmlFor="hosts">Mená alebo názov akcie</label>
            <input
              id="hosts"
              type="text"
              value={hostNames}
              onChange={(ev) => setHostNames(ev.target.value)}
              placeholder="Kika a Miro"
              autoComplete="off"
              required
            />
            <p className="note">Zobrazí sa hosťom v hlavičke stránky.</p>
          </div>

          <div className="field">
            <label htmlFor="slug">Adresa</label>
            <input
              id="slug"
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
            <p className="note">
              {baseUrl ? `${baseUrl}/` : '/'}
              <strong>{effectiveSlug || 'adresa'}</strong> - toto pôjde na QR kód, takže čím
              kratšie, tým lepšie.
            </p>
          </div>

          {error && <div className="alert">{error}</div>}

          <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
            <button className="btn" disabled={busy || !hostNames.trim() || !effectiveSlug}>
              {busy ? 'Zakladám…' : 'Vytvoriť'}
            </button>
            {events.length > 0 && (
              <button
                type="button"
                className="btn btn--quiet"
                onClick={() => setOpen(false)}
                disabled={busy}
              >
                Zrušiť
              </button>
            )}
          </div>
          <p className="note">
            Pri vytvorení sa vo vašom Google Drive založí nový priečinok pre túto akciu.
          </p>
        </form>
      ) : (
        <div style={{ marginTop: 24, maxWidth: 260 }}>
          <button className="btn btn--quiet" onClick={() => setOpen(true)}>
            Nová akcia
          </button>
        </div>
      )}
    </>
  );
}
