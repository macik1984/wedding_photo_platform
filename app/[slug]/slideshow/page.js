import { notFound } from 'next/navigation';
import { loadEvent } from '@/lib/event';
import EventTheme from '../../components/EventTheme';
import SlideshowClient from './SlideshowClient';

export const dynamic = 'force-dynamic';

export const metadata = { robots: { index: false, follow: false } };

export default async function SlideshowPage({ params }) {
  const { slug } = await params;
  const ctx = await loadEvent(slug).catch(() => null);
  if (!ctx || !ctx.settings.slideshowEnabled) notFound();

  return (
    <>
      <EventTheme settings={ctx.settings} />
      <SlideshowClient slug={ctx.event.slug} settings={ctx.settings} />
    </>
  );
}
