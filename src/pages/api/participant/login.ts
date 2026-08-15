export const prerender = false;

import type { APIRoute } from 'astro';
import { getDB } from '@db/client';
import { verifyPassword } from '@lib/passwords';
import { createParticipantToken, getSecret, PARTICIPANT_COOKIE } from '@lib/auth';
import type { Participant } from '@db/types';

export const POST: APIRoute = async ({ request, cookies, locals, redirect, url }) => {
  const form = await request.formData();
  const email = String(form.get('email') ?? '').trim().toLowerCase();
  const password = String(form.get('password') ?? '');

  const db = getDB(locals);
  const participant = await db
    .prepare('SELECT * FROM participants WHERE email = ?')
    .bind(email)
    .first<Participant>();

  const valid = participant?.password_hash
    ? await verifyPassword(password, participant.password_hash)
    : false;

  if (!participant || !valid) {
    await new Promise((resolve) => setTimeout(resolve, 400));
    return redirect('/masuk?error=1', 303);
  }

  const secret = getSecret(locals, 'SESSION_SECRET', 'insecure-dev-secret');
  const token = await createParticipantToken(participant.id, secret);

  cookies.set(PARTICIPANT_COOKIE, token, {
    path: '/',
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 30 * 24 * 60 * 60,
    secure: url.protocol === 'https:',
  });

  if (participant.payment_status === 'paid' && participant.status === 'active') {
    return redirect('/course', 303);
  }
  return redirect('/daftar/pembayaran', 303);
};
