'use client';

import { useEffect, useState } from 'react';
import { detectLang } from './i18n';

const KEY = 'pp_lang';

export default function useLang() {
  const [lang, setLang] = useState('sk');

  useEffect(() => {
    let saved = null;
    try {
      saved = window.localStorage.getItem(KEY);
    } catch {
      /* prehliadac moze mat uloziska vypnute */
    }
    setLang(saved === 'sk' || saved === 'en' ? saved : detectLang());
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const change = (next) => {
    setLang(next);
    try {
      window.localStorage.setItem(KEY, next);
    } catch {
      /* ignorujeme */
    }
  };

  return [lang, change];
}
