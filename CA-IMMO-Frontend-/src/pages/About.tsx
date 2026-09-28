import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import type { ReactNode } from 'react';
import {
  ArrowRight, ArrowRightCircle, ChevronRight, Trophy, Users, MapPin, ShieldCheck, Quote, Home as HomeIcon,
  Target, Gem, Handshake, Eye, UserCheck, Lightbulb, Leaf, Play, Plus,
} from 'lucide-react';

const IMG_VILLA = 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1400&q=80';
const IMG_BAY = 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80';
const IMG_HOUSE = 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80';
const IMG_BUILDING = 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=700&q=80';
const IMG_LANDSCAPE = 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1200&q=80';
const AVATARS = [
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=80&q=80',
];

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.6, ease: 'easeOut' as const },
};

function Pill({ children, dark = false }: { children: ReactNode; dark?: boolean }) {
  return (
    <span
      className={`inline-block rounded-md px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.15em] ${
        dark ? 'bg-white/10 text-white' : 'bg-navy-900/5 text-navy-900'
      }`}
    >
      {children}
    </span>
  );
}

function SectionTitle({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="mb-8">
      <h2 className="relative inline-block text-2xl md:text-3xl font-bold text-navy-900">
        {title}
        <span className="absolute -bottom-1 left-0 h-[3px] w-12 rounded-full bg-gold-500" />
      </h2>
      <p className="mt-3 text-sm text-slate-600">{subtitle}</p>
    </div>
  );
}

function Hand({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <p className={`font-[family-name:var(--font-hand)] text-white leading-tight -rotate-12 ${className}`}>{children}</p>
  );
}

