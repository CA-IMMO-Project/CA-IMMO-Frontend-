/* ==========================================================================
   Kit UI de l'espace client — le langage visuel du backoffice (cartes
   blanches rounded-2xl, badges à pastille, boutons navy/or), réutilisable
   par tous les panneaux de la feature « account ».
   ========================================================================== */

import { Link } from 'react-router-dom';
import { Check, ChevronRight, MapPin, Search } from 'lucide-react';
import { EmptyState } from '../../../shared/ui';
import { getLands } from '../../../lib/store';
import { formatArea, formatAriary } from '../../../lib/format';
import type { RequestStatus } from '../../../types';
import type { BuyStatus } from '../../../lib/dossiers';

/* ---------- Mise en forme (styles du backoffice) ---------- */

export const btnBase = 'inline-flex items-center justify-center gap-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50';
export const btnPrimary = `${btnBase} bg-navy-900 text-white hover:bg-navy-800 px-3.5 py-2`;
export const btnGold = `${btnBase} bg-gold-500 text-navy-950 hover:bg-gold-400 px-3.5 py-2`;
export const btnOutline = `${btnBase} border border-gray-300 bg-white text-navy-900 hover:bg-gray-50 px-3.5 py-2`;

export const TONES: Record<string, string> = {
  gray: 'bg-gray-100 text-gray-700',
  blue: 'bg-blue-100 text-blue-800',
  indigo: 'bg-indigo-100 text-indigo-800',
  amber: 'bg-amber-100 text-amber-800',
  orange: 'bg-orange-100 text-orange-800',
  green: 'bg-green-100 text-green-800',
  red: 'bg-red-100 text-red-700',
  purple: 'bg-purple-100 text-purple-800',
  navy: 'bg-navy-900 text-white',
  gold: 'bg-gold-400 text-navy-950',
};

const STATUS_TONE: Record<string, string> = {
  // Demandes d'achat (CRM)
  Nouvelle: 'blue', 'À contacter': 'orange', Contacté: 'indigo', 'En étude': 'purple', 'Proposition envoyée': 'indigo',
  'Visite programmée': 'amber', Négociation: 'amber', Validée: 'green', 'Achat finalisé': 'navy', Refusée: 'red', Archivée: 'gray',
  // Recherches spécifiques (CRM)
  'En recherche': 'blue', 'Terrains proposés': 'gold', Trouvé: 'green', Clôturée: 'gray',
  // Réponses aux propositions
  'En attente': 'gray', Intéressé: 'green', 'Pas intéressé': 'red', 'Visite demandée': 'amber',
};

const LOCAL_STATUS: Record<RequestStatus, { label: string; tone: string }> = {
  nouveau: { label: 'En cours de traitement', tone: 'amber' },
  traité: { label: 'Prise en charge', tone: 'green' },
  archivé: { label: 'Archivé', tone: 'gray' },
};

/** Étapes du pipeline d'achat (mêmes statuts que le backoffice). */
const FLOW: BuyStatus[] = ['Nouvelle', 'À contacter', 'Contacté', 'En étude', 'Proposition envoyée', 'Visite programmée', 'Négociation', 'Validée', 'Achat finalisé'];
export const STAGE_LABELS = ['Demande reçue', 'En traitement', 'Proposition', 'Visite', 'Finalisée'];

export function stageOf(status: BuyStatus): number {
  const i = FLOW.indexOf(status);
  if (i <= 0) return 0;
  if (i <= 3) return 1;
  if (i === 4) return 2;
  if (i === 5) return 3;
  return 4;
}


/* ---------- Petits composants (langage visuel du backoffice) ---------- */

export function Card({ title, icon, action, children, pad = true, className = '' }: {
  title?: string; icon?: React.ReactNode; action?: React.ReactNode; children: React.ReactNode; pad?: boolean; className?: string;
}) {
  return (
    <section className={`rounded-2xl border border-gray-200 bg-white shadow-sm ${className}`}>
      {title && (
        <header className="flex items-center justify-between gap-3 border-b border-gray-100 px-5 py-4">
          <h2 className="flex items-center gap-2 font-semibold text-navy-900">
            {icon && <span className="text-gold-600">{icon}</span>}
            {title}
          </h2>
          {action}
        </header>
      )}
      <div className={pad ? 'p-5' : ''}>{children}</div>
    </section>
  );
}

