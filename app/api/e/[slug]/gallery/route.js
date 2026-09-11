import { NextResponse } from 'next/server';
import { loadEvent, eventAccessToken } from '@/lib/event';
import { guestFromDriveName } from '@/lib/google';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const PAGE_SIZE = 48;

export async function GET(request, { params }) {
  const { slug } = await params;

  try {
    const ctx = await loadEvent(slug);
    if (!ctx) return NextResponse.json({ error: 'unknown_event' }, { status: 404 });

    const { event, owner, settings } = ctx;
    if (!settings.galleryEnabled && !settings.slideshowEnabled) {
      return NextResponse.json({ error: 'gallery_off' }, { status: 403 });
    }

    const token = await eventAccessToken(owner);
    const pageToken = request.nextUrl.searchParams.get('pageToken');

    const query = new URLSearchParams({
      q:
        `'${event.drive_folder_id}' in parents and trashed = false and ` +
        `(mimeType contains 'image/' or mimeType contains 'video/')`,
      orderBy: 'createdTime desc',
      pageSize: String(PAGE_SIZE),
      fields: 'nextPageToken, files(id, name, createdTime, mimeType)',
      supportsAllDrives: 'true',
      includeItemsFromAllDrives: 'true',
    });
    if (pageToken) query.set('pageToken', pageToken);

    const res = await fetch(`https://www.googleapis.com/drive/v3/files?${query}`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
    });

    if (!res.ok) {
      console.error('drive list failed', res.status, await res.text());
      return NextResponse.json({ error: 'drive_list_failed' }, { status: 502 });
    }

    const data = await res.json();
    const files = (data.files ?? []).map((f) => ({
      id: f.id,
      guest: guestFromDriveName(f.name),
      createdTime: f.createdTime,
      video: String(f.mimeType ?? '').startsWith('video/'),
      thumb: `/api/e/${slug}/photo/${f.id}?v=thumb`,
      full: `/api/e/${slug}/photo/${f.id}?v=full`,
    }));

    return NextResponse.json({ files, nextPageToken: data.nextPageToken ?? null });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'server_error' }, { status: 500 });
  }
}
