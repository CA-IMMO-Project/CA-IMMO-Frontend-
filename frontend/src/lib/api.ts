import { Land } from '../types';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://127.0.0.1:8000';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    const message = body?.errors
      ? Object.values(body.errors as Record<string, string>).join(' ')
      : (body?.error ?? "Une erreur est survenue. Merci de réessayer.");
    throw new Error(message);
  }

  return res.json();
}

export interface LandFilters {
  q?: string;
  region?: string;
  maxPrice?: number;
  minArea?: number;
  usage?: string;
  titleStatus?: string;
}

export function fetchLands(filters: LandFilters = {}): Promise<Land[]> {
  const params = new URLSearchParams();
  if (filters.q) params.set('q', filters.q);
  if (filters.region) params.set('region', filters.region);
  if (filters.maxPrice) params.set('maxPrice', String(filters.maxPrice));
  if (filters.minArea) params.set('minArea', String(filters.minArea));
  if (filters.usage) params.set('usage', filters.usage);
  if (filters.titleStatus) params.set('titleStatus', filters.titleStatus);
  const qs = params.toString();
  return request<Land[]>(`/api/lands${qs ? `?${qs}` : ''}`);
}

export function fetchRegions(): Promise<string[]> {
  return request<string[]>('/api/regions');
}

export interface ReservationPayload {
  fullName: string;
  phone: string;
  email?: string;
  budget?: string;
  profession?: string;
  bankAccount?: string;
  age?: number;
  nationality?: string;
  message?: string;
  landId?: number;
  projectName?: string;
}

export function createReservation(payload: ReservationPayload) {
  return request('/api/reservations', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export interface ContactPayload {
  firstName: string;
  lastName: string;
  phone: string;
  email?: string;
  subject?: string;
  message: string;
}

export function createContactMessage(payload: ContactPayload) {
  return request('/api/contact', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}
