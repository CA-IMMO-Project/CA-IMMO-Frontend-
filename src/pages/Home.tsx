import { motion } from 'motion/react';
import { Search, MapPin, ArrowRight, ShieldCheck, FileCheck, HandCoins, Headset } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import LandCard from '../components/LandCard';
import { Land } from '../types';
import { fetchLands, fetchRegions } from '../lib/api';
import { formatAriary } from '../lib/format';

export default function Home() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [lands, setLands] = useState<Land[]>([]);
  const [regions, setRegions] = useState<string[]>([]);

  useEffect(() => {
    fetchLands().then(setLands).catch(() => setLands([]));
    fetchRegions().then(setRegions).catch(() => setRegions([]));
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/terrains?q=${encodeURIComponent(query)}`);
  };

  const featured = lands.filter((l) => l.status === 'disponible').slice(0, 6);
  const highlight = lands.find((l) => l.region === 'Nosy Be') ?? lands[0];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden bg-brand-900">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=2075&q=80"
            alt="Terrain à Madagascar"
            className="w-full h-full object-cover opacity-40"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-brand-900 via-brand-900/90 to-brand-900/60" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-28 md:py-36">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <motion.span
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-block text-brand-accent text-xs font-semibold uppercase tracking-[0.2em] mb-6"
              >
                Chargé d'Affaire Immobilier
              </motion.span>
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: 'easeOut' }}
                className="text-4xl md:text-6xl font-serif text-white mb-6 leading-tight"
              >
                Votre terrain <span className="text-brand-accent">vous attend</span> à Madagascar
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="text-lg text-white/75 mb-10 max-w-xl font-light leading-relaxed"
              >
                Nous vous accompagnons dans l'achat de terrains sécurisés à Antananarivo et dans toute l'île — titres vérifiés, démarches simplifiées, prix transparents.
              </motion.p>

              <motion.form
                onSubmit={handleSearch}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.35 }}
                className="bg-white/10 backdrop-blur-md p-2 rounded-full w-full max-w-xl flex flex-col sm:flex-row gap-2 border border-white/20"
              >
                <div className="flex-1 flex items-center bg-white rounded-full px-5 py-3.5">
                  <MapPin className="w-5 h-5 text-brand-900/40 mr-3 shrink-0" />
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Ville, région, quartier..."
                    className="bg-transparent border-none focus:outline-none w-full text-brand-900 placeholder:text-brand-900/40 font-medium text-sm"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-brand-accent hover:bg-white hover:text-brand-900 text-white px-7 py-3.5 rounded-full font-medium tracking-wide text-sm transition-colors flex items-center justify-center"
                >
                  <Search className="w-4 h-4 mr-2" />
                  Rechercher
                </button>
              </motion.form>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="flex flex-wrap gap-2 mt-6"
              >
                {regions.slice(0, 5).map((r) => (
                  <Link
                    key={r}
                    to={`/terrains?region=${encodeURIComponent(r)}`}
                    className="text-xs px-4 py-2 rounded-full border border-white/20 text-white/70 hover:text-brand-900 hover:bg-white transition-colors"
                  >
                    {r}
                  </Link>
                ))}
              </motion.div>
            </div>

            {/* Floating cards */}
            {highlight && (
              <div className="relative hidden lg:block h-[480px]">
                <motion.div
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  className="absolute inset-0 rounded-3xl overflow-hidden shadow-2xl"
                >
                  <img
                    src={highlight.imageUrl}
                    alt={highlight.title}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.7 }}
                  className="absolute -left-8 top-10 bg-white rounded-2xl shadow-xl p-4 w-56"
                >
                  <p className="text-xs text-brand-900/50 uppercase tracking-wide mb-1">{highlight.location}</p>
                  <p className="font-serif text-brand-900 font-semibold">{formatAriary(highlight.price)}</p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.9 }}
                  className="absolute -right-6 bottom-14 bg-white rounded-2xl shadow-xl p-4 flex items-center gap-3"
                >
                  <FileCheck className="w-8 h-8 text-brand-accent" />
                  <div>
                    <p className="text-sm font-semibold text-brand-900">Titre Foncier</p>
                    <p className="text-xs text-brand-900/50">Vérifié & sécurisé</p>
                  </div>
                </motion.div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Trust bar */}
      <section className="bg-white border-b border-brand-900/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { icon: <FileCheck className="w-6 h-6" />, title: 'Titres vérifiés', desc: 'Sécurité juridique' },
            { icon: <HandCoins className="w-6 h-6" />, title: 'Prix transparents', desc: 'Sans frais cachés' },
            { icon: <ShieldCheck className="w-6 h-6" />, title: 'Accompagnement', desc: "De A à Z" },
            { icon: <Headset className="w-6 h-6" />, title: 'Support dédié', desc: 'Réponse rapide' },
          ].map((item, idx) => (
            <div key={idx} className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-brand-50 text-brand-accent flex items-center justify-center shrink-0">
                {item.icon}
              </div>
              <div>
                <p className="text-sm font-semibold text-brand-900">{item.title}</p>
                <p className="text-xs text-brand-900/50">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Offre du moment */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center bg-brand-50 rounded-3xl overflow-hidden shadow-xl shadow-brand-900/5">
            <motion.img
              initial={{ opacity: 0, scale: 1.02 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              src="/domaine-laceo-vontovorona.jpeg"
              alt="Domaine Lacéo Vontovorona - offre de terrains"
              className="w-full h-full object-cover max-h-[520px] lg:max-h-none"
              referrerPolicy="no-referrer"
            />
            <div className="p-10 md:p-14">
              <span className="inline-block text-brand-accent text-xs font-semibold uppercase tracking-[0.2em] mb-4">
                Offre du moment
              </span>
              <h2 className="text-3xl md:text-4xl font-serif text-brand-900 mb-4">Domaine Lacéo Vontovorona</h2>
              <p className="text-brand-900/70 font-light leading-relaxed mb-8">
                Posséder un terrain, c'est garantir l'avenir des générations futures. Des lots de 500 m² à 1000 m² avec titre foncier en main, dans un cadre calme proche du lac.
              </p>
              <ul className="space-y-3 mb-10">
                {[
                  '04 lots disponibles, de 500 m² à 1000 m²',
                  'Titre foncier en main',
                  'Facilité de paiement en 12 mois',
                ].map((item) => (
                  <li key={item} className="flex items-center text-brand-900 font-medium text-sm">
                    <div className="w-2 h-2 bg-brand-accent rounded-full mr-3 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                to="/reservation?project=Domaine%20Lac%C3%A9o%20Vontovorona"
                className="inline-flex items-center justify-center px-8 py-4 bg-brand-accent hover:bg-brand-900 text-white rounded-full font-medium uppercase tracking-widest text-sm transition-colors"
              >
                Réserver un lot <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Regions / Categories */}
      <section className="py-24 bg-brand-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-serif text-brand-900 mb-3">Nos régions</h2>
              <p className="text-brand-900/60 font-light">Des opportunités foncières dans toute Madagascar.</p>
            </div>
            <Link to="/terrains" className="hidden md:flex items-center text-sm font-medium text-brand-accent hover:text-brand-900 transition-colors">
              Toutes les régions <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {regions.map((r) => {
              const sample = lands.find((l) => l.region === r);
              return (
                <Link
                  key={r}
                  to={`/terrains?region=${encodeURIComponent(r)}`}
                  className="group relative h-40 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow"
                >
                  <img
                    src={sample?.imageUrl}
                    alt={r}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-brand-900/50 group-hover:bg-brand-900/60 transition-colors" />
                  <span className="absolute bottom-4 left-4 text-white font-serif text-lg">{r}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured lands */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-serif text-brand-900 mb-3">Terrains à la une</h2>
              <p className="text-brand-900/60 font-light">Une sélection de parcelles disponibles dès maintenant.</p>
            </div>
            <Link to="/terrains" className="hidden md:flex items-center text-sm font-medium text-brand-accent hover:text-brand-900 transition-colors">
              Voir tous les terrains <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featured.map((land) => (
              <LandCard key={land.id} land={land} />
            ))}
          </div>

          <div className="mt-12 text-center md:hidden">
            <Link to="/terrains" className="inline-flex items-center justify-center px-8 py-4 border border-brand-900 text-brand-900 hover:bg-brand-900 hover:text-white transition-colors duration-300 rounded-full uppercase tracking-widest text-sm font-medium">
              Voir tous les terrains
            </Link>
          </div>
        </div>
      </section>

      {/* CTA banner */}
      <section className="py-20 bg-brand-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-gradient-to-r from-brand-accent to-brand-accent/80 p-10 md:p-16 flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <h3 className="text-2xl md:text-3xl font-serif text-white mb-3">Prêt à sécuriser votre terrain ?</h3>
              <p className="text-white/85 font-light max-w-xl">Contactez-nous dès aujourd'hui pour réserver une parcelle ou obtenir un accompagnement personnalisé.</p>
            </div>
            <Link
              to="/reservation"
              className="shrink-0 inline-flex items-center justify-center px-8 py-4 bg-white text-brand-900 rounded-full font-medium uppercase tracking-widest text-sm hover:bg-brand-900 hover:text-white transition-colors"
            >
              Réserver maintenant
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
