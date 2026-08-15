export const prerender = false;

import type { APIRoute } from 'astro';
import { PARTICIPANT_COOKIE } from '@lib/auth';

export const POST: APIRoute = async ({ cookies, redirect }) => {
  cookies.delete(PARTICIPANT_COOKIE, { path: '/' });
  return redirect('/', 303);
};
