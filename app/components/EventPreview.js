'use client';

import { useState } from 'react';
import { themeStyle, fontHref } from '@/lib/settings';
import PhoneMock from './PhoneMock';

/**
 * Zive okno do toho, co uvidi host. Kresli sa z rozpracovanych nastaveni,
 * takze zmenu farby ci textu vidno okamzite a netreba nic ukladat.
 *
 * Stranka akcie ma zamerne iny vzhlad ako administracia: administracia je
 * nastroj, stranka akcie je pozvanka. Bez tohto nahladu to pri prvom
 * zakladani prekvapi.
 */
export default function EventPreview({ settings, t }) {
  const [variant, setVariant] = useState('upload');
  // Na uzkom displeji by nahlad zatlacil formular pod okraj, takze je zlozeny;
  // na sirokom ho CSS drzi otvoreny a tlacidlo nema co prepinat.
  const [open, setOpen] = useState(false);

  const theme = themeStyle(settings);
  const vars = {
    '--pp-paper': theme['--paper'],
    '--pp-card': theme['--card'],
    '--pp-ink': theme['--ink'],
    '--pp-ink-soft': theme['--ink-soft'],
    '--pp-line': theme['--line'],
    '--pp-accent': theme['--accent'],
    '--pp-script': theme['--font-script'],
    '--pp-body': theme['--font-body'],
  };

  const phone = {
    eyebrow: settings.eyebrow,
    names: settings.hostNames,
    kicker: settings.headline,
    sub: settings.lead,
    nameLabel: t.previewName,
    pick: t.previewPick,
    send: t.previewSend,
    missionsTitle: settings.missionsTitle,
  };

  const missions = (settings.missions ?? []).filter(Boolean);
  const hasMissions = missions.length > 0;

  return (
    <aside className="ui-preview">
      {/* pismo zvolenej temy; React ho vytiahne do hlavicky dokumentu */}
      <link rel="stylesheet" href={fontHref(settings)} />

      <button
        type="button"
        className="toggle"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <span className="label">{t.previewLabel}</span>
        <span className="chev" aria-hidden="true">
          {open ? '▴' : '▾'}
        </span>
      </button>

      <div className="body" hidden={!open}>
        {hasMissions && (
          <div className="ui-seg">
            <button
              type="button"
              data-on={variant === 'upload'}
              onClick={() => setVariant('upload')}
            >
              {t.previewTabUpload}
            </button>
            <button
              type="button"
              data-on={variant === 'missions'}
              onClick={() => setVariant('missions')}
            >
              {t.previewTabMissions}
            </button>
          </div>
        )}

        <div className="stage">
          <PhoneMock
            t={phone}
            vars={vars}
            missions={missions}
            variant={hasMissions ? variant : 'upload'}
          />
        </div>

        <p className="ui-hint">{t.previewNote}</p>
      </div>
    </aside>
  );
}
