export const prerender = false;

import type { APIRoute } from 'astro';
import { getDB } from '@db/client';
import { isParticipantStatus, isPaymentStatus } from '@db/types';

export const POST: APIRoute = async ({ request, locals, redirect }) => {
  const form = await request.formData();

  const name = String(form.get('name') ?? '').trim();
  const email = String(form.get('email') ?? '').trim().toLowerCase();
  const phone = String(form.get('phone') ?? '').trim();
  const notes = String(form.get('notes') ?? '').trim();
  const statusRaw = String(form.get('status') ?? 'pending');
  const paymentRaw = String(form.get('payment_status') ?? 'unpaid');

  if (!name || !email || !email.includes('@')) {
    return redirect('/dashboard/peserta?error=missing', 303);
  }

  const status = isParticipantStatus(statusRaw) ? statusRaw : 'pending';
  const paymentStatus = isPaymentStatus(paymentRaw) ? paymentRaw : 'unpaid';

  const db = getDB(locals);

  try {
    await db
      .prepare(
        'INSERT INTO participants (name, email, phone, status, payment_status, notes) VALUES (?, ?, ?, ?, ?, ?)'
      )
      .bind(name, email, phone || null, status, paymentStatus, notes || null)
      .run();
  } catch (err) {
    if (String(err).includes('UNIQUE')) {
      return redirect('/dashboard/peserta?error=dup', 303);
    }
    throw err;
  }

  return redirect('/dashboard/peserta?msg=added', 303);
};
