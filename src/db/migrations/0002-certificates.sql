-- Migrasi 0002: tracking progress modul untuk sertifikat
CREATE TABLE IF NOT EXISTS module_progress (
  participant_id INTEGER NOT NULL,
  module_id INTEGER NOT NULL,
  completed_at TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE(participant_id, module_id)
);
