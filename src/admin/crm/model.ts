// Modèle de données du back-office (demandes d'achat, dossiers terrains).
// Stockage local en attendant un vrai backend : métadonnées dans localStorage,
// fichiers (photos, vidéos, documents) dans IndexedDB (voir files.ts).

import { newId } from '../../lib/store';

// ---------- Listes de choix ----------
export const REGIONS = [
  'Analamanga', 'Vakinankaratra', 'Itasy', 'Bongolava', 'Alaotra-Mangoro', 'Analanjirofo', 'Atsinanana',
  'Boeny', 'Betsiboka', 'Melaky', 'Sofia', 'Diana', 'Sava', 'Amoron’i Mania', 'Haute Matsiatra',
  'Vatovavy', 'Fitovinany', 'Atsimo-Atsinanana', 'Ihorombe', 'Menabe', 'Atsimo-Andrefana', 'Androy', 'Anosy',
];
export const COUNTRIES = ['Madagascar', 'France', 'La Réunion', 'Autre'] as const;
export const DIAL_CODES = ['+261', '+33', '+262', '+1', '+44', '+49', '+230'];
export const AGENTS = ['Non assigné', 'Hery Rakoto', 'Fanja Randria', 'Tiana Rabe', 'Mialy Andriam'];
export const SOURCES = ['Site web', 'Téléphone', 'Facebook', 'WhatsApp', 'Agence', 'Recommandation', 'Autre'];
export const PRIORITIES = ['Faible', 'Normale', 'Haute', 'Urgente'] as const;

export const BUY_PAYMENT = ['Paiement comptant – règlement en une fois', 'Facilité de paiement – paiement échelonné'] as const;
export const PROPERTY_TYPES = ['Terrain', 'Maison', 'Appartement', 'Villa', 'Immeuble', 'Local commercial', 'Autre'];
export const BUY_GOALS = ['Résidence principale', 'Investissement', 'Construction', 'Projet commercial', 'Projet professionnel', 'Autre'];
export const BUY_STATUSES = [
  'Nouvelle', 'À contacter', 'Contacté', 'En étude', 'Proposition envoyée', 'Visite programmée',
  'Négociation', 'Validée', 'Achat finalisé', 'Refusée', 'Archivée',
] as const;

export const ID_TYPES = ['CIN', 'Passeport', 'Carte de résident', 'Autre'];
export const LAND_CATEGORIES = ['Terrain nu', 'Terrain bâti', 'Terrain agricole', 'Lotissement', 'Terrain commercial', 'Autre'];
export const RELIEFS = ['Terrain plat', 'Faible dénivelé', 'Pente douce', 'Dénivelé modéré', 'Pente forte', 'Dénivelé important'];
export const ACCESSES = ['Route goudronnée', 'Route pavée', 'Piste carrossable', 'Accès piéton'];
export const YES_NO_NEAR = ['Oui', 'Non', 'À proximité'];
export const OCCUPATIONS = ['Libre', 'Occupé', 'Loué', 'Exploité', 'Autre'];
export const USAGES = ['Résidentiel', 'Commercial', 'Industriel', 'Agricole', 'Hôtelier', 'Lotissement', 'Autre'];
export const DOC_CATEGORIES = [
  'Titre foncier', 'Certificat foncier', 'Plan du terrain', 'Acte de vente', 'Certificat juridique',
  'Certificat de situation juridique', 'Plan cadastral', 'Procuration', 'Autre document',
];
export const DOC_STATUSES = ['À vérifier', 'Vérifié', 'Incomplet', 'Rejeté'] as const;
export const SALE_PAYMENT = ['Comptant – paiement en une fois', 'Facilité – paiement échelonné', 'Les deux – comptant ou facilité'];
export const MAX_DURATIONS = ['0–4 mois', '4–6 mois', '6–10 mois', '10–12 mois', 'Autre durée'];
// [libellé, pourcentage minimum utilisé pour le calcul de l'acompte]
export const DEPOSITS: [string, number][] = [
  ['15–25 %', 15], ['25–35 %', 25], ['35–45 %', 35], ['45–55 %', 45], ['55–65 %', 55], ['65–80 %', 65], ['80–100 %', 80], ['Personnalisé', 0],
];
export const FREQUENCIES = ['Mensuelle', 'Bimestrielle', 'Trimestrielle', 'Personnalisée'];
export const LAND_STATUSES = [
  'Brouillon', 'Nouveau', 'Dossier incomplet', 'À vérifier', 'Vérification terrain programmée', 'Vérification juridique',
  'Validé', 'Publié', 'En négociation', 'Réservé', 'Vendu', 'Rejeté', 'Archivé',
] as const;
export const CHECKLIST = [
  'Identité du propriétaire vérifiée',
  'Documents fonciers complets',
  'Visite terrain effectuée',
  'Limites et bornage confirmés',
  'Situation juridique vérifiée',
  'Prix validé par l’agence',
  'Photos conformes (vue générale, accès, limites)',
];

