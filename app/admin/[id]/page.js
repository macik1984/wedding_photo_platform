import { redirect, notFound } from 'next/navigation';
import { currentUser } from '@/lib/session';
import { getEvent } from '@/lib/db';
import { appUrl } from '@/lib/google';
import { resolveLocale } from '@/lib/locale';
import { withDefaults } from '@/lib/settings';
import { tx } from '../../ui-strings';
import Backdrop from '../../components/Backdrop';
import TopBar from '../../components/TopBar';
import EditorClient from './EditorClient';

export const dynamic = 'force-dynamic';

export default async function EditorPage({ params }) {
  const { id } = await params;
  const user = await currentUser();
  if (!user) redirect('/');

  const [event, locale] = await Promise.all([getEvent(id, user.id), resolveLocale()]);
  if (!event) notFound();

  const t = tx(locale);

  let base = '';
  try {
    base = appUrl();
  } catch {
    base = '';
  }

  return (
    <div className="ui">
      <Backdrop />
      <TopBar user={user} t={t} />
      <main className="ui-page ui-page--editor">
        <EditorClient
          eventId={event.id}
          slug={event.slug}
          baseUrl={base}
          locale={locale}
          t={t.editor}
          initial={withDefaults(event.settings, locale)}
        />
      </main>
    </div>
  );
}
