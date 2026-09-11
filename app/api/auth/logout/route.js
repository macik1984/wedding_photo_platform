import { NextResponse } from 'next/server';
import { clearSession } from '@/lib/session';
import { appUrl } from '@/lib/google';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST() {
  await clearSession();
  return NextResponse.redirect(`${appUrl()}/`, { status: 303 });
}

export async function GET() {
  await clearSession();
  return NextResponse.redirect(`${appUrl()}/`, { status: 303 });
}
