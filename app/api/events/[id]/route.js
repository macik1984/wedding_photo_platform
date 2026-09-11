import { NextResponse } from 'next/server';
import { currentUser } from '@/lib/session';
import { getEvent, updateEventSettings, deleteEvent } from '@/lib/db';
import { sanitizeSettings } from '@/lib/settings';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function PATCH(request, { params }) {
  const { id } = await params;
  const user = await currentUser();
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const event = await getEvent(id, user.id);
  if (!event) return NextResponse.json({ error: 'not_found' }, { status: 404 });

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'bad_body' }, { status: 400 });
  }

  const settings = sanitizeSettings(body.settings, event.settings);
  const updated = await updateEventSettings(id, user.id, settings);
  return NextResponse.json({ event: updated });
}

export async function DELETE(_request, { params }) {
  const { id } = await params;
  const user = await currentUser();
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const ok = await deleteEvent(id, user.id);
  if (!ok) return NextResponse.json({ error: 'not_found' }, { status: 404 });
  return NextResponse.json({ ok: true });
}
