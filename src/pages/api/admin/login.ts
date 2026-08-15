export const prerender = false;

import type { APIRoute } from 'astro';
import { createAdminToken, getSecret, ADMIN_COOKIE } from '@lib/auth';

export const POST: APIRoute = async ({ request, cookies, locals, redirect, url }) => {
  const form = await request.formData();
  const password = String(form.get('password') ?? '');

  const expected = getSecret(locals, 'ADMIN_PASSWORD', 'admin123');

  if (!password || password !== expected) {
    await new Promise((resolve) => setTimeout(resolve, 400));
    return redirect('/admin/login?error=1', 303);
  }

  const secret = getSecret(locals, 'SESSION_SECRET', 'insecure-dev-secret');
  const token = await createAdminToken(secret);

  cookies.set(ADMIN_COOKIE, token, {
    path: '/',
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 8 * 60 * 60,
    secure: url.protocol === 'https:',
  });

  return redirect('/dashboard', 303);
};