export type Priority = (typeof PRIORITIES)[number];
export type BuyStatus = (typeof BUY_STATUSES)[number];
export type LandFileStatus = (typeof LAND_STATUSES)[number];
export type DocStatus = (typeof DOC_STATUSES)[number];

// ---------- Types communs ----------
export interface HistoryEntry { id: string; at: string; author: string; text: string }
export interface Note { id: string; at: string; author: string; text: string }
export interface Contact { id: string; at: string; channel: 'Appel' | 'Email' | 'SMS' | 'WhatsApp' | 'Visite' | 'Autre'; summary: string }
export interface Task { id: string; due: string; text: string; done: boolean }

// Action planifiée avec un client (appel, rendez-vous…). Une fois faite, son résultat est versé à l'historique.
export const ACTION_TYPES = ['Appel', 'Rendez-vous', 'Visite du terrain', 'Email', 'WhatsApp / SMS', 'Relance', 'Signature', 'Autre'] as const;
export type ActionType = (typeof ACTION_TYPES)[number];
export interface PlannedAction { id: string; type: ActionType; at: string; note: string; done: boolean; doneAt?: string; result?: string }
// Fichier téléversé : contenu dans IndexedDB (clé = id), ou lien externe (url) pour les données d'exemple.
export interface StoredFile { id: string; name: string; type: string; size: number; url?: string }

export interface Person {
  firstName: string;
  lastName: string;
  dialCode: string;
  phone: string;
  email: string;
  birthDate: string;
  profession: string;
  country: string;
  countryOther: string;
  address: string;
  hasBankAccount: 'Oui' | 'Non' | '';
  bank: string;
}

// ---------- Demande d'achat ----------
export interface BuyRequest extends Person {
  id: string;
  ref: string;
  createdAt: string;
  updatedAt: string;
  source: string;
  paymentMode: string;
  budgetMin: number;
  budgetMax: number;
  deposit: number;
  paymentDuration: string;
  propertyType: string;
  region: string;
  district: string;
  commune: string;
  fokontany: string;
  areaMin: number;
  areaMax: number;
  criteria: string;
  goal: string;
  deadline: string;
  extraInfo: string;
  consent: boolean;
  agent: string;
  priority: Priority;
  status: BuyStatus;
  nextFollowUp: string;
  visitAt: string;
  notes: Note[];
  contacts: Contact[];
  attachments: StoredFile[];
  history: HistoryEntry[];
  clientId?: string; // fiche dans la base clients
  landId: string; // terrain du catalogue que le client veut acheter (obligatoire)
  lotId?: string; // parcelle choisie, si le terrain est loti
  actions: PlannedAction[];
}

// ---------- Dossier terrain ----------
export interface LandDoc extends StoredFile { category: string; number: string; issuedAt: string; ownerName: string; status: DocStatus }

