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
}
