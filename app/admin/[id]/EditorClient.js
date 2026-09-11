'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { THEMES, FONTS } from '@/lib/settings';

function Text({ label, value, onChange, hint, placeholder, area, max }) {
  return (
    <div className="field">
      <label>{label}</label>
      {area ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          maxLength={max}
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          maxLength={max}
        />
      )}
      {hint && <p className="note">{hint}</p>}
    </div>
  );
}

function Toggle({ checked, onChange, title, desc }) {
  return (
    <label className="toggle">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <span>
        <span className="t">{title}</span>
        <br />
        <span className="d">{desc}</span>
      </span>
    </label>
  );
}

export default function EditorClient({ eventId, slug, baseUrl, initial }) {
  const router = useRouter();
  const [s, setS] = useState(initial);
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  const set = (patch) => {
    setS((prev) => ({ ...prev, ...patch }));
    setSaved(false);
  };

  const publicUrl = baseUrl ? `${baseUrl}/${slug}` : `/${slug}`;

  async function save() {
    setBusy(true);
    setError('');
    try {
      const res = await fetch(`/api/events/${eventId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings: s }),
      });
      if (!res.ok) throw new Error('save');
      setSaved(true);
      router.refresh();
    } catch {
      setError('Uloženie sa nepodarilo. Skúste to prosím znova.');
    } finally {
      setBusy(false);
    }
  }

  async function remove() {
    if (!window.confirm('Naozaj zmazať túto akciu? Fotky na Google Drive zostanú nedotknuté.')) {
      return;
    }
    setBusy(true);
    try {
      const res = await fetch(`/api/events/${eventId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('delete');
      router.push('/admin');
    } catch {
      setError('Zmazanie sa nepodarilo.');
      setBusy(false);
    }
  }

  function editMission(i, value) {
    const missions = [...s.missions];
    missions[i] = value;
    set({ missions });
  }

  function moveMission(i, delta) {
    const missions = [...s.missions];
    const j = i + delta;
    if (j < 0 || j >= missions.length) return;
    [missions[i], missions[j]] = [missions[j], missions[i]];
    set({ missions });
  }

  return (
    <>
      <p className="note" style={{ marginBottom: 6 }}>
        <Link href="/admin">← Moje akcie</Link>
      </p>
      <h1 className="h1">{s.hostNames || slug}</h1>

      <div className="section">
        <h2>Adresa pre hostí</h2>
        <p style={{ margin: '0 0 12px', wordBreak: 'break-all' }}>
          <a href={`/${slug}`} target="_blank" rel="noreferrer">
            {publicUrl}
          </a>
        </p>
        <div className="row-actions" style={{ marginTop: 0 }}>
          <button
            type="button"
            className="btn btn--quiet"
            onClick={() => navigator.clipboard?.writeText(publicUrl)}
          >
            Skopírovať odkaz
          </button>
          <a
            className="btn btn--quiet"
            href={`https://api.qrserver.com/v1/create-qr-code/?size=600x600&margin=10&data=${encodeURIComponent(publicUrl)}`}
            target="_blank"
            rel="noreferrer"
          >
            QR kód
          </a>
        </div>
      </div>

      <div className="section">
        <h2>Základné údaje</h2>
        <div className="two">
          <Text
            label="Mená alebo názov"
            value={s.hostNames}
            onChange={(v) => set({ hostNames: v })}
            placeholder="Kika a Miro"
            max={80}
          />
          <Text
            label="Dátum"
            value={s.dateText}
            onChange={(v) => set({ dateText: v })}
            placeholder="18. 9. 2026"
            hint="Píše sa presne tak, ako to zadáte."
            max={40}
          />
        </div>
        <div className="two">
          <Text
            label="Riadok nad menami"
            value={s.eyebrow}
            onChange={(v) => set({ eyebrow: v })}
            placeholder="Svadobná foto misia"
            max={60}
          />
          <Text
            label="Nadpis"
            value={s.headline}
            onChange={(v) => set({ headline: v })}
            placeholder="Svadobní paparazzi"
            max={60}
          />
        </div>
        <Text
          label="Podnadpis"
          value={s.lead}
          onChange={(v) => set({ lead: v })}
          placeholder="Zachyťte náš deň aj vašimi očami"
          max={200}
        />
        <Text
          label="Poďakovanie po odoslaní"
          value={s.thanks}
          onChange={(v) => set({ thanks: v })}
          placeholder="Ďakujeme!"
          hint="Zobrazí sa veľkým písaným písmom."
          max={60}
        />
      </div>

      <div className="section">
        <h2>Vzhľad</h2>

        <div className="field">
          <label>Farebná téma</label>
          <div className="chips">
            {Object.entries(THEMES).map(([key, theme]) => (
              <button
                key={key}
                type="button"
                className="chip"
                data-active={s.theme === key}
                onClick={() => set({ theme: key })}
              >
                <span className="swatch" style={{ background: theme.vars['--accent'] }} />
                {theme.label}
              </button>
            ))}
          </div>
        </div>

        <div className="field">
          <label>Vlastná hlavná farba</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <input
              type="color"
              value={s.accent || THEMES[s.theme]?.vars['--accent'] || '#b5966b'}
              onChange={(e) => set({ accent: e.target.value })}
              style={{ width: 52, height: 40, padding: 0, border: '1px solid var(--line)' }}
            />
            <button type="button" className="btn btn--quiet btn--auto" onClick={() => set({ accent: '' })}>
              Podľa témy
            </button>
          </div>
          <p className="note">Prepíše farbu z témy. Ostatné odtiene zostávajú.</p>
        </div>

        <div className="field">
          <label>Písmo</label>
          <div className="chips">
            {Object.entries(FONTS).map(([key, font]) => (
              <button
                key={key}
                type="button"
                className="chip"
                data-active={s.fonts === key}
                onClick={() => set({ fonts: key })}
              >
                {font.label}
              </button>
            ))}
          </div>
        </div>

        <Toggle
          checked={s.ornaments}
          onChange={(v) => set({ ornaments: v })}
          title="Botanické ozdoby"
          desc="Kreslené vetvičky v rohoch stránky."
        />
      </div>

      <div className="section">
        <h2>Úlohy foto misie</h2>
        <Text
          label="Nadpis zoznamu"
          value={s.missionsTitle}
          onChange={(v) => set({ missionsTitle: v })}
          max={80}
        />

        {s.missions.map((m, i) => (
          <div className="mission-row" key={i}>
            <input value={m} onChange={(e) => editMission(i, e.target.value)} maxLength={160} />
            <button type="button" onClick={() => moveMission(i, -1)} aria-label="hore">
              ↑
            </button>
            <button type="button" onClick={() => moveMission(i, 1)} aria-label="dole">
              ↓
            </button>
            <button
              type="button"
              onClick={() => set({ missions: s.missions.filter((_, k) => k !== i) })}
              aria-label="zmazať"
            >
              ×
            </button>
          </div>
        ))}

        <button
          type="button"
          className="btn btn--quiet btn--auto"
          onClick={() => set({ missions: [...s.missions, ''] })}
          disabled={s.missions.length >= 30}
        >
          Pridať úlohu
        </button>

        <div style={{ marginTop: 16 }}>
          <Text
            label="Veta na záver"
            value={s.missionsClosing}
            onChange={(v) => set({ missionsClosing: v })}
            hint="Píše sa písaným písmom pod zoznamom."
            max={120}
          />
        </div>
      </div>

      <div className="section">
        <h2>Možnosti</h2>
        <Toggle
          checked={s.galleryEnabled}
          onChange={(v) => set({ galleryEnabled: v })}
          title="Živá galéria"
          desc="Hostia uvidia fotky ostatných na /gallery."
        />
        <Toggle
          checked={s.slideshowEnabled}
          onChange={(v) => set({ slideshowEnabled: v })}
          title="Premietanie"
          desc="Celoobrazovkové striedanie fotiek na projektor v sále."
        />
        <Toggle
          checked={s.allowVideo}
          onChange={(v) => set({ allowVideo: v })}
          title="Prijímať aj videá"
          desc="Videá zaberú násobne viac miesta na Drive než fotky."
        />
        <Toggle
          checked={s.requireName}
          onChange={(v) => set({ requireName: v })}
          title="Vyžadovať meno"
          desc="Bez mena nie je v albume vidieť, kto čo poslal."
        />
      </div>

      <div className="section">
        <h2>Kontakt</h2>
        <Text
          label="E-mail na stránkach o ochrane údajov"
          value={s.contactEmail}
          onChange={(v) => set({ contactEmail: v })}
          placeholder="vas@email.sk"
          hint="Sem sa môžu hostia obrátiť so žiadosťou o zmazanie fotiek. Nepovinné."
          max={120}
        />
      </div>

      {error && <div className="alert">{error}</div>}

      <div className="sticky-save">
        <button className="btn btn--auto" onClick={save} disabled={busy}>
          {busy ? 'Ukladám…' : 'Uložiť zmeny'}
        </button>
        {saved && <span className="saved">Uložené</span>}
      </div>

      <div className="section" style={{ marginTop: 30 }}>
        <h2>Nebezpečná zóna</h2>
        <p className="note" style={{ marginTop: 0, marginBottom: 12 }}>
          Zmazaním prestane adresa fungovať. Priečinok a fotky na vašom Google Drive zostávajú
          nedotknuté.
        </p>
        <button type="button" className="btn btn--danger btn--auto" onClick={remove} disabled={busy}>
          Zmazať akciu
        </button>
      </div>
    </>
  );
}