export interface LandFile {
  id: string;
  createdAt: string;
  updatedAt: string;
  // Propriétaire
  ownerId: string;
  owner: Person & { accountNumber: string };
  idDoc: { type: string; number: string; issuedAt: string; expiresAt: string; authority: string; file?: StoredFile };
  // Terrain
  ref: string;
  title: string;
  category: string;
  area: number;
  price: number;
  pricePerM2: number;
  pricePerM2Manual: boolean;
  negotiable: 'Oui' | 'Non';
  description: string;
  relief: string;
  accesses: string[];
  roadWidth: string;
  distanceMainRoad: string;
  water: string;
  electricity: string;
  mobile: 'Oui' | 'Non' | '';
  internet: 'Oui' | 'Non' | '';
  sanitation: string;
  fence: 'Oui' | 'Non' | '';
  building: 'Oui' | 'Non' | '';
  buildingDesc: string;
  occupation: string;
  immediate: 'Oui' | 'Non' | '';
  usage: string;
  // Localisation
  region: string;
  regionOther: string;
  district: string;
  commune: string;
  fokontany: string;
  addressHint: string;
  landmark: string;
  lat?: number;
  lng?: number;
  // Médias
  photos: StoredFile[]; // la première est la photo principale
  video?: StoredFile;
  documents: LandDoc[];
  // Conditions de vente
  salePayment: string;
  maxDuration: string;
  maxDurationOther: string;
  depositRange: string;
  depositCustom: number;
  frequency: string;
  frequencyOther: string;
  saleNegotiable: 'Oui' | 'Non';
  negotiationMargin: string;
  specialConditions: string;
  ownerComments: string;
  // Suivi interne
  agent: string;
  receivedAt: string;
  priority: Priority;
  status: LandFileStatus;
  fieldCheck: string;
  legalCheck: string;
  internalEstimate: number;
  recommendedPrice: number;
  commission: number;
  internalComments: string;
  checklist: string[];
  visitAt: string;
  notes: Note[];
  tasks: Task[];
  history: HistoryEntry[];
  actions: PlannedAction[]; // planification (appels, visites, rendez-vous avec le propriétaire)
  decision?: 'Validé' | 'Refusé'; // décision finale : le dossier part ensuite dans les archives
  decisionReason?: string;
  decidedAt?: string;
}

// ---------- Calculs ----------
export const pricePerM2 = (price: number, area: number) => (area > 0 ? Math.round(price / area) : 0);

export function depositPercent(f: Pick<LandFile, 'depositRange' | 'depositCustom'>) {
  if (f.depositRange === 'Personnalisé') return f.depositCustom || 0;
  return DEPOSITS.find(([l]) => l === f.depositRange)?.[1] ?? 0;
}

export const fullName = (p: Pick<Person, 'firstName' | 'lastName'>) => `${p.firstName} ${p.lastName}`.trim();
export const phoneOf = (p: Pick<Person, 'dialCode' | 'phone'>) => `${p.dialCode} ${p.phone}`.trim();
export const ACTOR = 'Administrateur';

export function historyEntry(text: string): HistoryEntry {
  return { id: newId(), at: new Date().toISOString(), author: ACTOR, text };
}

// ---------- Stockage ----------
const KEYS = { buy: 'caimmo.crm.buy', land: 'caimmo.crm.land', seq: 'caimmo.crm.seq' };

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

function nextRef(prefix: 'ACH' | 'TER') {
  const seq = read<Record<string, number>>(KEYS.seq, {});
  const n = (seq[prefix] ?? 0) + 1;
  write(KEYS.seq, { ...seq, [prefix]: n });
  return `${prefix}-${new Date().getFullYear()}-${String(n).padStart(4, '0')}`;
}

export function getBuyRequests(): BuyRequest[] {
  const stored = read<BuyRequest[] | null>(KEYS.buy, null);
  // Les dossiers enregistrés avant l'ajout du terrain et des actions planifiées sont complétés.
  return stored ? stored.map((r, i) => ({ ...r, clientId: r.clientId ?? `cli-${r.id}`, landId: r.landId ?? String((i % 12) + 1), actions: r.actions ?? [] })) : seedBuy();
}
export function getBuyRequest(id: string) {
  return getBuyRequests().find((r) => r.id === id);
}
export function saveBuyRequest(r: BuyRequest) {
  const all = getBuyRequests();
  const i = all.findIndex((x) => x.id === r.id);
  const item = { ...r, updatedAt: new Date().toISOString() };
  if (i >= 0) all[i] = item; else all.unshift(item);
  write(KEYS.buy, all);
  return item;
}
export function deleteBuyRequest(id: string) {
  write(KEYS.buy, getBuyRequests().filter((r) => r.id !== id));
}

