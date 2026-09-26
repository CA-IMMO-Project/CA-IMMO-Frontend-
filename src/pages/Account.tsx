import { useEffect, useMemo, useState } from 'react';
import { Link, Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  Bell,
  CalendarDays,
  Check,
  ChevronRight,
  Clock,
  FileText,
  Heart,
  KeyRound,
  LandPlot,
  LogOut,
  Mail,
  MapPin,
  Pencil,
  Phone,
  Plus,
  Search,
  Settings,
  ShieldCheck,
  UserRound,
} from 'lucide-react';
import {
  EmptyState,
  ErrorBanner,
  Eyebrow,
  FormField,
  Input,
  Modal,
  ProgressSteps,
  Select,
} from '../components/ui';
import LandCard from '../components/LandCard';
import { useAuth } from '../lib/auth';
import { deleteReservation, getLands, getReservations, RequestStatus, Reservation } from '../lib/store';
import { useFavorites } from '../lib/land';
import { formatArea, formatAriary } from '../lib/format';

/* ==========================================================================
   Mon espace — suivi des demandes (achat, visites, recherches, ventes),
   favoris et profil. Données réelles : réservations déposées par l'utilisateur
   (store local) + favoris (lib/land).
   ========================================================================== */

type TabId = 'overview' | 'purchases' | 'searches' | 'lands' | 'visits' | 'favorites' | 'notifications' | 'profile';

const TABS: { id: TabId; label: string; icon: typeof Search }[] = [
  { id: 'overview', label: 'Vue d’ensemble', icon: UserRound },
  { id: 'purchases', label: 'Demandes d’achat', icon: FileText },
  { id: 'searches', label: 'Mes recherches', icon: Search },
  { id: 'lands', label: 'Terrains proposés', icon: LandPlot },
  { id: 'visits', label: 'Mes visites', icon: CalendarDays },
  { id: 'favorites', label: 'Favoris', icon: Heart },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'profile', label: 'Profil et sécurité', icon: Settings },
];

const parseDate = (iso: string) => new Date(iso.length <= 10 ? `${iso}T12:00:00` : iso);

const fmtDate = (iso: string) =>
  parseDate(iso).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });

const fmtShort = (iso: string) =>
  parseDate(iso).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });

const KIND_PREFIX: Record<string, string> = { interet: 'ACH', visite: 'VIS', recherche: 'REC', projet: 'REC', vente: 'VEN' };

