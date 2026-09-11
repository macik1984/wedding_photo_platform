import { NextResponse } from 'next/server';
import crypto from 'node:crypto';
import { currentUser } from '@/lib/session';
import { createEvent, listEvents, slugTaken } from '@/lib/db';
import { accessTokenFor, createFolder } from '@/lib/google';
import { defaultSettings } from '@/lib/settings';
import { toSlug, slugProblem } from '@/lib/slug';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  const user = await currentUser();
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  const events = await listEvents(user.id);
  return NextResponse.json({ events });
}

export async function POST(request) {
  const user = await currentUser();
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'bad_body' }, { status: 400 });
  }

  const hostNames = String(body.hostNames ?? '').trim().slice(0, 80);
  const lang = body.lang === 'en' ? 'en' : 'sk';
  const slug = toSlug(body.slug || hostNames);

  const problem = slugProblem(slug);
  if (problem) return NextResponse.json({ error: problem }, { status: 400 });
  if (await slugTaken(slug)) return NextResponse.json({ error: 'taken' }, { status: 409 });

  try {
    // Priecinok vznika pod uctom organizatora a vytvara ho aplikacia,
    // inak by ho pri rozsahu drive.file uz nikdy neuvidela.
    const token = await accessTokenFor(user.refresh_token);
    const folder = await createFolder(token, hostNames ? `Fotky - ${hostNames}` : `Fotky - ${slug}`);

    const settings = defaultSettings(lang, hostNames);
    const event = await createEvent({
      id: crypto.randomUUID(),
      userId: user.id,
      slug,
      driveFolderId: folder.id,
      settings,
    });

    return NextResponse.json({ event, folder: { id: folder.id, name: folder.name } });
  } catch (err) {
    console.error('create event failed', err);
    const msg = String(err.message ?? '');
    if (msg.includes('google refresh')) {
      return NextResponse.json({ error: 'google_reauth' }, { status: 401 });
    }
    return NextResponse.json({ error: 'drive_failed' }, { status: 502 });
  }
}
