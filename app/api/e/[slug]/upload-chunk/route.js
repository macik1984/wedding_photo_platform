import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const ALLOWED_PREFIX = 'https://www.googleapis.com/upload/drive/v3/files';

/**
 * Zalozna cesta k Drive, ked prehliadac nedokaze poslat bajty priamo
 * (CORS, prisna siet). Dva rezimy podla hlavicky x-content-range:
 *   "bytes STAR/CELKOM"  - kontrola, kolko uz Google prijal (telo prazdne)
 *   "bytes OD-DO/CELKOM" - poslanie jedneho kusu
 *
 * Kontrola je dolezita: ked priamy PUT prejde, ale prehliadac zahodi odpoved
 * kvoli CORS, subor uz v Drive je a bez nej by sa nahral druhy raz.
 */
export async function POST(request) {
  const target = request.nextUrl.searchParams.get('url');
  const range = request.headers.get('x-content-range');

  if (!target || !target.startsWith(ALLOWED_PREFIX)) {
    return NextResponse.json({ error: 'bad_target' }, { status: 400 });
  }
  if (!range) return NextResponse.json({ error: 'missing_range' }, { status: 400 });

  const isProbe = /^bytes \*\//.test(range);

  try {
    const init = { method: 'PUT', headers: { 'Content-Range': range } };

    if (isProbe) {
      init.headers['Content-Length'] = '0';
    } else {
      const body = await request.arrayBuffer();
      init.headers['Content-Length'] = String(body.byteLength);
      init.body = body;
    }

    const res = await fetch(target, init);

    if (res.ok) return NextResponse.json({ done: true });

    if (res.status === 308) {
      const header = res.headers.get('range'); // napr. "bytes=0-262143"
      const m = header && header.match(/bytes=0-(\d+)/);
      return NextResponse.json({ done: false, received: m ? Number(m[1]) + 1 : 0 });
    }

    if (res.status === 404 || res.status === 410) {
      return NextResponse.json({ error: 'session_gone' }, { status: 410 });
    }

    console.error('chunk upload failed', res.status, await res.text());
    return NextResponse.json({ error: 'drive_chunk_failed' }, { status: 502 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'server_error' }, { status: 500 });
  }
}
