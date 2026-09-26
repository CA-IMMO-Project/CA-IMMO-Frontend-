import { useEffect, useState } from 'react';
import { Land, PaymentMode, Relief } from '../types';
import { useAuth } from './auth';

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

/* --- Favoris (stockage local, par compte connecté) -----------------------
   Réservés aux comptes : le cœur n'est proposé nulle part tant qu'aucun
   utilisateur n'est connecté. Chaque compte possède sa propre liste. */

const FAVORITES_KEY = 'caimmo.favorites'; // ancienne clé globale (avant les comptes)
const favoritesKey = (userId: string) => `caimmo.favorites:${userId}`;

const FAVORITES_EVENT = 'caimmo:favorites';

/**
 * Favoris d'un compte. Migration unique : l'ancienne liste globale (avant
   les comptes) est adoptée par le premier compte qui se connecte.
 */
export function getFavorites(userId: string): string[] {
  try {
    const raw = localStorage.getItem(favoritesKey(userId));
    if (raw) return JSON.parse(raw) as string[];
    const legacy = localStorage.getItem(FAVORITES_KEY);
    if (legacy) {
      localStorage.setItem(favoritesKey(userId), legacy);
      localStorage.removeItem(FAVORITES_KEY);
      return JSON.parse(legacy) as string[];
    }
  } catch {
    /* stockage indisponible */
  }
  return [];
}

export function useFavorites() {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<string[]>(() => (user ? getFavorites(user.id) : []));

  useEffect(() => {
    setFavorites(user ? getFavorites(user.id) : []);
  }, [user]);

  useEffect(() => {
    const sync = () => setFavorites(user ? getFavorites(user.id) : []);
    window.addEventListener(FAVORITES_EVENT, sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener(FAVORITES_EVENT, sync);
      window.removeEventListener('storage', sync);
    };
  }, [user]);

  const toggleFavorite = (id: string) => {
    if (!user) return; // favoris réservés aux comptes connectés
    const current = getFavorites(user.id);
    const next = current.includes(id) ? current.filter((x) => x !== id) : [...current, id];
    try {
      localStorage.setItem(favoritesKey(user.id), JSON.stringify(next));
    } catch {
      /* stockage indisponible */
    }
    window.dispatchEvent(new Event(FAVORITES_EVENT));
  };

  return {
    favorites,
    isFavorite: (id: string) => favorites.includes(id),
    toggleFavorite,
    /** false tant qu'aucun compte n'est connecté : le cœur n'est pas affiché. */
    enabled: Boolean(user),
  };
}
