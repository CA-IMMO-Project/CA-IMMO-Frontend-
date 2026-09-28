// Base clients, recherches de terrain spécifiques et réalisations.
// Stockage local (navigateur) en attendant un vrai backend.
import { newId } from '../../lib/store';
import { HistoryEntry, StoredFile, getBuyRequests, historyEntry } from './model';

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}
function write(key: string, value: unknown) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* stockage indisponible */ }
}
function upsert<T extends { id: string }>(key: string, all: T[], item: T) {
  const i = all.findIndex((x) => x.id === item.id);
  if (i >= 0) all[i] = item; else all.unshift(item);
  write(key, all);
  return item;
}

const KEYS = { clients: 'caimmo.crm.clients', searches: 'caimmo.crm.searches', realisations: 'caimmo.crm.realisations', seq: 'caimmo.crm.seq2' };

function nextRef(prefix: string) {
  const seq = read<Record<string, number>>(KEYS.seq, {});
  const n = (seq[prefix] ?? 0) + 1;
  write(KEYS.seq, { ...seq, [prefix]: n });
  return `${prefix}-${new Date().getFullYear()}-${String(n).padStart(4, '0')}`;
}

// ======================= CLIENTS =======================
// Mêmes champs que le formulaire de réservation du site.
export interface Client {
  id: string;
  ref: string;
  createdAt: string;
  source: 'Site web' | 'Backoffice';
  fullName: string;
  phone: string;
  email: string;
  budget: string;
  profession: string;
  age: string;
  nationality: string;
  bankAccount: string;
  message: string;
}

export type ClientFields = Omit<Client, 'id' | 'ref' | 'createdAt' | 'source'>;
export const emptyClientFields = (): ClientFields => ({
  fullName: '', phone: '', email: '', budget: '', profession: '', age: '', nationality: '', bankAccount: '', message: '',
});

export function getClients(): Client[] {
  const stored = read<Client[] | null>(KEYS.clients, null);
  if (stored) return stored;
  // Première ouverture : la base est constituée à partir des demandes d'achat existantes.
  const clients: Client[] = getBuyRequests().map((r, i) => ({
    id: `cli-${r.id}`,
    ref: `CLI-${new Date(r.createdAt).getFullYear()}-${String(i + 1).padStart(4, '0')}`,
    createdAt: r.createdAt,
    source: r.source === 'Site web' ? 'Site web' : 'Backoffice',
    fullName: `${r.firstName} ${r.lastName}`.trim(),
    phone: `${r.dialCode} ${r.phone}`.trim(),
    email: r.email,
    budget: r.budgetMax ? String(r.budgetMax) : '',
    profession: r.profession,
    age: '',
    nationality: r.country === 'Madagascar' ? 'Malgache' : r.country === 'Autre' ? r.countryOther : r.country,
    bankAccount: r.hasBankAccount === 'Oui' ? r.bank || 'Oui' : r.hasBankAccount,
    message: '',
  }));
  write(KEYS.clients, clients);
  write(KEYS.seq, { ...read<Record<string, number>>(KEYS.seq, {}), CLI: clients.length });
  return clients;
}
export const getClient = (id: string) => getClients().find((c) => c.id === id);

export function createClient(fields: ClientFields, source: Client['source']): Client {
  const c: Client = { ...fields, id: newId(), ref: nextRef('CLI'), createdAt: new Date().toISOString(), source };
  return upsert(KEYS.clients, getClients(), c);
}
export function saveClient(c: Client) {
  return upsert(KEYS.clients, getClients(), c);
}
export function deleteClient(id: string) {
  write(KEYS.clients, getClients().filter((c) => c.id !== id));
}

/** Retrouve un client par téléphone (ou email) pour éviter les doublons lors d'une nouvelle demande sur le site. */
export function findOrCreateClient(fields: ClientFields, source: Client['source']): Client {
  const digits = (s: string) => s.replace(/\D/g, '').slice(-9);
  const existing = getClients().find(
    (c) => (fields.phone && digits(c.phone) === digits(fields.phone)) || (fields.email && c.email && c.email.toLowerCase() === fields.email.toLowerCase()),
  );
  if (!existing) return createClient(fields, source);
  // Complète les champs vides avec les nouvelles informations
  const merged = { ...existing };
  (Object.keys(fields) as (keyof ClientFields)[]).forEach((k) => { if (!merged[k] && fields[k]) merged[k] = fields[k]; });
  return saveClient(merged);
}