export function getLandFiles(): LandFile[] {
  const stored = read<LandFile[] | null>(KEYS.land, null);
  return stored ? stored.map((f) => ({ ...f, actions: f.actions ?? [] })) : seedLand();
}
export function getLandFile(id: string) {
  return getLandFiles().find((f) => f.id === id);
}
export function saveLandFile(f: LandFile) {
  const all = getLandFiles();
  const i = all.findIndex((x) => x.id === f.id);
  const item = { ...f, updatedAt: new Date().toISOString() };
  if (i >= 0) all[i] = item; else all.unshift(item);
  write(KEYS.land, all);
  return item;
}
export function deleteLandFile(id: string) {
  write(KEYS.land, getLandFiles().filter((f) => f.id !== id));
}

// ---------- Nouveaux dossiers ----------
const emptyPerson = (): Person => ({
  firstName: '', lastName: '', dialCode: '+261', phone: '', email: '', birthDate: '', profession: '',
  country: 'Madagascar', countryOther: '', address: '', hasBankAccount: '', bank: '',
});

export function newBuyRequest(): BuyRequest {
  const now = new Date().toISOString();
  return {
    ...emptyPerson(),
    id: newId(), ref: nextRef('ACH'), createdAt: now, updatedAt: now, source: 'Site web',
    paymentMode: '', budgetMin: 0, budgetMax: 0, deposit: 0, paymentDuration: '', propertyType: 'Terrain',
    region: 'Analamanga', district: '', commune: '', fokontany: '', areaMin: 0, areaMax: 0, criteria: '',
    goal: '', deadline: '', extraInfo: '', consent: false, agent: AGENTS[0], priority: 'Normale', status: 'Nouvelle',
    nextFollowUp: '', visitAt: '', notes: [], contacts: [], attachments: [], history: [historyEntry('Dossier créé')],
    landId: '', actions: [],
  };
}

export function newLandFile(): LandFile {
  const now = new Date().toISOString();
  return {
    id: newId(), createdAt: now, updatedAt: now,
    ownerId: `PROP-${newId().slice(-6).toUpperCase()}`,
    owner: { ...emptyPerson(), accountNumber: '' },
    idDoc: { type: 'CIN', number: '', issuedAt: '', expiresAt: '', authority: '' },
    ref: nextRef('TER'), title: '', category: 'Terrain nu', area: 0, price: 0, pricePerM2: 0, pricePerM2Manual: false,
    negotiable: 'Non', description: '', relief: '', accesses: [], roadWidth: '', distanceMainRoad: '', water: '',
    electricity: '', mobile: '', internet: '', sanitation: '', fence: '', building: '', buildingDesc: '',
    occupation: 'Libre', immediate: '', usage: 'Résidentiel',
    region: 'Analamanga', regionOther: '', district: '', commune: '', fokontany: '', addressHint: '', landmark: '',
    photos: [], documents: [],
    salePayment: '', maxDuration: '', maxDurationOther: '', depositRange: '', depositCustom: 0, frequency: 'Mensuelle',
    frequencyOther: '', saleNegotiable: 'Non', negotiationMargin: '', specialConditions: '', ownerComments: '',
    agent: AGENTS[0], receivedAt: now.slice(0, 10), priority: 'Normale', status: 'Brouillon', fieldCheck: '', legalCheck: '',
    internalEstimate: 0, recommendedPrice: 0, commission: 5, internalComments: '', checklist: [], visitAt: '',
    notes: [], tasks: [], history: [historyEntry('Dossier créé')], actions: [],
  };
}

// ---------- Données fictives ----------
function daysAgo(n: number) {
  return new Date(Date.now() - n * 86400000).toISOString();
}

