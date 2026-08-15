import type { BankAccount } from '@db/types';

export async function getSetting(db: D1Database, key: string): Promise<string | null> {
  const row = await db.prepare('SELECT value FROM settings WHERE key = ?').bind(key).first<{ value: string }>();
  return row?.value ?? null;
}

export async function setSetting(db: D1Database, key: string, value: string): Promise<void> {
  await db
    .prepare(
      `INSERT INTO settings (key, value, updated_at) VALUES (?, ?, datetime('now'))
       ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = datetime('now')`
    )
    .bind(key, value)
    .run();
}

export const DEFAULT_PRICE = 99000;

export async function getPrice(db: D1Database): Promise<number> {
  const raw = await getSetting(db, 'price');
  const n = Number(raw);
  return Number.isFinite(n) && n > 0 ? Math.round(n) : DEFAULT_PRICE;
}

export async function getBankAccounts(db: D1Database): Promise<BankAccount[]> {
  const raw = await getSetting(db, 'bank_accounts');
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (b): b is BankAccount =>
        b && typeof b.bank === 'string' && typeof b.number === 'string' && typeof b.name === 'string'
    );
  } catch {
    return [];
  }
}
