import { defineMiddleware } from 'astro:middleware';
import { verifySessionToken, getSecret } from './lib/auth';

export const onRequest = defineMiddleware(async (context, next) => {
  const { url, cookies, locals } = context;
  const path = url.pathname;

  const isProtectedPage = path === '/dashboard' || path.startsWith('/dashboard/');
  const isAdminApi =
    path.startsWith('/api/admin/') && path !== '/api/admin/login' && path !== '/api/admin/logout';

  if (!isProtectedPage && !isAdminApi) return next();

  const token = cookies.get('admin_session')?.value;
  const secret = getSecret(locals, 'SESSION_SECRET', 'insecure-dev-secret');

  if (await verifySessionToken(token, secret)) return next();

  if (path.startsWith('/api/')) {
    return new Response('Unauthorized', { status: 401 });
  }
  return context.redirect('/admin/login');
});
