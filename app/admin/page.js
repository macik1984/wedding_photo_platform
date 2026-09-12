import { redirect } from 'next/navigation';
import { currentUser } from '@/lib/session';
import { listEvents } from '@/lib/db';
import { appUrl } from '@/lib/google';
import { resolveLocale } from '@/lib/locale';
import { tx } from '../ui-strings';
import Backdrop from '../components/Backdrop';
import TopBar from '../components/TopBar';
import AdminClient from './AdminClient';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const user = await currentUser();
  if (!user) redirect('/');

  const [events, locale] = await Promise.all([listEvents(user.id), resolveLocale()]);
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
      <main className="ui-page">
        <AdminClient
          events={events.map((e) => ({
            id: e.id,
            slug: e.slug,
            settings: e.settings ?? {},
          }))}
          baseUrl={base}
          locale={locale}
          t={t.admin}
        />
      </main>
    </div>
  );
}
