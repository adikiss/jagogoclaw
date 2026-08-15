export const prerender = false;

import type { APIRoute } from 'astro';
import { verifyParticipantToken, getSecret, PARTICIPANT_COOKIE } from '@lib/auth';
import { getDB } from '@db/client';

const json = (data: unknown) =>
  new Response(JSON.stringify(data), {
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  });

export const GET: APIRoute = async ({ cookies, locals }) => {
  try {
    const token = cookies.get(PARTICIPANT_COOKIE)?.value;
    const secret = getSecret(locals, 'SESSION_SECRET', 'insecure-dev-secret');
    const participantId = await verifyParticipantToken(token, secret);

    if (participantId === null) {
      return json({ authenticated: false });
    }

    const db = getDB(locals);
    const p = await db
      .prepare('SELECT name FROM participants WHERE id = ?')
      .bind(participantId)
      .first<{ name: string }>();

    if (!p) {
      return json({ authenticated: false });
    }

    return json({ authenticated: true, name: p.name });
  } catch {
    return json({ authenticated: false });
  }
};