export function StatusBadge({ value, tone }: { value: string; tone?: string }) {
  const t = TONES[tone ?? STATUS_TONE[value] ?? 'gray'];
  return (
    <span className={`inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-medium ${t}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
      {value}
    </span>
  );
}

export function LocalStatusBadge({ status }: { status: RequestStatus }) {
  const s = LOCAL_STATUS[status] ?? LOCAL_STATUS.nouveau;
  return <StatusBadge value={s.label} tone={s.tone} />;
}

export function PageHead({ eyebrow, title, text, action }: { eyebrow?: string; title: string; text?: string; action?: React.ReactNode }) {
  return (
    <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        {eyebrow && <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-gold-700">{eyebrow}</p>}
        <h1 className="mt-1.5 text-2xl font-bold tracking-tight text-navy-900">{title}</h1>
        {text && <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-gray-500">{text}</p>}
      </div>
      {action}
    </header>
  );
}

/** Barre de progression d'un dossier (étapes du suivi). */
export function StageTrack({ steps, current }: { steps: string[]; current: number }) {
  return (
    <div className="mt-5 flex items-start overflow-x-auto pb-1" role="group" aria-label="Avancement du dossier">
      {steps.map((label, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <div key={label} className={`flex items-start ${i < steps.length - 1 ? 'min-w-fit flex-1' : ''}`}>
            <div className="flex flex-col items-center gap-1.5 px-1">
              <span
                className={`grid h-8 w-8 shrink-0 place-items-center rounded-full text-xs font-bold transition-colors ${
                  done ? 'bg-navy-900 text-white' : active ? 'bg-gold-500 text-navy-950 ring-4 ring-gold-500/20' : 'bg-gray-100 text-gray-400'
                }`}
              >
                {done ? <Check className="h-4 w-4" /> : i + 1}
              </span>
              <small className={`whitespace-nowrap text-center text-[11px] leading-tight ${done || active ? 'font-semibold text-navy-900' : 'text-gray-400'}`}>
                {label}
              </small>
            </div>
            {i < steps.length - 1 && <span className={`mx-1 mt-4 h-0.5 flex-1 rounded-full ${done ? 'bg-navy-900' : 'bg-gray-200'}`} />}
          </div>
        );
      })}
    </div>
  );
}

export function LandMini({ landId, actionLabel = 'Voir le terrain' }: { landId?: string; actionLabel?: string }) {
  const land = getLands().find((l) => String(l.id) === String(landId));
  if (!land) {
    return (
      <p className="mt-3 rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 text-xs text-gray-500">
        Terrain retiré du catalogue ou indisponible.
      </p>
    );
  }
  return (
    <div className="mt-3 flex flex-wrap items-center gap-4 rounded-xl border border-gray-100 bg-gray-50 p-3.5">
      <img src={land.imageUrl} alt="" className="h-16 w-24 shrink-0 rounded-lg object-cover" />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-navy-900">{land.title}</p>
        <p className="mt-0.5 flex items-center gap-1.5 text-xs text-gray-500">
          <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden />
          {land.location}
        </p>
        <p className="text-xs text-gray-500">
          {formatArea(land.area)} • {formatAriary(land.price)}
        </p>
      </div>
      <Link to={`/terrains/${land.id}`} className={`${btnOutline} shrink-0`}>
        {actionLabel}
        <ChevronRight className="h-4 w-4" aria-hidden />
      </Link>
    </div>
  );
}

export function EmptyBlock({ icon, title, text, actionLabel, onAction }: {
  icon: typeof Search; title: string; text: string; actionLabel?: string; onAction?: () => void;
}) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-10 shadow-sm">
      <EmptyState icon={icon} title={title} text={text} action={actionLabel} onAction={onAction} />
    </div>
  );
}

/* ========================================================================== */