function seedBuy(): BuyRequest[] {
  const rows: [string, string, string, string, string, number, number, string, string, BuyStatus, Priority, string, number][] = [
    ['Hery', 'Rasoanaivo', '34 12 345 67', 'hery.r@gmail.com', 'Ingénieur', 40_000_000, 80_000_000, 'Analamanga', 'Terrain', 'Nouvelle', 'Haute', BUY_PAYMENT[0], 1],
    ['Claire', 'Dupont', '6 12 34 56 78', 'claire.dupont@orange.fr', 'Médecin', 150_000_000, 300_000_000, 'Analamanga', 'Villa', 'Visite programmée', 'Urgente', BUY_PAYMENT[1], 3],
    ['Njaka', 'Andrianarivo', '33 98 765 43', 'njaka.a@yahoo.fr', 'Commerçant', 20_000_000, 45_000_000, 'Vakinankaratra', 'Terrain', 'Contacté', 'Normale', BUY_PAYMENT[1], 6],
    ['Sophie', 'Payet', '692 45 67 89', 'sophie.payet@gmail.com', 'Enseignante', 60_000_000, 120_000_000, 'Itasy', 'Maison', 'Négociation', 'Haute', BUY_PAYMENT[0], 9],
    ['Tahina', 'Ramanantsoa', '32 11 222 33', 'tahina.r@gmail.com', 'Entrepreneur', 200_000_000, 500_000_000, 'Analamanga', 'Local commercial', 'En étude', 'Normale', BUY_PAYMENT[0], 12],
    ['Voahangy', 'Razafy', '34 55 666 77', 'voahangy.razafy@gmail.com', 'Comptable', 25_000_000, 35_000_000, 'Analamanga', 'Terrain', 'Achat finalisé', 'Faible', BUY_PAYMENT[1], 30],
  ];
  const data = rows.map(([firstName, lastName, phone, email, profession, budgetMin, budgetMax, region, propertyType, status, priority, paymentMode, age], i) => {
    const r = newBuyRequest();
    const dial = email.endsWith('.fr') && region !== 'Vakinankaratra' ? '+33' : lastName === 'Payet' ? '+262' : '+261';
    return {
      ...r,
      firstName, lastName, phone, email, profession, budgetMin, budgetMax, region, propertyType, status, priority, paymentMode,
      dialCode: dial,
      country: dial === '+33' ? 'France' : dial === '+262' ? 'La Réunion' : 'Madagascar',
      birthDate: `19${80 + i}-0${(i % 9) + 1}-15`,
      hasBankAccount: 'Oui' as const,
      bank: ['BNI', 'BOA', 'BFV-SG', 'BMOI'][i % 4],
      deposit: Math.round(budgetMin * 0.3),
      paymentDuration: paymentMode === BUY_PAYMENT[1] ? '12 mois' : '',
      district: region === 'Analamanga' ? 'Antananarivo Avaradrano' : region === 'Itasy' ? 'Arivonimamo' : 'Antsirabe I',
      commune: region === 'Analamanga' ? 'Ivato' : region === 'Itasy' ? 'Arivonimamo' : 'Antsirabe',
      areaMin: 300 + i * 100,
      areaMax: 1000 + i * 300,
      goal: BUY_GOALS[i % BUY_GOALS.length],
      deadline: ['Dans 1 mois', 'Dans 3 mois', 'Dans 6 mois'][i % 3],
      consent: true,
      landId: ['2', '7', '4', '5', '12', '1'][i],
      lotId: ['2-1', '7-1', '4-3', undefined, '12-2', undefined][i],
      actions: status === 'Achat finalisé' ? [] : [{
        id: newId(),
        type: (['Appel', 'Rendez-vous', 'Visite du terrain'] as const)[i % 3],
        at: new Date(Date.now() + (i - 1) * 86400000 + 3600000 * 10).toISOString(),
        note: ['Rappeler pour confirmer le budget', 'Rendez-vous à l’agence pour présenter le terrain', 'Visite sur place avec l’agent'][i % 3],
        done: false,
      }],
      source: SOURCES[i % SOURCES.length],
      agent: AGENTS[(i % 4) + 1],
      createdAt: daysAgo(age),
      updatedAt: daysAgo(Math.max(0, age - 1)),
      nextFollowUp: daysAgo(-2 - i).slice(0, 10),
      notes: i % 2 === 0 ? [{ id: newId(), at: daysAgo(age - 1), author: ACTOR, text: 'Client sérieux, apport déjà disponible.' }] : [],
      contacts: status !== 'Nouvelle' ? [{ id: newId(), at: daysAgo(age - 1), channel: 'Appel' as const, summary: 'Premier appel : besoin confirmé, envoi de propositions.' }] : [],
      history: [
        { id: newId(), at: daysAgo(age), author: ACTOR, text: 'Dossier créé' },
        ...(status !== 'Nouvelle' ? [{ id: newId(), at: daysAgo(age - 1), author: ACTOR, text: `Statut changé : Nouvelle → ${status}` }] : []),
      ],
    };
  });
  write(KEYS.buy, data);
  return data;
}

