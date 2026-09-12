'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  THEMES,
  FONTS,
  TEMPLATES,
  EMOJI_CHOICES,
  templateContent,
  monogramOf,
  longDate,
} from '@/lib/settings';
import QrPanel from '../../components/QrPanel';
import EventPreview from '../../components/EventPreview';

const SYMBOL_KEYS = ['ornaments', 'emoji', 'monogram', 'logo', 'none'];

/** Ku ktorej volbe patri aka vysvetlivka pod prepinacom. */
const SYMBOL_HINT = {
  ornaments: 'symbolHintOrnaments',
  emoji: 'symbolHintEmoji',
  monogram: 'symbolHintMonogram',
  logo: 'symbolHintLogo',
  none: 'symbolHintNone',
};

const ACCENTS = [
  '#b5966b',
  '#c9a875',
  '#7c9070',
  '#4a7c8c',
  '#5b6b86',
  '#8a6fa8',
  '#c08d86',
  '#c0603f',
];

function Field({ label, hint, children }) {
  return (
    <div className="ui-field">
      {label && <label>{label}</label>}
      {children}
      {hint && <p className="ui-hint">{hint}</p>}
    </div>
  );
}

function Text({ label, value, onChange, hint, placeholder, max }) {
  return (
    <Field label={label} hint={hint}>
      <input
        className="ui-input"
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        maxLength={max}
      />
    </Field>
  );
}

function SwitchRow({ checked, onChange, title, desc }) {
  return (
    <div className="ui-row">
      <div className="grow">
        <div className="t">{title}</div>
        <div className="d">{desc}</div>
      </div>
      <input
        type="checkbox"
        className="ui-switch"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        aria-label={title}
      />
    </div>
  );
}

/** Zaloha pre prehliadace bez Clipboard API (stary Safari, stranka bez HTTPS). */
function copyText(value) {
  if (navigator.clipboard?.writeText) {
    return navigator.clipboard.writeText(value);
  }
  return new Promise((resolve, reject) => {
    try {
      const el = document.createElement('textarea');
      el.value = value;
      el.setAttribute('readonly', '');
      el.style.position = 'fixed';
      el.style.opacity = '0';
      document.body.appendChild(el);
      el.select();
      const ok = document.execCommand('copy');
      document.body.removeChild(el);
      ok ? resolve() : reject(new Error('copy'));
    } catch (err) {
      reject(err);
    }
  });
}

