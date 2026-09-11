import { cookies } from 'next/headers';
import { sign, verify } from './crypto';
import { getUser } from './db';

const COOKIE = 'pp_session';
const DAYS = 60;

export async function setSession(userId) {
  const jar = await cookies();
  jar.set(COOKIE, sign({ uid: userId, exp: Date.now() + DAYS * 86400_000 }), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: DAYS * 86400,
  });
}

export async function clearSession() {
  const jar = await cookies();
  jar.delete(COOKIE);
}

export async function currentUserId() {
  const jar = await cookies();
  const data = verify(jar.get(COOKIE)?.value);
  if (!data?.uid) return null;
  if (typeof data.exp === 'number' && Date.now() > data.exp) return null;
  return data.uid;
}

/** Vrati prihlaseneho organizatora, alebo null. Nikdy nehadze. */
export async function currentUser() {
  try {
    const id = await currentUserId();
    if (!id) return null;
    return await getUser(id);
  } catch {
    return null;
  }
}
