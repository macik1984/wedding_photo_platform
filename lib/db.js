import { neon } from '@neondatabase/serverless';

let _sql = null;
let _schema = null;

export function sql(...args) {
  if (!_sql) {
    if (!process.env.DATABASE_URL) {
      throw new Error('Chyba konfiguracie: DATABASE_URL nie je nastavena');
    }
    _sql = neon(process.env.DATABASE_URL);
  }
  return _sql(...args);
}

/**
 * Schema sa zaklada sama pri prvom dotaze. Pri tejto velkosti projektu je to
 * spolahlivejsie ako samostatny migracny krok, na ktory sa da zabudnut.
 * Beh je idempotentny a v ramci procesu sa spusti raz.
 */
export function ensureSchema() {
  if (!_schema) {
    _schema = (async () => {
      await sql`
        CREATE TABLE IF NOT EXISTS users (
          id            TEXT PRIMARY KEY,
          google_sub    TEXT UNIQUE NOT NULL,
          email         TEXT NOT NULL,
          name          TEXT,
          refresh_token TEXT NOT NULL,
          created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
          updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
        )`;
      await sql`
        CREATE TABLE IF NOT EXISTS events (
          id              TEXT PRIMARY KEY,
          user_id         TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          slug            TEXT UNIQUE NOT NULL,
          drive_folder_id TEXT NOT NULL,
          settings        JSONB NOT NULL DEFAULT '{}'::jsonb,
          created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
          updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
        )`;
      await sql`CREATE INDEX IF NOT EXISTS events_user_idx ON events (user_id)`;
    })().catch((err) => {
      _schema = null; // aby sa dalsi request pokusil znova
      throw err;
    });
  }
  return _schema;
}

export async function findUserByGoogleSub(sub) {
  await ensureSchema();
  const rows = await sql`SELECT * FROM users WHERE google_sub = ${sub} LIMIT 1`;
  return rows[0] ?? null;
}

export async function getUser(id) {
  await ensureSchema();
  const rows = await sql`SELECT * FROM users WHERE id = ${id} LIMIT 1`;
  return rows[0] ?? null;
}

export async function upsertUser({ id, googleSub, email, name, refreshToken }) {
  await ensureSchema();
  // Google posle refresh token len pri prvom suhlase, preto ho pri opakovanom
  // prihlaseni bez noveho tokenu necháme tak, ako je.
  const rows = await sql`
    INSERT INTO users (id, google_sub, email, name, refresh_token)
    VALUES (${id}, ${googleSub}, ${email}, ${name}, ${refreshToken ?? ''})
    ON CONFLICT (google_sub) DO UPDATE SET
      email = EXCLUDED.email,
      name = EXCLUDED.name,
      refresh_token = CASE
        WHEN EXCLUDED.refresh_token = '' THEN users.refresh_token
        ELSE EXCLUDED.refresh_token END,
      updated_at = now()
    RETURNING *`;
  return rows[0];
}

export async function listEvents(userId) {
  await ensureSchema();
  return sql`SELECT * FROM events WHERE user_id = ${userId} ORDER BY created_at DESC`;
}

export async function getEventBySlug(slug) {
  await ensureSchema();
  const rows = await sql`SELECT * FROM events WHERE slug = ${slug} LIMIT 1`;
  return rows[0] ?? null;
}

export async function getEvent(id, userId) {
  await ensureSchema();
  const rows = await sql`
    SELECT * FROM events WHERE id = ${id} AND user_id = ${userId} LIMIT 1`;
  return rows[0] ?? null;
}

export async function slugTaken(slug) {
  await ensureSchema();
  const rows = await sql`SELECT 1 FROM events WHERE slug = ${slug} LIMIT 1`;
  return rows.length > 0;
}

export async function createEvent({ id, userId, slug, driveFolderId, settings }) {
  await ensureSchema();
  const rows = await sql`
    INSERT INTO events (id, user_id, slug, drive_folder_id, settings)
    VALUES (${id}, ${userId}, ${slug}, ${driveFolderId}, ${JSON.stringify(settings)}::jsonb)
    RETURNING *`;
  return rows[0];
}

export async function updateEventSettings(id, userId, settings) {
  await ensureSchema();
  const rows = await sql`
    UPDATE events
    SET settings = ${JSON.stringify(settings)}::jsonb, updated_at = now()
    WHERE id = ${id} AND user_id = ${userId}
    RETURNING *`;
  return rows[0] ?? null;
}

export async function deleteEvent(id, userId) {
  await ensureSchema();
  // Priecinok na Drive zamerne nechavame - fotky su majetkom organizatora
  // a nechceme, aby ich zmazalo omylom kliknutie v administracii.
  const rows = await sql`
    DELETE FROM events WHERE id = ${id} AND user_id = ${userId} RETURNING id`;
  return rows.length > 0;
}
