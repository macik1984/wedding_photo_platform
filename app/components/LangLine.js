'use client';

import { LANGS, ui } from '../i18n';

/** Diskretny prepinac pre pripad, ze prehliadac hosta trafi vedla. */
export default function LangLine({ lang, onChange }) {
  return (
    <div className="langline">
      {LANGS.map((l) => (
        <button
          key={l}
          type="button"
          data-active={l === lang}
          aria-pressed={l === lang}
          onClick={() => onChange(l)}
        >
          {ui[l].label}
        </button>
      ))}
    </div>
  );
}
