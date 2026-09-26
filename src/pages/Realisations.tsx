import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { CalendarDays, Clock, MapPin, Ruler, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Realisation, getRealisations } from '../admin/crm/people';
import { Thumb } from '../admin/crm/kit';

const monthLabel = (ym: string) => (ym ? new Date(`${ym}-01`).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' }) : '');

export default function Realisations() {
  const items = getRealisations()
    .filter((r) => r.published)
    .sort((a, b) => Number(b.featured) - Number(a.featured) || b.completedAt.localeCompare(a.completedAt));
  const categories = [...new Set(items.map((r) => r.category))];
  const [category, setCategory] = useState('');
  const [open, setOpen] = useState<Realisation | null>(null);
  const shown = items.filter((r) => !category || r.category === category);

  return (
    <div className="bg-brand-50 min-h-screen py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl md:text-5xl font-serif text-brand-900 mb-6 tracking-wide">
            Nos réalisations
          </motion.h1>
          <div className="w-24 h-1 bg-brand-accent mx-auto mb-6" />
          <p className="text-lg text-brand-900/70 font-light max-w-2xl mx-auto">Maisons, villas, lotissements : découvrez les projets que nous avons menés avec nos clients.</p>
        </div>

        {categories.length > 1 && (
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {['', ...categories].map((c) => (
              <button
                key={c || 'all'}
                onClick={() => setCategory(c)}
                className={`px-4 py-2 rounded-full text-sm transition-colors ${category === c ? 'bg-brand-900 text-white' : 'bg-white text-brand-900 hover:bg-brand-accent/10'}`}
              >
                {c || 'Tout'}
              </button>
            ))}
          </div>
        )}

        {shown.length === 0 ? (
          <p className="text-center py-20 text-brand-900/50 font-light">Nos réalisations seront bientôt présentées ici.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {shown.map((r, i) => (
              <motion.button
                key={r.id}
                type="button"
                onClick={() => setOpen(r)}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="text-left bg-white rounded-2xl overflow-hidden border border-brand-900/10 hover:shadow-xl transition-shadow group"
              >
                <div className="relative overflow-hidden">
                  {r.photos[0] && <Thumb file={r.photos[0]} className="w-full aspect-[4/3] group-hover:scale-105 transition-transform duration-700" />}
                  <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-white/90 text-xs uppercase tracking-widest text-brand-900">{r.category}</span>
                </div>
                <div className="p-6">
                  <h2 className="text-xl font-serif text-brand-900">{r.title}</h2>
                  <p className="flex items-center gap-1.5 text-sm text-brand-900/60 mt-2"><MapPin className="w-3.5 h-3.5" /> {r.location}{r.completedAt && ` · ${monthLabel(r.completedAt)}`}</p>
                  <p className="text-sm text-brand-900/70 font-light mt-3 line-clamp-3">{r.description}</p>
                </div>
              </motion.button>
            ))}
          </div>
        )}

        <div className="text-center mt-16">
          <p className="text-brand-900/70 mb-4">Vous avez un projet de construction ?</p>
          <Link to="/contact" className="inline-flex items-center px-8 py-3.5 rounded-full bg-brand-900 text-white hover:bg-gold-500 hover:text-navy-900 transition-colors">Parlons-en</Link>
        </div>
      </div>

      {open && <RealisationModal r={open} onClose={() => setOpen(null)} />}
    </div>
  );
}

function RealisationModal({ r, onClose }: { r: Realisation; onClose: () => void }) {
  const [i, setI] = useState(0);
  const photo = r.photos[i];
  return (
    <div className="fixed inset-0 z-[60] bg-black/70 flex items-start sm:items-center justify-center p-4 overflow-y-auto" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-4xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="relative bg-black">
          {photo && <Thumb file={photo} className="w-full max-h-[60vh] aspect-[16/10] object-contain" />}
          <button onClick={onClose} className="absolute top-3 right-3 p-2 rounded-full bg-white/90 text-brand-900" aria-label="Fermer"><X className="w-5 h-5" /></button>
          {r.photos.length > 1 && (
            <>
              <button onClick={() => setI((i - 1 + r.photos.length) % r.photos.length)} className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/90" aria-label="Précédente"><ChevronLeft className="w-5 h-5" /></button>
              <button onClick={() => setI((i + 1) % r.photos.length)} className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/90" aria-label="Suivante"><ChevronRight className="w-5 h-5" /></button>
            </>
          )}
        </div>
        <div className="p-6 md:p-8">
          <p className="text-xs uppercase tracking-widest text-brand-accent">{r.category}</p>
          <h2 className="text-2xl md:text-3xl font-serif text-brand-900 mt-2">{r.title}</h2>
          <div className="flex flex-wrap gap-x-6 gap-y-2 mt-4 text-sm text-brand-900/70">
            {r.location && <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-brand-accent" /> {r.location}</span>}
            {r.completedAt && <span className="flex items-center gap-1.5"><CalendarDays className="w-4 h-4 text-brand-accent" /> {monthLabel(r.completedAt)}</span>}
            {r.duration && <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-brand-accent" /> {r.duration}</span>}
            {r.area > 0 && <span className="flex items-center gap-1.5"><Ruler className="w-4 h-4 text-brand-accent" /> {new Intl.NumberFormat('fr-FR').format(r.area)} m²</span>}
          </div>
          <p className="mt-5 text-brand-900/80 font-light leading-relaxed whitespace-pre-line">{r.description}</p>
          {r.client && <p className="mt-4 text-sm text-brand-900/60">Client : {r.client}</p>}
        </div>
      </div>
    </div>
  );
}
