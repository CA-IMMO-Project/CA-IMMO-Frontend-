export type TitleStatus = 'Titre Foncier' | 'Titre en cours' | 'Cadastré';

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
  status: 'disponible' | 'réservé' | 'vendu';
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
