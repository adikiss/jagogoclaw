export const prerender = false;

import type { APIRoute } from 'astro';
import { getDB } from '@db/client';
import { setSetting } from '@lib/settings';
import type { BankAccount } from '@db/types';

export const POST: APIRoute = async ({ request, locals, redirect }) => {
  const form = await request.formData();

  const priceRaw = String(form.get('price') ?? '').replace(/[^\d]/g, '');
  const price = Number(priceRaw);
  if (Number.isFinite(price) && price > 0) {
    const db = getDB(locals);
    await setSetting(db, 'price', String(Math.round(price)));
  }

  const banksRaw = form.getAll('bank').map(String);
  const numbers = form.getAll('number').map(String);
  const names = form.getAll('account_name').map(String);

  const banks: BankAccount[] = [];
  for (let i = 0; i < banksRaw.length; i++) {
    const bank = banksRaw[i]?.trim();
    const number = numbers[i]?.trim();
    const name = names[i]?.trim();
    if (bank && number && name) banks.push({ bank, number, name });
  }

  const db = getDB(locals);
  await setSetting(db, 'bank_accounts', JSON.stringify(banks));

  return redirect('/dashboard/pembayaran?msg=saved', 303);
};
