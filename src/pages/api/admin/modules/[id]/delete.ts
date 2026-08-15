export const prerender = false;

import type { APIRoute } from 'astro';
import { getDB } from '@db/client';

export const POST: APIRoute = async ({ locals, redirect, params }) => {
  const id = Number(params.id);
  if (!Number.isInteger(id) || id <= 0) {
    return redirect('/dashboard/kurikulum?error=notfound', 303);
  }

  const db = getDB(locals);
  await db.prepare('DELETE FROM modules WHERE id = ?').bind(id).run();

  return redirect('/dashboard/kurikulum?msg=deleted', 303);
};
