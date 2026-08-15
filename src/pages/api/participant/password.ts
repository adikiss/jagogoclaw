export const prerender = false;

import type { APIRoute } from 'astro';
import { getDB } from '@db/client';
import { verifyParticipantToken, getSecret, PARTICIPANT_COOKIE } from '@lib/auth';
import { verifyPassword, hashPassword } from '@lib/passwords';
import type { Participant } from '@db/types';

export const POST: APIRoute = async ({ request, cookies, locals, redirect }) => {
  const token = cookies.get(PARTICIPANT_COOKIE)?.value;
  const secret = getSecret(locals, 'SESSION_SECRET', 'insecure-dev-secret');
  const participantId = await verifyParticipantToken(token, secret);

  if (participantId === null) return redirect('/masuk', 303);

  const form = await request.formData();
  const current = String(form.get('current_password') ?? '');
  const next = String(form.get('new_password') ?? '');

  if (next.length < 6) return redirect('/course/profil?error=short', 303);

  const db = getDB(locals);
  const participant = await db
    .prepare('SELECT password_hash FROM participants WHERE id = ?')
    .bind(participantId)
    .first<Pick<Participant, 'password_hash'>>();

  const valid = await verifyPassword(current, participant?.password_hash ?? null);
  if (!valid) {
    await new Promise((resolve) => setTimeout(resolve, 400));
    return redirect('/course/profil?error=wrongpass', 303);
  }

  const newHash = await hashPassword(next);
  await db
    .prepare(`UPDATE participants SET password_hash = ?, updated_at = datetime('now') WHERE id = ?`)
    .bind(newHash, participantId)
    .run();

  return redirect('/course/profil?msg=password', 303);
};
