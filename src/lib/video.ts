import { getStreamEnv, createStreamSignedToken, streamEmbedUrl } from './stream';

export type VideoKind = 'youtube' | 'stream';

export interface VideoRef {
  kind: VideoKind;
  id: string;
}

const STREAM_UID_RE = /^[0-9a-f]{32}$/;

/**
 * Kenali input admin: URL YouTube, URL cloudflarestream.com, atau UID Stream mentah (32 hex).
 */
export function parseVideoUrl(url: string): VideoRef | null {
  const raw = url.trim();
  if (!raw) return null;

  if (STREAM_UID_RE.test(raw)) return { kind: 'stream', id: raw };

  try {
    const u = new URL(raw);

    if (u.hostname.endsWith('cloudflarestream.com')) {
      const m = u.pathname.match(/([0-9a-f]{32})/);
      if (m) return { kind: 'stream', id: m[1] };
    }

    if (u.hostname === 'youtu.be') {
      const id = u.pathname.slice(1).split('/')[0];
      if (id) return { kind: 'youtube', id };
    }
    if (u.hostname === 'www.youtube.com' || u.hostname === 'youtube.com' || u.hostname === 'm.youtube.com') {
      if (u.pathname.startsWith('/embed/')) {
        const id = u.pathname.split('/')[2];
        if (id) return { kind: 'youtube', id };
      }
      const v = u.searchParams.get('v');
      if (v) return { kind: 'youtube', id: v };
    }
  } catch {
    return null;
  }

  return null;
}

/**
 * Bangun URL embed aman:
 * - Stream  : iframe dengan token tanda tangan (expired, terikat video) bila signing dikonfigurasi
 * - YouTube : iframe embed biasa
 */
export async function buildEmbedUrl(ref: VideoRef, locals: App.Locals): Promise<string> {
  if (ref.kind === 'youtube') {
    return `https://www.youtube.com/embed/${ref.id}`;
  }

  const env = getStreamEnv(locals);
  if (env.customerCode) {
    const token = await createStreamSignedToken(ref.id, env);
    return streamEmbedUrl(ref.id, env.customerCode, token);
  }

  return streamEmbedUrl(ref.id, 'REPLACE_ME');
}