export default function About() {
  return (
    <div className="font-display overflow-hidden bg-white">
      {/* ================= HERO ================= */}
      <section className="relative bg-navy-900 text-white pb-28 md:pb-32">
        {/* image villa avec découpe courbe à gauche */}
        <div className="absolute inset-y-0 right-0 hidden md:block w-[58%]">
          <img
            src={IMG_VILLA}
            alt="Villa moderne avec piscine"
            className="h-full w-full object-cover [clip-path:ellipse(95%_100%_at_100%_40%)]"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-navy-900/60 via-transparent to-navy-900/40 [clip-path:ellipse(95%_100%_at_100%_40%)]" />
          <Hand className="absolute right-6 top-6 text-3xl lg:text-4xl text-right">
            Des projets<br />d’aujourd’hui,<br />un meilleur demain.
            <svg viewBox="0 0 120 12" className="ml-auto mt-1 w-24 text-gold-500" aria-hidden>
              <path d="M2,8 C40,2 80,2 118,6" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round" />
            </svg>
          </Hand>
        </div>
        {/* courbes jaunes */}
        <svg className="absolute left-0 top-8 h-40 w-8 text-gold-500" viewBox="0 0 30 160" aria-hidden>
          <path fill="currentColor" d="M0,0 C30,30 30,120 0,160 Z" />
        </svg>
        <svg className="absolute left-0 bottom-10 h-32 w-24 text-gold-500" viewBox="0 0 100 130" aria-hidden>
          <path fill="currentColor" d="M0,0 C10,70 50,110 100,130 L0,130 Z" />
        </svg>
        <svg className="absolute right-0 bottom-16 h-44 w-10 text-gold-500" viewBox="0 0 40 180" aria-hidden>
          <path fill="currentColor" d="M40,0 C0,40 0,140 40,180 Z" />
        </svg>

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8 md:pt-10">
          <nav className="mb-8 flex items-center gap-1 text-xs text-white/70">
            <Link to="/" className="hover:text-gold-500">Accueil</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-white">À propos</span>
          </nav>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="max-w-lg">
            <Pill dark>Notre histoire, votre confiance</Pill>
            <h1 className="mt-4 text-4xl sm:text-5xl md:text-6xl font-extrabold leading-[1.05] tracking-tight">
              À propos de<br />CA <span className="text-gold-500">Immo</span>
            </h1>
            <p className="mt-6 text-lg md:text-xl font-semibold leading-snug">
              Plus qu’une agence immobilière,<br />un partenaire pour la vie.
            </p>
            <p className="mt-5 text-sm md:text-base text-white/80 leading-relaxed">
              Depuis plus de 12 ans, nous accompagnons les particuliers, les familles et les investisseurs dans la réalisation
              de leurs projets immobiliers à Madagascar.
            </p>
            <a
              href="#histoire"
              className="mt-8 inline-flex items-center gap-3 rounded-full bg-gold-500 px-6 py-3 text-sm font-semibold text-navy-900 shadow-lg shadow-gold-500/30 transition hover:bg-gold-400"
            >
              Notre histoire <ArrowRightCircle className="w-4 h-4" />
            </a>
          </motion.div>
        </div>

        {/* carte 500+ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="absolute right-8 bottom-36 z-10 hidden md:flex items-center gap-5 rounded-2xl bg-white p-5 pr-7 text-navy-900 shadow-2xl"
        >
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-mist">
            <Users className="w-6 h-6 text-gold-600" />
          </span>
          <div>
            <p className="text-2xl font-extrabold leading-none">500+</p>
            <p className="text-xs text-slate-500 mb-2">Clients satisfaits</p>
            <div className="flex -space-x-2">
              {AVATARS.map((a) => (
                <img key={a} src={a} alt="" className="h-7 w-7 rounded-full border-2 border-white object-cover" referrerPolicy="no-referrer" />
              ))}
              <span className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-gold-500">
                <Plus className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ================= STATS ================= */}
      <section className="relative z-20 -mt-20 px-4 sm:px-6 lg:px-8">
        <motion.div
          {...fadeUp}
          className="mx-auto max-w-7xl grid grid-cols-2 lg:grid-cols-4 gap-y-8 rounded-3xl bg-navy-900 px-6 py-8 text-white shadow-2xl shadow-navy-900/30 ring-1 ring-white/10 lg:divide-x lg:divide-white/15"
        >
          {[
            { icon: Trophy, n: '12+', l: 'ans d’expérience', d: 'Une expertise solide sur le marché immobilier.' },
            { icon: Users, n: '500+', l: 'clients satisfaits', d: 'Des familles et investisseurs qui nous font confiance.' },
            { icon: MapPin, n: '1000+', l: 'terrains proposés', d: 'Dans plusieurs régions de Madagascar.' },
            { icon: ShieldCheck, n: '100%', l: 'biens sécurisés', d: 'Des démarches encadrées et transparentes.' },
          ].map(({ icon: Icon, n, l, d }) => (
            <div key={l} className="flex gap-4 px-4 lg:px-7">
              <Icon className="w-9 h-9 shrink-0 text-gold-500" strokeWidth={1.8} />
              <div>
                <p className="text-xl font-bold leading-none">{n}</p>
                <p className="text-xs text-white/80 mb-2">{l}</p>
                <p className="text-[11px] text-white/60 leading-relaxed">{d}</p>
              </div>
            </div>
          ))}
        </motion.div>
      </section>

      {/* ================= NOTRE ENTREPRISE ================= */}
      <section className="py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid gap-14 lg:grid-cols-2 items-center">
          {/* collage */}
          <motion.div {...fadeUp} className="relative h-[330px] sm:h-[320px]">
            <img
              src={IMG_BAY}
              alt="Baie de Madagascar"
              className="absolute left-0 top-0 h-44 w-[88%] rounded-3xl rounded-tl-[4rem] object-cover shadow-lg"
              referrerPolicy="no-referrer"
            />
            <img
              src={IMG_HOUSE}
              alt="Maison clé en main"
              className="absolute right-0 bottom-0 h-48 w-[62%] rounded-3xl rounded-br-[3rem] object-cover shadow-xl border-4 border-white"
              referrerPolicy="no-referrer"
            />
            <div className="absolute left-2 bottom-2 w-44 sm:w-48 rounded-3xl bg-navy-900 p-5 text-white shadow-2xl ring-4 ring-white">
              <Quote className="w-6 h-6 fill-white mb-3" />
              <p className="text-base leading-snug">Accompagner aujourd’hui pour bâtir demain.</p>
              <span className="mt-4 block h-[3px] w-8 rounded-full bg-gold-500" />
            </div>
            <div className="absolute left-[56%] top-[28%] flex h-24 w-24 flex-col items-center justify-center rounded-full bg-navy-900 text-white ring-4 ring-gold-500 ring-offset-4 ring-offset-white shadow-xl">
              <span className="text-3xl font-bold leading-none">12+</span>
              <span className="text-[9px] text-white/80">ans à vos côtés</span>
            </div>
          </motion.div>

          <motion.div {...fadeUp}>
            <Pill>Notre entreprise</Pill>
            <h2 className="mt-3 text-3xl md:text-4xl font-bold text-navy-900 leading-tight">
              Une expertise immobilière au service de Madagascar
            </h2>
            <p className="mt-5 text-sm md:text-[15px] text-slate-600 leading-relaxed">
              CA Immo est une entreprise immobilière spécialisée dans l’achat, la vente de terrains, le lotissement, la recherche
              de biens spécifiques et les projets de maisons clé en main. Notre mission est de rendre l’immobilier plus simple,
              plus sûr et plus accessible pour tous.
            </p>
            <p className="mt-3 text-sm md:text-[15px] text-slate-600 leading-relaxed">
              Nous mettons à votre disposition une équipe passionnée, des outils modernes et un réseau de professionnels de
              confiance (notaires, géomètres, spécialistes fonciers) pour vous garantir un accompagnement complet et sécurisé.
            </p>
            <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-5 border-t border-navy-900/10 pt-6">
              {[
                { icon: HomeIcon, t: 'Proximité', d: 'Toujours à votre écoute' },
                { icon: Target, t: 'Engagement', d: 'Des solutions sur mesure' },
                { icon: Gem, t: 'Qualité', d: 'Des biens sélectionnés' },
                { icon: Handshake, t: 'Confiance', d: 'Une relation durable' },
              ].map(({ icon: Icon, t, d }) => (
                <div key={t}>
                  <Icon className="w-8 h-8 text-navy-900 mb-2" strokeWidth={1.8} />
                  <p className="text-xs font-bold text-navy-900">{t}</p>
                  <p className="text-[11px] text-slate-500">{d}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ================= HISTOIRE + MISSION ================= */}
      <section id="histoire" className="bg-mist py-14 md:py-16 scroll-mt-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid gap-10 lg:grid-cols-12 items-center">
          <motion.div {...fadeUp} className="lg:col-span-7">
            <SectionTitle title="Notre histoire" subtitle="Un parcours construit sur la confiance, l’engagement et la passion de l’immobilier." />
            <div className="relative">
              <div className="absolute left-2 right-8 top-2 hidden sm:block h-px bg-navy-900/30" />
              <div className="grid gap-8 grid-cols-2 lg:grid-cols-4">
                {[
                  { y: '2012', t: 'Création de CA Immo', d: 'Une vision claire : faciliter l’accès à la propriété.', ring: false },
                  { y: '2015', t: 'Expansion des services', d: 'Développement du lotissement et des maisons clé en main.', ring: true },
                  { y: '2020', t: 'Digitalisation', d: 'Mise en place des visites à distance et des outils numériques.', ring: true },
                  { y: '2024', t: 'Toujours plus loin', d: 'Plus de 500 clients satisfaits et des projets dans toute l’île.', ring: false },
                ].map(({ y, t, d, ring }) => (
                  <div key={y} className="relative">
                    <span
                      className={`relative z-10 mb-4 block rounded-full bg-gold-500 ${
                        ring ? 'h-4 w-4 ring-4 ring-gold-500/25 border-2 border-white' : 'h-2.5 w-2.5 mt-1 ml-0.5'
                      }`}
                    />
                    <p className="text-lg font-bold text-navy-900">{y}</p>
                    <p className="text-xs font-bold text-navy-900 mb-2">{t}</p>
                    <p className="text-[11px] text-slate-600 leading-relaxed">{d}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div {...fadeUp} className="lg:col-span-5 relative flex overflow-hidden rounded-[2rem] rounded-tr-[4rem] bg-navy-900 text-white shadow-2xl">
            <div className="flex-1 p-7 space-y-6">
              {[
                { icon: Target, t: 'Notre mission', d: 'Vous accompagner dans tous vos projets immobiliers avec professionnalisme, transparence et innovation.' },
                { icon: Eye, t: 'Notre vision', d: 'Devenir la référence immobilière à Madagascar en offrant des solutions modernes, sécurisées et accessibles à tous.' },
              ].map(({ icon: Icon, t, d }, i) => (
                <div key={t} className={`flex gap-4 ${i ? 'border-t border-white/15 pt-6' : ''}`}>
                  <Icon className="w-9 h-9 shrink-0 text-gold-500" strokeWidth={1.8} />
                  <div>
                    <p className="text-sm font-bold mb-2">{t}</p>
                    <p className="text-xs text-white/75 leading-relaxed">{d}</p>
                  </div>
                </div>
              ))}
            </div>
            <img
              src={IMG_BUILDING}
              alt="Résidence moderne"
              className="hidden sm:block w-32 md:w-36 object-cover [clip-path:ellipse(100%_75%_at_100%_50%)]"
              referrerPolicy="no-referrer"
            />
          </motion.div>
        </div>
      </section>

      {/* ================= VALEURS ================= */}
      <section className="relative bg-white">
        <div className="mx-auto max-w-7xl grid lg:grid-cols-12 items-center">
          <motion.div {...fadeUp} className="lg:col-span-8 px-4 sm:px-6 lg:px-8 py-14">
            <SectionTitle title="Nos valeurs" subtitle="Des valeurs fortes qui guident chacune de nos actions." />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { icon: Handshake, t: 'Intégrité', d: 'Des relations basées sur la transparence.' },
                { icon: UserCheck, t: 'Satisfaction client', d: 'Votre satisfaction est notre priorité.' },
                { icon: Lightbulb, t: 'Innovation', d: 'Des solutions modernes pour un immobilier plus simple.' },
                { icon: Leaf, t: 'Développement durable', d: 'Des projets qui respectent l’environnement et les communautés.' },
              ].map(({ icon: Icon, t, d }) => (
                <div key={t}>
                  <span className="mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-gold-500/20">
                    <Icon className="w-5 h-5 text-navy-900" />
                  </span>
                  <p className="text-sm font-bold text-navy-900 mb-1">{t}</p>
                  <p className="text-[11px] text-slate-600 leading-relaxed">{d}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <div className="lg:col-span-4 relative h-64 lg:h-full lg:min-h-[300px]">
            <img
              src={IMG_LANDSCAPE}
              alt="Paysage de Madagascar"
              className="absolute inset-0 h-full w-full object-cover lg:[clip-path:polygon(22%_0,100%_0,100%_100%,0_100%)]"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-navy-900/25 lg:[clip-path:polygon(22%_0,100%_0,100%_100%,0_100%)]" />
            <span className="absolute left-[13%] top-0 hidden lg:block h-full w-2 bg-gold-500 origin-top -skew-x-[11deg]" />
            <Hand className="absolute right-6 top-8 text-3xl text-right">
              Pour un Madagascar<br />plus beau demain !
            </Hand>
          </div>
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="relative bg-navy-900 text-white">
        <img src={IMG_LANDSCAPE} alt="" className="absolute inset-0 h-full w-full object-cover opacity-15" referrerPolicy="no-referrer" />
        <svg className="absolute left-0 bottom-0 h-full w-10 text-gold-500" viewBox="0 0 40 120" preserveAspectRatio="none" aria-hidden>
          <path fill="currentColor" d="M0,40 C30,70 30,110 0,120 Z" />
        </svg>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-16 py-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <motion.div {...fadeUp}>
            <p className="text-lg font-semibold">Vous avez un projet ?</p>
            <p className="text-2xl md:text-3xl font-bold mb-2">Parlons-en ensemble !</p>
            <p className="text-xs md:text-sm text-white/75 max-w-md">
              Notre équipe est à votre écoute pour vous conseiller et vous accompagner dans la réalisation de vos projets.
            </p>
          </motion.div>
          <motion.div {...fadeUp} className="flex items-center gap-6">
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 rounded-full bg-gold-500 px-6 py-3 text-sm font-semibold text-navy-900 shadow-lg shadow-gold-500/30 transition hover:bg-gold-400"
            >
              Parler à un conseiller <ArrowRight className="w-4 h-4" />
            </Link>
            <span className="hidden sm:block h-10 w-3 rounded-r-full border-r-2 border-gold-500" />
            <button type="button" className="group flex items-center gap-4 text-left">
              <span className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-white transition group-hover:bg-white group-hover:text-navy-900">
                <Play className="w-5 h-5 fill-current" />
              </span>
              <span className="text-sm leading-tight">Découvrez<br />notre présentation</span>
            </button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
