import { themeStyle, fontHref, isDark } from '@/lib/settings';

/**
 * Prepise CSS premenne na koreni dokumentu podla nastaveni akcie a dotiahne
 * len tie pisma, ktore si organizator zvolil. Jeden stylesheet tak obsluzi
 * vsetky temy a nenacitava sa nic navyse.
 */
export default function EventTheme({ settings }) {
  const vars = themeStyle(settings);
  const decls = Object.entries(vars)
    .map(([k, v]) => `${k}:${v}`)
    .join(';');
  const scheme = isDark(settings) ? 'dark' : 'light';

  return (
    <>
      <link rel="stylesheet" href={fontHref(settings)} />
      <style
        dangerouslySetInnerHTML={{
          __html: `:root{${decls};color-scheme:${scheme}}`,
        }}
      />
    </>
  );
}
