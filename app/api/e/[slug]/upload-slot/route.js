import { NextResponse } from 'next/server';
import { loadEvent, eventAccessToken } from '@/lib/event';
import { buildDriveName } from '@/lib/google';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Vytvori na Drive organizatora resumable upload session a vrati prehliadacu
 * adresu, na ktoru posle bajty priamo Googlu. Vercel funkcia tak nikdy nedrzi
 * telo suboru a neplati pre nu limit 4,5 MB.
 */
export async function POST(request, { params }) {
  const { slug } = await params;

  try {
    const ctx = await loadEvent(slug);
    if (!ctx) return NextResponse.json({ error: 'unknown_event' }, { status: 404 });

    const { event, owner, settings } = ctx;
    const { filename, mimeType, guest, size } = await request.json();

    if (settings.requireName && !String(guest ?? '').trim()) {
      return NextResponse.json({ error: 'missing_guest' }, { status: 400 });
    }
    if (!filename) return NextResponse.json({ error: 'missing_filename' }, { status: 400 });

    const contentType = mimeType || 'application/octet-stream';
    if (!settings.allowVideo && contentType.startsWith('video/')) {
      return NextResponse.json({ error: 'video_not_allowed' }, { status: 400 });
    }

    const token = await eventAccessToken(owner);

    const headers = {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json; charset=UTF-8',
      'X-Upload-Content-Type': contentType,
    };
    if (size) headers['X-Upload-Content-Length'] = String(size);

    // Google odvodzuje CORS pravidla session z hlavicky Origin, ktoru dostane
    // pri jej zakladani. Bez nej prehliadac PUT vobec neodosle.
    const origin = request.headers.get('origin');
    if (origin) headers.Origin = origin;

    const res = await fetch(
      'https://www.googleapis.com/upload/drive/v3/files?uploadType=resumable&supportsAllDrives=true',
      {
        method: 'POST',
        headers,
        body: JSON.stringify({
          name: buildDriveName(guest || 'Host', filename),
          parents: [event.drive_folder_id],
          description: guest ? `Nahral: ${guest}` : undefined,
        }),
      }
    );

    if (!res.ok) {
      console.error('drive resumable init failed', res.status, await res.text());
      return NextResponse.json({ error: 'drive_init_failed' }, { status: 502 });
    }

    const uploadUrl = res.headers.get('location');
    if (!uploadUrl) return NextResponse.json({ error: 'no_upload_url' }, { status: 502 });

    return NextResponse.json({ uploadUrl });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'server_error' }, { status: 500 });
  }
}
