import { Land } from '../types';
import { getLands, addReservation, addMessage } from './store';
import { normalizeLand, paymentAllows, pricePerSqm } from './land';
import { createBuyRequestFromSite } from '../admin/crm/model';
import { SearchFields, createSearch, findOrCreateClient } from '../admin/crm/people';

const USAGE_KEYWORDS: Record<string, string[]> = {
  residentiel: ['résidentiel', 'résidence', 'villa', 'famille'],
  agricole: ['agricole', 'agriculture', 'fertile', 'culture'],
  commercial: ['commercial', 'commerce', 'boutique'],
  touristique: ['touristique', 'tourisme', 'hôtelier', 'plage', 'vue mer', 'bord de mer'],
};

export type LandSort = 'recent' | 'priceAsc' | 'priceDesc' | 'area';

export interface LandFilters {
  q?: string;
  region?: string;
  zone?: string;
  minPrice?: number;
  maxPrice?: number;
  minArea?: number;
  maxArea?: number;
  maxPricePerSqm?: number;
  relief?: string;
  payment?: 'comptant' | 'facilite';
  verifiedOnly?: boolean;
  availableOnly?: boolean;
  usage?: string;
  titleStatus?: string;
  sort?: LandSort;
}

export async function fetchLands(filters: LandFilters = {}): Promise<Land[]> {
  const q = filters.q?.toLowerCase();
  const keywords = filters.usage ? USAGE_KEYWORDS[filters.usage] : undefined;

  const results = getLands().filter((raw) => {
    const land = normalizeLand(raw);
    if (q && !land.title.toLowerCase().includes(q) && !land.location.toLowerCase().includes(q)) return false;
    if (filters.region && land.region !== filters.region) return false;
    if (filters.zone && land.zone !== filters.zone) return false;
    if (filters.minPrice && land.price < filters.minPrice) return false;
    if (filters.maxPrice && land.price > filters.maxPrice) return false;
    if (filters.minArea && land.area < filters.minArea) return false;
    if (filters.maxArea && land.area > filters.maxArea) return false;
    if (filters.maxPricePerSqm && pricePerSqm(land) > filters.maxPricePerSqm) return false;
    if (filters.relief && land.relief !== filters.relief) return false;
    if (filters.payment && !paymentAllows(land.paymentMode, filters.payment)) return false;
    if (filters.verifiedOnly && !land.verified) return false;
    if (filters.availableOnly && land.status !== 'disponible') return false;
    if (filters.titleStatus && land.titleStatus !== filters.titleStatus) return false;
    if (keywords) {
      const text = `${land.title} ${land.description}`.toLowerCase();
      if (!keywords.some((k) => text.includes(k))) return false;
    }
    return true;
  });

  const sorted = [...results];
  switch (filters.sort) {
    case 'priceAsc':
      sorted.sort((a, b) => a.price - b.price);
      break;
    case 'priceDesc':
      sorted.sort((a, b) => b.price - a.price);
      break;
    case 'area':
      sorted.sort((a, b) => b.area - a.area);
      break;
    default:
      // « Plus récents » : les biens mis en avant d'abord, puis par référence.
      sorted.sort((a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)) || b.id.localeCompare(a.id));
  }
  return sorted;
}

export async function fetchLand(id: string): Promise<Land | undefined> {
  return getLands().find((land) => land.id === id);
}

export async function fetchRegions(): Promise<string[]> {
  return [...new Set(getLands().map((land) => land.region))].sort();
}

export async function fetchZones(): Promise<string[]> {
  return [...new Set(getLands().map((land) => normalizeLand(land).zone))].sort();
}

export type RequestKind = 'interet' | 'visite' | 'projet' | 'recherche' | 'vente';

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
  landId?: string;
  lotId?: string;
  projectName?: string;
  userId?: string;
  /** Référence affichée au client (ACH/VIS/REC/VEN-YYMMDD) — mémorisée pour l'espace client. */
  ref?: string;
  kind?: RequestKind;
  paymentMode?: string;
  duration?: string;
  downPaymentAmount?: string;
  visitDate?: string;
  visitTime?: string;
}

// Pas de backend : les demandes sont stockées localement et visibles dans le backoffice.
export async function createReservation(payload: ReservationPayload): Promise<void> {
  addReservation(payload);
  // Le client est ajouté la base clients, et un dossier « Demande d'achat » est ouvert.
  const client = findOrCreateClient({
    fullName: payload.fullName, phone: payload.phone, email: payload.email ?? '', budget: payload.budget ?? '',
    profession: payload.profession ?? '', age: payload.age ? String(payload.age) : '', nationality: payload.nationality ?? '',
    bankAccount: payload.bankAccount ?? '', message: payload.message ?? '',
  }, 'Site web');
  if (payload.landId) createBuyRequestFromSite({ ...payload, clientId: client.id });
}

export async function createSpecificSearch(fields: SearchFields): Promise<void> {
  createSearch(fields, 'Site web');
}

export interface ContactPayload {
  firstName: string;
  lastName: string;
  phone: string;
  email?: string;
  subject?: string;
  message: string;
  userId?: string;
}

export async function createContactMessage(payload: ContactPayload): Promise<void> {
  addMessage(payload);
}
