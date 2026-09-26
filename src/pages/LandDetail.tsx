import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import {
  ArrowLeft,
  ArrowRight,
  Banknote,
  CalendarDays,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Copy,
  Droplets,
  Heart,
  LandPlot,
  MapPin,
  Maximize2,
  Navigation,
  Route as RoadIcon,
  Share2,
  ShieldCheck,
  WalletCards,
  X,
  Zap,
} from 'lucide-react';
import MapVisual from '../components/MapVisual';
import LandCard from '../components/LandCard';
import { ChoiceCards, EmptyState, ErrorBanner, Eyebrow, FormField, Input, Modal, ProgressSteps, Select, Textarea } from '../components/ui';
import { AccountNote, AuthModal } from '../components/AuthModule';
import { AuthUser, useAuth } from '../lib/auth';
import { Land } from '../types';
import { createReservation, fetchLand, fetchLands, ReservationPayload } from '../lib/api';
import { formatArea, formatAriary } from '../lib/format';
import { landReference, normalizeLand, pricePerSqm, useFavorites } from '../lib/land';

function requestNumber(prefix: 'ACH' | 'VIS'): string {
  const d = new Date();
  const yy = String(d.getFullYear()).slice(2);
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${prefix}-${yy}${mm}${dd}`;
}

/* ============================ Formulaires ============================ */

function InterestForm({ land, onDone }: { land: Land; onDone: (ref: string) => void }) {
  const { user } = useAuth();
  const [authOpen, setAuthOpen] = useState(false);
  const pendingRef = useRef<ReservationPayload | null>(null);
  const [step, setStep] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    birthDate: '',
    profession: '',
    country: 'Madagascar',
    bankAccount: 'Oui',
    deadline: 'Dès que possible',
    payment: 'Comptant' as 'Comptant' | 'Facilité',
    duration: '0–4 mois',
    downPaymentAmount: '',
    message: '',
  });
  const set = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) => setForm((f) => ({ ...f, [k]: v }));

  useEffect(() => {
    if (user) {
      setForm((f) => ({
        ...f,
        firstName: f.firstName || user.firstName,
        lastName: f.lastName || user.lastName,
        phone: f.phone || user.phone,
        email: f.email || user.email,
      }));
    }
  }, [user]);

  const next = () => {
    setError(null);
    if (step === 0 && (!form.firstName.trim() || !form.lastName.trim() || !form.phone.trim() || !form.email.trim())) {
      setError('Veuillez compléter vos coordonnées avant de continuer.');
      return;
    }
    setStep((s) => Math.min(s + 1, 2));
  };
  const back = () => {
    setError(null);
    setStep((s) => Math.max(s - 1, 0));
  };

  const finalize = async (payload: ReservationPayload, asUser: AuthUser) => {
    const ref = requestNumber('ACH');
    await createReservation({
      ...payload,
      ref,
      userId: asUser.id,
      fullName: payload.fullName || asUser.fullName,
      phone: payload.phone || asUser.phone,
      email: payload.email || asUser.email,
    });
    onDone(ref);
  };

  const submit = () => {
    const payload: ReservationPayload = {
      kind: 'interet',
      landId: land.id,
      fullName: `${form.firstName} ${form.lastName}`.trim(),
      phone: form.phone,
      email: form.email,
      profession: form.profession,
      bankAccount: form.bankAccount,
      nationality: form.country,
      paymentMode: form.payment,
      duration: form.payment === 'Facilité' ? form.duration : undefined,
      downPaymentAmount: form.payment === 'Facilité' ? form.downPaymentAmount : undefined,
      message: [`Délai souhaité : ${form.deadline}`, form.message.trim()].filter(Boolean).join('\n'),
    };
    if (!user) {
      pendingRef.current = payload;
      setAuthOpen(true);
      return;
    }
    void finalize(payload, user);
  };

  return (
    <div>
      <ProgressSteps steps={['Profil', 'Projet', 'Financement']} current={step} />

      <div className="mt-9">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            <div className="mb-7">
              <span className="text-xs font-semibold uppercase tracking-[0.22em] text-navy-900/65">
                Étape {step + 1} sur 3
              </span>
              <h3 className="mt-2 text-xl font-bold text-navy-900">
                {['Parlons un peu de vous', 'Votre projet d’achat', 'Votre financement'][step]}
              </h3>
              <p className="mt-1.5 text-xs font-normal text-navy-900/80">
                {[
                  'Ces informations permettent à notre équipe de vous recontacter.',
                  'Délais et précisions pour mieux préparer les échanges.',
                  'Choisissez vos modalités, vérifiez le résumé, et c’est envoyé.',
                ][step]}
              </p>
              {error && <ErrorBanner className="mt-4">{error}</ErrorBanner>}
            </div>

            {/* — Étape 1 : Profil — */}
            {step === 0 && (
              <div>
                <div className="grid gap-5 sm:grid-cols-2">
                  <FormField label="Prénom" required>
                    <Input placeholder="Votre prénom" value={form.firstName} onChange={(e) => set('firstName', e.target.value)} />
                  </FormField>
                  <FormField label="Nom" required>
                    <Input placeholder="Votre nom" value={form.lastName} onChange={(e) => set('lastName', e.target.value)} />
                  </FormField>
                  <FormField label="Téléphone" required>
                    <Input type="tel" placeholder="+261 34 00 000 00" value={form.phone} onChange={(e) => set('phone', e.target.value)} />
                  </FormField>
                  <FormField label="Adresse email" required>
                    <Input type="email" placeholder="vous@exemple.com" value={form.email} onChange={(e) => set('email', e.target.value)} />
                  </FormField>
                  <FormField label="Date de naissance">
                    <Input type="date" value={form.birthDate} onChange={(e) => set('birthDate', e.target.value)} />
                  </FormField>
                  <FormField label="Profession">
                    <Input placeholder="Ex. Entrepreneur" value={form.profession} onChange={(e) => set('profession', e.target.value)} />
                  </FormField>
                  <FormField label="Pays de résidence" required>
                    <Select value={form.country} onChange={(e) => set('country', e.target.value)}>
                      <option>Madagascar</option>
                      <option>France</option>
                      <option>La Réunion</option>
                      <option>Autre</option>
                    </Select>
                  </FormField>
                  <FormField label="Titulaire d’un compte bancaire ?" required>
                    <Select value={form.bankAccount} onChange={(e) => set('bankAccount', e.target.value)}>
                      <option>Oui</option>
                      <option>Non</option>
                    </Select>
                  </FormField>
                </div>
                <p className="mt-6 flex items-start gap-2.5 text-xs font-normal leading-relaxed text-navy-900/80">
                  <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-green-700" />
                  Vos informations restent confidentielles. Aucune donnée bancaire sensible ne vous sera jamais demandée.
                </p>
              </div>
            )}

            {/* — Étape 2 : Projet — */}
            {step === 1 && (
              <div className="space-y-6">
                <FormField label="Quand souhaitez-vous concrétiser ?" required>
                  <ChoiceCards
                    value={form.deadline}
                    onChange={(v) => set('deadline', v)}
                    options={[
                      { value: 'Dès que possible', label: 'Dès que possible' },
                      { value: 'Sous 1 mois', label: 'Sous 1 mois' },
                      { value: '1 à 3 mois', label: '1 à 3 mois' },
                      { value: 'À définir', label: 'À définir ensemble' },
                    ]}
                  />
                </FormField>
                <FormField label="Parlez-nous de votre projet">
                  <Textarea
                    rows={5}
                    placeholder="Un mot sur votre projet, vos questions, vos disponibilités pour une visite…"
                    value={form.message}
                    onChange={(e) => set('message', e.target.value)}
                  />
                </FormField>
              </div>
            )}

            {/* — Étape 3 : Financement — */}
            {step === 2 && (
              <div className="space-y-6">
                <FormField label="Mode de paiement souhaité" required>
                  <ChoiceCards<'Comptant' | 'Facilité'>
                    value={form.payment}
                    onChange={(v) => set('payment', v)}
                    options={[
                      { value: 'Comptant', label: 'Paiement comptant', description: 'Règlement en une fois', icon: Banknote },
                      { value: 'Facilité', label: 'Facilité de paiement', description: 'Paiement échelonné', icon: WalletCards },
                    ]}
                  />
                </FormField>
                {form.payment === 'Facilité' && (
                  <div className="grid gap-5 sm:grid-cols-2">
                    <FormField label="Durée souhaitée" required>
                      <Select value={form.duration} onChange={(e) => set('duration', e.target.value)}>
                        <option>0–4 mois</option>
                        <option>4–6 mois</option>
                        <option>6–10 mois</option>
                        <option>10–12 mois</option>
                        <option>Autre durée</option>
                      </Select>
                    </FormField>
                    <FormField label="Apport initial disponible" required>
                      <Input type="number" min={0} placeholder="Ex. 35 000 000 Ar" value={form.downPaymentAmount} onChange={(e) => set('downPaymentAmount', e.target.value)} />
                    </FormField>
                  </div>
                )}

                <div className="flex items-center gap-4 rounded-2xl border border-navy-900/8 bg-white px-5 py-4">
                  <LandPlot className="h-5 w-5 shrink-0 text-gold-700" />
                  <div>
                    <strong className="block text-sm font-medium text-navy-900">{land.title}</strong>
                    <span className="text-xs font-normal text-navy-900/80">
                      {formatAriary(land.price)} • Réf. {landReference(land)}
                    </span>
                  </div>
                </div>

                <AccountNote />
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="mt-9 flex items-center justify-between border-t border-navy-900/8 pt-7">
        {step > 0 ? (
          <button onClick={back} className="btn-ghost">
            <ChevronLeft className="h-4 w-4" /> Retour
          </button>
        ) : (
          <span />
        )}
        {step < 2 ? (
          <button onClick={next} className="btn-gold">
            Continuer <ChevronRight className="h-4 w-4" />
          </button>
        ) : (
          <button onClick={submit} className="btn-gold">
            Envoyer ma demande <ArrowRight className="h-4 w-4" />
          </button>
        )}
      </div>

      <AuthModal
        open={authOpen}
        onClose={() => setAuthOpen(false)}
        onSuccess={(u) => {
          setAuthOpen(false);
          if (pendingRef.current) void finalize(pendingRef.current, u);
        }}
      />
    </div>
  );
}

function VisitForm({ land, onDone }: { land: Land; onDone: (ref: string) => void }) {
  const { user } = useAuth();
  const [authOpen, setAuthOpen] = useState(false);
  const pendingRef = useRef<ReservationPayload | null>(null);
  const [form, setForm] = useState({ date: '', time: '10:00', fullName: '', phone: '', message: '' });
  const set = (k: keyof typeof form, v: string) => setForm((f) => ({ ...f, [k]: v }));
  const today = new Date().toISOString().slice(0, 10);

  const finalize = async (payload: ReservationPayload, asUser: AuthUser) => {
    const ref = requestNumber('VIS');
    await createReservation({
      ...payload,
      ref,
      userId: asUser.id,
      fullName: payload.fullName || asUser.fullName,
      phone: payload.phone || asUser.phone,
      email: asUser.email,
    });
    onDone(ref);
  };

  const submit = async () => {
    const payload: ReservationPayload = {
      kind: 'visite',
      landId: land.id,
      fullName: form.fullName,
      phone: form.phone,
      visitDate: form.date,
      visitTime: form.time,
      message: form.message,
    };
    if (!user) {
      pendingRef.current = payload;
      setAuthOpen(true);
      return;
    }
    await finalize(payload, user);
  };

  return (
    <div>
      <p className="mb-7 text-sm font-normal leading-relaxed text-navy-900/85">
        Choisissez un créneau : un membre de notre équipe se déplace avec vous et répond à vos questions sur place.
      </p>

      <div className="grid gap-5 sm:grid-cols-2">
        <FormField label="Date souhaitée" required>
          <Input type="date" min={today} value={form.date} onChange={(e) => set('date', e.target.value)} />
        </FormField>
        <FormField label="Heure souhaitée" required>
          <Select value={form.time} onChange={(e) => set('time', e.target.value)}>
            <option>09:00</option>
            <option>10:00</option>
            <option>11:30</option>
            <option>14:00</option>
            <option>15:30</option>
          </Select>
        </FormField>
        <FormField label="Votre nom et prénom" required className="sm:col-span-2">
          <Input placeholder="Nom complet" value={form.fullName} onChange={(e) => set('fullName', e.target.value)} />
        </FormField>
        <FormField label="Numéro de téléphone" required className="sm:col-span-2">
          <Input type="tel" placeholder="+261 34 00 000 00" value={form.phone} onChange={(e) => set('phone', e.target.value)} />
        </FormField>
        <FormField label="Commentaire (facultatif)" className="sm:col-span-2">
          <Textarea rows={3} placeholder="Une question ou une précision pour la visite ?" value={form.message} onChange={(e) => set('message', e.target.value)} />
        </FormField>
      </div>

      <p className="mt-5 flex items-center gap-2.5 text-xs font-normal text-navy-900/80">
        <Clock3 className="h-4 w-4 shrink-0 text-gold-700" />
        CA IMMO confirmera le créneau par SMS et par téléphone.
      </p>

      <div className="mt-8 space-y-4">
        <AccountNote />
        <div className="flex justify-end">
          <button className="btn-gold disabled:cursor-not-allowed disabled:opacity-40" disabled={!form.date || !form.fullName || !form.phone} onClick={submit}>
            Demander cette visite <CalendarDays className="h-4 w-4" />
          </button>
        </div>
      </div>

      <AuthModal
        open={authOpen}
        onClose={() => setAuthOpen(false)}
        onSuccess={(u) => {
          setAuthOpen(false);
          if (pendingRef.current) void finalize(pendingRef.current, u);
        }}
      />
    </div>
  );
}

/* ============================ Page ============================ */

export default function LandDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [land, setLand] = useState<Land | null | undefined>(undefined);
  const [related, setRelated] = useState<Land[]>([]);
  const { isFavorite, toggleFavorite } = useFavorites();

  const [lightbox, setLightbox] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);
  const [shared, setShared] = useState(false);
  const [interest, setInterest] = useState(false);
  const [visit, setVisit] = useState(false);
  const [success, setSuccess] = useState<{ kind: 'interest' | 'visit'; ref: string } | null>(null);

  useEffect(() => {
    if (!id) return;
    fetchLand(id).then((found) => {
      setLand(found ?? null);
      if (found) {
        document.title = `CA IMMO | ${found.title}`;
        fetchLands({}).then((all) => {
          const others = all.filter((l) => l.id !== found.id);
          const sameRegion = others.filter((l) => l.region === found.region);
          setRelated([...sameRegion, ...others.filter((l) => l.region !== found.region)].slice(0, 3));
        });
      }
    }).catch(() => setLand(null));
    return () => {
      document.title = 'CA IMMO | Vente de Terrains à Madagascar';
    };
  }, [id]);

  useEffect(() => {
    if (lightbox === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightbox(null);
      if (e.key === 'ArrowRight' && land) setLightbox((i) => ((i ?? 0) + 1) % normalizeLand(land).gallery.length);
      if (e.key === 'ArrowLeft' && land) setLightbox((i) => ((i ?? 0) - 1 + normalizeLand(land).gallery.length) % normalizeLand(land).gallery.length);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lightbox, land]);

  const full = useMemo(() => (land ? normalizeLand(land) : null), [land]);

  if (land === undefined) {
    return (
      <div className="grid min-h-[60vh] place-items-center bg-mist">
        <p className="animate-pulse text-sm font-normal text-navy-900/75">Chargement du terrain…</p>
      </div>
    );
  }

  if (land === null || !full) {
    return (
      <div className="bg-mist px-4 py-20 md:py-28">
        <div className="mx-auto max-w-2xl">
          <EmptyState
            icon={MapPin}
            title="Terrain introuvable"
            text="Ce terrain n’est plus disponible ou n’existe pas. Découvrez le reste de notre sélection."
            action="Retour aux terrains"
            onAction={() => navigate('/terrains')}
          />
        </div>
      </div>
    );
  }

  const fav = isFavorite(land.id);
  const ref = landReference(land);
  const perSqm = pricePerSqm(land);
  const [lat, lng] = land.coordinates ?? [0, 0];

  const copyRef = async () => {
    try {
      await navigator.clipboard.writeText(ref);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  };

  const share = async () => {
    try {
      if (navigator.share) {
        await navigator.share({ title: land.title, url: window.location.href });
        return;
      }
      await navigator.clipboard.writeText(window.location.href);
      setShared(true);
      setTimeout(() => setShared(false), 2000);
    } catch {
      /* ignore */
    }
  };

  const specs = [
    { icon: Maximize2, label: 'Superficie', value: formatArea(land.area) },
    { icon: LandPlot, label: 'Relief', value: full.relief },
    { icon: RoadIcon, label: 'Accessibilité', value: full.access },
    { icon: Zap, label: 'Électricité', value: full.electricity ? 'Disponible' : 'À raccorder' },
    { icon: Droplets, label: 'Eau', value: full.water ? 'Disponible' : 'À prévoir' },
  ];

  return (
        <div className="font-display overflow-hidden bg-mist">
      {/* — Barre supérieure — */}
      <div className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <button onClick={() => navigate('/terrains')} className="btn-ghost !px-4 !py-2.5 !text-xs">
            <ArrowLeft className="h-4 w-4" /> Retour aux terrains
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={() => toggleFavorite(land.id)}
              className={`btn-outline !px-5 !py-2.5 !text-xs ${fav ? '!border-gold-500 !text-gold-700' : ''}`}
            >
              <Heart className="h-4 w-4" fill={fav ? 'currentColor' : 'none'} />
              {fav ? 'Enregistré' : 'Enregistrer'}
            </button>
            <button onClick={share} className="btn-outline !px-5 !py-2.5 !text-xs">
              <Share2 className="h-4 w-4" />
              {shared ? 'Lien copié !' : 'Partager'}
            </button>
          </div>
        </div>
      </div>

      {/* — Galerie asymétrique — */}
      <section className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
        <div className="grid gap-3 md:grid-cols-[1.55fr_1fr]">
          <button
            onClick={() => setLightbox(0)}
            className="group relative h-[22rem] overflow-hidden rounded-3xl bg-navy-900/5 md:h-[30rem]"
          >
            <img
              src={full.gallery[0]}
              alt={land.title}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
              referrerPolicy="no-referrer"
            />
            <span className="absolute bottom-5 left-5 rounded-full bg-white/92 px-4 py-2 text-xs font-semibold text-navy-900 backdrop-blur-md transition group-hover:bg-white">
              Agrandir la photo
            </span>
          </button>
          <div className="grid gap-3">
            {[1, 2].map((g) => (
              <button
                key={g}
                onClick={() => setLightbox(g)}
                className="group relative h-[10.5rem] overflow-hidden rounded-3xl bg-navy-900/5 md:h-[14.5rem]"
              >
                {full.gallery[g] && (
                  <img
                    src={full.gallery[g]}
                    alt={`Vue du terrain ${g + 1}`}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                    referrerPolicy="no-referrer"
                  />
                )}
                {g === 2 && full.gallery.length > 3 && (
                  <span className="absolute bottom-4 right-4 rounded-full bg-white/92 px-4 py-2 text-xs font-semibold text-navy-900 backdrop-blur-md">
                    Toutes les photos <span className="text-gold-700">+{full.gallery.length - 3}</span>
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* — Contenu — */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="gap-14 lg:grid lg:grid-cols-[1fr_22rem] xl:gap-20">
          <div>
            {/* Titre */}
            <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}>
              <h1 className="mt-5 max-w-2xl text-3xl font-bold leading-tight tracking-tight text-navy-900 md:text-5xl">
                {land.title}
              </h1>
              <p className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm font-normal text-navy-900/80">
                <MapPin className="h-4 w-4" />
                {land.location}
                <a href="#localisation" className="text-link !text-xs">
                  Voir sur la carte
                </a>
              </p>
            </motion.div>

            {/* Caractéristiques clés */}
            <div className="mt-10 grid grid-cols-2 gap-y-7 border-y border-navy-900/8 py-8 sm:grid-cols-3 lg:grid-cols-5">
              {specs.map(({ icon: Icon, label, value }, i) => (
                <div key={label} className={`px-2 ${i > 0 ? 'sm:border-l sm:border-navy-900/8 sm:pl-6' : ''}`}>
                  <Icon className="h-4.5 w-4.5 text-gold-700" strokeWidth={2} />
                  <small className="mt-3 block text-xs font-semibold uppercase tracking-[0.18em] text-navy-900/65">{label}</small>
                  <strong className="mt-1 block text-sm font-medium leading-snug text-navy-900">{value}</strong>
                </div>
              ))}
            </div>

            {/* À propos */}
            <div className="mt-12">
              <Eyebrow>À propos</Eyebrow>
              <h2 className="mt-4 text-2xl font-bold text-navy-900 md:text-3xl">Ce terrain en quelques mots</h2>
              <p className="mt-5 max-w-2xl text-sm font-normal leading-[1.9] text-navy-900/90">{land.description}</p>
              <div className="mt-6 flex flex-wrap gap-2">
                {land.features.map((f) => (
                  <span key={f} className="chip-off !cursor-default !bg-white/70">
                    {f}
                  </span>
                ))}
              </div>
              <div className="mt-8 flex items-center justify-between rounded-2xl bg-white px-6 py-4">
                <span className="text-xs font-normal text-navy-900/75">Référence du terrain</span>
                <strong className="flex items-center gap-2 text-sm font-medium text-navy-900">
                  {ref}
                  <button onClick={copyRef} aria-label="Copier la référence" className="rounded-full p-2 -m-1 text-navy-900/70 transition hover:bg-navy-900/5 hover:text-gold-700">
                    <Copy className="h-3.5 w-3.5" />
                  </button>
                  {copied && <span className="text-xs font-medium text-green-700">Copié !</span>}
                </strong>
              </div>
            </div>

            {/* Localisation */}
            <div id="localisation" className="mt-14 scroll-mt-28">
              <div className="flex flex-wrap items-end justify-between gap-4">
                <h2 className="text-2xl font-bold text-navy-900 md:text-3xl">Localisation</h2>
                {land.coordinates && (
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-link !text-xs"
                  >
                    <Navigation className="h-3.5 w-3.5" /> Itinéraire
                  </a>
                )}
              </div>
              {land.coordinates ? (
                <div className="mt-6 overflow-hidden rounded-3xl border border-navy-900/8">
                  <MapVisual label={full.zone} pin={{ x: 50, y: 52 }} className="h-[22rem]" />
                </div>
              ) : (
                <div className="mt-6 rounded-3xl border border-dashed border-navy-900/15 bg-white/60 px-8 py-14 text-center text-sm font-normal text-navy-900/75">
                  Emplacement communiqué lors de la prise de contact.
                </div>
              )}
              <p className="mt-4 flex items-start gap-3 text-xs font-normal leading-relaxed text-navy-900/80">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold-700" />
                <span>
                  <strong className="font-medium text-navy-900">{land.location}</strong>
                  <br />
                  Emplacement approximatif — la position exacte est communiquée lors de la visite.
                </span>
              </p>
            </div>

            {/* Documents */}
            <div className="mt-14">
              <h2 className="text-2xl font-bold text-navy-900 md:text-3xl">Documents disponibles</h2>
              <p className="mt-3 text-sm font-normal text-navy-900/80">
                Pièces contrôlées par notre équipe et consultables sur rendez-vous.
              </p>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {full.documents.map((d) => (
                  <div key={d} className="flex items-center gap-4 rounded-2xl border border-navy-900/8 bg-white px-5 py-4">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-navy-900/5 text-navy-900/90">
                      <ShieldCheck className="h-4.5 w-4.5" strokeWidth={2} />
                    </span>
                    <div>
                      <strong className="block text-sm font-medium text-navy-900">{d}</strong>
                      <small className="text-xs font-normal text-navy-900/70">Reçu et contrôlé</small>
                    </div>
                    <CheckCircle2 className="ml-auto h-4.5 w-4.5 text-green-700" />
                  </div>
                ))}
              </div>
            </div>

            {/* Paiement */}
            <div className="mt-14">
              <h2 className="text-2xl font-bold text-navy-900 md:text-3xl">Conditions de paiement</h2>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {[
                  { icon: Banknote, label: 'Prix total', value: formatAriary(land.price) },
                  { icon: LandPlot, label: 'Prix au m²', value: `${formatAriary(perSqm)} / m²` },
                  { icon: WalletCards, label: 'Acompte demandé', value: full.downPayment },
                  { icon: Clock3, label: 'Durée maximale', value: full.installments },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex items-center gap-4 rounded-2xl border border-navy-900/8 bg-white px-6 py-5">
                    <Icon className="h-5 w-5 shrink-0 text-gold-700" strokeWidth={2} />
                    <span>
                      <small className="block text-xs font-semibold uppercase tracking-[0.18em] text-navy-900/65">{label}</small>
                      <strong className="mt-1 block text-sm font-medium text-navy-900">{value}</strong>
                    </span>
                  </div>
                ))}
              </div>
              <p className="mt-5 rounded-2xl bg-gold-500/8 px-6 py-4 text-xs font-normal leading-relaxed text-navy-900/85">
                {full.payment} — les conditions finales sont soumises à l’accord du propriétaire et formalisées par
                CA IMMO. Les prix sont négociables selon le projet.
              </p>
            </div>
          </div>

          {/* — Colonne latérale — */}
          <aside className="mt-14 lg:mt-0">
            <div className="lg:sticky lg:top-28">
              <div className="card-soft p-8">
                <span className="text-xs font-semibold uppercase tracking-[0.22em] text-navy-900/70">Prix du terrain</span>
                <strong className="mt-2 block font-serif text-3xl font-bold text-navy-900">
                  {formatAriary(land.price)}
                </strong>
                <small className="mt-1 block text-xs font-normal text-navy-900/75">soit {formatAriary(perSqm)} / m²</small>

                <div className="my-7 h-px bg-navy-900/8" />

                <ul className="space-y-3.5">
                  {[
                    { icon: WalletCards, text: full.payment, tone: 'text-gold-700' },
                    { icon: CalendarDays, text: 'Visite possible sur rendez-vous', tone: 'text-green-700' },
                    { icon: ShieldCheck, text: 'Accompagnement notaire & géomètre', tone: 'text-green-700' },
                  ].map(({ icon: Icon, text, tone }) => (
                    <li key={text} className="flex items-center gap-3 text-sm font-normal text-navy-900/90">
                      <Icon className={`h-4 w-4 shrink-0 ${tone}`} />
                      {text}
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => setInterest(true)}
                  disabled={land.status === 'vendu'}
                  className="btn-gold mt-8 w-full disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Je suis intéressé <ArrowRight className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setVisit(true)}
                  disabled={land.status === 'vendu'}
                  className="btn-outline mt-3 w-full disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <CalendarDays className="h-4 w-4" /> Demander une visite
                </button>
                <p className="mt-4 text-center text-xs font-normal text-navy-900/70">
                  Réponse d’un conseiller sous 24 h ouvrées.
                </p>
              </div>

              {/* Conseil sécurité */}
              <div className="mt-5 flex items-start gap-3.5 rounded-[1.5rem] border border-gold-500/25 bg-gold-500/8 px-6 py-5">
                <ShieldCheck className="mt-0.5 h-4.5 w-4.5 shrink-0 text-gold-700" />
                <div>
                  <strong className="text-xs font-semibold text-navy-900">Conseil sécurité</strong>
                  <p className="mt-1 text-xs font-normal leading-relaxed text-navy-900/85">
                    Ne versez aucun acompte sans document officiel de CA IMMO.
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* — Terrains similaires — */}
      {related.length > 0 && (
        <section className="border-t border-navy-900/8 bg-white/50 py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap items-end justify-between gap-6">
              <div>
                <Eyebrow>À découvrir aussi</Eyebrow>
                <h2 className="mt-4 text-3xl font-bold text-navy-900">Terrains similaires</h2>
              </div>
              <Link to="/terrains" className="text-link">
                Voir tous les terrains <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="mt-10 grid gap-7 md:grid-cols-2 xl:grid-cols-3">
              {related.map((l) => (
                <LandCard key={l.id} land={l} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* — Modales — */}
      <Modal
        open={interest}
        onClose={() => setInterest(false)}
        title="Votre projet d’achat"
        subtitle={`Terrain ${ref} • ${land.location}`}
        size="lg"
      >
        <InterestForm
          land={land}
          onDone={(reqRef) => {
            setInterest(false);
            setSuccess({ kind: 'interest', ref: reqRef });
          }}
        />
      </Modal>

      <Modal open={visit} onClose={() => setVisit(false)} title="Planifier une visite" subtitle={`${land.title} • ${land.location}`}>
        <VisitForm
          land={land}
          onDone={(reqRef) => {
            setVisit(false);
            setSuccess({ kind: 'visit', ref: reqRef });
          }}
        />
      </Modal>

      <Modal open={!!success} onClose={() => setSuccess(null)} size="sm">
        <div className="flex flex-col items-center py-4 text-center">
          <span className="grid h-16 w-16 place-items-center rounded-full bg-brand-accent/10">
            <CheckCircle2 className="h-8 w-8 text-green-700" strokeWidth={2} />
          </span>
          <h2 className="mt-6 text-2xl font-bold text-navy-900">
            {success?.kind === 'visit' ? 'Demande de visite envoyée !' : 'Votre intérêt est enregistré !'}
          </h2>
          <p className="mt-3 max-w-xs text-sm font-normal leading-relaxed text-navy-900/85">
            {success?.kind === 'visit'
              ? 'Notre équipe vérifie la disponibilité du conseiller. Vous recevrez une confirmation par téléphone et SMS.'
              : `Notre équipe CA IMMO vous contactera sous 24 heures ouvrées pour qualifier votre projet.`}
          </p>
          <div className="mt-6 w-full rounded-2xl border border-navy-900/8 bg-white px-6 py-4">
            <small className="block text-xs font-semibold uppercase tracking-[0.2em] text-navy-900/65">Numéro de demande</small>
            <strong className="mt-1 block tracking-[0.12em] text-navy-900">{success?.ref}</strong>
          </div>
          <button onClick={() => setSuccess(null)} className="btn-gold mt-7 w-full">
            Terminé
          </button>
        </div>
      </Modal>

      {/* — Visionneuse — */}
      {lightbox !== null && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label="Visionneuse de photos"
          tabIndex={-1}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-[110] flex items-center justify-center bg-navy-950/92 p-4 sm:p-10"
          onMouseDown={() => setLightbox(null)}
        >
          <button
            onClick={() => setLightbox(null)}
            aria-label="Fermer la visionneuse"
            className="absolute right-5 top-5 rounded-full border border-white/25 p-2.5 text-white/80 transition hover:bg-white hover:text-navy-900"
          >
            <X className="h-5 w-5" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setLightbox((i) => ((i ?? 0) - 1 + full.gallery.length) % full.gallery.length);
            }}
            aria-label="Photo précédente"
            className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full border border-white/25 p-3 text-white/80 transition hover:bg-white hover:text-navy-900 sm:left-8"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setLightbox((i) => ((i ?? 0) + 1) % full.gallery.length);
            }}
            aria-label="Photo suivante"
            className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full border border-white/25 p-3 text-white/80 transition hover:bg-white hover:text-navy-900 sm:right-8"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
          <motion.img
            key={lightbox}
            initial={{ opacity: 0, scale: 0.985 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            src={full.gallery[lightbox]}
            alt={`${land.title} — photo ${lightbox + 1}`}
            className="max-h-full max-w-full rounded-2xl object-contain"
            onMouseDown={(e) => e.stopPropagation()}
          />
          <span className="absolute bottom-6 left-1/2 -translate-x-1/2 rounded-full bg-white/10 px-4 py-2 text-xs font-medium tracking-widest text-white backdrop-blur-sm">
            {lightbox + 1} / {full.gallery.length}
          </span>
        </motion.div>
      )}
    </div>
  );
}
