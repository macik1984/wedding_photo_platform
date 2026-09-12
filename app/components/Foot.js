'use client';

import Link from 'next/link';
import LangLine from './LangLine';
import { t } from '../i18n';
import { displayDate } from '@/lib/settings';

export default function Foot({ lang, onLang, settings, children }) {
  const c = t(lang);
  const date = displayDate(settings, lang);

  return (
    <footer className="foot">
      {children}
      {date && <p className="date">{date}</p>}
      {settings.hostNames && <p className="sig script">{settings.hostNames}</p>}
      <p className="links">
        <Link href="/privacy">{c.privacy}</Link>
        {' · '}
        <Link href="/terms">{c.terms}</Link>
      </p>
      <LangLine lang={lang} onChange={onLang} />
    </footer>
  );
}
