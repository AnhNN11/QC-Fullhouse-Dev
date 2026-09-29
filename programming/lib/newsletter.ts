import { createHash } from 'node:crypto';

export function newsletterEmail(value: FormDataEntryValue | null): string | null {
  if (typeof value !== 'string') return null;
  const email = value.trim().toLowerCase();
  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return null;
  return email;
}

export function newsletterId(email: string) {
  return createHash('sha256').update(email).digest('hex');
}

export type NewsletterRequest = {
  _id: string;
  email: string;
  status: 'requested' | 'suppressed';
  createdAt: Date;
  updatedAt: Date;
  consentVersion: 'newsletter-v1';
};
