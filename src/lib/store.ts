import { Land } from '../types';
import { LANDS } from '../data/lands';
import type { ContactPayload, ReservationPayload } from './api';

// Stockage local (navigateur) en attendant un vrai backend.
// Toutes les lectures/écritures du site et du backoffice passent par ici.

export type RequestStatus = 'nouveau' | 'traité' | 'archivé';

export interface Reservation extends ReservationPayload {
  id: string;
  createdAt: string;
  status: RequestStatus;
}

export interface ContactMessage extends ContactPayload {
  id: string;
  createdAt: string;
  status: RequestStatus;
}

const KEYS = {
  lands: 'caimmo.lands',
  reservations: 'caimmo.reservations',
  messages: 'caimmo.messages',
};

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, value: T) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // stockage indisponible (navigation privée, quota…)
  }
}

export function newId(): string {
  return `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`;
}

// --- Terrains ---
export function getLands(): Land[] {
  // Les terrains enregistrés avant l'ajout des parcelles n'ont pas de champ `lots` :
  // on leur ajoute les parcelles par défaut.
  return read<Land[]>(KEYS.lands, LANDS).map((land) => {
    const defaults = LANDS.find((l) => l.id === land.id)?.lots;
    if (land.lots === undefined) return { ...land, lots: defaults };
    // Complète la photo et les détails des parcelles par défaut enregistrées avant leur ajout.
    return {
      ...land,
      lots: land.lots.map((lot) => {
        const def = defaults?.find((d) => d.id === lot.id);
        return def ? { ...lot, imageUrl: lot.imageUrl ?? def.imageUrl, details: lot.details ?? def.details } : lot;
      }),
    };
  });
}

export function saveLand(land: Land) {
  const lands = getLands();
  const idx = lands.findIndex((l) => l.id === land.id);
  if (idx >= 0) lands[idx] = land;
  else lands.unshift(land);
  write(KEYS.lands, lands);
}

export function deleteLand(id: string) {
  write(KEYS.lands, getLands().filter((l) => l.id !== id));
}

export function resetLands() {
  write(KEYS.lands, LANDS);
}

// --- Réservations ---
export function getReservations(): Reservation[] {
  return read<Reservation[]>(KEYS.reservations, []);
}

export function addReservation(payload: ReservationPayload) {
  const item: Reservation = { ...payload, id: newId(), createdAt: new Date().toISOString(), status: 'nouveau' };
  write(KEYS.reservations, [item, ...getReservations()]);
}

export function updateReservation(id: string, patch: Partial<Reservation>) {
  write(KEYS.reservations, getReservations().map((r) => (r.id === id ? { ...r, ...patch } : r)));
}

export function deleteReservation(id: string) {
  write(KEYS.reservations, getReservations().filter((r) => r.id !== id));
}

// --- Messages de contact ---
export function getMessages(): ContactMessage[] {
  return read<ContactMessage[]>(KEYS.messages, []);
}

export function addMessage(payload: ContactPayload) {
  const item: ContactMessage = { ...payload, id: newId(), createdAt: new Date().toISOString(), status: 'nouveau' };
  write(KEYS.messages, [item, ...getMessages()]);
}

export function updateMessage(id: string, patch: Partial<ContactMessage>) {
  write(KEYS.messages, getMessages().map((m) => (m.id === id ? { ...m, ...patch } : m)));
}

export function deleteMessage(id: string) {
  write(KEYS.messages, getMessages().filter((m) => m.id !== id));
}

// --- Authentification admin (simple, côté client) ---
const AUTH_KEY = 'caimmo.admin';
const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'caimmo2026';

export function login(password: string): boolean {
  if (password !== ADMIN_PASSWORD) return false;
  try { sessionStorage.setItem(AUTH_KEY, '1'); } catch { /* ignore */ }
  return true;
}

export function logout() {
  try { sessionStorage.removeItem(AUTH_KEY); } catch { /* ignore */ }
}

export function isAuthenticated(): boolean {
  try { return sessionStorage.getItem(AUTH_KEY) === '1'; } catch { return false; }
}