const SEED_PHOTOS = [
  'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=75',
  'https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=1200&q=75',
  'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1200&q=75',
];

function seedLand(): LandFile[] {
  const rows: [string, string, string, string, number, number, string, string, string, LandFileStatus, Priority, number, number, number][] = [
    ['Rivo', 'Rakotomalala', 'Terrain résidentiel vue dégagée', 'Analamanga', 1200, 54_000_000, 'Antananarivo Atsimondrano', 'Ampitatafika', 'Ankadimbahoaka', 'Publié', 'Normale', -18.9437, 47.5087, 4],
    ['Lalao', 'Randrianasolo', 'Grand terrain à lotir – Ivato', 'Analamanga', 12000, 420_000_000, 'Ambohidratrimo', 'Ivato', 'Ivato Aéroport', 'Vérification juridique', 'Haute', -18.7969, 47.4788, 7],
    ['Jean-Marc', 'Hoarau', 'Terrain agricole fertile', 'Vakinankaratra', 30000, 60_000_000, 'Antsirabe II', 'Vinaninkarena', 'Ambohimena', 'Nouveau', 'Normale', -19.9486, 47.0366, 2],
    ['Fara', 'Rabemananjara', 'Terrain commercial bord de RN1', 'Itasy', 2500, 100_000_000, 'Arivonimamo', 'Arivonimamo', 'Centre', 'En négociation', 'Urgente', -19.0197, 47.1797, 15],
    ['Andry', 'Rakotoarisoa', 'Parcelle plate proche écoles', 'Analamanga', 600, 36_000_000, 'Antananarivo Avaradrano', 'Ambohimangakely', 'Ambohimangakely', 'Dossier incomplet', 'Faible', -18.9011, 47.5892, 1],
  ];
  const data = rows.map(([firstName, lastName, title, region, area, price, district, commune, fokontany, status, priority, lat, lng, age], i) => {
    const f = newLandFile();
    return {
      ...f,
      owner: {
        ...f.owner, firstName, lastName, phone: `34 0${i} 123 45`, email: `${firstName.toLowerCase().replace(/[^a-z]/g, '')}.${lastName.toLowerCase()}@gmail.com`,
        birthDate: `197${i}-05-12`, profession: ['Retraité', 'Commerçante', 'Agriculteur', 'Fonctionnaire', 'Artisan'][i],
        hasBankAccount: 'Oui' as const, bank: 'BNI', accountNumber: '',
        dialCode: lastName === 'Hoarau' ? '+262' : '+261', country: lastName === 'Hoarau' ? 'La Réunion' : 'Madagascar',
      },
      idDoc: { type: 'CIN', number: `10120${i}123456`, issuedAt: '2015-03-10', expiresAt: '', authority: 'Commune urbaine' },
      title, region, area, price, pricePerM2: pricePerM2(price, area), district, commune, fokontany, lat, lng, status, priority,
      category: area >= 10000 ? 'Lotissement' : 'Terrain nu',
      description: 'Terrain bien situé, environnement calme, voisinage résidentiel. Accès facile toute l’année. Idéal pour une construction familiale ou un investissement.',
      relief: RELIEFS[i % 3], accesses: [ACCESSES[i % 3]], roadWidth: '6 m', distanceMainRoad: `${(i + 1) * 200} m`,
      water: YES_NO_NEAR[i % 3], electricity: YES_NO_NEAR[(i + 1) % 3], mobile: 'Oui' as const, internet: i % 2 ? 'Non' as const : 'Oui' as const,
      fence: i % 2 ? 'Non' as const : 'Oui' as const, building: 'Non' as const, immediate: 'Oui' as const,
      usage: area >= 10000 ? (region === 'Vakinankaratra' ? 'Agricole' : 'Lotissement') : 'Résidentiel',
      addressHint: `À 5 min du centre de ${commune}`, landmark: 'Près de l’église / EPP',
      salePayment: SALE_PAYMENT[i % 3], maxDuration: MAX_DURATIONS[i % 4], depositRange: DEPOSITS[i % 5][0], frequency: 'Mensuelle',
      saleNegotiable: i % 2 ? 'Oui' as const : 'Non' as const, negotiationMargin: i % 2 ? '5 %' : '',
      agent: AGENTS[(i % 4) + 1], receivedAt: daysAgo(age).slice(0, 10),
      internalEstimate: Math.round(price * 0.95), recommendedPrice: price, commission: 5,
      checklist: CHECKLIST.slice(0, status === 'Publié' ? 7 : i + 1),
      createdAt: daysAgo(age), updatedAt: daysAgo(Math.max(0, age - 1)),
      photos: SEED_PHOTOS.map((url, k) => ({
        id: newId(), name: ['Vue générale', 'Accès', 'Limites du terrain'][k] + '.jpg', type: 'image/jpeg', size: 0,
        url: url.replace('{i}', String(i)),
      })).slice(i === 4 ? 1 : 0), // le dernier dossier n'a que 2 photos (incomplet)
      tasks: [{ id: newId(), due: daysAgo(-3).slice(0, 10), text: 'Relancer le propriétaire pour le plan cadastral', done: false }],
      history: [
        { id: newId(), at: daysAgo(age), author: ACTOR, text: 'Dossier créé' },
        { id: newId(), at: daysAgo(Math.max(0, age - 1)), author: ACTOR, text: `Statut changé : Nouveau → ${status}` },
      ],
    };
  });
  write(KEYS.land, data);
  return data;
}

