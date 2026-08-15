# Jago GoClaw — Landing Page + Dashboard Admin

Landing page bilingual (ID/EN) untuk pelatihan **Jago GoClaw** + dashboard admin (SSR).
Dibangun dengan **Astro 5 + Tailwind CSS 4**, database **Cloudflare D1**, deploy ke **Cloudflare Pages**.

- Landing page: statis (prerendered, cepat) di `/` dan `/en/`
- Dashboard admin: SSR di `/dashboard` — login password, kelola data peserta

## Pengembangan Lokal

```bash
npm install
cp .dev.vars.example .dev.vars   # lalu edit nilainya
npm run db:migrate:local         # buat tabel di D1 lokal
npm run dev                      # http://localhost:4321
```

Akses admin: `http://localhost:4321/admin/login` (password default dev: `admin123`, dari `.dev.vars`).

## Dashboard Admin

| Halaman | URL | Status |
|---|---|---|
| Login | `/admin/login` | ✅ |
| Dashboard (statistik) | `/dashboard` | ✅ |
| Peserta (CRUD) | `/dashboard/peserta` | ✅ |
| Kurikulum | `/dashboard/kurikulum` | 🔜 tahap berikutnya |
| Harga | `/dashboard/harga` | 🔜 tahap berikutnya |
| Halaman Depan | `/dashboard/halaman-depan` | 🔜 tahap berikutnya |

Fitur peserta: tambah, edit, hapus, cari (nama/email/WA), filter status, badge status & pembayaran.

## Environment Variables

Set di `.dev.vars` (lokal) dan Cloudflare Pages → Settings → Environment variables (produksi):

| Var | Fungsi |
|---|---|
| `ADMIN_PASSWORD` | Password login dashboard admin |
| `SESSION_SECRET` | Secret penanda tanda tangan session cookie (string acak panjang) |

## Setup D1 (sekali saja, untuk produksi)

```bash
npx wrangler login
npx wrangler d1 create jagogoclaw-db
# salin database_id dari output ke wrangler.toml (ganti REPLACE_WITH_YOUR_D1_DATABASE_ID)
npm run db:migrate:remote
```

## Deploy ke Cloudflare Pages

### Opsi A — Dashboard (recommended)

1. Push repo ini ke GitHub.
2. **Workers & Pages** → **Create** → **Pages** → **Connect to Git** → pilih repo.
3. Framework preset **Astro**, build command `npm run build`, output dir `dist`.
4. Environment variables (Production): `ADMIN_PASSWORD`, `SESSION_SECRET`, `NODE_VERSION=20`.
5. **Settings → Functions → D1 database bindings**: binding name `DB` → pilih database `jagogoclaw-db`.
6. Deploy. Custom domain `jagoclaw.id` di tab **Custom domains**.

### Opsi B — Wrangler CLI

```bash
npm run build
npx wrangler pages deploy dist --project-name jagogoclaw
```

## Struktur

```
src/
├── components/      Navbar, Hero, Curriculum, Pricing, Instructor, Footer, ui/*
├── data/            site.ts (URL daftar/email), curriculum.ts (15 modul)
├── i18n/            ui.ts (semua teks ID/EN), utils.ts (helper)
├── layouts/         BaseLayout.astro (publik), AdminLayout.astro (admin)
├── lib/             auth.ts (session, HMAC)
├── db/              schema.sql, client.ts, types.ts
├── middleware.ts    proteksi route /dashboard & /api/admin
└── pages/
    ├── index.astro / en/index.astro   (landing, statis)
    ├── admin/login.astro              (login)
    ├── dashboard/                     (admin SSR)
    └── api/admin/                     (endpoint form: login, logout, participants)

## Konten yang Perlu Diganti

Cari komentar `TODO` di file berikut:

| File | Isi |
|---|---|
| `src/data/site.ts` | URL aplikasi GoClaw (`registerUrl`), email support, sosial media |
| `public/og-image.jpg` | Gambar preview WhatsApp/Twitter (1200×630 px) |
| `astro.config.mjs` | `SITE_URL` — ubah kalau domain berubah |
| `wrangler.toml` | `database_id` D1 |

