/* ==========================================================================
   useClientSpace — TOUTE la donnée de l'espace client :
   demandes locales (store), dossiers CRM (lib/dossiers), favoris,
   visites fusionnées, notifications et compteurs. La page ne fait plus
   qu'afficher.
   ========================================================================== */

import { useMemo, useState } from 'react';
import { useAuth } from '../../../lib/auth';
import type { AuthUser } from '../../../lib/auth';
import { deleteReservation, getLands, getReservations } from '../../../lib/store';
import type { Reservation } from '../../../types';
import { getClientDossiers, getClientSearches } from '../../../lib/dossiers';
import type { BuyRequest, SpecificSearch } from '../../../lib/dossiers';
import { useFavorites } from '../../../lib/land';
import { fmtDate, parseDate } from '../../../lib/format';

/** Sections de l'espace client (la page en déduit sa navigation). */
export type TabId = 'overview' | 'purchases' | 'searches' | 'lands' | 'visits' | 'favorites' | 'notifications' | 'profile';

export const KIND_PREFIX: Record<string, string> = { interet: 'ACH', visite: 'VIS', recherche: 'REC', projet: 'REC', vente: 'VEN' };

export function refOf(r: Reservation): string {
  if (r.ref) return r.ref;
  const d = parseDate(r.createdAt);
  const yy = String(d.getFullYear()).slice(2);
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${KIND_PREFIX[r.kind ?? 'interet']}-${yy}${mm}${dd}`;
}


/** Nombre de terrains du catalogue correspondant aux critères d'une recherche CRM. */
export function searchMatches(s: SpecificSearch): number {
  const zone = s.mainZone.split(',')[0].trim().toLowerCase();
  return getLands().filter((l) => {
    const haystack = `${l.location} ${l.region} ${l.title}`.toLowerCase();
    const zoneOk = !zone || haystack.includes(zone);
    const budgetOk = !s.budgetMax || l.price <= s.budgetMax;
    const areaOk = (!s.areaMin || l.area >= s.areaMin) && (!s.areaMax || l.area <= s.areaMax);
    return zoneOk && budgetOk && areaOk;
  }).length;
}



export type NotifKind = 'status' | 'visit' | 'match' | 'search' | 'land';
export interface Notif {
  key: string;
  title: string;
  text: string;
  at: string;
  kind: NotifKind;
}

export interface VisitItem {
  key: string;
  when: string; // date ISO ou AAAA-MM-JJ
  time?: string;
  landId?: string;
  ref: string;
  source: 'reservation' | 'crm';
}


export function useClientSpace() {
  const { user } = useAuth();
  const fav = useFavorites();
  const [version, setVersion] = useState(0); // invalide les lectures après écriture

  const refresh = () => setVersion((v) => v + 1);

  /* ---------- Données ---------- */

  const bucket = useMemo(() => {
    const sortDesc = (a: Reservation, b: Reservation) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    const empty = { purchases: [] as Reservation[], searches: [] as Reservation[], sells: [] as Reservation[], visits: [] as Reservation[], recent: [] as Reservation[] };
    if (!user) return empty;
    const mine = getReservations().filter(
      (r) => r.userId === user.id || (!!r.email && r.email.toLowerCase() === user.email.toLowerCase()),
    );
    return {
      purchases: mine.filter((r) => r.kind === 'interet').sort(sortDesc),
      searches: mine.filter((r) => r.kind === 'recherche' || r.kind === 'projet').sort(sortDesc),
      sells: mine.filter((r) => r.kind === 'vente').sort(sortDesc),
      visits: mine.filter((r) => r.kind === 'visite').sort(sortDesc),
      recent: [...mine].sort(sortDesc),
    };
  }, [user, version]);

  /** Dossiers CRM (backoffice) rattachés à ce compte : suivi réel par l'équipe. */
  const crm = useMemo(() => {
    if (!user) return { buys: [] as BuyRequest[], searches: [] as SpecificSearch[] };
    return {
      buys: getClientDossiers(user),
      searches: getClientSearches(user),
    };
  }, [user, version]);

  /** Demandes d'achat locales sans équivalent CRM (soumises avant l'intégration). */
  const legacyPurchases = useMemo(() => {
    const crmKeys = new Set(crm.buys.map((b) => `${b.landId}|${b.createdAt.slice(0, 10)}`));
    return bucket.purchases.filter((r) => !crmKeys.has(`${r.landId}|${r.createdAt.slice(0, 10)}`));
  }, [bucket, crm]);


  /* ---------- Visites (réservations + visites programmées au backoffice) ---------- */

  const visits = useMemo<VisitItem[]>(() => {
    const fromReservations: VisitItem[] = bucket.visits.map((r) => ({
      key: r.id,
      when: r.visitDate ?? r.createdAt,
      time: r.visitTime,
      landId: r.landId,
      ref: refOf(r),
      source: 'reservation',
    }));
    const fromCrm: VisitItem[] = crm.buys
      .filter((b) => b.status === 'Visite programmée' && b.visitAt)
      .map((b) => ({ key: b.id, when: b.visitAt, landId: b.landId, ref: b.ref, source: 'crm' }));
    return [...fromReservations, ...fromCrm].sort((a, b) => a.when.localeCompare(b.when));
  }, [bucket, crm]);

  const today = new Date().toISOString().slice(0, 10);
  const upcomingVisits = visits.filter((v) => v.when.slice(0, 10) >= today);
  const pastVisits = visits.filter((v) => v.when.slice(0, 10) < today).reverse();
  const nextVisit = upcomingVisits[0];


  /* ---------- Notifications (historique réel des dossiers + demandes du site) ---------- */

  const notifs = useMemo<Notif[]>(() => {
    const out: Notif[] = [];
    for (const b of crm.buys) {
      for (const h of b.history) {
        out.push({ key: `b:${h.id}`, title: `Dossier ${b.ref}`, text: h.text, at: h.at, kind: 'status' });
      }
    }
    for (const s of crm.searches) {
      for (const h of s.history) {
        out.push({ key: `s:${h.id}`, title: `Recherche ${s.ref}`, text: h.text, at: h.at, kind: 'search' });
      }
      for (const p of s.proposals) {
        const land = getLands().find((l) => l.id === p.landId);
        out.push({
          key: `sp:${p.id}`,
          title: `Recherche ${s.ref}`,
          text: land ? `Le terrain « ${land.title} » vous a été proposé par notre équipe.` : 'Un terrain vous a été proposé par notre équipe.',
          at: p.at,
          kind: 'match',
        });
      }
    }
    for (const r of bucket.recent) {
      const ref = refOf(r);
      switch (r.kind) {
        case 'visite':
          out.push({
            key: `r:${r.id}:${r.status}`,
            title: r.status === 'traité' ? `Visite confirmée — ${ref}` : `Demande de visite ${ref}`,
            text: r.visitDate ? `Souhaitée le ${fmtDate(r.visitDate)}${r.visitTime ? ` à ${r.visitTime}` : ''}` : 'Votre demande de visite a bien été enregistrée.',
            at: r.createdAt,
            kind: 'visit',
          });
          break;
        case 'recherche':
        case 'projet':
          out.push({
            key: `r:${r.id}:${r.status}`,
            title: r.status === 'traité' ? `Recherche prise en charge — ${ref}` : `Recherche ${ref} enregistrée`,
            text: r.projectName || 'Vos critères sont enregistrés, notre équipe les étudie.',
            at: r.createdAt,
            kind: 'search',
          });
          break;
        case 'vente':
          out.push({
            key: `r:${r.id}:${r.status}`,
            title: r.status === 'traité' ? `Dossier de vente validé — ${ref}` : `Dossier de vente ${ref} reçu`,
            text: r.projectName || 'Notre équipe examine les documents transmis.',
            at: r.createdAt,
            kind: 'land',
          });
          break;
        default:
          out.push({
            key: `r:${r.id}:${r.status}`,
            title: r.status === 'traité' ? `Demande prise en charge — ${ref}` : `Demande ${ref} enregistrée`,
            text: r.projectName || 'Votre demande d’achat est en cours de traitement.',
            at: r.createdAt,
            kind: 'status',
          });
      }
    }
    return out.sort((a, b) => b.at.localeCompare(a.at));
  }, [bucket, crm]);

  const readKey = user ? `caimmo.espace-read:${user.id}` : '';
  const [readKeys, setReadKeys] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem(readKey) ?? '[]') as string[];
    } catch {
      return [];
    }
  });

  const unread = notifs.filter((n) => !readKeys.includes(n.key)).length;

  const markAllRead = () => {
    const keys = notifs.map((n) => n.key);
    setReadKeys(keys);
    try {
      localStorage.setItem(readKey, JSON.stringify(keys));
    } catch {
      /* stockage indisponible */
    }
  };


  /* ---------- Divers ---------- */

  const favLands = getLands().filter((l) => fav.favorites.includes(String(l.id)));
  const recommended = useMemo(() => {
    const all = getLands();
    return [...all.filter((l) => (l as { featured?: boolean }).featured), ...all.filter((l) => !(l as { featured?: boolean }).featured)].slice(0, 3);
  }, [version]);

  const counts: Partial<Record<TabId, number>> = {
    purchases: crm.buys.length + legacyPurchases.length,
    searches: crm.searches.length + bucket.searches.length,
    lands: bucket.sells.length,
    visits: upcomingVisits.length,
    favorites: favLands.length,
    notifications: unread,
  };


  /** Annule une demande de visite locale (l'UI affiche le toast). */
  const cancelVisit = (r: Reservation) => {
    deleteReservation(r.id);
    refresh();
  };

  return {
    user: user as AuthUser | null,
    bucket, crm, legacyPurchases,
    visits, upcomingVisits, pastVisits, nextVisit,
    notifs, readKeys, unread, markAllRead,
    favLands, recommended, counts,
    cancelVisit, refresh,
  };
}
