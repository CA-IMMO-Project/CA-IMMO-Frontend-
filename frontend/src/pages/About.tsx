import { motion } from 'motion/react';
import { Award, MapPinned, ShieldCheck, Clock, FileSearch, Scale, Ruler, HandshakeIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Phone, Facebook } from 'lucide-react';
import { FB_URL, PHONE_1, PHONE_1_TEL } from '../lib/contact';

export default function About() {
  return (
    <div className="bg-brand-50 min-h-screen">
      {/* Hero */}
      <section className="relative py-32 bg-brand-900 overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <img
            src="https://images.unsplash.com/photo-1464082354059-27db6ce50048?auto=format&fit=crop&w=2000&q=80"
            alt="Madagascar"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-brand-900/40 to-brand-900"></div>
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block text-brand-accent text-xs font-semibold uppercase tracking-[0.2em] mb-6"
          >
            À propos de CA IMMO
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-serif text-white mb-8 tracking-wide"
          >
            Votre Chargé d'Affaire Immobilier à Madagascar
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-white/80 font-light max-w-3xl mx-auto leading-relaxed"
          >
            Nous accompagnons particuliers et investisseurs dans l'achat de terrains sécurisés, des grandes villes aux régions côtières.
          </motion.p>
        </div>
      </section>

      {/* Stats */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            {[
              { icon: <Award className="w-8 h-8 text-brand-accent" />, title: '12 ans d\'expérience', desc: 'Une connaissance fine du foncier malgache' },
              { icon: <MapPinned className="w-8 h-8 text-brand-accent" />, title: '8 régions couvertes', desc: 'Antananarivo, Toamasina, Nosy Be et plus' },
              { icon: <ShieldCheck className="w-8 h-8 text-brand-accent" />, title: 'Titres sécurisés', desc: 'Vérification rigoureuse avant chaque vente' },
              { icon: <Clock className="w-8 h-8 text-brand-accent" />, title: 'Disponibilité', desc: 'Une équipe réactive à votre écoute' },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.6 }}
                className="p-10 bg-white rounded-2xl border border-brand-900/5 shadow-xl shadow-brand-900/5 text-center group hover:-translate-y-2 transition-transform duration-300"
              >
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-brand-50 mb-6 group-hover:scale-110 transition-transform duration-300">
                  {item.icon}
                </div>
                <h3 className="text-2xl font-serif text-brand-900 mb-3">{item.title}</h3>
                <p className="text-brand-900/60 font-light">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Who we are */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-20 items-center">
            <div className="lg:w-1/2 relative">
              <div className="absolute inset-0 bg-brand-accent/10 rounded-3xl transform translate-x-4 translate-y-4"></div>
              <motion.img
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                src="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1000&q=80"
                alt="Terrains à Madagascar"
                className="relative rounded-3xl shadow-2xl object-cover h-[560px] w-full"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="lg:w-1/2 space-y-8">
              <h2 className="text-4xl font-serif text-brand-900 leading-tight">Notre mission : créateur de projets immobiliers</h2>
              <div className="w-16 h-1 bg-brand-accent"></div>
              <p className="text-lg text-brand-900/70 font-light leading-relaxed">
                Chez CA IMMO, nous sommes créateurs de projets immobiliers : achat, vente, et tout type de projet trouve sa place chez nous. Notre rôle est de sécuriser chaque étape et d'augmenter la valeur de votre terrain.
              </p>
              <p className="text-lg text-brand-900/70 font-light leading-relaxed">
                Que vous cherchiez un terrain pour construire votre résidence, développer un projet agricole ou investir dans le tourisme, notre équipe vous propose des parcelles vérifiées et un accompagnement personnalisé jusqu'à la signature.
              </p>
              <p className="text-lg text-brand-900/70 font-light leading-relaxed">
                Notre objectif : permettre à chacun d'acquérir un terrain, où qu'il soit, avec une quittance en bonne et due forme, même à partir de 500 000 Ar.
              </p>
              <ul className="space-y-5 mt-10">
                {[
                  'Prospection foncière ciblée',
                  'Vérification des titres et du cadastre',
                  'Prix compétitif, négociable sur le prix et le mode de paiement',
                  'Calendrier souple',
                  'Facilité de paiement sans intérêt',
                  'Accompagnement jusqu\'à la signature',
                  'Partenariat bancaire pour financer votre construction',
                  'Satisfait ou remboursé en cas de non satisfaction',
                ].map((item, idx) => (
                  <li key={idx} className="flex items-center text-brand-900 font-medium">
                    <div className="w-2 h-2 bg-brand-accent rounded-full mr-4" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* What we do */}
      <section className="py-24 bg-brand-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif text-brand-900 mb-4">Ce que nous faisons</h2>
            <p className="text-brand-900/60 font-light max-w-2xl mx-auto">Un accompagnement complet, de la recherche du terrain à la remise des documents.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { icon: <FileSearch className="w-7 h-7" />, title: 'Vérification de titres', desc: 'Contrôle rigoureux de la situation juridique de chaque parcelle.' },
              { icon: <Scale className="w-7 h-7" />, title: 'Accompagnement légal', desc: 'Rédaction et suivi des actes en toute conformité.' },
              { icon: <Ruler className="w-7 h-7" />, title: 'Bornage & mesurage', desc: 'Délimitation précise avant chaque transaction.' },
              { icon: <HandshakeIcon className="w-7 h-7" />, title: 'Négociation', desc: 'Défense de vos intérêts pour un prix juste.' },
            ].map((s, idx) => (
              <div key={idx} className="bg-white rounded-2xl p-8 shadow-sm border border-brand-900/5 hover:shadow-xl transition-shadow">
                <div className="w-14 h-14 rounded-xl bg-brand-900 text-brand-accent flex items-center justify-center mb-5">
                  {s.icon}
                </div>
                <h3 className="text-lg font-serif text-brand-900 mb-2">{s.title}</h3>
                <p className="text-sm text-brand-900/60 font-light leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-brand-900 p-10 md:p-16 flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <h3 className="text-2xl md:text-3xl font-serif text-white mb-3">Un projet de terrain à Madagascar ?</h3>
              <p className="text-white/70 font-light max-w-xl">Contactez-nous par téléphone ou sur Facebook, notre équipe vous répond rapidement.</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <a href={PHONE_1_TEL} className="inline-flex items-center justify-center px-7 py-4 bg-brand-accent text-white rounded-full font-medium uppercase tracking-widest text-sm hover:bg-white hover:text-brand-900 transition-colors">
                <Phone className="w-4 h-4 mr-2" /> {PHONE_1}
              </a>
              <a href={FB_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center px-7 py-4 border border-white/30 text-white rounded-full font-medium uppercase tracking-widest text-sm hover:bg-white hover:text-brand-900 transition-colors">
                <Facebook className="w-4 h-4 mr-2" /> Facebook
              </a>
            </div>
          </div>
          <div className="text-center mt-10">
            <Link to="/terrains" className="text-brand-accent hover:text-brand-900 font-medium transition-colors">
              Découvrir nos terrains disponibles →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
