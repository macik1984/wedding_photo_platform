import { notFound } from 'next/navigation';
import { loadEvent } from '@/lib/event';
import EventTheme from '../components/EventTheme';
import UploadClient from './UploadClient';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const ctx = await loadEvent(slug).catch(() => null);
  if (!ctx) return { title: 'Nenájdené' };
  const s = ctx.settings;
  return {
    title: [s.hostNames, s.headline].filter(Boolean).join(' · ') || 'Foto misia',
    description: s.lead,
    robots: { index: false, follow: false },
  };
}

export default async function EventPage({ params }) {
  const { slug } = await params;
  const ctx = await loadEvent(slug).catch(() => null);
  if (!ctx) notFound();

  return (
    <>
      <EventTheme settings={ctx.settings} />
      <UploadClient slug={ctx.event.slug} settings={ctx.settings} />
    </>
  );
}
