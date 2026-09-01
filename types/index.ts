export interface CVData {
  nama: string;
  email: string;
  telepon: string;
  linkedin?: string;
  ringkasan: string;
  pengalaman: {
    jabatan: string;
    perusahaan: string;
    periode: string;
    deskripsi: string;
  }[];
  pendidikan: {
    institusi: string;
    jurusan: string;
    tahun: string;
  }[];
  keahlian: string[];
  sertifikasi?: string[];
  bahasa?: { nama: string; level: string }[];
}

export interface Resume {
  id: string;
  user_id: string;
  title: string;
  data: CVData;
  template: 'minimalis' | 'modern' | 'profesional';
  ai_score: number | null;
  ai_feedback: AIReviewResult | null;
  created_at: string;
  updated_at: string;
}

export interface AIReviewResult {
  skor: number;
  verdict: string;
  dimensi: {
    kelengkapan: number;
    kata_kunci: number;
    struktur: number;
    ats_readability: number;
  };
  saran: string[];
}

export interface CoverLetter {
  id: string;
  user_id: string;
  position: string;
  company: string;
  content: string;
  created_at: string;
}

export interface InterviewMessage {
  role: 'ai' | 'user';
  text: string;
  timestamp: string;
}

export interface InterviewSession {
  id: string;
  user_id: string;
  position: string;
  messages: InterviewMessage[];
  final_score: number | null;
  status: 'active' | 'completed';
  created_at: string;
}

export type PlanType = 'free' | 'pro' | 'enterprise';

export interface PlanLimits {
  cv_review: number;       // per bulan
  cover_letter: number;
  interview: number;
  max_resumes: number;
  templates: string[];
}

export interface Profile {
  id: string;
  name: string;
  email: string;
  plan: PlanType;
  plan_expires_at: string | null;
  is_admin: boolean;
  created_at: string;
}

export type AuditAction =
  | 'auth.login'
  | 'auth.logout'
  | 'cv.deleted'
  | 'cv.exported'
  | 'cv.reviewed'
  | 'cover_letter.generated'
  | 'interview.started'
  | 'interview.completed'
  | 'payment.created'
  | 'payment.activated'
  | 'payment.expired_or_cancelled'
  | 'rate_limit.exceeded'
  | 'admin.access';

export interface AuditLog {
  id: string;
  user_id: string | null;
  action: AuditAction;
  metadata: Record<string, unknown>;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
}
