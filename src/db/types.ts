export type ParticipantStatus = 'pending' | 'active' | 'cancelled';
export type PaymentStatus = 'unpaid' | 'paid';

export interface Participant {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  password_hash: string | null;
  status: ParticipantStatus;
  payment_status: PaymentStatus;
  payment_method: string | null;
  payment_confirmed_at: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface CourseModule {
  id: number;
  day: number;
  num: number;
  title_id: string;
  title_en: string;
  desc_id: string;
  desc_en: string;
  video_url: string | null;
}

export interface BankAccount {
  bank: string;
  number: string;
  name: string;
}

export const statusLabels: Record<ParticipantStatus, string> = {
  pending: 'Menunggu',
  active: 'Aktif',
  cancelled: 'Batal',
};

export const paymentLabels: Record<PaymentStatus, string> = {
  unpaid: 'Belum Bayar',
  paid: 'Lunas',
};

export function isParticipantStatus(v: string): v is ParticipantStatus {
  return v === 'pending' || v === 'active' || v === 'cancelled';
}

export function isPaymentStatus(v: string): v is PaymentStatus {
  return v === 'unpaid' || v === 'paid';
}

export function formatDate(sqlDate: string | null): string {
  if (!sqlDate) return '-';
  return sqlDate.slice(0, 16).replace('T', ' ');
}

export function formatIDR(n: number): string {
  return 'Rp ' + n.toLocaleString('id-ID');
}
