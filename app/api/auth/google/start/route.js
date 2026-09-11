import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { authorizeUrl } from '@/lib/google';
import { randomToken, sign } from '@/lib/crypto';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  const nonce = randomToken(16);
  const jar = await cookies();

  // Stav si podpiseme a zaroven ulozime do cookie. Callback prijme len taky,
  // ktory sedi s oboma - inak by sa dal prihlasovaci odkaz podstrcit.
  jar.set('pp_oauth', nonce, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 600,
  });

  return NextResponse.redirect(authorizeUrl(sign({ n: nonce })));
}
