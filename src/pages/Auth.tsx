import { Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'motion/react';
import { Bell, CalendarDays, Heart, Search } from 'lucide-react';
import { AuthForm } from '../components/AuthModule';
import { useAuth } from '../lib/auth';

const benefits = [
  { icon: Search, title: 'Suivez vos demandes', text: 'Achat, visite, réservation — tout au même endroit.' },
  { icon: CalendarDays, title: 'Vos visites planifiées', text: 'Créneaux et confirmations retrouvés en un clic.' },
  { icon: Heart, title: 'Vos favoris', text: 'Gardez une trace des terrains qui vous intéressent.' },
  { icon: Bell, title: 'Des réponses rapides', text: 'Notre équipe vous recontacte sous 24 h ouvrées.' },
];

export default function Auth() {
  const [params] = useSearchParams();
  const initialMode = params.get('mode') === 'login' ? 'login' : 'register';
  // Destination après connexion : page d'origine si précisée (ex. /compte), sinon l'espace client.
  const rawRedirect = params.get('redirect') ?? '/compte';
  const redirect = rawRedirect.startsWith('/') ? rawRedirect : '/compte';
  const navigate = useNavigate();
  const { user } = useAuth();

  // Connexion / inscription réussie (ou compte déjà actif) : direction la destination choisie.
  if (user) return <Navigate to={redirect} replace />;

  return (
    <div className="font-display overflow-hidden bg-mist">
      {/* — Hero navy : formulaire visible dès le haut, sans scroll — */}
      <section className="relative overflow-hidden bg-navy-900 text-white">
        {/* Galettes dorées — signature des pages Accueil / À propos */}
        <svg className="absolute left-0 top-8 h-24 w-5 text-gold-500 md:h-32 md:w-7" viewBox="0 0 30 160" aria-hidden>
          <path fill="currentColor" d="M0,0 C30,30 30,120 0,160 Z" />
        </svg>
        <svg className="absolute bottom-16 right-0 h-32 w-8 text-gold-500" viewBox="0 0 40 180" aria-hidden>
          <path fill="currentColor" d="M40,0 C0,40 0,140 40,180 Z" />
        </svg>

        <div className="relative z-10 mx-auto grid max-w-7xl gap-10 px-4 pb-32 pt-8 sm:px-6 lg:grid-cols-12 lg:gap-14 lg:px-8 lg:pb-36">
          {/* Formulaire — EN PREMIER sur mobile, à droite sur grand écran */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="order-1 lg:order-2 lg:col-span-5"
          >
            <div className="card-soft p-7 text-navy-900 sm:p-9">
              <h2 className="text-2xl font-bold tracking-tight text-navy-900">Bienvenue</h2>
              <p className="mt-1 text-sm text-navy-900/85">Créez votre compte ou connectez-vous pour accéder à votre espace.</p>
              <div className="mt-6">
                <AuthForm
                  initialMode={initialMode}
                  onSuccess={() => navigate(redirect, { replace: true })}
                  submitLabels={{ register: 'Créer mon compte', login: 'Se connecter' }}
                />
              </div>
            </div>
          </motion.div>

          {/* Parole de marque */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="order-2 lg:order-1 lg:col-span-7"
          >
            <span className="inline-block rounded-md bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.15em]">
              Votre espace CA IMMO
            </span>
            <h1 className="mt-4 max-w-xl text-4xl font-extrabold leading-[1.05] tracking-tight md:text-5xl">
              Un compte pour <span className="text-gold-500">valider</span> et suivre vos demandes
            </h1>
            <p className="mt-5 max-w-xl text-sm leading-relaxed text-white/80 md:text-base">
              Créer votre compte prend 30 secondes. Il vous permet d’envoyer vos demandes d’achat ou de visite, de les
              suivre, et de conserver l’historique de vos échanges avec notre équipe.
            </p>
            <div className="mt-9 grid gap-x-8 gap-y-6 sm:grid-cols-2">
              {benefits.map(({ icon: Icon, title, text }) => (
                <div key={title} className="flex gap-3.5">
                  <Icon className="mt-0.5 h-6 w-6 shrink-0 text-gold-500" strokeWidth={2} />
                  <div>
                    <strong className="block text-sm font-semibold">{title}</strong>
                    <p className="mt-1 text-xs leading-relaxed text-white/75">{text}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Courbe descendante */}
        <svg className="absolute -bottom-px left-0 z-0 block h-14 w-full text-mist md:h-20" viewBox="0 0 1440 90" preserveAspectRatio="none" aria-hidden>
          <path fill="currentColor" d="M0,0 C330,72 830,95 1440,72 L1440,92 L0,92 Z" />
        </svg>
      </section>
    </div>
  );
}
