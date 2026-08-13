# Jago GoClaw — Landing Page

Landing page bilingual (ID/EN) untuk pelatihan **Jago GoClaw**.
Dibangun dengan **Astro 5 + Tailwind CSS 4**, dioptimalkan untuk **Cloudflare Pages**.

## Pengembangan Lokal

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # astro check + build ke ./dist
npm run preview  # preview hasil build
```

## Struktur

```
src/
├── components/      Navbar, Hero, Curriculum, Pricing, Instructor, Footer, ui/*
├── data/            site.ts (URL daftar/email), curriculum.ts (15 modul)
├── i18n/            ui.ts (semua teks ID/EN), utils.ts (helper)
├── layouts/         BaseLayout.astro (SEO, JSON-LD, hreflang)
├── pages/           index.astro (ID default), en/index.astro
└── styles/          global.css (Tailwind 4 @theme)
```

## Konten yang Perlu Diganti

Cari komentar `TODO` di file berikut:

| File | Isi |
|---|---|
| `src/data/site.ts` | URL aplikasi GoClaw (`registerUrl`), email support, sosial media |
| `src/data/site.ts` | Path foto instruktur (`instructor.photo`) |
| `public/images/adi-kiswanto.jpg` | Taruh foto asliinstruktur di sini (membuat auto-show, kalau kosong tampil inisial) |
| `public/og-image.jpg` | Gambar untuk preview WhatsApp/Twitter (1200×630 px) |
| `astro.config.mjs` | `SITE_URL` — ubah kalau domain berubah |

## Deploy ke Cloudflare Pages

### Opsi A — Dashboard (recommended)

1. Push repo ini ke GitHub.
2. Buka https://dash.cloudflare.com → **Workers & Pages** → **Create application** → **Pages** → **Connect to Git**.
3. Pilih repo, isi:
   - **Framework preset**: Astro
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
   - **Node version** (Environment variable): `NODE_VERSION = 20`
4. **Save and Deploy**. Tunggu sampai status *Success*.
5. (Opsional) **Custom domain** → tambahkan `jagoclaw.id`. Ikuti instruksi DNS Cloudflare.

### Opsi B — Wrangler CLI

```bash
npm run build
npx wrangler pages deploy dist --project-name jagoclaw
```

## Catatan Teknis

- **Bilingual**: `/` (ID, default), `/en/` (English). Language switcher di Navbar & Footer. `hreflang` otomatis.
- **SEO**: JSON-LD `Course` schema, OpenGraph, canonical, sitemap.xml (otomatis via `@astrojs/sitemap`).
- **Performance**: 100% static, gambar di-optimalkan Astro, font Plus Jakarta Sans via Fontsource (self-host).
- **Aksesibilitas**: skip-link, semantic HTML, focus ring, kontras AA.