export default function EditorClient({ eventId, slug, baseUrl, locale, t, initial }) {
  const router = useRouter();
  const [s, setS] = useState(initial);
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [customDate, setCustomDate] = useState(Boolean(initial.dateText));
  const [logoBusy, setLogoBusy] = useState(false);
  const [logoError, setLogoError] = useState('');

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
      setError(t.saveFailed);
    } finally {
      setBusy(false);
    }
  }

  async function remove() {
    if (!window.confirm(t.confirmDelete)) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/events/${eventId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('delete');
      router.push('/admin');
    } catch {
      setError(t.deleteFailed);
      setBusy(false);
    }
  }

  function copy() {
    copyText(publicUrl).then(
      () => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1600);
      },
      () => {}
    );
  }

  /**
   * Sablona prepise vzhlad, texty aj ulohy naraz. Pytame sa, lebo pre niekoho,
   * kto uz ma vsetko napisane, by to bola strata prace.
   */
  function applyTemplate(key) {
    const tpl = TEMPLATES[key];
    if (!tpl) return;
    if (!window.confirm(t.templateConfirm)) return;
    const c = templateContent(key, locale);
    set({
      template: key,
      theme: tpl.look.theme,
      fonts: tpl.look.fonts,
      accent: tpl.look.accent,
      symbol: s.symbol === 'logo' && s.logoFileId ? 'logo' : tpl.look.symbol,
      emoji: tpl.look.emoji,
      eyebrow: c.eyebrow,
      headline: c.headline,
      lead: c.lead,
      thanks: c.thanks,
      missionsTitle: c.missionsTitle,
      missionsClosing: c.missionsClosing,
      missions: [...c.missions],
    });
  }

  /** Ulohy v jazyku administracie, bez zasahu do vzhladu a ostatnych textov. */
  function loadMissions(key) {
    const c = templateContent(key, locale);
    set({
      missionsTitle: c.missionsTitle,
      missionsClosing: c.missionsClosing,
      missions: [...c.missions],
    });
  }

  async function uploadLogo(file) {
    if (!file) return;
    setLogoError('');
    if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.type)) {
      setLogoError(t.logoBadType);
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setLogoError(t.logoTooBig);
      return;
    }

    setLogoBusy(true);
    try {
      const res = await fetch(`/api/events/${eventId}/logo`, {
        method: 'POST',
        headers: { 'Content-Type': file.type },
        body: file,
      });
      if (!res.ok) throw new Error('upload');
      const data = await res.json();
      set({ logoFileId: data.logoFileId, symbol: 'logo' });
      router.refresh();
    } catch {
      setLogoError(t.logoFailed);
    } finally {
      setLogoBusy(false);
    }
  }

  async function removeLogo() {
    setLogoBusy(true);
    setLogoError('');
    try {
      const res = await fetch(`/api/events/${eventId}/logo`, { method: 'DELETE' });
      if (!res.ok) throw new Error('delete');
      set({ logoFileId: '', symbol: s.symbol === 'logo' ? 'none' : s.symbol });
      router.refresh();
    } catch {
      setLogoError(t.logoFailed);
    } finally {
      setLogoBusy(false);
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

  const themeAccent = THEMES[s.theme]?.vars['--accent'] ?? '#b5966b';
  const activeAccent = s.accent || themeAccent;

  return (
    <>
      <Link href="/admin" className="ui-back">
        ‹ {t.back}
      </Link>
      <h1 className="ui-title">{s.hostNames || slug}</h1>
      <p className="ui-sub">{t.sub}</p>

      <div className="ui-editor">
        <EventPreview settings={s} t={t} slug={slug} />

        <div className="form">
          <div className="ui-group">
            <p className="label">{t.linkGroup}</p>
            <div className="ui-card" style={{ marginBottom: 0 }}>
              <a className="ui-url" href={`/${slug}`} target="_blank" rel="noreferrer">
                {publicUrl}
              </a>
              <div className="ui-actions" style={{ marginTop: 14 }}>
                <button type="button" className="ui-btn ui-btn--glass" onClick={copy}>
                  {copied ? t.copied : t.copy}
                </button>
                <QrPanel url={publicUrl} t={t} fileName={slug} />
              </div>
            </div>
          </div>

          <div className="ui-group">
            <p className="label">{t.templateGroup}</p>
            <div className="ui-card" style={{ marginBottom: 0 }}>
              <Field hint={t.templateHint}>
                <div className="ui-themes">
                  {Object.entries(TEMPLATES).map(([key, tpl]) => (
                    <button
                      key={key}
                      type="button"
                      className="ui-theme"
                      data-on={s.template === key}
                      onClick={() => applyTemplate(key)}
                    >
                      <span
                        className="swatch"
                        style={{ background: THEMES[tpl.look.theme].vars['--paper'] }}
                      >
                        <span
                          className="dot"
                          style={{ background: THEMES[tpl.look.theme].vars['--accent'] }}
                        />
                      </span>
                      <span className="name">{tpl.label[locale] ?? tpl.label.sk}</span>
                    </button>
                  ))}
                </div>
              </Field>
            </div>
          </div>

          <div className="ui-group">
            <p className="label">{t.basicGroup}</p>
            <div className="ui-card" style={{ marginBottom: 0 }}>
              <Text
                label={t.names}
                value={s.hostNames}
                onChange={(v) => set({ hostNames: v })}
                placeholder="Kika a Miro"
                max={80}
              />

              <Field
                label={t.date}
                hint={
                  customDate
                    ? t.dateHintCustom
                    : s.dateISO
                      ? longDate(s.dateISO, locale)
                      : t.dateHintEmpty
                }
              >
                {customDate ? (
                  <input
                    className="ui-input"
                    type="text"
                    value={s.dateText}
                    onChange={(e) => set({ dateText: e.target.value })}
                    placeholder={locale === 'sk' ? 'leto 2026' : 'summer 2026'}
                    maxLength={40}
                  />
                ) : (
                  <input
                    className="ui-input"
                    type="date"
                    value={s.dateISO}
                    onChange={(e) => set({ dateISO: e.target.value })}
                  />
                )}
                <button
                  type="button"
                  className="ui-btn ui-btn--plain"
                  style={{ paddingLeft: 0, marginTop: 2 }}
                  onClick={() => {
                    const next = !customDate;
                    setCustomDate(next);
                    set(next ? {} : { dateText: '' });
                  }}
                >
                  {customDate ? t.dateToPicker : t.dateToText}
                </button>
              </Field>

              <div className="ui-two">
                <Text
                  label={t.eyebrow}
                  value={s.eyebrow}
                  onChange={(v) => set({ eyebrow: v })}
                  max={60}
                />
                <Text
                  label={t.headline}
                  value={s.headline}
                  onChange={(v) => set({ headline: v })}
                  max={60}
                />
              </div>

              <Text label={t.lead} value={s.lead} onChange={(v) => set({ lead: v })} max={200} />
              <Text
                label={t.thanks}
                value={s.thanks}
                onChange={(v) => set({ thanks: v })}
                hint={t.thanksHint}
                max={60}
              />
            </div>
          </div>

          <div className="ui-group">
            <p className="label">{t.lookGroup}</p>
            <div className="ui-card" style={{ marginBottom: 0 }}>
              <Field label={t.theme}>
                <div className="ui-themes">
                  {Object.entries(THEMES).map(([key, theme]) => (
                    <button
                      key={key}
                      type="button"
                      className="ui-theme"
                      data-on={s.theme === key}
                      onClick={() => set({ theme: key })}
                    >
                      <span className="swatch" style={{ background: theme.vars['--paper'] }}>
                        <span className="dot" style={{ background: theme.vars['--accent'] }} />
                      </span>
                      <span className="name">{theme.label[locale] ?? theme.label.sk}</span>
                    </button>
                  ))}
                </div>
              </Field>

              <Field label={t.accent} hint={s.accent ? t.accentHintCustom : t.accentHintTheme}>
                <div className="ui-colors">
                  <button
                    type="button"
                    className="ui-color"
                    data-on={!s.accent}
                    style={{ background: themeAccent }}
                    onClick={() => set({ accent: '' })}
                    aria-label={t.accentHintTheme}
                  />
                  {ACCENTS.map((hex) => (
                    <button
                      key={hex}
                      type="button"
                      className="ui-color"
                      data-on={s.accent?.toLowerCase() === hex}
                      style={{ background: hex }}
                      onClick={() => set({ accent: hex })}
                      aria-label={hex}
                    />
                  ))}
                  <input
                    type="color"
                    className="ui-color ui-color--custom"
                    value={activeAccent}
                    onChange={(e) => set({ accent: e.target.value })}
                    aria-label={t.accent}
                  />
                </div>
              </Field>

              <Field label={t.font}>
                <div className="ui-seg">
                  {Object.entries(FONTS).map(([key, font]) => (
                    <button
                      key={key}
                      type="button"
                      data-on={s.fonts === key}
                      onClick={() => set({ fonts: key })}
                    >
                      {font.label[locale] ?? font.label.sk}
                    </button>
                  ))}
                </div>
              </Field>
            </div>

            <div className="ui-card" style={{ marginTop: 12, marginBottom: 0 }}>
              <Field label={t.symbol} hint={SYMBOL_HINT[s.symbol] ? t[SYMBOL_HINT[s.symbol]] : ''}>
                <div className="ui-seg">
                  {SYMBOL_KEYS.map((key) => (
                    <button
                      key={key}
                      type="button"
                      data-on={s.symbol === key}
                      onClick={() => set({ symbol: key })}
                    >
                      {t[`symbol_${key}`]}
                    </button>
                  ))}
                </div>
              </Field>

              {s.symbol === 'emoji' && (
                <Field label={t.emojiPick}>
                  <div className="ui-emoji">
                    {EMOJI_CHOICES.map((e) => (
                      <button
                        key={e}
                        type="button"
                        className="ui-emojibtn"
                        data-on={s.emoji === e}
                        onClick={() => set({ emoji: e })}
                      >
                        {e}
                      </button>
                    ))}
                  </div>
                  <input
                    className="ui-input"
                    style={{ marginTop: 10, maxWidth: 140 }}
                    value={s.emoji}
                    onChange={(e) => set({ emoji: e.target.value.slice(0, 4) })}
                    placeholder="🎈"
                    aria-label={t.emojiOwn}
                  />
                </Field>
              )}

              {s.symbol === 'monogram' && (
                <p className="ui-hint" style={{ margin: 0 }}>
                  {t.monogramHint} <b>{monogramOf(s.hostNames) || '—'}</b>
                </p>
              )}

              {s.symbol === 'logo' && (
                <Field label={t.logo} hint={t.logoHint}>
                  {s.logoFileId && (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img className="ui-logo" src={`/api/e/${slug}/logo?v=${s.logoFileId}`} alt="" />
                  )}
                  <div className="ui-actions" style={{ marginTop: 10 }}>
                    <label className="ui-btn ui-btn--glass" data-busy={logoBusy}>
                      {logoBusy ? t.logoUploading : s.logoFileId ? t.logoReplace : t.logoPick}
                      <input
                        type="file"
                        accept="image/png,image/jpeg,image/webp"
                        hidden
                        disabled={logoBusy}
                        onChange={(e) => {
                          uploadLogo(e.target.files?.[0]);
                          e.target.value = '';
                        }}
                      />
                    </label>
                    {s.logoFileId && (
                      <button
                        type="button"
                        className="ui-btn ui-btn--plain"
                        onClick={removeLogo}
                        disabled={logoBusy}
                      >
                        {t.logoRemove}
                      </button>
                    )}
                  </div>
                  {logoError && (
                    <p className="ui-hint" style={{ color: 'var(--danger)' }}>
                      {logoError}
                    </p>
                  )}
                </Field>
              )}
            </div>
          </div>

          <div className="ui-group">
            <p className="label">{t.missionsGroup}</p>
            <div className="ui-card" style={{ marginBottom: 0 }}>
              <Text
                label={t.missionsTitle}
                value={s.missionsTitle}
                onChange={(v) => set({ missionsTitle: v })}
                max={80}
              />

              {/* hotove ulohy podla typu akcie, v jazyku administracie */}
              <Field label={t.missionPacks} hint={t.missionPacksHint}>
                <div className="ui-seg">
                  {Object.entries(TEMPLATES).map(([key, tpl]) => (
                    <button key={key} type="button" onClick={() => loadMissions(key)}>
                      {tpl.label[locale] ?? tpl.label.sk}
                    </button>
                  ))}
                </div>
              </Field>

              {s.missions.map((m, i) => (
                <div className="ui-mission" key={i}>
                  <input
                    className="ui-input"
                    value={m}
                    onChange={(e) => editMission(i, e.target.value)}
                    maxLength={160}
                  />
                  <button
                    type="button"
                    className="ui-btn ui-btn--icon"
                    onClick={() => moveMission(i, -1)}
                    aria-label={t.up}
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    className="ui-btn ui-btn--icon"
                    onClick={() => moveMission(i, 1)}
                    aria-label={t.down}
                  >
                    ↓
                  </button>
                  <button
                    type="button"
                    className="ui-btn ui-btn--icon"
                    onClick={() => set({ missions: s.missions.filter((_, k) => k !== i) })}
                    aria-label={t.remove}
                  >
                    ×
                  </button>
                </div>
              ))}

              <button
                type="button"
                className="ui-btn ui-btn--glass"
                onClick={() => set({ missions: [...s.missions, ''] })}
                disabled={s.missions.length >= 30}
              >
                {t.addMission}
              </button>

              <div style={{ marginTop: 18 }}>
                <Text
                  label={t.missionsClosing}
                  value={s.missionsClosing}
                  onChange={(v) => set({ missionsClosing: v })}
                  hint={t.missionsClosingHint}
                  max={120}
                />
              </div>
            </div>
          </div>

          <div className="ui-group">
            <p className="label">{t.optionsGroup}</p>
            <div className="ui-list">
              <SwitchRow
                checked={s.galleryEnabled}
                onChange={(v) => set({ galleryEnabled: v })}
                title={t.gallery}
                desc={t.galleryDesc}
              />
              <SwitchRow
                checked={s.slideshowEnabled}
                onChange={(v) => set({ slideshowEnabled: v })}
                title={t.slideshow}
                desc={t.slideshowDesc}
              />
              <SwitchRow
                checked={s.allowVideo}
                onChange={(v) => set({ allowVideo: v })}
                title={t.video}
                desc={t.videoDesc}
              />
              <SwitchRow
                checked={s.requireName}
                onChange={(v) => set({ requireName: v })}
                title={t.requireName}
                desc={t.requireNameDesc}
              />
            </div>
          </div>

          <div className="ui-group">
            <p className="label">{t.contactGroup}</p>
            <div className="ui-card" style={{ marginBottom: 0 }}>
              <Text
                label={t.contactLabel}
                value={s.contactEmail}
                onChange={(v) => set({ contactEmail: v })}
                placeholder="vas@email.sk"
                hint={t.contactHint}
                max={120}
              />
            </div>
          </div>

          <div className="ui-group">
            <p className="label">{t.dangerGroup}</p>
            <div className="ui-card" style={{ marginBottom: 0 }}>
              <p className="ui-hint" style={{ margin: '0 0 14px' }}>
                {t.dangerNote}
              </p>
              <button
                type="button"
                className="ui-btn ui-btn--danger"
                onClick={remove}
                disabled={busy}
              >
                {t.remove_event}
              </button>
            </div>
          </div>

          {error && <div className="ui-alert">{error}</div>}

          <div className="ui-save">
            <button className="ui-btn" onClick={save} disabled={busy}>
              {busy ? t.saving : t.save}
            </button>
            {saved && <span className="ui-saved">{t.saved}</span>}
          </div>
        </div>
      </div>
    </>
  );
}