/** Découpe « Prénom Nom » pour les dossiers d'achat. */
export function splitName(fullName: string) {
  const [firstName = '', ...rest] = fullName.trim().split(/\s+/);
  return { firstName, lastName: rest.join(' ') };
}

// ======================= RECHERCHES SPÉCIFIQUES =======================
export const SEARCH_STATUSES = ['Nouvelle', 'En recherche', 'Terrains proposés', 'Visite programmée', 'Trouvé', 'Clôturée'] as const;
export const SEARCH_USAGES = ['Habitation', 'Investissement', 'Commerce', 'Agriculture', 'Hôtellerie / tourisme', 'Autre'];
export const RADIUS_OPTIONS = [1, 2, 5, 10, 20, 50];
export type SearchStatus = (typeof SEARCH_STATUSES)[number];

export interface Proposal { id: string; landId: string; lotId?: string; at: string; note: string; answer: 'En attente' | 'Intéressé' | 'Pas intéressé' | 'Visite demandée' }

export interface SpecificSearch {
  id: string;
  ref: string;
  createdAt: string;
  source: 'Site web' | 'Backoffice';
  clientId: string;
  // Coordonnées (copiées pour l'affichage même si le client est supprimé)
  fullName: string;
  phone: string;
  email: string;
  // Besoin
  usage: string;
  budgetMax: number;
  areaMin: number;
  areaMax: number;
  // Localisation
  mainZone: string; // Zone principale recherchée
  otherZones: string; // Autres zones acceptées
  targetZone: string; // Zone ciblée (quartier, repère…)
  lat?: number;
  lng?: number;
  radiusKm: number; // Rayon suggéré
  flexible: 'Oui' | 'Non'; // Êtes-vous flexible sur la localisation ?
  suggestNearby: boolean; // Proposez-moi les zones proches
  criteria: string;
  // Suivi
  status: SearchStatus;
  proposals: Proposal[];
  history: HistoryEntry[];
}

export type SearchFields = Omit<SpecificSearch, 'id' | 'ref' | 'createdAt' | 'clientId' | 'status' | 'proposals' | 'history' | 'source'>;
export const emptySearchFields = (): SearchFields => ({
  fullName: '', phone: '', email: '', usage: 'Habitation', budgetMax: 0, areaMin: 0, areaMax: 0,
  mainZone: '', otherZones: '', targetZone: '', radiusKm: 5, flexible: 'Oui', suggestNearby: true, criteria: '',
});

export function getSearches(): SpecificSearch[] {
  const stored = read<SpecificSearch[] | null>(KEYS.searches, null);
  if (stored) return stored;
  const clients = getClients();
  const demo: [string, string, string, number, number, number, number, number, 'Oui' | 'Non', SearchStatus][] = [
    ['Ivato, Antananarivo', 'Ambohidratrimo, Talatamaty', 'Près de l’aéroport', -18.7969, 47.4788, 5, 60_000_000, 500, 'Oui', 'Terrains proposés'],
    ['Antsirabe', 'Vinaninkarena', 'Centre-ville', -19.8659, 47.0333, 10, 30_000_000, 1000, 'Non', 'Nouvelle'],
  ];
  const data = demo.map(([mainZone, otherZones, targetZone, lat, lng, radiusKm, budgetMax, areaMin, flexible, status], i) => {
    const c = clients[i];
    return {
      ...emptySearchFields(),
      id: newId(), ref: nextRef('REC'), createdAt: new Date(Date.now() - (i + 2) * 86400000).toISOString(), source: 'Site web' as const,
      clientId: c?.id ?? '', fullName: c?.fullName ?? 'Client démo', phone: c?.phone ?? '', email: c?.email ?? '',
      mainZone, otherZones, targetZone, lat, lng, radiusKm, budgetMax, areaMin, areaMax: areaMin * 2, flexible, suggestNearby: flexible === 'Oui',
      criteria: 'Terrain plat, accessible en voiture, titre foncier.', status,
      proposals: status === 'Terrains proposés' ? [{ id: newId(), landId: '1', at: new Date().toISOString(), note: 'Correspond au budget et à la zone', answer: 'Intéressé' as const }] : [],
      history: [historyEntry('Recherche reçue depuis le site web')],
    };
  });
  write(KEYS.searches, data);
  return data;
}
export const getSearch = (id: string) => getSearches().find((s) => s.id === id);
export const saveSearch = (s: SpecificSearch) => upsert(KEYS.searches, getSearches(), s);
export const deleteSearch = (id: string) => write(KEYS.searches, getSearches().filter((s) => s.id !== id));

