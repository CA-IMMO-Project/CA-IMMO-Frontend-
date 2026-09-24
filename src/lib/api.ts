import { Land } from '../types';
import { LANDS } from '../data/lands';

const USAGE_KEYWORDS: Record<string, string[]> = {
  residentiel: ['résidentiel', 'résidence', 'villa', 'famille'],
  agricole: ['agricole', 'agriculture', 'fertile', 'culture'],
  commercial: ['commercial', 'commerce', 'boutique'],
  touristique: ['touristique', 'tourisme', 'hôtelier', 'plage', 'vue mer', 'bord de mer'],
};

export interface LandFilters {
  q?: string;
  region?: string;
  maxPrice?: number;
  minArea?: number;
  usage?: string;
  titleStatus?: string;
}

export async function fetchLands(filters: LandFilters = {}): Promise<Land[]> {
  const q = filters.q?.toLowerCase();
  const keywords = filters.usage ? USAGE_KEYWORDS[filters.usage] : undefined;

  return LANDS.filter((land) => {
    if (q && !land.title.toLowerCase().includes(q) && !land.location.toLowerCase().includes(q)) return false;
    if (filters.region && land.region !== filters.region) return false;
    if (filters.maxPrice && land.price > filters.maxPrice) return false;
    if (filters.minArea && land.area < filters.minArea) return false;
    if (filters.titleStatus && land.titleStatus !== filters.titleStatus) return false;
    if (keywords) {
      const text = `${land.title} ${land.description}`.toLowerCase();
      if (!keywords.some((k) => text.includes(k))) return false;
    }
    return true;
  });
}

export async function fetchRegions(): Promise<string[]> {
  return [...new Set(LANDS.map((land) => land.region))].sort();
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

// Pas de backend : les demandes ne sont envoyées nulle part pour l'instant.
export async function createReservation(_payload: ReservationPayload): Promise<void> {}

export interface ContactPayload {
  firstName: string;
  lastName: string;
  phone: string;
  email?: string;
  subject?: string;
  message: string;
}

export async function createContactMessage(_payload: ContactPayload): Promise<void> {}
