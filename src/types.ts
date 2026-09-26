export type TitleStatus = 'Titre Foncier' | 'Titre en cours' | 'Cadastré';
export type Relief = 'Plat' | 'Pente douce' | 'Pente forte';
export type PaymentMode = 'comptant' | 'facilite' | 'comptant-ou-facilite';
export type LandStatus = 'disponible' | 'réservé' | 'vendu';

export interface Land {
  id: string;
  title: string;
  description: string;
  price: number; // in Ariary (Ar)
  region: string;
  location: string;
  coordinates?: [number, number]; // [latitude, longitude]
  imageUrl: string;
  features: string[];
  area: number; // in m²
  titleStatus: TitleStatus;
  status: LandStatus;

  /* --- Enrichissements « fiche terrain » -------------------------------
     Optionnels : le backoffice peut créer un terrain minimal,
     `normalizeLand()` (lib/land.ts) complète les valeurs manquantes. */
  zone?: string;
  gallery?: string[];
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
}
