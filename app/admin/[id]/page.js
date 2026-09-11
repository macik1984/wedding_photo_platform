import { redirect, notFound } from 'next/navigation';
import { currentUser } from '@/lib/session';
import { getEvent } from '@/lib/db';
import { appUrl } from '@/lib/google';
import { defaultSettings } from '@/lib/settings';
import TopBar from '../../components/TopBar';
import EditorClient from './EditorClient';

export const dynamic = 'force-dynamic';

export default async function EditorPage({ params }) {
  const { id } = await params;
  const user = await currentUser();
  if (!user) redirect('/');

  const event = await getEvent(id, user.id);
  if (!event) notFound();

  let base = '';
  try {
    base = appUrl();
  } catch {
    base = '';
  }

  return (
    <>
      <TopBar user={user} />
      <main className="wrap wrap--narrow">
        <EditorClient
          eventId={event.id}
          slug={event.slug}
          baseUrl={base}
          initial={{ ...defaultSettings(), ...(event.settings ?? {}) }}
        />
      </main>
    </>
  );
}
