// En-tête des pages de l'espace client, dans le même style que l'Accueil et À propos :
// fond bleu marine, photo à droite en dégradé, formes dorées, fil d'Ariane et titre extra-gras.
import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ChevronRight } from 'lucide-react';

export default function Hero({ crumb, pill, title, highlight, text, image, children }: {
  crumb: string;
  pill: string;
  title: string;
  highlight?: string; // mot du titre affiché en or
  text: string;
  image: string;
  children?: ReactNode; // barre de recherche, boutons…
}) {
  return (
    <section className="relative overflow-hidden bg-navy-900 text-white font-display">
      <div className="absolute inset-y-0 right-0 w-full lg:w-[58%]">
        <img src={image} alt="" className="h-full w-full object-cover" referrerPolicy="no-referrer" />
        <div className="absolute inset-0 bg-gradient-to-r from-navy-900 via-navy-900/75 to-navy-900/10" />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-900/80 via-transparent to-transparent" />
      </div>
      <svg className="absolute left-0 top-8 h-36 w-8 text-gold-500" viewBox="0 0 30 160" aria-hidden>
        <path fill="currentColor" d="M0,0 C30,30 30,120 0,160 Z" />
      </svg>
      <svg className="absolute right-0 bottom-10 h-40 w-10 text-gold-500" viewBox="0 0 40 180" aria-hidden>
        <path fill="currentColor" d="M40,0 C0,40 0,140 40,180 Z" />
      </svg>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8 pb-16 md:pt-10 md:pb-20">
        <nav className="mb-8 flex items-center gap-1 text-xs text-white/70">
          <Link to="/" className="hover:text-gold-500">Accueil</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-white">{crumb}</span>
        </nav>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="max-w-2xl flex flex-col items-start gap-5">
          <span className="inline-block rounded-md bg-white/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.15em] text-white">{pill}</span>
          <h1 className="text-4xl sm:text-5xl font-extrabold leading-[1.2] tracking-tight">
            {title} {highlight && <span className="text-gold-500">{highlight}</span>}
          </h1>
          <p className="text-sm md:text-base text-white/80 leading-relaxed max-w-lg">{text}</p>
          {children && <div className="w-full pt-3">{children}</div>}
        </motion.div>
      </div>
    </section>
  );
}
