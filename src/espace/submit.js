// Envoi des formulaires de l'espace client vers le backoffice (base clients, demandes d'achat,
// recherches spécifiques, dossiers terrains). Stockage local en attendant un vrai backend.
import { newId } from '../lib/store';
import {
  BUY_PAYMENT, getBuyRequests, historyEntry, newBuyRequest, newLandFile, pricePerM2, saveBuyRequest, saveLandFile,
} from '../admin/crm/model';
import { createSearch, findOrCreateClient } from '../admin/crm/people';
import { putFile } from '../admin/crm/files';

const COUNTRIES = ['Madagascar', 'France', 'La Réunion'];
const country = (c) => (COUNTRIES.includes(c) ? { country: c, countryOther: '' } : { country: 'Autre', countryOther: c === 'Autre' ? '' : c || '' });
const toNumber = (v) => Number(String(v ?? '').replace(/[^\d]/g, '')) || 0;

function clientFrom(f) {
  return findOrCreateClient({
    fullName: `${f.firstName} ${f.lastName}`.trim(), phone: f.phone, email: f.email || '', budget: f.budget || '',
    profession: f.profession || '', age: '', nationality: f.country === 'Madagascar' ? 'Malgache' : f.country || '',
    bankAccount: f.bank || '', message: f.info || '',
  }, 'Site web');
}

/** « Je suis intéressé » : ouvre une demande d'achat rattachée au terrain (et à la parcelle). */
export function submitInterest(property, lotId, f) {
  const client = clientFrom(f);
  const facility = f.payment === 'Facilité';
  const r = newBuyRequest();
  const lot = property.lots.find((l) => l.id === lotId);
  return saveBuyRequest({
    ...r,
    clientId: client.id, firstName: f.firstName, lastName: f.lastName, phone: f.phone, email: f.email, birthDate: f.birthDate,
    profession: f.profession, ...country(f.country), hasBankAccount: f.bank === 'Non' ? 'Non' : 'Oui',
    paymentMode: facility ? BUY_PAYMENT[1] : BUY_PAYMENT[0], paymentDuration: facility ? f.duration : '', deposit: toNumber(f.deposit),
    budgetMax: lot?.price ?? property.price, propertyType: 'Terrain', extraInfo: f.info || '', consent: true,
    landId: property.id, lotId: lot?.id, source: 'Site web', status: 'Nouvelle', priority: 'Haute',
    history: [historyEntry(`Demande reçue depuis le site : intéressé par ${property.title}${lot ? ` — ${lot.number}` : ''}`)],
    actions: [{ id: newId(), type: 'Appel', at: new Date(Date.now() + 3600000).toISOString(), note: 'Rappeler le client (demande en ligne)', done: false }],
  });
}

/** « Demander une visite » : planifie la visite dans le dossier du client (créé si besoin). */
export function submitVisit(property, lotId, v) {
  const [firstName = '', ...rest] = v.fullName.trim().split(/\s+/);
  const client = clientFrom({ firstName, lastName: rest.join(' '), phone: v.phone, info: v.comment });
  const at = new Date(`${v.date}T${v.time}`).toISOString();
  const action = { id: newId(), type: 'Visite du terrain', at, note: `Visite demandée en ligne${v.comment ? ` — ${v.comment}` : ''}`, done: false };
  const existing = getBuyRequests().find((r) => r.clientId === client.id && r.landId === property.id && !['Achat finalisé', 'Refusée', 'Archivée'].includes(r.status));
  const log = historyEntry(`Visite demandée depuis le site pour le ${new Date(at).toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short' })}`);
  if (existing) {
    return saveBuyRequest({ ...existing, status: 'Visite programmée', visitAt: at, actions: [...existing.actions, action], history: [...existing.history, log] });
  }
  const r = newBuyRequest();
  return saveBuyRequest({
    ...r, clientId: client.id, firstName, lastName: rest.join(' '), phone: v.phone, consent: true, extraInfo: v.comment || '',
    landId: property.id, lotId: lotId || undefined, source: 'Site web', status: 'Visite programmée', priority: 'Haute', visitAt: at,
    actions: [action], history: [historyEntry('Dossier créé depuis le site (demande de visite)'), log],
  });
}

