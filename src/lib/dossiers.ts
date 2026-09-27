/* ==========================================================================
   Dossiers client — passerelle vers le CRM du backoffice.
   ⚠ Ce module est le SEUL endroit du site public autorisé à importer
   src/admin/**. Tout le reste du code passe par ses fonctions : le jour où
   le backoffice sera déplacé ou remplacé par une API, seul ce fichier changera.
   ========================================================================== */

import { createBuyRequestFromSite, getBuyRequests } from '../admin/crm/model';
import type { BuyRequest, BuyStatus } from '../admin/crm/model';
import { createSearch, findOrCreateClient, getRealisations, getSearches } from '../admin/crm/people';
import type { Realisation, SearchFields, SpecificSearch } from '../admin/crm/people';
import { Thumb as RealisationThumb } from '../admin/crm/kit';
import { addMessage, addReservation } from './store';
import type { AuthUser } from './auth';
import type { ContactPayload, ReservationPayload } from '../types';

export type { BuyRequest, BuyStatus } from '../admin/crm/model';
export type { Realisation, SearchFields, SpecificSearch } from '../admin/crm/people';
export { RealisationThumb };


/** Référence courte affichée au client (ACH-260927…). */
export function nextRequestRef(prefix: 'ACH' | 'VIS' | 'REC' | 'VEN'): string {
  const d = new Date();
  const yy = String(d.getFullYear()).slice(2);
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${prefix}-${yy}${mm}${dd}`;
}

/* --- Rapprochement d'un dossier CRM avec le compte connecté --------------- */

const normPhone = (p?: string) => (p ?? '').replace(/[\s.-]/g, '');

function personMatchesUser(person: { email?: string; phone?: string }, user: AuthUser): boolean {
  if (person.email && person.email.toLowerCase() === user.email.toLowerCase()) return true;
  const pp = normPhone(person.phone);
  const up = normPhone(user.phone);
  return Boolean(pp && up && (pp === up || pp.endsWith(up) || up.endsWith(pp)));
}

/** Demandes d'achat du backoffice rattachées à ce compte (statut réel du pipeline). */
export function getClientDossiers(user: AuthUser): BuyRequest[] {
  return getBuyRequests().filter((b) => personMatchesUser(b, user));
}

/** Recherches spécifiques confiées par ce compte. */
export function getClientSearches(user: AuthUser): SpecificSearch[] {
  return getSearches().filter((s) => personMatchesUser(s, user));
}

/* --- Écritures : le site crée la demande locale ET le dossier CRM --------- */

/**
 * Enregistre une demande (achat, visite, recherche, vente) :
 * store local (historique client) + base clients et dossier « demande d'achat »
 * côté backoffice, pour que l'équipe la traite depuis le CRM.
 */
export function createReservation(payload: ReservationPayload): void {
  addReservation(payload);
  const client = findOrCreateClient({
    fullName: payload.fullName, phone: payload.phone, email: payload.email ?? '', budget: payload.budget ?? '',
    profession: payload.profession ?? '', age: payload.age ? String(payload.age) : '', nationality: payload.nationality ?? '',
    bankAccount: payload.bankAccount ?? '', message: payload.message ?? '',
  }, 'Site web');
  if (payload.landId) createBuyRequestFromSite({ ...payload, clientId: client.id });
}

/** Message de contact (store local, visible dans le backoffice). */
export function createContactMessage(payload: ContactPayload): void {
  addMessage(payload);
}

/** Recherche spécifique confiée à l'équipe (crée la fiche dans le CRM). */
export function submitSpecificSearch(fields: SearchFields): void {
  createSearch(fields, 'Site web');
}

/* --- Réalisations publiées depuis le backoffice --------------------------- */

export function getPublishedRealisations(): Realisation[] {
  return getRealisations();
}
