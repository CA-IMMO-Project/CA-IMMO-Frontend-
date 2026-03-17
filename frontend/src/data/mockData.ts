import { Property } from '../types';

const generateProperties = (count: number, base: Property): Property[] => {
  return Array.from({ length: count }).map((_, i) => ({
    ...base,
    id: `${base.id}-${i}`,
    title: `${base.title} ${i > 0 ? `(Lot ${i + 1})` : ''}`,
    price: base.price + (i * 15000),
    coordinates: base.coordinates ? [
      base.coordinates[0] + (Math.random() * 0.02 - 0.01),
      base.coordinates[1] + (Math.random() * 0.02 - 0.01)
    ] : undefined
  }));
};

const baseHouse: Property = {
  id: 'h',
  title: 'Villa Moderne avec Vue Mer',
  description: 'Magnifique villa contemporaine offrant une vue panoramique sur la mer. Finitions haut de gamme, piscine à débordement et jardin paysager.',
  price: 1250000,
  location: 'Cannes, France',
  coordinates: [43.5528, 7.0174],
  type: 'house',
  imageUrl: 'https://images.unsplash.com/photo-1613490900233-141c51fa6f59?auto=format&fit=crop&w=1000&q=80',
  features: ['Piscine', 'Vue Mer', 'Garage', 'Climatisation'],
  bedrooms: 4,
  bathrooms: 3,
  area: 250,
  status: 'for_sale'
};

const baseApt: Property = {
  id: 'a',
  title: 'Appartement Haussmannien',
  description: 'Superbe appartement de réception dans un bel immeuble en pierre de taille. Parquet point de Hongrie, moulures et cheminées.',
  price: 850000,
  location: 'Paris 8ème, France',
  coordinates: [48.8728, 2.3120],
  type: 'apartment',
  imageUrl: 'https://images.unsplash.com/photo-1502672260266-1c1e5240980c?auto=format&fit=crop&w=1000&q=80',
  features: ['Balcon', 'Ascenseur', 'Cave', 'Gardien'],
  bedrooms: 3,
  bathrooms: 2,
  area: 120,
  status: 'for_sale'
};

const baseLoft: Property = {
  id: 'l',
  title: 'Loft Industriel Rénové',
  description: 'Ancien atelier transformé en loft lumineux avec de grands volumes. Verrière d\'époque et matériaux bruts.',
  price: 3500,
  location: 'Lyon, France',
  coordinates: [45.7640, 4.8357],
  type: 'apartment',
  imageUrl: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1000&q=80',
  features: ['Terrasse', 'Parking', 'Cuisine équipée'],
  bedrooms: 2,
  bathrooms: 1,
  area: 150,
  status: 'for_rent'
};

export const mockProperties: Property[] = [
  ...generateProperties(8, baseHouse),
  ...generateProperties(8, baseApt),
  ...generateProperties(4, baseLoft),
];

const baseLand1: Property = {
  id: 'la1',
  title: 'Terrain Constructible Vue Montagne',
  description: 'Beau terrain plat viabilisé, prêt à construire. Environnement calme et verdoyant avec vue dégagée sur les montagnes.',
  price: 150000,
  location: 'Annecy, France',
  coordinates: [45.8992, 6.1294],
  type: 'land',
  imageUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1000&q=80',
  features: ['Viabilisé', 'Permis accordé', 'Vue dégagée'],
  area: 1200,
  status: 'for_sale'
};

const baseLand2: Property = {
  id: 'la2',
  title: 'Parcelle en Bord de Lac',
  description: 'Rare opportunité d\'acquérir un terrain avec accès direct au lac. Idéal pour projet de résidence secondaire.',
  price: 450000,
  location: 'Genève, Suisse',
  coordinates: [46.2044, 6.1432],
  type: 'land',
  imageUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1000&q=80',
  features: ['Accès eau', 'Constructible', 'Exclusivité'],
  area: 800,
  status: 'for_sale'
};

export const mockLands: Property[] = [
  ...generateProperties(10, baseLand1),
  ...generateProperties(5, baseLand2),
];

const baseHotel1: Property = {
  id: 'ho1',
  title: 'Le Grand Hôtel Spa & Resort',
  description: 'Séjournez dans le luxe absolu. Spa de 1000m², restaurant étoilé et suites avec vue imprenable.',
  price: 450,
  location: 'Monaco',
  coordinates: [43.7384, 7.4246],
  type: 'hotel',
  imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1000&q=80',
  features: ['Spa', 'Piscine', 'Restaurant', 'Service Voiturier'],
  bedrooms: 1,
  bathrooms: 1,
  area: 45,
  status: 'available'
};

const baseHotel2: Property = {
  id: 'ho2',
  title: 'Boutique Hôtel Historique',
  description: 'Charme et authenticité au cœur de la ville. Chambres décorées avec goût et service personnalisé.',
  price: 280,
  location: 'Bordeaux, France',
  coordinates: [44.8378, -0.5792],
  type: 'hotel',
  imageUrl: 'https://images.unsplash.com/photo-1551882547-ff40c0d5e9af?auto=format&fit=crop&w=1000&q=80',
  features: ['Centre-ville', 'Petit-déjeuner inclus', 'Bar'],
  bedrooms: 1,
  bathrooms: 1,
  area: 30,
  status: 'available'
};

export const mockHotels: Property[] = [
  ...generateProperties(7, baseHotel1),
  ...generateProperties(8, baseHotel2),
];
