export type TitleStatus = 'Titre Foncier' | 'Titre en cours' | 'Cadastré';
export type Relief = 'Plat' | 'Pente douce' | 'Pente forte';
export type PaymentMode = 'comptant' | 'facilite' | 'comptant-ou-facilite';
export type LandStatus = 'disponible' | 'réservé' | 'vendu';

export interface Land {
  id: string;
  title: string;
  location: string;
  region: string;
  price: number; // in Ariary (Ar)
  imageUrl: string;
  description: string;
  features: string[];
  area: number; // in m²
  titleStatus: TitleStatus;
  status: LandStatus;

  /* --- Enrichissements « fiche terrain » -------------------------------
     Optionnels : le backoffice peut créer un terrain minimal,
     `normalizeLand()` (lib/land.ts) complète les valeurs manquantes. */
  zone?: string;
  gallery?: string[];
  /** Coordonnées GPS [latitude, longitude] — utilisées par la carte et le backoffice. */
  coordinates?: [number, number];
  relief?: Relief;
  access?: string;
  water?: boolean;
  electricity?: boolean;
  documents?: string[];
  payment?: string;
  paymentMode?: PaymentMode;
  downPayment?: string;
  installments?: string;
  verified?: boolean;
  featured?: boolean;

  /* --- Lotissement / ventes (backoffice du dépôt principal) ----------- */
  lots?: Lot[]; // lotissement
  sales?: Sale[]; // historique des ventes (terrain entier ou parcelles)
}

export interface Sale {
  id: string;
  date: string; // AAAA-MM-JJ
  lotId?: string; // absent = terrain entier
  price: number;
  paymentMode: string;
  buyer: { firstName: string; lastName: string; phone: string; email: string; address: string; idNumber: string };
  notes: string;
  buyRequestId: string; // dossier client (demande d'achat) qui garde l'historique
}

export interface Lot {
  id: string;
  number: string; // ex : "Lot 12"
  area: number; // in m²
  price: number; // in Ariary (Ar)
  status: Land['status'];
  imageUrl?: string;
  details?: string;
  history?: { id: string; at: string; author: string; text: string }[]; // historique de la parcelle
}
