export const prerender = false;

import type { APIRoute } from 'astro';
import { getDB } from '@db/client';
import { verifyParticipantToken, getSecret, PARTICIPANT_COOKIE } from '@lib/auth';

export const POST: APIRoute = async ({ request, cookies, locals, redirect }) => {
  const token = cookies.get(PARTICIPANT_COOKIE)?.value;
  const secret = getSecret(locals, 'SESSION_SECRET', 'insecure-dev-secret');
  const participantId = await verifyParticipantToken(token, secret);

  if (participantId === null) return redirect('/masuk', 303);

  const form = await request.formData();
  const name = String(form.get('name') ?? '').trim();
  const phone = String(form.get('phone') ?? '').trim();

  if (!name) return redirect('/course/profil?error=name', 303);

  const db = getDB(locals);
  await db
    .prepare(`UPDATE participants SET name = ?, phone = ?, updated_at = datetime('now') WHERE id = ?`)
    .bind(name, phone || null, participantId)
    .run();

  return redirect('/course/profil?msg=saved', 303);
};