function refOf(r: Reservation): string {
  if (r.ref) return r.ref;
  const d = parseDate(r.createdAt);
  const yy = String(d.getFullYear()).slice(2);
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${KIND_PREFIX[r.kind ?? 'interet']}-${yy}${mm}${dd}`;
}

const STATUS_MAP: Record<RequestStatus, { label: string; cls: string }> = {
  nouveau: { label: 'En cours de traitement', cls: 'border-gold-500/40 bg-gold-500/15 text-gold-700' },
  traité: { label: 'Prise en charge', cls: 'border-green-700/30 bg-green-700/10 text-green-700' },
  archivé: { label: 'Archivé', cls: 'border-navy-900/20 bg-navy-900/5 text-navy-900/70' },
};

function StatusPill({ status }: { status: RequestStatus }) {
  const s = STATUS_MAP[status] ?? STATUS_MAP.nouveau;
  return (
    <span className={`inline-flex shrink-0 items-center rounded-full border px-3 py-1 text-xs font-semibold ${s.cls}`}>
      {s.label}
    </span>
  );
}

function PanelTitle({ eyebrow, title, text, action }: { eyebrow?: string; title: string; text?: string; action?: React.ReactNode }) {
  return (
    <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
      <div>
        {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
        <h2 className="text-2xl font-bold tracking-tight text-navy-900 md:text-3xl">{title}</h2>
        {text && <p className="mt-2 max-w-xl text-sm leading-relaxed text-navy-900/85">{text}</p>}
      </div>
      {action}
    </div>
  );
}

function ActionLink({ to, variant = 'gold', children }: { to: string; variant?: 'gold' | 'outline'; children: React.ReactNode }) {
  const cls =
    variant === 'gold'
      ? 'inline-flex shrink-0 items-center gap-2 rounded-full bg-gold-500 px-5 py-2.5 text-xs font-semibold text-navy-900 shadow-lg shadow-gold-500/30 transition hover:bg-gold-400'
      : 'inline-flex shrink-0 items-center gap-2 rounded-full border border-navy-900/40 px-5 py-2.5 text-xs font-semibold text-navy-900 transition hover:bg-navy-900 hover:text-white';
  return (
    <Link to={to} className={cls}>
      {children}
    </Link>
  );
}

function RequestShell({ r, dateWord, children }: { r: Reservation; dateWord: string; children: React.ReactNode }) {
  return (
    <article className="card-soft p-6 sm:p-7">
      <header className="flex flex-wrap items-center gap-3">
        <div>
          <p className="text-sm font-extrabold tracking-wide text-navy-900">{refOf(r)}</p>
          <p className="text-xs text-navy-900/75">
            {dateWord} le {fmtDate(r.createdAt)}
          </p>
        </div>
        <span className="ml-auto">
          <StatusPill status={r.status} />
        </span>
      </header>
      {children}
    </article>
  );
}

function LandMini({ landId, actionLabel = 'Voir le terrain' }: { landId?: string; actionLabel?: string }) {
  const land = getLands().find((l) => String(l.id) === String(landId));
  if (!land) {
    return (
      <p className="mt-4 rounded-xl bg-mist px-4 py-3 text-xs text-navy-900/75">
        Terrain retiré du catalogue ou indisponible.
      </p>
    );
  }
  return (
    <div className="mt-4 flex flex-wrap items-center gap-4 rounded-2xl bg-mist p-4">
      <img src={land.imageUrl} alt="" className="h-16 w-24 rounded-xl object-cover" />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-bold text-navy-900">{land.title}</p>
        <p className="mt-0.5 flex items-center gap-1.5 text-xs text-navy-900/75">
          <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden />
          {land.location}
        </p>
        <p className="text-xs text-navy-900/75">
          {formatArea(land.area)} • {formatAriary(land.price)}
        </p>
      </div>
      <ActionLink to={`/terrains/${land.id}`} variant="outline">
        {actionLabel}
      </ActionLink>
    </div>
  );
}

export default function Account() {
  const { user, logout, updateProfile, changePassword } = useAuth();
  const [params, setParams] = useSearchParams();
  const navigate = useNavigate();
  const fav = useFavorites();
  const [version, setVersion] = useState(0);
  const [toast, setToast] = useState<string | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);
  const [pwOpen, setPwOpen] = useState(false);
  const [pwError, setPwError] = useState<string | null>(null);
  const [editForm, setEditForm] = useState(() => ({
    firstName: user?.firstName ?? '',
    lastName: user?.lastName ?? '',
    phone: user?.phone ?? '',
    email: user?.email ?? '',
  }));
  const [pw, setPw] = useState({ current: '', next: '', confirm: '' });

  const tabParam = params.get('tab') as TabId | null;
  const active: TabId = tabParam && TABS.some((t) => t.id === tabParam) ? tabParam : 'overview';
  const setTab = (id: TabId) => setParams({ tab: id }, { replace: true });

  useEffect(() => {
    document.title = 'Mon espace | CA IMMO';
    return () => {
      document.title = 'CA IMMO | Vente de Terrains à Madagascar';
    };
  }, []);

  useEffect(() => {
    if (!toast) return;
    const t = window.setTimeout(() => setToast(null), 3500);
    return () => window.clearTimeout(t);
  }, [toast]);

  const bucket = useMemo(() => {
    const sortDesc = (a: Reservation, b: Reservation) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    if (!user) {
      return { purchases: [] as Reservation[], searches: [] as Reservation[], sells: [] as Reservation[], visits: [] as Reservation[], recent: [] as Reservation[] };
    }
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

  const readKey = user ? `caimmo.notif-read:${user.id}` : '';
  const [readKeys, setReadKeys] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem(readKey) ?? '[]') as string[];
    } catch {
      return [];
    }
  });

  const events = useMemo(() => {
    return bucket.recent.map((r) => {
      const ref = refOf(r);
      const key = `${r.id}:${r.status}`;
      let title: string;
      let text: string;
      let type: 'check' | 'visit' | 'search' | 'land';
      switch (r.kind) {
        case 'visite':
          type = 'visit';
          title = r.status === 'traité' ? `Visite confirmée — ${ref}` : `Demande de visite ${ref}`;
          text = r.visitDate ? `Souhaitée le ${fmtDate(r.visitDate)}${r.visitTime ? ` à ${r.visitTime}` : ''}` : 'Votre demande de visite a bien été enregistrée.';
          break;
        case 'recherche':
        case 'projet':
          type = 'search';
          title = r.status === 'traité' ? `Recherche prise en charge — ${ref}` : `Recherche ${ref} enregistrée`;
          text = r.projectName || 'Vos critères sont enregistrés, notre équipe les étudie.';
          break;
        case 'vente':
          type = 'land';
          title = r.status === 'traité' ? `Dossier de vente validé — ${ref}` : `Dossier de vente ${ref} reçu`;
          text = r.projectName || 'Notre équipe examine les documents transmis.';
          break;
        default:
          title = r.status === 'traité' ? `Demande prise en charge — ${ref}` : `Demande ${ref} enregistrée`;
          text = r.projectName || 'Votre demande d’achat est en cours de traitement.';
      }
      return { key, title, text, type, date: r.createdAt };
    });
  }, [bucket]);

  const unread = events.filter((e) => !readKeys.includes(e.key)).length;
  const today = new Date().toISOString().slice(0, 10);
  const upcoming = bucket.visits.filter((r) => (r.visitDate ?? '') >= today).sort((a, b) => (a.visitDate ?? '').localeCompare(b.visitDate ?? ''));
  const pastVisits = bucket.visits.filter((r) => (r.visitDate ?? '') < today);
  const nextVisit = upcoming[0];
  const favLands = getLands().filter((l) => fav.favorites.includes(String(l.id)));
  const recommended = getLands().slice(0, 3);

  const counts: Partial<Record<TabId, number>> = {
    purchases: bucket.purchases.length,
    searches: bucket.searches.length,
    lands: bucket.sells.length,
    visits: bucket.visits.length,
    favorites: favLands.length,
    notifications: unread,
  };

  const markAllRead = () => {
    const keys = events.map((e) => e.key);
    setReadKeys(keys);
    try {
      localStorage.setItem(readKey, JSON.stringify(keys));
    } catch {
      /* stockage indisponible */
    }
  };

  const cancelVisit = (r: Reservation) => {
    deleteReservation(r.id);
    setVersion((v) => v + 1);
    setToast('Demande de visite annulée');
  };

  const openEdit = () => {
    if (user) {
      setEditForm({ firstName: user.firstName, lastName: user.lastName, phone: user.phone, email: user.email });
    }
    setEditError(null);
    setEditOpen(true);
  };

  const saveEdit = () => {
    const res = updateProfile(editForm);
    if (!res.ok) {
      setEditError(res.error ?? 'Une erreur est survenue.');
      return;
    }
    setEditOpen(false);
    setToast('Profil mis à jour');
  };

  const savePassword = () => {
    setPwError(null);
    if (pw.next !== pw.confirm) {
      setPwError('Les deux mots de passe ne correspondent pas.');
      return;
    }
    const res = changePassword(pw.current, pw.next);
    if (!res.ok) {
      setPwError(res.error ?? 'Une erreur est survenue.');
      return;
    }
    setPwOpen(false);
    setPw({ current: '', next: '', confirm: '' });
    setToast('Mot de passe mis à jour');
  };

  if (!user) return <Navigate to="/connexion?mode=login" replace />;

  const initials = `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();
  const eventIcons = { check: Check, visit: CalendarDays, search: Search, land: LandPlot } as const;

  return (
    <div className="font-display overflow-hidden bg-mist">
      {/* — Bandeau de bienvenue — signature navy + or des pages Accueil / À propos — */}
      <section className="relative overflow-hidden bg-navy-900 text-white">
        <svg className="absolute left-0 top-6 h-24 w-5 text-gold-500 md:h-32 md:w-7" viewBox="0 0 30 160" aria-hidden>
          <path fill="currentColor" d="M0,0 C30,30 30,120 0,160 Z" />
        </svg>
        <svg className="absolute bottom-4 right-0 h-28 w-8 text-gold-500" viewBox="0 0 40 180" aria-hidden>
          <path fill="currentColor" d="M40,0 C0,40 0,140 40,180 Z" />
        </svg>
        <div className="relative z-10 mx-auto flex max-w-7xl flex-wrap items-center gap-6 px-4 py-12 sm:px-6 md:py-16 lg:px-8">
          <span className="grid h-16 w-16 shrink-0 place-items-center rounded-full bg-white/10 text-xl font-extrabold text-gold-500 ring-2 ring-gold-500/60">
            {initials}
          </span>
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gold-500">Bienvenue dans votre espace</p>
            <h1 className="mt-2 text-3xl font-extrabold tracking-tight md:text-4xl">Bonjour, {user.firstName}</h1>
            <p className="mt-2 truncate text-sm text-white/80">{user.email}</p>
          </div>
          {unread > 0 && (
            <button
              type="button"
              onClick={() => setTab('notifications')}
              className="ml-auto flex items-center gap-3 rounded-2xl bg-white/10 px-5 py-3 transition hover:bg-white/15"
            >
              <Bell className="h-5 w-5 text-gold-500" aria-hidden />
              <span className="text-left text-xs text-white/85">
                <strong className="text-lg text-white">{unread}</strong>
                <br />
                non lue{unread > 1 ? 's' : ''}
              </span>
            </button>
          )}
        </div>
      </section>

      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 md:py-14 lg:grid-cols-12 lg:px-8">
        {/* — Navigation latérale (sélecteur sur mobile) — */}
        <aside className="lg:col-span-3">
          <div className="card-soft p-3 lg:sticky lg:top-24">
            <label className="block lg:hidden">
              <span className="sr-only">Section de mon espace</span>
              <Select value={active} onChange={(e) => setTab(e.target.value as TabId)}>
                {TABS.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.label}
                  </option>
                ))}
              </Select>
            </label>
            <nav role="tablist" aria-orientation="vertical" aria-label="Sections de mon espace" className="hidden flex-col gap-1 lg:flex">
              {TABS.map((t) => {
                const Icon = t.icon;
                const count = counts[t.id];
                const isActive = active === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    role="tab"
                    id={`tab-${t.id}`}
                    aria-selected={isActive}
                    aria-controls={`panel-${t.id}`}
                    onClick={() => setTab(t.id)}
                    className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                      isActive ? 'bg-navy-900 text-white' : 'text-navy-900 hover:bg-mist'
                    }`}
                  >
                    <Icon className="h-4 w-4 shrink-0" aria-hidden />
                    <span>{t.label}</span>
                    {count ? (
                      <b className={`ml-auto rounded-full px-2 py-0.5 text-xs ${isActive ? 'bg-gold-500 text-navy-900' : 'bg-navy-900/5 text-navy-900'}`}>
                        {count}
                      </b>
                    ) : (
                      <ChevronRight className={`ml-auto h-4 w-4 ${isActive ? 'text-gold-500' : 'opacity-40'}`} aria-hidden />
                    )}
                  </button>
                );
              })}
            </nav>
            <button
              type="button"
              onClick={() => {
                logout();
                navigate('/');
              }}
              className="mt-3 hidden w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-navy-900/80 transition hover:bg-red-50 hover:text-red-700 lg:flex"
            >
              <LogOut className="h-4 w-4 shrink-0" aria-hidden /> Se déconnecter
            </button>
            <button
              type="button"
              onClick={() => {
                logout();
                navigate('/');
              }}
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-navy-900/20 px-4 py-3 text-sm font-medium text-navy-900/80 transition hover:bg-red-50 hover:text-red-700 lg:hidden"
            >
              <LogOut className="h-4 w-4 shrink-0" aria-hidden /> Se déconnecter
            </button>
          </div>
        </aside>

        {/* — Contenu de la section active — */}
        <main role="tabpanel" id={`panel-${active}`} aria-labelledby={`tab-${active}`} tabIndex={0} className="min-w-0 lg:col-span-9">
          <motion.div key={active} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>

            {active === 'overview' && (
              <>
                <PanelTitle eyebrow="Mon espace" title="Vue d’ensemble" text="Suivez vos projets et les dernières mises à jour." />
                <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                  {([
                    { id: 'purchases', icon: FileText, label: 'Demandes d’achat', count: bucket.purchases.length },
                    { id: 'searches', icon: Search, label: 'Recherches actives', count: bucket.searches.length },
                    { id: 'visits', icon: CalendarDays, label: 'Visites', count: bucket.visits.length },
                    { id: 'lands', icon: LandPlot, label: 'Terrains proposés', count: bucket.sells.length },
                  ] as const).map((s) => {
                    const Icon = s.icon;
                    return (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => setTab(s.id)}
                        className="card-soft card-lift flex items-center gap-4 p-5 text-left"
                      >
                        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-gold-500/15 text-gold-700">
                          <Icon className="h-5 w-5" aria-hidden />
                        </span>
                        <span className="min-w-0">
                          <strong className="block text-2xl font-extrabold text-navy-900">{s.count}</strong>
                          <span className="block truncate text-xs text-navy-900/75">{s.label}</span>
                        </span>
                        <ChevronRight className="ml-auto h-4 w-4 shrink-0 text-navy-900/40" aria-hidden />
                      </button>
                    );
                  })}
                </div>

                {bucket.recent.length === 0 ? (
                  <div className="card-soft mt-8 p-8">
                    <EmptyState
                      icon={Search}
                      title="Aucun projet pour l’instant"
                      text="Confiez-nous une recherche ou proposez votre terrain : le suivi apparaîtra ici."
                    >
                      <div className="mt-5 flex flex-wrap justify-center gap-3">
                        <ActionLink to="/recherche">Confier ma recherche</ActionLink>
                        <ActionLink to="/vendre" variant="outline">
                          <Plus className="h-4 w-4" aria-hidden /> Proposer un terrain
                        </ActionLink>
                      </div>
                    </EmptyState>
                  </div>
                ) : (
                  <div className="mt-8 grid gap-6 lg:grid-cols-5">
                    <section className="card-soft p-6 sm:p-7 lg:col-span-3">
                      <h3 className="text-lg font-bold text-navy-900">Activités récentes</h3>
                      <ul className="mt-5 space-y-5">
                        {events.slice(0, 5).map((e) => {
                          const Icon = eventIcons[e.type];
                          return (
                            <li key={e.key} className="flex items-start gap-4">
                              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-navy-900/5 text-navy-900">
                                <Icon className="h-4 w-4" aria-hidden />
                              </span>
                              <div className="min-w-0">
                                <p className="text-sm font-bold text-navy-900">{e.title}</p>
                                <p className="mt-0.5 text-xs leading-relaxed text-navy-900/75">{e.text}</p>
                                <p className="mt-1 text-xs text-navy-900/60">{fmtShort(e.date)}</p>
                              </div>
                            </li>
                          );
                        })}
                      </ul>
                    </section>
                    {nextVisit ? (
                      <section className="card-soft p-6 sm:p-7 lg:col-span-2">
                        <div className="flex items-center justify-between gap-3">
                          <h3 className="text-lg font-bold text-navy-900">Prochaine visite</h3>
                          <button type="button" onClick={() => setTab('visits')} className="text-xs font-semibold text-navy-900 underline decoration-gold-500 decoration-2 underline-offset-4 transition hover:text-gold-700">
                            Détails
                          </button>
                        </div>
                        <p className="mt-5 flex items-center gap-2 text-sm font-semibold text-navy-900">
                          <CalendarDays className="h-4 w-4 text-gold-700" aria-hidden />
                          {nextVisit.visitDate ? fmtDate(nextVisit.visitDate) : 'Date à confirmer'}
                          {nextVisit.visitTime && (
                            <span className="flex items-center gap-1 text-xs font-normal text-navy-900/75">
                              <Clock className="h-3.5 w-3.5" aria-hidden />
                              {nextVisit.visitTime}
                            </span>
                          )}
                        </p>
                        <LandMini landId={nextVisit.landId} />
                      </section>
                    ) : (
                      <section className="card-soft p-6 sm:p-7 lg:col-span-2">
                        <h3 className="text-lg font-bold text-navy-900">Une visite sur place ?</h3>
                        <p className="mt-3 text-sm leading-relaxed text-navy-900/85">
                          Choisissez un terrain et demandez une visite : notre équipe organise le rendez-vous avec vous.
                        </p>
                        <div className="mt-5">
                          <ActionLink to="/terrains">Parcourir les terrains</ActionLink>
                        </div>
                      </section>
                    )}
                  </div>
                )}

                {recommended.length > 0 && (
                  <section className="mt-8">
                    <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
                      <div>
                        <Eyebrow>Sélection du moment</Eyebrow>
                        <h3 className="text-lg font-bold text-navy-900">Recommandés pour vous</h3>
                      </div>
                      <ActionLink to="/terrains" variant="outline">
                        Voir tous les terrains <ChevronRight className="h-4 w-4" aria-hidden />
                      </ActionLink>
                    </div>
                    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                      {recommended.map((l) => (
                        <LandCard key={l.id} land={l} />
                      ))}
                    </div>
                  </section>
                )}
              </>
            )}

            {active === 'purchases' && (
              <>
                <PanelTitle
                  eyebrow="Suivi"
                  title="Demandes d’achat"
                  text="Consultez l’avancement de vos intérêts pour les terrains publiés."
                  action={<ActionLink to="/terrains"><Plus className="h-4 w-4" aria-hidden /> Nouveau projet</ActionLink>}
                />
                {bucket.purchases.length === 0 ? (
                  <div className="card-soft p-8">
                    <EmptyState icon={FileText} title="Aucune demande d’achat" text="Votre historique d’intérêts apparaîtra ici." action="Parcourir les terrains" onAction={() => navigate('/terrains')} />
                  </div>
                ) : (
                  <div className="space-y-5">
                    {bucket.purchases.map((r) => (
                      <RequestShell key={r.id} r={r} dateWord="Envoyée">
                        <LandMini landId={r.landId} />
                        {r.paymentMode && (
                          <p className="mt-3 text-xs text-navy-900/75">Paiement souhaité : <strong className="font-semibold">{r.paymentMode}</strong></p>
                        )}
                        <div className="mt-6">
                          <ProgressSteps steps={['Demande reçue', 'En traitement', 'Prise en charge']} current={r.status === 'nouveau' ? 1 : 2} />
                        </div>
                      </RequestShell>
                    ))}
                  </div>
                )}
              </>
            )}

            {active === 'searches' && (
              <>
                <PanelTitle
                  eyebrow="Suivi"
                  title="Mes recherches"
                  text="Vos critères personnalisés, pris en charge par notre équipe."
                  action={<ActionLink to="/recherche"><Plus className="h-4 w-4" aria-hidden /> Nouvelle recherche</ActionLink>}
                />
                {bucket.searches.length === 0 ? (
                  <div className="card-soft p-8">
                    <EmptyState icon={Search} title="Aucune recherche confiée" text="Décrivez votre projet : nous cherchons pour vous." action="Confier ma recherche" onAction={() => navigate('/recherche')} />
                  </div>
                ) : (
                  <div className="space-y-5">
                    {bucket.searches.map((r) => (
                      <RequestShell key={r.id} r={r} dateWord="Créée">
                        <h3 className="mt-4 text-lg font-bold text-navy-900">{r.projectName || 'Recherche de terrain'}</h3>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {r.budget && <span className="rounded-full bg-navy-900/5 px-3 py-1 text-xs font-medium text-navy-900">{r.budget}</span>}
                          {r.paymentMode && <span className="rounded-full bg-navy-900/5 px-3 py-1 text-xs font-medium text-navy-900">{r.paymentMode}</span>}
                          {r.duration && <span className="rounded-full bg-navy-900/5 px-3 py-1 text-xs font-medium text-navy-900">Durée : {r.duration}</span>}
                        </div>
                        {r.message && (
                          <details className="group mt-4">
                            <summary className="cursor-pointer select-none text-xs font-semibold uppercase tracking-[0.2em] text-navy-900/85 hover:text-navy-900">
                              Détails de la demande
                            </summary>
                            <p className="mt-3 whitespace-pre-line rounded-xl bg-mist px-4 py-3 text-xs leading-relaxed text-navy-900/85">{r.message}</p>
                          </details>
                        )}
                        <div className="mt-5 flex flex-wrap gap-3">
                          <ActionLink to="/terrains" variant="outline">Voir les terrains</ActionLink>
                        </div>
                      </RequestShell>
                    ))}
                  </div>
                )}
              </>
            )}

            {active === 'lands' && (
              <>
                <PanelTitle
                  eyebrow="Suivi"
                  title="Terrains proposés"
                  text="Suivez la vérification et la publication de vos terrains."
                  action={<ActionLink to="/vendre"><Plus className="h-4 w-4" aria-hidden /> Proposer un terrain</ActionLink>}
                />
                {bucket.sells.length === 0 ? (
                  <div className="card-soft p-8">
                    <EmptyState icon={LandPlot} title="Aucun terrain proposé" text="Vous souhaitez vendre ? Confiez-nous votre terrain." action="Proposer un terrain" onAction={() => navigate('/vendre')} />
                  </div>
                ) : (
                  <div className="space-y-5">
                    {bucket.sells.map((r) => (
                      <RequestShell key={r.id} r={r} dateWord="Soumis">
                        <h3 className="mt-4 text-lg font-bold text-navy-900">{r.projectName || 'Terrain à vendre'}</h3>
                        {r.budget && <p className="mt-1 text-sm text-navy-900/85">Prix demandé : <strong className="font-semibold">{r.budget}</strong></p>}
                        {r.status === 'traité' ? (
                          <p className="mt-4 flex items-start gap-3 rounded-xl bg-green-700/10 px-4 py-3 text-xs leading-relaxed text-navy-900/85">
                            <Check className="mt-0.5 h-4 w-4 shrink-0 text-green-700" aria-hidden />
                            <span><strong className="font-bold">Dossier validé.</strong> Notre équipe vous contacte pour la suite de la publication.</span>
                          </p>
                        ) : (
                          <p className="mt-4 flex items-start gap-3 rounded-xl bg-gold-500/10 px-4 py-3 text-xs leading-relaxed text-navy-900/85">
                            <Clock className="mt-0.5 h-4 w-4 shrink-0 text-gold-700" aria-hidden />
                            <span><strong className="font-bold">Vérification en cours.</strong> Notre équipe contrôle les documents transmis. Délai estimé : 2 à 5 jours ouvrés.</span>
                          </p>
                        )}
                      </RequestShell>
                    ))}
                  </div>
                )}
              </>
            )}

            {active === 'visits' && (
              <>
                <PanelTitle
                  eyebrow="Suivi"
                  title="Mes visites"
                  text="Vos rendez-vous confirmés et passés."
                  action={<ActionLink to="/terrains"><Plus className="h-4 w-4" aria-hidden /> Planifier une visite</ActionLink>}
                />
                {bucket.visits.length === 0 ? (
                  <div className="card-soft p-8">
                    <EmptyState icon={CalendarDays} title="Aucune visite" text="Demandez une visite depuis la fiche d’un terrain." action="Parcourir les terrains" onAction={() => navigate('/terrains')} />
                  </div>
                ) : (
                  <div className="space-y-8">
                    {upcoming.length > 0 && (
                      <div className="space-y-5">
                        <h3 className="text-xs font-semibold uppercase tracking-[0.24em] text-navy-900/70">À venir</h3>
                        {upcoming.map((r) => (
                          <RequestShell key={r.id} r={r} dateWord="Demandée">
                            <p className="mt-4 flex flex-wrap items-center gap-2 text-sm font-semibold text-navy-900">
                              <CalendarDays className="h-4 w-4 text-gold-700" aria-hidden />
                              {r.visitDate ? fmtDate(r.visitDate) : 'Date à confirmer'}
                              {r.visitTime && (
                                <span className="flex items-center gap-1 text-xs font-normal text-navy-900/75">
                                  <Clock className="h-3.5 w-3.5" aria-hidden />
                                  {r.visitTime}
                                </span>
                              )}
                            </p>
                            <LandMini landId={r.landId} />
                            <div className="mt-5">
                              <button
                                type="button"
                                onClick={() => cancelVisit(r)}
                                className="text-xs font-semibold text-navy-900/80 underline decoration-red-600/60 decoration-2 underline-offset-4 transition hover:text-red-700"
                              >
                                Annuler cette demande de visite
                              </button>
                            </div>
                          </RequestShell>
                        ))}
                      </div>
                    )}
                    {pastVisits.length > 0 && (
                      <div className="space-y-5">
                        <h3 className="text-xs font-semibold uppercase tracking-[0.24em] text-navy-900/70">Passées</h3>
                        {pastVisits.map((r) => (
                          <RequestShell key={r.id} r={r} dateWord="Demandée">
                            <p className="mt-4 flex flex-wrap items-center gap-2 text-sm font-semibold text-navy-900">
                              <CalendarDays className="h-4 w-4 text-gold-700" aria-hidden />
                              {r.visitDate ? fmtDate(r.visitDate) : '—'}
                              {r.visitTime && (
                                <span className="flex items-center gap-1 text-xs font-normal text-navy-900/75">
                                  <Clock className="h-3.5 w-3.5" aria-hidden />
                                  {r.visitTime}
                                </span>
                              )}
                            </p>
                            <LandMini landId={r.landId} />
                          </RequestShell>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </>
            )}

            {active === 'favorites' && (
              <>
                <PanelTitle eyebrow="Ma sélection" title="Favoris" text="Les terrains que vous avez mis de côté." action={<ActionLink to="/terrains" variant="outline">Parcourir les terrains</ActionLink>} />
                {favLands.length === 0 ? (
                  <div className="card-soft p-8">
                    <EmptyState icon={Heart} title="Aucun favori" text="Cliquez sur le cœur d’un terrain pour le retrouver ici." action="Parcourir les terrains" onAction={() => navigate('/terrains')} />
                  </div>
                ) : (
                  <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                    {favLands.map((l) => (
                      <LandCard key={l.id} land={l} />
                    ))}
                  </div>
                )}
              </>
            )}

            {active === 'notifications' && (
              <>
                <PanelTitle
                  eyebrow="Activité"
                  title="Notifications"
                  text="Restez informé de l’avancement de tous vos projets."
                  action={
                    unread > 0 ? (
                      <button
                        type="button"
                        onClick={markAllRead}
                        className="text-xs font-semibold text-navy-900 underline decoration-gold-500 decoration-2 underline-offset-4 transition hover:text-gold-700"
                      >
                        Tout marquer comme lu
                      </button>
                    ) : undefined
                  }
                />
                {events.length === 0 ? (
                  <div className="card-soft p-8">
                    <EmptyState icon={Bell} title="Aucune notification" text="Les mises à jour de vos projets apparaîtront ici." />
                  </div>
                ) : (
                  <ul className="card-soft divide-y divide-navy-900/8 p-2">
                    {events.map((e) => {
                      const Icon = eventIcons[e.type];
                      const isUnread = !readKeys.includes(e.key);
                      return (
                        <li key={e.key} className={`flex items-start gap-4 rounded-xl px-4 py-4 ${isUnread ? 'bg-gold-500/5' : ''}`}>
                          <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-full ${isUnread ? 'bg-gold-500/20 text-gold-700' : 'bg-navy-900/5 text-navy-900'}`}>
                            <Icon className="h-4 w-4" aria-hidden />
                          </span>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-bold text-navy-900">{e.title}</p>
                            <p className="mt-0.5 text-xs leading-relaxed text-navy-900/75">{e.text}</p>
                            <p className="mt-1 text-xs text-navy-900/60">{fmtShort(e.date)}</p>
                          </div>
                          {isUnread && <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-gold-500" aria-label="Non lue" />}
                        </li>
                      );
                    })}
                  </ul>
                )}
              </>
            )}

            {active === 'profile' && (
              <>
                <PanelTitle eyebrow="Mon compte" title="Profil et sécurité" text="Gérez vos informations personnelles et votre mot de passe." action={
                  <button type="button" onClick={openEdit} className="inline-flex shrink-0 items-center gap-2 rounded-full border border-navy-900/40 px-5 py-2.5 text-xs font-semibold text-navy-900 transition hover:bg-navy-900 hover:text-white">
                    <Pencil className="h-4 w-4" aria-hidden /> Modifier
                  </button>
                } />
                <div className="grid gap-5 lg:grid-cols-5">
                  <section className="card-soft p-6 sm:p-7 lg:col-span-2">
                    <div className="flex flex-col items-center text-center">
                      <span className="grid h-20 w-20 place-items-center rounded-full bg-navy-900 text-2xl font-extrabold text-gold-500 ring-2 ring-gold-500/60">
                        {initials}
                      </span>
                      <h3 className="mt-4 text-xl font-bold text-navy-900">{user.fullName}</h3>
                      <p className="mt-1 text-xs text-navy-900/75">Compte créé le {fmtDate(user.createdAt)}</p>
                      <p className="mt-4 flex items-center gap-2 rounded-full bg-green-700/10 px-4 py-2 text-xs font-semibold text-green-700">
                        <ShieldCheck className="h-4 w-4" aria-hidden /> Connecté(e) à votre espace
                      </p>
                    </div>
                  </section>
                  <section className="card-soft p-6 sm:p-7 lg:col-span-3">
                    <h3 className="text-lg font-bold text-navy-900">Informations personnelles</h3>
                    <dl className="mt-5 space-y-4">
                      <div className="flex items-center gap-3">
                        <Mail className="h-4 w-4 shrink-0 text-gold-700" aria-hidden />
                        <dt className="text-xs text-navy-900/75">Adresse email</dt>
                        <dd className="ml-auto truncate text-sm font-semibold text-navy-900">{user.email}</dd>
                      </div>
                      <div className="flex items-center gap-3">
                        <Phone className="h-4 w-4 shrink-0 text-gold-700" aria-hidden />
                        <dt className="text-xs text-navy-900/75">Téléphone</dt>
                        <dd className="ml-auto truncate text-sm font-semibold text-navy-900">{user.phone || '—'}</dd>
                      </div>
                      <div className="flex items-center gap-3">
                        <UserRound className="h-4 w-4 shrink-0 text-gold-700" aria-hidden />
                        <dt className="text-xs text-navy-900/75">Nom complet</dt>
                        <dd className="ml-auto truncate text-sm font-semibold text-navy-900">{user.fullName}</dd>
                      </div>
                    </dl>
                  </section>
                  <section className="card-soft p-6 sm:p-7 lg:col-span-5">
                    <h3 className="text-lg font-bold text-navy-900">Sécurité</h3>
                    <div className="mt-5 flex flex-wrap items-center gap-4">
                      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-navy-900/5 text-navy-900">
                        <KeyRound className="h-5 w-5" aria-hidden />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-bold text-navy-900">Mot de passe</p>
                        <p className="text-xs text-navy-900/75">Choisissez un mot de passe d’au moins 6 caractères.</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setPwError(null);
                          setPwOpen(true);
                        }}
                        className="inline-flex shrink-0 items-center gap-2 rounded-full border border-navy-900/40 px-5 py-2.5 text-xs font-semibold text-navy-900 transition hover:bg-navy-900 hover:text-white"
                      >
                        Changer
                      </button>
                    </div>
                  </section>
                </div>
              </>
            )}
          </motion.div>
        </main>
      </div>

      {/* — Modifier mes informations — */}
      <Modal open={editOpen} onClose={() => setEditOpen(false)} title="Modifier mes informations" subtitle="Mettez à jour vos coordonnées personnelles.">
        {editError && <ErrorBanner className="mb-5">{editError}</ErrorBanner>}
        <div className="grid gap-5 sm:grid-cols-2">
          <FormField label="Prénom" required>
            <Input value={editForm.firstName} onChange={(e) => setEditForm((f) => ({ ...f, firstName: e.target.value }))} autoComplete="given-name" />
          </FormField>
          <FormField label="Nom" required>
            <Input value={editForm.lastName} onChange={(e) => setEditForm((f) => ({ ...f, lastName: e.target.value }))} autoComplete="family-name" />
          </FormField>
          <FormField label="Téléphone" required>
            <Input value={editForm.phone} onChange={(e) => setEditForm((f) => ({ ...f, phone: e.target.value }))} autoComplete="tel" />
          </FormField>
          <FormField label="Adresse email" required>
            <Input type="email" value={editForm.email} onChange={(e) => setEditForm((f) => ({ ...f, email: e.target.value }))} autoComplete="email" />
          </FormField>
        </div>
        <div className="mt-7 flex flex-wrap justify-end gap-3">
          <button type="button" onClick={() => setEditOpen(false)} className="btn-ghost">
            Annuler
          </button>
          <button type="button" onClick={saveEdit} className="btn-gold">
            Enregistrer
          </button>
        </div>
      </Modal>

      {/* — Changer mon mot de passe — */}
      <Modal open={pwOpen} onClose={() => setPwOpen(false)} title="Changer mon mot de passe" subtitle="6 caractères minimum." size="sm">
        {pwError && <ErrorBanner className="mb-5">{pwError}</ErrorBanner>}
        <div className="space-y-5">
          <FormField label="Mot de passe actuel" required>
            <Input type="password" value={pw.current} onChange={(e) => setPw((p) => ({ ...p, current: e.target.value }))} autoComplete="current-password" />
          </FormField>
          <FormField label="Nouveau mot de passe" required>
            <Input type="password" value={pw.next} onChange={(e) => setPw((p) => ({ ...p, next: e.target.value }))} autoComplete="new-password" />
          </FormField>
          <FormField label="Confirmer le nouveau mot de passe" required>
            <Input type="password" value={pw.confirm} onChange={(e) => setPw((p) => ({ ...p, confirm: e.target.value }))} autoComplete="new-password" />
          </FormField>
        </div>
        <div className="mt-7 flex flex-wrap justify-end gap-3">
          <button type="button" onClick={() => setPwOpen(false)} className="btn-ghost">
            Annuler
          </button>
          <button type="button" onClick={savePassword} className="btn-gold">
            Mettre à jour
          </button>
        </div>
      </Modal>

      {toast && (
        <div role="status" className="fixed bottom-6 right-6 z-[120] flex items-center gap-3 rounded-2xl bg-navy-900 px-5 py-4 text-white shadow-2xl">
          <Check className="h-5 w-5 shrink-0 text-gold-500" aria-hidden />
          <p className="text-sm font-medium">{toast}</p>
        </div>
      )}
    </div>
  );
}
