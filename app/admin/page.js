import { redirect } from 'next/navigation';
import { currentUser } from '@/lib/session';
import { listEvents } from '@/lib/db';
import { appUrl } from '@/lib/google';
import TopBar from '../components/TopBar';
import AdminClient from './AdminClient';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const user = await currentUser();
  if (!user) redirect('/');

  const events = await listEvents(user.id);
  let base = '';
  try {
    base = appUrl();
  } catch {
    base = '';
  }

  return (
    <>
      <TopBar user={user} />
      <main className="wrap">
        <AdminClient
          events={events.map((e) => ({
            id: e.id,
            slug: e.slug,
            settings: e.settings ?? {},
          }))}
          baseUrl={base}
        />
      </main>
    </>
  );
}
