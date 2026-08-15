import { defineMiddleware } from 'astro:middleware';
import {
  verifyAdminToken,
  verifyParticipantToken,
  getSecret,
  ADMIN_COOKIE,
  PARTICIPANT_COOKIE,
} from './lib/auth';

export const onRequest = defineMiddleware(async (context, next) => {
  const { url, cookies, locals } = context;
  const path = url.pathname;
  const secret = getSecret(locals, 'SESSION_SECRET', 'insecure-dev-secret');

  const isProtectedPage = path === '/dashboard' || path.startsWith('/dashboard/');
  const isAdminApi =
    path.startsWith('/api/admin/') && path !== '/api/admin/login' && path !== '/api/admin/logout';
  const isCoursePage = path === '/course' || path.startsWith('/course/');

  if (isProtectedPage || isAdminApi) {
    const token = cookies.get(ADMIN_COOKIE)?.value;
    if (await verifyAdminToken(token, secret)) return next();
    if (isAdminApi) return new Response('Unauthorized', { status: 401 });
    return context.redirect('/admin/login');
  }

  if (isCoursePage) {
    const token = cookies.get(PARTICIPANT_COOKIE)?.value;
    const participantId = await verifyParticipantToken(token, secret);
    if (participantId === null) return context.redirect('/masuk');
    locals.participantId = participantId;
    return next();
  }

  return next();
});
