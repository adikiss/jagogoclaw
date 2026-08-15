export const prerender = false;

import type { APIRoute } from 'astro';
import { getDB } from '@db/client';
import { hashPassword } from '@lib/passwords';
import { createParticipantToken, getSecret, PARTICIPANT_COOKIE } from '@lib/auth';

export const POST: APIRoute = async ({ request, cookies, locals, redirect, url }) => {
  const form = await request.formData();

  const name = String(form.get('name') ?? '').trim();
  const email = String(form.get('email') ?? '').trim().toLowerCase();
  const phone = String(form.get('phone') ?? '').trim();
  const password = String(form.get('password') ?? '');

  if (!name || !email || !email.includes('@')) {
    return redirect('/daftar?error=missing', 303);
  }
  if (password.length < 6) {
    return redirect('/daftar?error=short', 303);
  }

  const passwordHash = await hashPassword(password);
  const db = getDB(locals);

  let participantId: number;
  try {
    await db
      .prepare('INSERT INTO participants (name, email, phone, password_hash) VALUES (?, ?, ?, ?)')
      .bind(name, email, phone || null, passwordHash)
      .run();
    const row = await db
      .prepare('SELECT id FROM participants WHERE email = ?')
      .bind(email)
      .first<{ id: number }>();
    participantId = row?.id ?? 0;
  } catch (err) {
    if (String(err).includes('UNIQUE')) {
      return redirect('/daftar?error=dup', 303);
    }
    throw err;
  }

  if (!participantId) {
    return redirect('/daftar?error=missing', 303);
  }

  const secret = getSecret(locals, 'SESSION_SECRET', 'insecure-dev-secret');
  const token = await createParticipantToken(participantId, secret);

  cookies.set(PARTICIPANT_COOKIE, token, {
    path: '/',
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 30 * 24 * 60 * 60,
    secure: url.protocol === 'https:',
  });

  return redirect('/daftar/pembayaran', 303);
};
