export type PropertyType = 'house' | 'apartment' | 'land' | 'hotel';

export interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  location: string;
  coordinates?: [number, number]; // [latitude, longitude]
  type: PropertyType;
  imageUrl: string;
  features: string[];
  bedrooms?: number;
  bathrooms?: number;
  area?: number; // in sq meters
  status: 'for_sale' | 'for_rent' | 'available' | 'booked';
}
