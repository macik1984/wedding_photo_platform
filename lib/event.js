import { getEventBySlug, getUser } from './db';
import { accessTokenFor } from './google';
import { withDefaults } from './settings';

/**
 * Nacita akciu aj jej organizatora. Nahravanie bezi pod jeho pristupom,
 * host sa nikam neprihlasuje a o nicom nerozhoduje.
 */
export async function loadEvent(slug) {
  const event = await getEventBySlug(String(slug ?? '').toLowerCase());
  if (!event) return null;

  const owner = await getUser(event.user_id);
  if (!owner) return null;

  return {
    event,
    owner,
    settings: withDefaults(event.settings),
  };
}

export async function eventAccessToken(owner) {
  return accessTokenFor(owner.refresh_token);
}
