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
    keyId: runtimeStr(locals, 'STREAM_SIGNING_KEY_ID'),
    privateKey: runtimeStr(locals, 'STREAM_SIGNING_KEY'),
  };
}

export function isStreamConfigured(env: StreamEnv): boolean {
  return Boolean(env.customerCode && env.keyId && env.privateKey);
}

/**
 * Buat token tanda tangan (JWT RS256) untuk satu video Cloudflare Stream.
 * Dokumentasi algoritma: https://developers.cloudflare.com/stream/viewing-videos/securing-your-stream/
 */
export async function createStreamSignedToken(
  videoUid: string,
  env: StreamEnv,
  expiresInSeconds = 2 * 60 * 60
): Promise<string | null> {
  if (!isStreamConfigured(env)) return null;

  const header = b64urlJson({ alg: 'RS256', typ: 'JWT' });
  const payload = b64urlJson({
    sub: `/video/${videoUid}`,
    exp: Math.floor(Date.now() / 1000) + expiresInSeconds,
    kid: env.keyId,
  });

  const key = await crypto.subtle.importKey(
    'pkcs8',
    pemToDer(env.privateKey!) as unknown as ArrayBuffer,
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
}

export function streamEmbedUrl(videoUid: string, customerCode: string, token?: string | null): string {
  const base = `https://customer-${customerCode}.cloudflarestream.com/${videoUid}/iframe`;
  return token ? `${base}?token=${token}` : base;
}
