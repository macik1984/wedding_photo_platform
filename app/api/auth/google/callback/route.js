import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import crypto from 'node:crypto';
import { exchangeCode, readIdToken, appUrl } from '@/lib/google';
import { encrypt, verify } from '@/lib/crypto';
import { upsertUser } from '@/lib/db';
import { setSession } from '@/lib/session';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function fail(reason) {
  return NextResponse.redirect(`${appUrl()}/?error=${encodeURIComponent(reason)}`);
}

export async function GET(request) {
  const params = request.nextUrl.searchParams;

  if (params.get('error')) return fail('prístup zamietnutý');

  const code = params.get('code');
  const state = verify(params.get('state'));
  const jar = await cookies();
  const nonce = jar.get('pp_oauth')?.value;
  jar.delete('pp_oauth');

  if (!code || !state?.n || !nonce || state.n !== nonce) return fail('neplatné prihlásenie');

  try {
    const tokens = await exchangeCode(code);
    const profile = readIdToken(tokens.id_token);

    if (!tokens.refresh_token) {
      // Bez refresh tokenu by aplikacia po hodine stratila pristup k Drive.
      return fail('Google nevrátil refresh token, skúste to znova');
    }

    const user = await upsertUser({
      id: crypto.randomUUID(),
      googleSub: profile.sub,
      email: profile.email ?? '',
      name: profile.name ?? '',
      refreshToken: encrypt(tokens.refresh_token),
    });

    await setSession(user.id);
    return NextResponse.redirect(`${appUrl()}/admin`);
  } catch (err) {
    console.error('oauth callback failed', err);
    return fail('prihlásenie zlyhalo');
  }
}
