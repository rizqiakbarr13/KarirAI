import { PlanLimits, PlanType } from '@/types';

export const PLAN_LIMITS: Record<PlanType, PlanLimits> = {
  free: {
    cv_review: 1,
    cover_letter: 2,
    interview: 1,
    max_resumes: 1,
    templates: ['minimalis'],
  },
  pro: {
    cv_review: Infinity,
    cover_letter: Infinity,
    interview: 10,
    max_resumes: Infinity,
    templates: ['minimalis', 'modern', 'profesional'],
  },
  enterprise: {
    cv_review: Infinity,
    cover_letter: Infinity,
    interview: Infinity,
    max_resumes: Infinity,
    templates: ['minimalis', 'modern', 'profesional', 'custom'],
  },
};

export const PRICING = {
  pro_monthly: 49_000,    // Rp 49.000
  pro_yearly: 399_000,    // Rp 399.000
} as const;
