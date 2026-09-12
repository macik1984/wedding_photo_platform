import { NextResponse } from 'next/server';
import { ensureSchema } from '@/lib/db';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/** Nikdy nevracia hodnoty premennych, len ci existuju a ci drzia tvar. */
function present(name) {
  return Boolean(process.env[name]);
}

export async function GET() {
  const env = {
    APP_URL: present('APP_URL'),
    GOOGLE_CLIENT_ID: present('GOOGLE_CLIENT_ID'),
    GOOGLE_CLIENT_SECRET: present('GOOGLE_CLIENT_SECRET'),
    DATABASE_URL: present('DATABASE_URL'),
    APP_SECRET: present('APP_SECRET'),
  };

  const missing = Object.entries(env)
    .filter(([, ok]) => !ok)
    .map(([k]) => k);

  if (missing.length) {
    return NextResponse.json({ ok: false, step: 'env', missing }, { status: 500 });
  }

  let secretOk = false;
  try {
    secretOk = Buffer.from(process.env.APP_SECRET, 'base64').length === 32;
  } catch {
    secretOk = false;
  }
  if (!secretOk) {
    return NextResponse.json(
      { ok: false, step: 'secret', detail: 'APP_SECRET musi byt 32 bajtov v base64' },
      { status: 500 }
    );
  }

  try {
    await ensureSchema();
  } catch (err) {
    return NextResponse.json(
      { ok: false, step: 'database', detail: String(err.message).slice(0, 300) },
      { status: 500 }
    );
  }

  // Rovnaka normalizacia ako v lib/google.js, inak by diagnostika ukazovala
  // inu adresu, nez aplikacia naozaj posiela Googlu.
  const base = process.env.APP_URL.replace(/\/+$/, '');
  return NextResponse.json({ ok: true, redirectUri: `${base}/api/auth/google/callback` });
}
