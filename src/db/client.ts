export function getDB(locals: App.Locals): D1Database {
  const db = locals.runtime?.env?.DB;
  if (!db) {
    throw new Error(
      'D1 binding "DB" tidak tersedia. Pastikan wrangler.toml berisi konfigurasi [[d1_databases]] dan restart dev server.'
    );
  }
  return db;
}
