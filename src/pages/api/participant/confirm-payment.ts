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
  const paymentMethod = String(form.get('payment_method') ?? '').trim().slice(0, 50);

  if (!paymentMethod) return redirect('/daftar/pembayaran', 303);

  const db = getDB(locals);
  await db
    .prepare(
      `UPDATE participants
       SET payment_method = ?, payment_confirmed_at = datetime('now'), updated_at = datetime('now')
       WHERE id = ?`
    )
    .bind(paymentMethod, participantId)
    .run();

  return redirect('/daftar/pembayaran?msg=confirmed', 303);
};
