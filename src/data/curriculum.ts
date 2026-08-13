import type { Locale } from '@i18n/ui';

export interface Module {
  num: number;
  title: string;
  desc: string;
}

export interface DayGroup {
  day: number;
  key: 'day1' | 'day2' | 'day3';
  accent: 'brand' | 'violet' | 'accent';
  modules: Module[];
}

export const curriculum: Record<Locale, DayGroup[]> = {
  id: [
    {
      day: 1,
      key: 'day1',
      accent: 'brand',
      modules: [
        { num: 1, title: 'Apa itu GoClaw', desc: 'Pengenalan platform & cara kerjanya.' },
        { num: 2, title: 'LLM & AI Model', desc: 'Pemahaman dasar model AI yang men powering agent.' },
        { num: 3, title: 'Setup GoClaw', desc: 'Instalasi & konfigurasi awal hingga siap dipakai.' },
        { num: 4, title: 'Provider & AI Model Gratis', desc: 'Pilih model gratis via OpenRouter & provider lain.' },
        { num: 5, title: 'Membuat Agent + Channel', desc: 'Bangun agent pertama & channel komunikasi.' },
      ],
    },
    {
      day: 2,
      key: 'day2',
      accent: 'violet',
      modules: [
        { num: 6, title: 'Memory & Context', desc: 'Cara agent mengingat info (MEMORY.md).' },
        { num: 7, title: 'Daily Planner / Reminder Agent', desc: 'Praktik agent produktivitas harian.' },
        { num: 8, title: 'Input Keuangan dari Text', desc: 'Catat pemasukan/pengeluaran lewat chat.' },
        { num: 9, title: 'OCR + Scan Struk → Input Otomatis', desc: 'Baca struk & masukkan data otomatis.' },
        { num: 10, title: 'Database Pelanggan/Kontak', desc: 'Kelola kontak & data pelanggan.' },
      ],
    },
    {
      day: 3,
      key: 'day3',
      accent: 'accent',
      modules: [
        { num: 11, title: 'Email Assistant', desc: 'Kirim, baca, & AI review email.' },
        { num: 12, title: 'WordPress Integration', desc: 'Posting artikel otomatis ke WordPress.' },
        { num: 13, title: 'WooCommerce Integration', desc: 'Kelola produk, transaksi, & laporan.' },
        { num: 14, title: 'Skills & Tips Prompt Engineering', desc: 'Buat skill & teknik prompt yang efektif.' },
        { num: 15, title: 'Keamanan, Privacy & Best Practices', desc: 'Simpan API key aman & privasi data.' },
      ],
    },
  ],

  en: [
    {
      day: 1,
      key: 'day1',
      accent: 'brand',
      modules: [
        { num: 1, title: 'What is GoClaw', desc: 'Intro to the platform & how it works.' },
        { num: 2, title: 'LLM & AI Models', desc: 'Fundamentals of AI models that power agents.' },
        { num: 3, title: 'Setting up GoClaw', desc: 'Initial install & config to get ready.' },
        { num: 4, title: 'Providers & Free AI Models', desc: 'Pick free models via OpenRouter & others.' },
        { num: 5, title: 'Building an Agent + Channel', desc: 'Create your first agent & comms channel.' },
      ],
    },
    {
      day: 2,
      key: 'day2',
      accent: 'violet',
      modules: [
        { num: 6, title: 'Memory & Context', desc: 'How agents remember info (MEMORY.md).' },
        { num: 7, title: 'Daily Planner / Reminder Agent', desc: 'Hands-on daily productivity agent.' },
        { num: 8, title: 'Expense Tracking from Text', desc: 'Log income/expenses via chat.' },
        { num: 9, title: 'OCR + Receipt Scan → Auto Input', desc: 'Read receipts & auto-fill data.' },
        { num: 10, title: 'Customer/Contact Database', desc: 'Manage contacts & customer data.' },
      ],
    },
    {
      day: 3,
      key: 'day3',
      accent: 'accent',
      modules: [
        { num: 11, title: 'Email Assistant', desc: 'Send, read, & AI-review emails.' },
        { num: 12, title: 'WordPress Integration', desc: 'Auto-publish articles to WordPress.' },
        { num: 13, title: 'WooCommerce Integration', desc: 'Manage products, transactions, & reports.' },
        { num: 14, title: 'Skills & Prompt Engineering Tips', desc: 'Create skills & effective prompting.' },
        { num: 15, title: 'Security, Privacy & Best Practices', desc: 'Keep API keys safe & data private.' },
      ],
    },
  ],
};
