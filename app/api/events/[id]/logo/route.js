import { NextResponse } from 'next/server';
import { currentUser } from '@/lib/session';
import { getEvent, updateEventSettings } from '@/lib/db';
import { accessTokenFor, ensureAssetFolder, uploadSmallFile, trashFile } from '@/lib/google';
import { withDefaults } from '@/lib/settings';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const MAX_BYTES = 2 * 1024 * 1024;

// Ziadne SVG: to je dokument, nie obrazok, a servirujeme ho hostom.
const TYPES = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/webp': 'webp',
};

/**
 * Logo akcie. Neuklada sa medzi fotky od hosti, ale do podpriecinka
 * "Paparazzi - vzhlad" v tom istom priecinku akcie, aby sa nemiesalo
 * do galerie ani do premietania.
 */
export async function POST(request, { params }) {
  const { id } = await params;
  const user = await currentUser();
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const event = await getEvent(id, user.id);
  if (!event) return NextResponse.json({ error: 'not_found' }, { status: 404 });

  const mime = (request.headers.get('content-type') ?? '').split(';')[0].trim();
  const ext = TYPES[mime];
  if (!ext) return NextResponse.json({ error: 'bad_type' }, { status: 415 });

  const buf = Buffer.from(await request.arrayBuffer());
  if (!buf.length) return NextResponse.json({ error: 'empty' }, { status: 400 });
  if (buf.length > MAX_BYTES) return NextResponse.json({ error: 'too_big' }, { status: 413 });

  try {
    const token = await accessTokenFor(user.refresh_token);
    const folderId = await ensureAssetFolder(token, event.drive_folder_id);
    const file = await uploadSmallFile(token, {
      name: `logo-${Date.now()}.${ext}`,
      mimeType: mime,
      parentId: folderId,
      bytes: buf,
    });

    const settings = withDefaults(event.settings);
    if (settings.logoFileId && settings.logoFileId !== file.id) {
      await trashFile(token, settings.logoFileId);
    }

    const updated = await updateEventSettings(id, user.id, {
      ...settings,
      logoFileId: file.id,
      symbol: 'logo',
    });

    return NextResponse.json({ event: updated, logoFileId: file.id });
  } catch (err) {
    console.error('logo upload failed', err);
    return NextResponse.json({ error: 'upload_failed' }, { status: 502 });
  }
}

export async function DELETE(_request, { params }) {
  const { id } = await params;
  const user = await currentUser();
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const event = await getEvent(id, user.id);
  if (!event) return NextResponse.json({ error: 'not_found' }, { status: 404 });

  const settings = withDefaults(event.settings);
  if (settings.logoFileId) {
    try {
      const token = await accessTokenFor(user.refresh_token);
      await trashFile(token, settings.logoFileId);
    } catch (err) {
      console.error('logo delete failed', err);
    }
  }

  const updated = await updateEventSettings(id, user.id, {
    ...settings,
    logoFileId: '',
    symbol: settings.symbol === 'logo' ? 'none' : settings.symbol,
  });

  return NextResponse.json({ event: updated });
}