export function createSearch(fields: SearchFields, source: SpecificSearch['source'], clientFields?: Partial<ClientFields>): SpecificSearch {
  const client = findOrCreateClient(
    { ...emptyClientFields(), fullName: fields.fullName, phone: fields.phone, email: fields.email, budget: fields.budgetMax ? String(fields.budgetMax) : '', ...clientFields },
    source,
  );
  return saveSearch({
    ...fields, id: newId(), ref: nextRef('REC'), createdAt: new Date().toISOString(), source, clientId: client.id,
    status: 'Nouvelle', proposals: [],
    history: [historyEntry(source === 'Site web' ? 'Recherche reçue depuis le site web' : 'Recherche créée dans le backoffice')],
  });
}

// ======================= RÉALISATIONS =======================
export const REALISATION_CATEGORIES = ['Construction de maison', 'Villa', 'Immeuble', 'Lotissement', 'Aménagement de terrain', 'Rénovation', 'Local commercial', 'Autre'];

export interface Realisation {
  id: string;
  createdAt: string;
  updatedAt: string;
  title: string;
  category: string;
  location: string;
  completedAt: string; // AAAA-MM
  client: string; // nom affiché (facultatif)
  area: number;
  duration: string;
  description: string;
  photos: StoredFile[]; // la première est la photo de couverture
  published: boolean;
  featured: boolean;
}

export function getRealisations(): Realisation[] {
  const stored = read<Realisation[] | null>(KEYS.realisations, null);
  if (stored) return stored;
  const img = (id: string, name: string): StoredFile => ({ id: newId(), name, type: 'image/jpeg', size: 0, url: `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1400&q=75` });
  const now = new Date().toISOString();
  const data: Realisation[] = [
    {
      id: newId(), createdAt: now, updatedAt: now, title: 'Villa familiale R+1 à Ivato', category: 'Villa', location: 'Ivato, Antananarivo',
      completedAt: '2025-11', client: 'Famille R.', area: 220, duration: '9 mois',
      description: 'Construction clé en main d’une villa de 4 chambres sur un terrain de 600 m² acquis auprès de CA IMMO : gros œuvre, finitions, clôture et portail.',
      photos: [img('photo-1600596542815-ffad4c1539a9', 'facade.jpg'), img('photo-1600585154340-be6161a56a0c', 'jardin.jpg')], published: true, featured: true,
    },
    {
      id: newId(), createdAt: now, updatedAt: now, title: 'Lotissement « Les Jacarandas »', category: 'Lotissement', location: 'Ambohidratrimo',
      completedAt: '2025-06', client: '', area: 12000, duration: '6 mois',
      description: 'Viabilisation et bornage de 24 parcelles : voies d’accès, adduction d’eau, raccordement électrique et titres individuels.',
      photos: [img('photo-1500382017468-9049fed747ef', 'vue.jpg')], published: true, featured: false,
    },
    {
      id: newId(), createdAt: now, updatedAt: now, title: 'Maison plain-pied à Antsirabe', category: 'Construction de maison', location: 'Antsirabe',
      completedAt: '2026-02', client: '', area: 110, duration: '5 mois',
      description: 'Maison de 3 chambres en briques avec toiture en tuiles, adaptée au climat des Hautes Terres.',
      photos: [img('photo-1600607687939-ce8a6c25118c', 'maison.jpg')], published: false, featured: false,
    },
  ];
  write(KEYS.realisations, data);
  return data;
}
export const saveRealisation = (r: Realisation) => upsert(KEYS.realisations, getRealisations(), { ...r, updatedAt: new Date().toISOString() });
export const deleteRealisation = (id: string) => write(KEYS.realisations, getRealisations().filter((r) => r.id !== id));
export const newRealisation = (): Realisation => {
  const now = new Date().toISOString();
  return {
    id: newId(), createdAt: now, updatedAt: now, title: '', category: REALISATION_CATEGORIES[0], location: '', completedAt: now.slice(0, 7),
    client: '', area: 0, duration: '', description: '', photos: [], published: false, featured: false,
  };
};
