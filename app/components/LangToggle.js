'use client';

import { useRouter } from 'next/navigation';

/**
 * Rucna volba jazyka. Ulozi sa do cookie, aby ju server poznal uz pri
 * vykreslovani dalsej stranky a text nepreblikol.
 */
export default function LangToggle({ locale, other, otherLabel }) {
  const router = useRouter();

  function switchTo() {
    try {
      document.cookie = `pp_ui_lang=${other};path=/;max-age=${60 * 60 * 24 * 365};samesite=lax`;
    } catch {
      /* niektore prehliadace maju cookies zakazane */
    }
    router.refresh();
  }

  return (
    <button
      type="button"
      className="ui-lang"
      onClick={switchTo}
      lang={other}
      aria-label={otherLabel}
      title={otherLabel}
    >
      {other.toUpperCase()}
    </button>
  );
}
