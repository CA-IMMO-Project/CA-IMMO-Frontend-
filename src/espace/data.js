// Données de l'espace client : les terrains viennent du catalogue géré dans le backoffice.
import { getLands } from '../lib/store';

export const formatAr = (value) => new Intl.NumberFormat('fr-FR').format(Math.round(value || 0)) + ' Ar';

// Utilisé par l'en-tête d'origine de l'espace (non affiché : le site utilise son propre menu)
export const notifications = [];

const STATUS = { disponible: 'Disponible', réservé: 'Réservé', vendu: 'Vendu' };

function guessRelief(text) {
  const t = text.toLowerCase();
  if (/pente forte|forte pente|escarp/.test(t)) return 'Pente forte';
  if (/pente|dénivel|vallon|colline|vue/.test(t)) return 'Pente douce';
  return 'Plat';
}

/** Convertit un terrain du catalogue au format attendu par les pages de l'espace client. */
export function toProperty(land) {
  const text = `${land.title} ${land.description} ${land.features.join(' ')}`;
  const lots = land.lots ?? [];
  const available = lots.length ? lots.some((l) => l.status === 'disponible') : land.status === 'disponible';
  const [commune] = land.location.split(',');
  return {
    id: land.id,
    title: land.title,
    location: land.location,
    zone: commune.trim(),
    region: land.region,
    area: land.area,
    price: land.price,
    perSqm: land.area ? Math.round(land.price / land.area) : 0,
    relief: guessRelief(text),
    payment: /facilit/i.test(text) ? 'Comptant ou facilité' : 'Comptant ou facilité selon accord',
    verified: land.titleStatus === 'Titre Foncier',
    available,
    status: available ? 'Disponible' : STATUS[land.status],
    image: land.imageUrl,
    gallery: [land.imageUrl, ...lots.map((l) => l.imageUrl).filter(Boolean)].filter((v, i, a) => a.indexOf(v) === i),
    access: land.features.find((f) => /route|accès|piste|goudron/i.test(f)) || 'Accès à préciser lors de la visite',
    water: /eau|jirama/i.test(text),
    electricity: /électri|jirama/i.test(text),
    documents: [land.titleStatus],
    downPayment: 'Selon conditions du vendeur',
    installments: 'À convenir',
    description: land.description,
    features: land.features,
    coordinates: land.coordinates,
    lots,
    titleStatus: land.titleStatus,
  };
}

export function getProperties() {
  return getLands().filter((l) => l.status !== 'vendu').map(toProperty);
}

export function getProperty(id) {
  const land = getLands().find((l) => l.id === String(id));
  return land ? toProperty(land) : undefined;
}
