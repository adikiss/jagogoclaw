export const prerender = false;

import type { APIRoute } from 'astro';
import { getDB } from '@db/client';

export const POST: APIRoute = async ({ locals, redirect, params }) => {
  const id = Number(params.id);
  if (!Number.isInteger(id) || id <= 0) {
    return redirect('/dashboard/peserta?error=notfound', 303);
  }

  const db = getDB(locals);
  await db
    .prepare(
      `UPDATE participants
       SET payment_status = 'paid', status = 'active', updated_at = datetime('now')
       WHERE id = ?`
    )
    .bind(id)
    .run();

  return redirect('/dashboard/peserta?msg=verified', 303);
};
