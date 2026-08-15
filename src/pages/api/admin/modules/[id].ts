export const prerender = false;

import type { APIRoute } from 'astro';
import { getDB } from '@db/client';

export const POST: APIRoute = async ({ request, locals, redirect, params }) => {
  const id = Number(params.id);
  if (!Number.isInteger(id) || id <= 0) {
    return redirect('/dashboard/kurikulum?error=notfound', 303);
  }

  const form = await request.formData();
  const day = Number(form.get('day'));
  const num = Number(form.get('num'));
  const title_id = String(form.get('title_id') ?? '').trim();
  const title_en = String(form.get('title_en') ?? '').trim() || title_id;
  const desc_id = String(form.get('desc_id') ?? '').trim();
  const desc_en = String(form.get('desc_en') ?? '').trim() || desc_id;
  const video_url = String(form.get('video_url') ?? '').trim();

  if (![1, 2, 3].includes(day) || !Number.isInteger(num) || num < 1 || !title_id || !desc_id) {
    return redirect(`/dashboard/kurikulum?error=invalid`, 303);
  }

  const db = getDB(locals);
  try {
    await db
      .prepare(
        'UPDATE modules SET day = ?, num = ?, title_id = ?, title_en = ?, desc_id = ?, desc_en = ?, video_url = ? WHERE id = ?'
      )
      .bind(day, num, title_id, title_en, desc_id, desc_en, video_url || null, id)
      .run();
  } catch (err) {
    if (String(err).includes('UNIQUE')) {
      return redirect('/dashboard/kurikulum?error=dup', 303);
    }
    throw err;
  }

  return redirect('/dashboard/kurikulum?msg=updated', 303);
};
