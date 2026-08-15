-- Skema database Jago GoClaw v2 (Cloudflare D1 / SQLite)

DROP TABLE IF EXISTS participants;
CREATE TABLE participants (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  password_hash TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  payment_status TEXT NOT NULL DEFAULT 'unpaid',
  payment_method TEXT,
  payment_confirmed_at TEXT,
  notes TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

DROP TABLE IF EXISTS settings;
CREATE TABLE settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

DROP TABLE IF EXISTS modules;
CREATE TABLE modules (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  day INTEGER NOT NULL,
  num INTEGER NOT NULL,
  title_id TEXT NOT NULL,
  title_en TEXT NOT NULL,
  desc_id TEXT NOT NULL,
  desc_en TEXT NOT NULL,
  video_url TEXT,
  UNIQUE(day, num)
);

INSERT INTO modules (day, num, title_id, title_en, desc_id, desc_en) VALUES
(1, 1, 'Apa itu GoClaw', 'What is GoClaw', 'Pengenalan platform & cara kerjanya.', 'Intro to the platform & how it works.'),
(1, 2, 'LLM & AI Model', 'LLM & AI Models', 'Pemahaman dasar model AI yang men powering agent.', 'Fundamentals of AI models that power agents.'),
(1, 3, 'Setup GoClaw', 'Setting up GoClaw', 'Instalasi & konfigurasi awal hingga siap dipakai.', 'Initial install & config to get ready.'),
(1, 4, 'Provider & AI Model Gratis', 'Providers & Free AI Models', 'Pilih model gratis via OpenRouter & provider lain.', 'Pick free models via OpenRouter & others.'),
(1, 5, 'Membuat Agent + Channel', 'Building an Agent + Channel', 'Bangun agent pertama & channel komunikasi.', 'Create your first agent & comms channel.'),
(2, 6, 'Memory & Context', 'Memory & Context', 'Cara agent mengingat info (MEMORY.md).', 'How agents remember info (MEMORY.md).'),
(2, 7, 'Daily Planner / Reminder Agent', 'Daily Planner / Reminder Agent', 'Praktik agent produktivitas harian.', 'Hands-on daily productivity agent.'),
(2, 8, 'Input Keuangan dari Text', 'Expense Tracking from Text', 'Catat pemasukan/pengeluaran lewat chat.', 'Log income/expenses via chat.'),
(2, 9, 'OCR + Scan Struk → Input Otomatis', 'OCR + Receipt Scan → Auto Input', 'Baca struk & masukkan data otomatis.', 'Read receipts & auto-fill data.'),
(2, 10, 'Database Pelanggan/Kontak', 'Customer/Contact Database', 'Kelola kontak & data pelanggan.', 'Manage contacts & customer data.'),
(3, 11, 'Email Assistant', 'Email Assistant', 'Kirim, baca, & AI review email.', 'Send, read, & AI-review emails.'),
(3, 12, 'WordPress Integration', 'WordPress Integration', 'Posting artikel otomatis ke WordPress.', 'Auto-publish articles to WordPress.'),
(3, 13, 'WooCommerce Integration', 'WooCommerce Integration', 'Kelola produk, transaksi, & laporan.', 'Manage products, transactions, & reports.'),
(3, 14, 'Skills & Tips Prompt Engineering', 'Skills & Prompt Engineering Tips', 'Buat skill & teknik prompt yang efektif.', 'Create skills & effective prompting.'),
(3, 15, 'Keamanan, Privacy & Best Practices', 'Security, Privacy & Best Practices', 'Simpan API key aman & privasi data.', 'Keep API keys safe & data private.');
