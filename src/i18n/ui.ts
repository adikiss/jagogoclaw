export type Locale = 'id' | 'en';

export const defaultLocale: Locale = 'id';
export const locales: Locale[] = ['id', 'en'];

export const localeLabels: Record<Locale, string> = {
  id: 'Bahasa Indonesia',
  en: 'English',
};

export const ui = {
  id: {
    'site.name': 'Jago GoClaw',
    'site.tagline': 'Kuasai GoClaw untuk Otomatisasi Bisnis dengan AI',

    'nav.curriculum': 'Kurikulum',
    'nav.pricing': 'Harga',
    'nav.instructor': 'Instruktur',
    'nav.cta': 'Daftar',
    'nav.login': 'Masuk',
    'nav.verify': 'Verifikasi Sertifikat',

    'lang.switch': 'English',

    'hero.badge': 'Pelatihan Online · 3 Hari',
    'hero.title': 'Kuasai GoClaw — Setup Karyawan AI-mu yang Kerja 24 Jam',
    'hero.subtitle': 'GoClaw Lebih OP (Over Power) dari OpenClaw dan Hermes',
    'hero.description':
      'Pelajari cara membangun agent AI otomatis untuk bisnis Anda: dari input keuangan, scan struk, hingga integrasi WordPress & WooCommerce. Praktik langsung, bukan teori.',
    'hero.cta.primary': 'Daftar — Rp 99.000',
    'hero.cta.secondary': 'Lihat Kurikulum',
    'hero.stats.modules': 'Modul',
    'hero.stats.days': 'Hari',
    'hero.stats.price': 'Sekali Bayar',
    'hero.stats.level': 'Semua Level',

    'curriculum.eyebrow': 'Kurikulum',
    'curriculum.title': '15 Modul dalam 3 Hari',
    'curriculum.subtitle':
      'Struktur progresif: dasar → praktik → advanced. Setiap modul = video + praktik langsung.',
    'curriculum.day': 'Hari',
    'curriculum.day1.title': 'Dasar',
    'curriculum.day1.desc': 'Pahami fondasi GoClaw, AI model, dan setup awal.',
    'curriculum.day2.title': 'Praktik',
    'curriculum.day2.desc': 'Bangun agent produktif: keuangan, OCR, database.',
    'curriculum.day3.title': 'Advanced',
    'curriculum.day3.desc': 'Integrasi penuh: Email, WordPress, WooCommerce.',

    'pricing.eyebrow': 'Harga',
    'pricing.title': 'Investasi Sekali, Skill Selamanya',
    'pricing.subtitle': 'Akses penuh ke seluruh 15 modul + praktik langsung.',
    'pricing.price': 'Rp 99.000',
    'pricing.priceNote': 'Sekali bayar · Akses selamanya',
    'pricing.cta': 'Daftar',
    'pricing.feat.video': '15 modul video + praktik langsung',
    'pricing.feat.templates': 'Template agent siap pakai',
    'pricing.feat.updates': 'Update materi selamanya',
    'pricing.feat.community': 'Akses grup komunitas',
    'pricing.feat.certificate': 'Sertifikat penyelesaian',

    'instructor.eyebrow': 'Instruktur',
    'instructor.title': 'Belajar Langsung dari Praktisi',
    'instructor.name': 'Adi Kiswanto',
    'instructor.role': 'Trainer GoClaw & AI Automation Specialist',
    'instructor.bio': 'Praktisi otomatisasi bisnis dengan AI. Berpengalaman membantu UMKM dan profesional membangun workflow otomatis menggunakan GoClaw — dari manajemen keuangan harian hingga integrasi e-commerce.',

    'footer.tagline': 'Pelatihan GoClaw untuk otomatisasi bisnis berbasis AI.',
    'footer.contact': 'Kontak',
    'footer.curriculum': 'Kurikulum',
    'footer.legal': '© 2026 Jago GoClaw. Hak cipta dilindungi.',

    'common.comingSoon': 'Segera',
  },

  en: {
    'site.name': 'Jago GoClaw',
    'site.tagline': 'Master GoClaw for AI-Powered Business Automation',

    'nav.curriculum': 'Curriculum',
    'nav.pricing': 'Pricing',
    'nav.instructor': 'Instructor',
    'nav.cta': 'Enroll',
    'nav.login': 'Sign In',
    'nav.verify': 'Verify Certificate',

    'lang.switch': 'Bahasa Indonesia',

    'hero.badge': 'Online Course · 3 Days',
    'hero.title': 'Master GoClaw — Set Up Your 24/7 AI Employee',
    'hero.subtitle': 'GoClaw Is Overpowered Compared to OpenClaw and Hermes',
    'hero.description':
      'Learn to build AI agents that automate your business: from expense tracking, receipt scanning, to WordPress & WooCommerce integration. Hands-on practice, not just theory.',
    'hero.cta.primary': 'Enroll — Rp 99.000',
    'hero.cta.secondary': 'View Curriculum',
    'hero.stats.modules': 'Modules',
    'hero.stats.days': 'Days',
    'hero.stats.price': 'One-time',
    'hero.stats.level': 'All Levels',

    'curriculum.eyebrow': 'Curriculum',
    'curriculum.title': '15 Modules in 3 Days',
    'curriculum.subtitle':
      'Progressive structure: basics → practice → advanced. Every module = video + hands-on.',
    'curriculum.day': 'Day',
    'curriculum.day1.title': 'Fundamentals',
    'curriculum.day1.desc': 'Understand GoClaw foundations, AI models, and initial setup.',
    'curriculum.day2.title': 'Practice',
    'curriculum.day2.desc': 'Build productive agents: finance, OCR, database.',
    'curriculum.day3.title': 'Advanced',
    'curriculum.day3.desc': 'Full integration: Email, WordPress, WooCommerce.',

    'pricing.eyebrow': 'Pricing',
    'pricing.title': 'One Investment, Lifelong Skills',
    'pricing.subtitle': 'Full access to all 15 modules + hands-on practice.',
    'pricing.price': 'Rp 99.000',
    'pricing.priceNote': 'One-time payment · Lifetime access',
    'pricing.cta': 'Enroll',
    'pricing.feat.video': '15 video modules + hands-on practice',
    'pricing.feat.templates': 'Ready-to-use agent templates',
    'pricing.feat.updates': 'Lifetime material updates',
    'pricing.feat.community': 'Community group access',
    'pricing.feat.certificate': 'Completion certificate',

    'instructor.eyebrow': 'Instructor',
    'instructor.title': 'Learn Directly from a Practitioner',
    'instructor.name': 'Adi Kiswanto',
    'instructor.role': 'GoClaw Trainer & AI Automation Specialist',
    'instructor.bio': 'Business automation practitioner using AI. Experienced in helping SMEs and professionals build automated workflows with GoClaw — from daily finance management to e-commerce integration.',

    'footer.tagline': 'GoClaw training for AI-powered business automation.',
    'footer.contact': 'Contact',
    'footer.curriculum': 'Curriculum',
    'footer.legal': '© 2026 Jago GoClaw. All rights reserved.',

    'common.comingSoon': 'Soon',
  },
} as const;

export type TranslationKey = keyof typeof ui.id;
