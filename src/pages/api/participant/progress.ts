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
  const moduleId = Number(form.get('module_id'));

  if (!Number.isInteger(moduleId) || moduleId <= 0) return redirect('/course', 303);

  const db = getDB(locals);
  const mod = await db.prepare('SELECT id FROM modules WHERE id = ?').bind(moduleId).first();

  if (!mod) return redirect('/course', 303);

  await db
    .prepare('INSERT OR IGNORE INTO module_progress (participant_id, module_id) VALUES (?, ?)')
    .bind(participantId, moduleId)
    .run();

  return redirect(`/course?m=${moduleId}`, 303);
};
