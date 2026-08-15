const encoder = new TextEncoder();

function buf2hex(buffer: ArrayBuffer): string {
  return [...new Uint8Array(buffer)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

async function hmac(secret: string, message: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(message));
  return buf2hex(signature);
}

export const ADMIN_COOKIE = 'admin_session';
export const PARTICIPANT_COOKIE = 'participant_session';

export async function createAdminToken(secret: string, hours = 8): Promise<string> {
  const expiresAt = Date.now() + hours * 60 * 60 * 1000;
  const signature = await hmac(secret, `admin:${expiresAt}`);
  return `${expiresAt}.${signature}`;
}

export async function verifyAdminToken(token: string | undefined, secret: string): Promise<boolean> {
  if (!token) return false;
  const [expiresAtStr, signature] = token.split('.');
  if (!expiresAtStr || !signature) return false;
  const expiresAt = Number(expiresAtStr);
  if (!Number.isFinite(expiresAt) || expiresAt < Date.now()) return false;
  return (await hmac(secret, `admin:${expiresAt}`)) === signature;
}

export async function createParticipantToken(id: number, secret: string, days = 30): Promise<string> {
  const expiresAt = Date.now() + days * 24 * 60 * 60 * 1000;
  const payload = `participant:${id}:${expiresAt}`;
  return `${payload}.${await hmac(secret, payload)}`;
}

export async function verifyParticipantToken(
  token: string | undefined,
  secret: string
): Promise<number | null> {
  if (!token) return null;
  const [payload, signature] = token.split('.');
  if (!payload || !signature) return null;
  const [prefix, idStr, expiresAtStr] = payload.split(':');
  if (prefix !== 'participant') return null;
  const id = Number(idStr);
  const expiresAt = Number(expiresAtStr);
  if (!Number.isInteger(id) || id <= 0 || !Number.isFinite(expiresAt) || expiresAt < Date.now()) {
    return null;
  }
  const expected = await hmac(secret, payload);
  return expected === signature ? id : null;
}

export function getSecret(
  locals: App.Locals,
  key: 'ADMIN_PASSWORD' | 'SESSION_SECRET',
  fallbackDev: string
): string {
  const fromRuntime = locals.runtime?.env?.[key];
  if (fromRuntime && typeof fromRuntime === 'string') return fromRuntime;
  const fromEnv = import.meta.env[key];
  if (typeof fromEnv === 'string' && fromEnv.length > 0) return fromEnv;
  console.warn(`[dev] ${key} tidak diset — memakai fallback development. Jangan dipakai di produksi!`);
  return fallbackDev;
}