const BUDGETS = { '60 000–100 000 Ar': 100_000_000, '100 000–150 000 Ar': 150_000_000, '150 000 Ar et plus': 0 };
const AREAS = {
  'Moins de 300 m²': [0, 300], '300–500 m²': [300, 500], '500–1 000 m²': [500, 1000], '1 000–2 000 m²': [1000, 2000], 'Plus de 2 000 m²': [2000, 0],
};

/** Recherche de terrain sur mesure. */
export function submitSearch(f) {
  const [areaMin, areaMax] = f.area === 'Surface personnalisée' ? [toNumber(f.customArea), 0] : AREAS[f.area] ?? [0, 0];
  const criteria = [
    `Relief : ${f.relief}`, `Paiement : ${f.payment}${f.payment === 'Facilité de paiement' ? ` (${f.duration}, apport ${f.contribution || '—'} Ar)` : ''}`,
    `Budget indiqué : ${f.budget === 'Budget personnalisé' ? `${f.customBudget} Ar` : f.budget}`, f.info,
  ].filter(Boolean).join('\n');
  return createSearch({
    fullName: `${f.firstName} ${f.lastName}`.trim(), phone: f.phone, email: f.email, usage: f.usage,
    budgetMax: f.budget === 'Budget personnalisé' ? toNumber(f.customBudget) : BUDGETS[f.budget] ?? 0, areaMin, areaMax,
    mainZone: f.zone, otherZones: f.otherZones, targetZone: f.zone, lat: f.lat, lng: f.lng, radiusKm: f.radius,
    flexible: f.flexible, suggestNearby: f.flexible === 'Oui', criteria,
  }, 'Site web', {
    profession: f.profession, nationality: f.country === 'Madagascar' ? 'Malgache' : f.country, bankAccount: f.bank,
    budget: f.budget === 'Budget personnalisé' ? f.customBudget : f.budget,
  });
}

/** Dépôt d'un terrain par un propriétaire : crée un dossier « Terrains / Recherche » à vérifier. */
export async function submitSell(f, files) {
  const stored = async (list) => Promise.all(list.map((file) => putFile(file)));
  const [idFiles, photos, video, docs] = await Promise.all([stored(files.id), stored(files.photos), stored(files.video), stored(files.docs)]);
  const d = newLandFile();
  const area = toNumber(f.area), price = toNumber(f.price);
  findOrCreateClient({
    fullName: `${f.firstName} ${f.lastName}`.trim(), phone: f.phone, email: f.email, budget: '', profession: f.profession,
    age: '', nationality: f.country === 'Madagascar' ? 'Malgache' : f.country, bankAccount: f.bank, message: 'Propriétaire (dépôt de terrain)',
  }, 'Site web');
  const payment = { Comptant: 'Comptant – paiement en une fois', Facilité: 'Facilité – paiement échelonné', 'Les deux': 'Les deux – comptant ou facilité' }[f.payment];
  return saveLandFile({
    ...d,
    owner: { ...d.owner, firstName: f.firstName, lastName: f.lastName, phone: f.phone, email: f.email, birthDate: f.birthDate, profession: f.profession, ...country(f.country), hasBankAccount: f.bank === 'Non' ? 'Non' : 'Oui' },
    idDoc: { ...d.idDoc, type: f.idType, number: f.idNumber, file: idFiles[0] },
    title: f.title, area, price, pricePerM2: toNumber(f.perSqm) || pricePerM2(price, area), pricePerM2Manual: Boolean(toNumber(f.perSqm)),
    description: f.description, relief: { Plat: 'Terrain plat', 'Pente douce': 'Pente douce', 'Pente forte': 'Pente forte' }[f.relief],
    accesses: [f.access], water: f.water, electricity: f.electricity,
    region: f.region, district: f.district, commune: f.commune, fokontany: f.fokontany, addressHint: f.addressHint, lat: f.lat, lng: f.lng,
    photos, video: video[0], documents: docs.map((x) => ({ ...x, category: f.docTypes[0] || 'Autre document', number: '', issuedAt: '', ownerName: `${f.firstName} ${f.lastName}`, status: 'À vérifier' })),
    salePayment: payment, maxDuration: f.payment === 'Comptant' ? '0–4 mois' : f.duration,
    depositRange: f.deposit, depositCustom: toNumber(f.customDeposit),
    ownerComments: f.docTypes.length ? `Documents déclarés : ${f.docTypes.join(', ')}` : '',
    status: 'Nouveau', priority: 'Normale',
    history: [historyEntry('Terrain déposé par le propriétaire depuis le site')],
  });
}
