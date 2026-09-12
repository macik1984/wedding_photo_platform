import { monogramOf } from '@/lib/settings';
import { BotanicalTopRight, BotanicalBottomLeft } from './Botanicals';

/**
 * Ozdoby v rohoch stranky. Su sucastou vzhladu, nie hlavicky, preto maju
 * vlastnu zlozku - na svadbu sedia, na firemnu akciu nie.
 */
export function SymbolCorners({ settings, single = false }) {
  if (settings.symbol !== 'ornaments') return null;
  return (
    <>
      <BotanicalTopRight />
      {!single && <BotanicalBottomLeft />}
    </>
  );
}

/**
 * Znak nad menami: emoji, monogram z mien alebo nahrate logo. Logo si stiahne
 * aplikacia z Drive organizatora, priecinok zostava sukromny.
 */
export default function EventSymbol({ settings, slug }) {
  if (settings.symbol === 'emoji' && settings.emoji) {
    return (
      <p className="symbol symbol--emoji" aria-hidden="true">
        {settings.emoji}
      </p>
    );
  }

  if (settings.symbol === 'monogram') {
    const mono = monogramOf(settings.hostNames);
    if (!mono) return null;
    return (
      <p className="symbol symbol--mono script" aria-hidden="true">
        {mono}
      </p>
    );
  }

  if (settings.symbol === 'logo' && settings.logoFileId && slug) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img className="symbol symbol--logo" src={`/api/e/${slug}/logo`} alt="" />;
  }

  return null;
}