/** Crée une demande d'achat à partir d'une réservation faite sur le site public. */
export function createBuyRequestFromSite(p: {
  fullName: string; phone: string; email?: string; budget?: string; profession?: string; age?: number;
  nationality?: string; message?: string; landId?: string; lotId?: string; bankAccount?: string; clientId?: string;
}) {
  const [firstName, ...rest] = p.fullName.trim().split(/\s+/);
  const foreign = p.nationality && !/malgache|madagascar/i.test(p.nationality);
  const r = newBuyRequest();
  return saveBuyRequest({
    ...r,
    firstName, lastName: rest.join(' '), phone: p.phone, email: p.email ?? '', profession: p.profession ?? '',
    country: foreign ? 'Autre' : 'Madagascar', countryOther: foreign ? p.nationality! : '',
    hasBankAccount: p.bankAccount ? (/^non/i.test(p.bankAccount) ? 'Non' : 'Oui') : '',
    extraInfo: [p.budget && `Budget indiqué : ${p.budget}`, p.age && `Âge : ${p.age}`, p.message].filter(Boolean).join('\n'),
    clientId: p.clientId, landId: p.landId ?? '', lotId: p.lotId, source: 'Site web', consent: true, status: 'Nouvelle', priority: 'Haute',
    history: [historyEntry('Réservation reçue depuis le site web')],
    actions: [{ id: newId(), type: 'Appel', at: new Date(Date.now() + 3600000).toISOString(), note: 'Premier appel suite à la réservation en ligne', done: false }],
  });
}

// ---------- Actions fictives pour l'agenda (ajoutées une seule fois) ----------
const AGENDA_SEED_KEY = 'caimmo.crm.agendaSeeded';

