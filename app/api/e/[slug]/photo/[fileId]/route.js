import { loadEvent, eventAccessToken } from '@/lib/event';

export const runtime = 'nodejs';

/**
 * Subory na Drive su sukromne, takze ich nemozeme dat priamo do <img>.
 * Tento endpoint ich pretoci cez server. Hlavicku Range preposielame,
 * aby sa dalo vo videu previjat.
 */
export async function GET(request, { params }) {
  const { slug, fileId } = await params;
  const variant = request.nextUrl.searchParams.get('v') ?? 'thumb';

  if (!/^[A-Za-z0-9_-]{10,}$/.test(fileId)) {
    return new Response('bad id', { status: 400 });
  }

  try {
    const ctx = await loadEvent(slug);
    if (!ctx) return new Response('not found', { status: 404 });

    const token = await eventAccessToken(ctx.owner);

    if (variant === 'thumb') {
      const metaRes = await fetch(
        `https://www.googleapis.com/drive/v3/files/${fileId}?fields=thumbnailLink,parents&supportsAllDrives=true`,
        { headers: { Authorization: `Bearer ${token}` }, cache: 'no-store' }
      );
      if (metaRes.ok) {
        const meta = await metaRes.json();
        // Subor musi lezat v priecinku tejto akcie, inak by sa cez cudzie id
        // dalo citat z inej akcie toho isteho organizatora.
        if (!(meta.parents ?? []).includes(ctx.event.drive_folder_id)) {
          return new Response('not found', { status: 404 });
        }
        if (meta.thumbnailLink) {
          const big = meta.thumbnailLink.replace(/=s\d+$/, '=s800');
          const thumbRes = await fetch(big);
          if (thumbRes.ok) {
            return new Response(thumbRes.body, {
              headers: {
                'Content-Type': thumbRes.headers.get('content-type') ?? 'image/jpeg',
                'Cache-Control': 'public, max-age=86400, s-maxage=86400, immutable',
              },
            });
          }
        }
      }
    }

    const check = await fetch(
      `https://www.googleapis.com/drive/v3/files/${fileId}?fields=parents&supportsAllDrives=true`,
      { headers: { Authorization: `Bearer ${token}` }, cache: 'no-store' }
    );
    if (!check.ok) return new Response('not found', { status: 404 });
    const meta = await check.json();
    if (!(meta.parents ?? []).includes(ctx.event.drive_folder_id)) {
      return new Response('not found', { status: 404 });
    }

    const range = request.headers.get('range');
    const upstream = { Authorization: `Bearer ${token}` };
    if (range) upstream.Range = range;

    const fileRes = await fetch(
      `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media&supportsAllDrives=true`,
      { headers: upstream, cache: 'no-store' }
    );

    if (!fileRes.ok && fileRes.status !== 206) {
      return new Response('not found', { status: 404 });
    }

    const out = {
      'Content-Type': fileRes.headers.get('content-type') ?? 'application/octet-stream',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400, immutable',
      'Accept-Ranges': 'bytes',
    };
    const cr = fileRes.headers.get('content-range');
    const cl = fileRes.headers.get('content-length');
    if (cr) out['Content-Range'] = cr;
    if (cl) out['Content-Length'] = cl;

    return new Response(fileRes.body, { status: fileRes.status, headers: out });
  } catch (err) {
    console.error(err);
    return new Response('error', { status: 500 });
  }
}
