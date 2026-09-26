import { useEffect, useState } from 'react';
import { Land, PaymentMode, Relief } from '../types';

/** Terrain dont les champs « fiche » sont garantis présents. */
export interface LandComplete extends Land {
  zone: string;
  gallery: string[];
  relief: Relief;
  access: string;
  water: boolean;
  electricity: boolean;
  documents: string[];
  payment: string;
  paymentMode: PaymentMode;
  downPayment: string;
  installments: string;
  verified: boolean;
}

/** Complète un terrain (utile pour les biens créés via le backoffice). */
export function normalizeLand(land: Land): LandComplete {
  return {
    ...land,
    zone: land.zone ?? land.location.split(',')[0].trim(),
    gallery: land.gallery?.length ? land.gallery : [land.imageUrl].filter(Boolean),
    relief: land.relief ?? 'Plat',
    access: land.access ?? 'Accès par route',
    water: land.water ?? false,
    electricity: land.electricity ?? false,
    documents: land.documents ?? [land.titleStatus],
    payment: land.payment ?? 'Comptant',
    paymentMode: land.paymentMode ?? 'comptant',
    downPayment: land.downPayment ?? 'Selon accord',
    installments: land.installments ?? 'Non disponible',
    verified: land.verified ?? land.titleStatus === 'Titre Foncier',
  };
}

export function pricePerSqm(land: Land): number {
  return land.area > 0 ? Math.round(land.price / land.area) : 0;
}

export function landReference(land: Land): string {
  return `CAI-${land.id.toString().padStart(4, '0')}`;
}

export function paymentAllows(mode: PaymentMode, want: 'comptant' | 'facilite'): boolean {
  return mode === want || mode === 'comptant-ou-facilite';
}

/* --- Favoris (stockage local, réutilisés par l'espace client) --- */

const FAVORITES_KEY = 'caimmo.favorites';

export function getFavorites(): string[] {
  try {
    const raw = localStorage.getItem(FAVORITES_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

const FAVORITES_EVENT = 'caimmo:favorites';

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>(() => getFavorites());

  useEffect(() => {
    const sync = () => setFavorites(getFavorites());
    window.addEventListener(FAVORITES_EVENT, sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener(FAVORITES_EVENT, sync);
      window.removeEventListener('storage', sync);
    };
  }, []);

  const toggleFavorite = (id: string) => {
    const current = getFavorites();
    const next = current.includes(id) ? current.filter((x) => x !== id) : [...current, id];
    try {
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(next));
    } catch {
      /* stockage indisponible */
    }
    window.dispatchEvent(new Event(FAVORITES_EVENT));
  };

  return {
    favorites,
    isFavorite: (id: string) => favorites.includes(id),
    toggleFavorite,
  };
}
