const encoder = new TextEncoder();

function b64urlEncode(bytes: Uint8Array): string {
  let bin = '';
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function b64urlJson(obj: unknown): string {
  return b64urlEncode(encoder.encode(JSON.stringify(obj)));
}

function pemToDer(pem: string): Uint8Array {
  const b64 = pem.replace(/-----[^-]+-----/g, '').replace(/\s+/g, '');
  const bin = atob(b64);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

export interface StreamEnv {
  customerCode: string | null;
  accountId: string | null;
  apiToken: string | null;
  keyId: string | null;
  privateKey: string | null;
}

function runtimeStr(locals: App.Locals, key: string): string | null {
  const v = locals.runtime?.env?.[key];
  return typeof v === 'string' && v.length > 0 ? v : null;
}

export function getStreamEnv(locals: App.Locals): StreamEnv {
  return {
    customerCode: runtimeStr(locals, 'STREAM_CUSTOMER_CODE'),
    accountId: runtimeStr(locals, 'CLOUDFLARE_ACCOUNT_ID'),
    apiToken: runtimeStr(locals, 'STREAM_API_TOKEN'),
    keyId: runtimeStr(locals, 'STREAM_SIGNING_KEY_ID'),
    privateKey: runtimeStr(locals, 'STREAM_SIGNING_KEY'),
  };
}

export function isStreamConfigured(env: StreamEnv): boolean {
  return Boolean(env.customerCode);
}

/**
 * Metode 1 (paling sederhana): endpoint /token Cloudflare Stream.
 * Cukup API token + account ID. Token default berlaku 1 jam, kita kirim exp kustom.
 * Cocok untuk < 1.000 token/hari (rate-limited API).
 */
async function tokenViaApi(
  videoUid: string,
  env: StreamEnv,
  expiresInSeconds: number
): Promise<string | null> {
  if (!env.apiToken || !env.accountId) return null;

  try {
    const res = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${env.accountId}/stream/${videoUid}/token`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${env.apiToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ exp: Math.floor(Date.now() / 1000) + expiresInSeconds }),
      }
    );

    if (!res.ok) {
      console.error(`[stream] /token error ${res.status}: ${await res.text()}`);
      return null;
    }

    const data = (await res.json()) as { result?: { token?: string } };
    return data.result?.token ?? null;
  } catch (err) {
    console.error('[stream] /token gagal:', err);
    return null;
  }
}

/**
 * Metode 2 (volume tinggi): buat JWT RS256 sendiri dengan signing key.
 * Tanpa panggilan API per token — tidak kena rate limit.
 * Ref: https://developers.cloudflare.com/stream/viewing-videos/securing-your-stream/
 */
async function tokenViaSigningKey(
  videoUid: string,
  env: StreamEnv,
  expiresInSeconds: number
): Promise<string | null> {
  if (!env.keyId || !env.privateKey) return null;

  try {
    const header = b64urlJson({ alg: 'RS256', typ: 'JWT', kid: env.keyId });
    const payload = b64urlJson({
      sub: videoUid,
      kid: env.keyId,
      exp: Math.floor(Date.now() / 1000) + expiresInSeconds,
    });

    const key = await crypto.subtle.importKey(
      'pkcs8',
      pemToDer(env.privateKey).buffer as ArrayBuffer,
      { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
      false,
      ['sign']
    );

    const signature = await crypto.subtle.sign(
      'RSASSA-PKCS1-v1_5',
      key,
      encoder.encode(`${header}.${payload}`)
    );

    return `${header}.${payload}.${b64urlEncode(new Uint8Array(signature))}`;
  } catch (err) {
    console.error('[stream] signing key gagal:', err);
    return null;
  }
}

/**
 * Buat token tanda tangan untuk satu video Stream.
 * Prioritas: API /token (simple) → signing key (high volume) → null (embed polos).
 */
export async function createStreamToken(
  videoUid: string,
  env: StreamEnv,
  expiresInSeconds = 2 * 60 * 60
): Promise<string | null> {
  return (await tokenViaApi(videoUid, env, expiresInSeconds)) ??
    (await tokenViaSigningKey(videoUid, env, expiresInSeconds));
}

/**
 * URL embed player Stream.
 * Sesuai dokumentasi: bila ada token, token MENGGANTIKAN uid di path
 * (https://customer-<CODE>.cloudflarestream.com/<TOKEN>/iframe).
 */
export function streamEmbedUrl(videoUid: string, customerCode: string, token?: string | null): string {
  const id = token ?? videoUid;
  return `https://customer-${customerCode}.cloudflarestream.com/${id}/iframe`;
}