/** Ajoute des actions d'exemple aux dossiers existants : en retard, aujourd'hui, à venir et déjà faites. */
export function seedAgendaOnce() {
  if (read<boolean>(AGENDA_SEED_KEY, false)) return;
  const at = (days: number, hour: number, min = 0) => {
    const d = new Date();
    d.setDate(d.getDate() + days);
    d.setHours(hour, min, 0, 0);
    return d.toISOString();
  };
  const act = (type: ActionType, when: string, note: string, result?: string): PlannedAction =>
    ({ id: newId(), type, at: when, note, done: Boolean(result), doneAt: result ? when : undefined, result });

  // [jour relatif, heure, minute, type, objet, compte rendu si déjà fait]
  const buyPlan: [number, number, number, ActionType, string, string?][][] = [
    [[0, 9, 30, 'Appel', 'Confirmer le budget et l’apport disponible'], [2, 10, 0, 'Visite du terrain', 'Visite de la parcelle avec l’agent'], [-3, 15, 0, 'Appel', 'Premier contact', 'Client très intéressé, souhaite visiter rapidement.']],
    [[0, 14, 0, 'Rendez-vous', 'Rendez-vous à l’agence : présentation des conditions de paiement'], [5, 11, 0, 'Signature', 'Signature du compromis chez le notaire'], [-6, 10, 0, 'Visite du terrain', 'Visite sur place', 'Visite effectuée, le terrain plaît. Attente de l’accord du conjoint.']],
    [[-1, 16, 0, 'Relance', 'Relancer pour la réponse sur la proposition'], [1, 9, 0, 'WhatsApp / SMS', 'Envoyer les photos des parcelles disponibles']],
    [[1, 15, 30, 'Visite du terrain', 'Deuxième visite avec la famille'], [-2, 11, 0, 'Email', 'Envoi du plan et du titre foncier', 'Documents envoyés, bien reçus par le client.']],
    [[3, 10, 30, 'Appel', 'Point sur le financement bancaire'], [-4, 9, 0, 'Rendez-vous', 'Rencontre à l’agence', 'Projet de construction confirmé, budget validé.']],
    [[-2, 14, 30, 'Appel', 'Rappeler : pas de réponse la dernière fois']],
  ];
  const buy = getBuyRequests();
  buy.forEach((r, i) => {
    const plan = buyPlan[i % buyPlan.length];
    if (r.status === 'Achat finalisé' || r.status === 'Archivée') return;
    const added = plan.map(([d, h, m, type, note, result]) => act(type, at(d, h, m), note, result));
    saveBuyRequest({ ...r, actions: [...r.actions, ...added], history: [...r.history, ...added.map((a) => historyEntry(`${a.type} planifié(e) le ${new Date(a.at).toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short' })}${a.result ? ` — fait : ${a.result}` : ''}`))] });
  });

  const sellPlan: [number, number, number, ActionType, string, string?][][] = [
    [[0, 11, 0, 'Visite du terrain', 'Vérification terrain : bornage et accès'], [4, 14, 0, 'Rendez-vous', 'Rendez-vous avec le propriétaire pour les documents']],
    [[1, 8, 30, 'Visite du terrain', 'Visite de contrôle avec le géomètre'], [-1, 10, 0, 'Appel', 'Demander le plan cadastral manquant']],
    [[2, 16, 0, 'Appel', 'Négociation du prix avec le propriétaire'], [-5, 9, 30, 'Visite du terrain', 'Première visite', 'Terrain conforme aux photos, accès facile.']],
    [[6, 10, 0, 'Signature', 'Signature du mandat de vente']],
  ];
  getLandFiles().forEach((f, i) => {
    if (f.status === 'Archivé') return;
    const added = sellPlan[i % sellPlan.length].map(([d, h, m, type, note, result]) => act(type, at(d, h, m), note, result));
    saveLandFile({ ...f, actions: [...(f.actions ?? []), ...added], history: [...f.history, ...added.map((a) => historyEntry(`${a.type} planifié(e) avec le propriétaire${a.result ? ` — fait : ${a.result}` : ''}`))] });
  });
  write(AGENDA_SEED_KEY, true);
}
