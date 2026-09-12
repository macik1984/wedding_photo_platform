import { loadEvent, eventAccessToken } from '@/lib/event';

export const runtime = 'nodejs';

/**
 * Logo akcie pre hosti. Id suboru sa berie z nastaveni akcie, nie z adresy,
 * takze cez tento endpoint sa nedá vytiahnut nic ine z Drive organizatora.
 */
export async function GET(_request, { params }) {
  const { slug } = await params;

  try {
    const ctx = await loadEvent(slug);
    if (!ctx) return new Response('not found', { status: 404 });

    const fileId = ctx.settings.logoFileId;
    if (!fileId || !/^[A-Za-z0-9_-]{10,}$/.test(fileId)) {
      return new Response('not found', { status: 404 });
    }

    const token = await eventAccessToken(ctx.owner);
    const res = await fetch(
      `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media&supportsAllDrives=true`,
      { headers: { Authorization: `Bearer ${token}` }, cache: 'no-store' }
    );
    if (!res.ok) return new Response('not found', { status: 404 });

    return new Response(res.body, {
      headers: {
        'Content-Type': res.headers.get('content-type') ?? 'image/png',
        // Logo sa meni zriedka, ale nie nikdy - hodina je rozumny kompromis.
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      },
    });
  } catch (err) {
    console.error('logo fetch failed', err);
    return new Response('error', { status: 500 });
  }
}
