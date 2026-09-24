import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle, X, Send, Phone, Facebook, ClipboardList, FileSignature, HandCoins, Search } from 'lucide-react';
import { Land } from '../types';
import { createReservation, fetchLands } from '../lib/api';
import { formatAriary, formatArea } from '../lib/format';
import { FB_URL, PHONE_1, PHONE_1_TEL, PHONE_2, PHONE_2_TEL } from '../lib/contact';

const steps = [
  { icon: <Search className="w-6 h-6" />, title: 'Choisissez un terrain', desc: 'Parcourez nos parcelles disponibles et sélectionnez celle qui vous convient.' },
  { icon: <ClipboardList className="w-6 h-6" />, title: 'Envoyez votre demande', desc: 'Remplissez le formulaire ci-dessous ou contactez-nous directement.' },
  { icon: <HandCoins className="w-6 h-6" />, title: 'Versez un acompte', desc: 'Un acompte sécurise votre réservation pendant la vérification du titre.' },
  { icon: <FileSignature className="w-6 h-6" />, title: 'Signature de l\'acte', desc: 'Nous finalisons la transaction en toute transparence.' },
];

export default function Reservation() {
  const [searchParams] = useSearchParams();
  const preselected = searchParams.get('terrain') ?? '';
  const project = searchParams.get('project');
  const [selectedLand, setSelectedLand] = useState(preselected);
  const [availableLands, setAvailableLands] = useState<Land[]>([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const defaultMessage = project ? `Je suis intéressé(e) par : ${project}` : '';

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [budget, setBudget] = useState('');
  const [profession, setProfession] = useState('');
  const [bankAccount, setBankAccount] = useState('');
  const [age, setAge] = useState('');
  const [nationality, setNationality] = useState('');
  const [message, setMessage] = useState(defaultMessage);

  useEffect(() => {
    fetchLands()
      .then((lands) => setAvailableLands(lands.filter((l) => l.status !== 'vendu')))
      .catch(() => setAvailableLands([]));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      await createReservation({
        fullName,
        phone,
        email: email || undefined,
        budget: budget || undefined,
        profession: profession || undefined,
        bankAccount: bankAccount || undefined,
        age: age ? Number(age) : undefined,
        nationality: nationality || undefined,
        message: message || undefined,
        landId: selectedLand || undefined,
        projectName: project ?? undefined,
      });
      setIsSubmitted(true);
      setFullName('');
      setPhone('');
      setEmail('');
      setBudget('');
      setProfession('');
      setBankAccount('');
      setAge('');
      setNationality('');
      setMessage('');
      setTimeout(() => setIsSubmitted(false), 6000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue. Merci de réessayer.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-brand-50 min-h-screen">
      {/* Hero */}
      <section className="relative py-28 bg-brand-900 overflow-hidden">
        <div className="absolute inset-0 opacity-25">
          <img
            src="https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=2000&q=80"
            alt="Réservation de terrain"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-brand-900/40 to-brand-900" />
        </div>
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-serif text-white mb-6 tracking-wide"
          >
            Réservez votre terrain
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="text-lg text-white/80 font-light max-w-2xl mx-auto leading-relaxed"
          >
            Sécurisez dès aujourd'hui la parcelle de votre choix. Notre équipe vous accompagne jusqu'à la signature de l'acte.
          </motion.p>
        </div>
      </section>

      {/* Steps */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {steps.map((s, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="relative bg-brand-50 rounded-2xl p-8 text-center"
              >
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-brand-accent text-white text-sm font-semibold flex items-center justify-center">
                  {idx + 1}
                </div>
                <div className="w-14 h-14 mx-auto rounded-full bg-brand-900 text-brand-accent flex items-center justify-center mb-5 mt-2">
                  {s.icon}
                </div>
                <h3 className="text-lg font-serif text-brand-900 mb-2">{s.title}</h3>
                <p className="text-sm text-brand-900/60 font-light leading-relaxed">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Form + sidebar */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-2 bg-white p-10 md:p-12 rounded-3xl shadow-xl shadow-brand-900/5 border border-brand-900/5 relative order-2 lg:order-1"
            >
              <AnimatePresence>
                {isSubmitted && (
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="absolute top-0 left-0 right-0 -mt-20 bg-emerald-50 border border-emerald-200 text-emerald-800 px-6 py-4 rounded-2xl flex items-center justify-between shadow-lg shadow-emerald-900/5"
                  >
                    <div className="flex items-center">
                      <CheckCircle className="w-6 h-6 text-emerald-500 mr-3" />
                      <div>
                        <p className="font-medium">Demande de réservation envoyée !</p>
                        <p className="text-sm text-emerald-700/80 font-light mt-0.5">Nous vous contactons rapidement pour confirmer les détails.</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setIsSubmitted(false)}
                      className="text-emerald-600 hover:text-emerald-800 transition-colors p-2 rounded-full hover:bg-emerald-100"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              <h2 className="text-2xl font-serif text-brand-900 mb-8">Formulaire de réservation</h2>

              {error && (
                <div className="mb-6 px-5 py-4 rounded-xl bg-red-50 text-red-700 text-sm">{error}</div>
              )}

              <form className="space-y-8" onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="land" className="block text-sm font-medium text-brand-900 mb-3">Terrain souhaité</label>
                  <select
                    id="land"
                    value={selectedLand}
                    onChange={(e) => setSelectedLand(e.target.value)}
                    className="w-full px-5 py-4 bg-brand-50 border border-brand-900/10 rounded-xl focus:ring-2 focus:ring-brand-accent focus:border-brand-accent transition-all duration-300 font-light text-brand-900 appearance-none"
                  >
                    <option value="">Je ne sais pas encore / autre demande</option>
                    {availableLands.map((land) => (
                      <option key={land.id} value={land.id}>
                        {land.title} — {land.location} — {formatAriary(land.price)}
                      </option>
                    ))}
                  </select>
                  {selectedLand && (() => {
                    const land = availableLands.find((l) => l.id === selectedLand);
                    if (!land) return null;
                    return (
                      <div className="mt-4 flex items-center gap-4 bg-brand-50 rounded-xl p-4">
                        <img src={land.imageUrl} alt={land.title} className="w-20 h-20 rounded-lg object-cover" referrerPolicy="no-referrer" />
                        <div className="text-sm">
                          <p className="font-medium text-brand-900">{land.title}</p>
                          <p className="text-brand-900/60">{formatArea(land.area)} · {land.titleStatus}</p>
                          <p className="text-brand-accent font-semibold mt-1">{formatAriary(land.price)}</p>
                        </div>
                      </div>
                    );
                  })()}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <label htmlFor="fullName" className="block text-sm font-medium text-brand-900 mb-3">Nom complet</label>
                    <input type="text" id="fullName" required value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full px-5 py-4 bg-brand-50 border border-brand-900/10 rounded-xl focus:ring-2 focus:ring-brand-accent focus:border-brand-accent transition-all duration-300 font-light text-brand-900 placeholder-brand-900/40" placeholder="Rakoto Andrianina" />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-brand-900 mb-3">Téléphone</label>
                    <input type="tel" id="phone" required value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full px-5 py-4 bg-brand-50 border border-brand-900/10 rounded-xl focus:ring-2 focus:ring-brand-accent focus:border-brand-accent transition-all duration-300 font-light text-brand-900 placeholder-brand-900/40" placeholder="034 XX XXX XX" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-brand-900 mb-3">Email (facultatif)</label>
                    <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-5 py-4 bg-brand-50 border border-brand-900/10 rounded-xl focus:ring-2 focus:ring-brand-accent focus:border-brand-accent transition-all duration-300 font-light text-brand-900 placeholder-brand-900/40" placeholder="vous@exemple.com" />
                  </div>
                  <div>
                    <label htmlFor="budget" className="block text-sm font-medium text-brand-900 mb-3">Budget approximatif (Ar)</label>
                    <input type="text" id="budget" value={budget} onChange={(e) => setBudget(e.target.value)} className="w-full px-5 py-4 bg-brand-50 border border-brand-900/10 rounded-xl focus:ring-2 focus:ring-brand-accent focus:border-brand-accent transition-all duration-300 font-light text-brand-900 placeholder-brand-900/40" placeholder="Ex: 50 000 000 Ar" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <label htmlFor="profession" className="block text-sm font-medium text-brand-900 mb-3">Profession</label>
                    <input type="text" id="profession" value={profession} onChange={(e) => setProfession(e.target.value)} className="w-full px-5 py-4 bg-brand-50 border border-brand-900/10 rounded-xl focus:ring-2 focus:ring-brand-accent focus:border-brand-accent transition-all duration-300 font-light text-brand-900 placeholder-brand-900/40" placeholder="Ex: Commerçant, Fonctionnaire..." />
                  </div>
                  <div>
                    <label htmlFor="age" className="block text-sm font-medium text-brand-900 mb-3">Âge</label>
                    <input type="number" id="age" min="18" value={age} onChange={(e) => setAge(e.target.value)} className="w-full px-5 py-4 bg-brand-50 border border-brand-900/10 rounded-xl focus:ring-2 focus:ring-brand-accent focus:border-brand-accent transition-all duration-300 font-light text-brand-900 placeholder-brand-900/40" placeholder="Ex: 35" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <label htmlFor="nationality" className="block text-sm font-medium text-brand-900 mb-3">Nationalité</label>
                    <input type="text" id="nationality" value={nationality} onChange={(e) => setNationality(e.target.value)} className="w-full px-5 py-4 bg-brand-50 border border-brand-900/10 rounded-xl focus:ring-2 focus:ring-brand-accent focus:border-brand-accent transition-all duration-300 font-light text-brand-900 placeholder-brand-900/40" placeholder="Ex: Malgache" />
                  </div>
                  <div>
                    <label htmlFor="bankAccount" className="block text-sm font-medium text-brand-900 mb-3">Compte bancaire (facultatif)</label>
                    <input type="text" id="bankAccount" value={bankAccount} onChange={(e) => setBankAccount(e.target.value)} className="w-full px-5 py-4 bg-brand-50 border border-brand-900/10 rounded-xl focus:ring-2 focus:ring-brand-accent focus:border-brand-accent transition-all duration-300 font-light text-brand-900 placeholder-brand-900/40" placeholder="N° de compte / IBAN" />
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-brand-900 mb-3">Message</label>
                  <textarea id="message" rows={5} value={message} onChange={(e) => setMessage(e.target.value)} className="w-full px-5 py-4 bg-brand-50 border border-brand-900/10 rounded-xl focus:ring-2 focus:ring-brand-accent focus:border-brand-accent transition-all duration-300 font-light text-brand-900 placeholder-brand-900/40 resize-none" placeholder="Précisez la région souhaitée, la surface, ou toute autre information utile..."></textarea>
                </div>

                <p className="text-sm text-brand-900/60 font-light text-center">
                  La réservation est valable <strong className="text-brand-900">7 jours</strong> et <strong className="text-brand-900">non remboursable</strong>.
                </p>

                <button type="submit" disabled={isSubmitting} className="w-full bg-brand-accent hover:bg-brand-900 disabled:opacity-60 text-white font-medium py-4 px-8 rounded-full transition-all duration-300 flex items-center justify-center shadow-lg shadow-brand-900/20">
                  <Send className="w-5 h-5 mr-3" />
                  {isSubmitting ? 'Envoi en cours...' : 'Envoyer ma demande de réservation'}
                </button>
              </form>
            </motion.div>

            {/* Sidebar */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-1 order-1 lg:order-2 space-y-6"
            >
              <div className="bg-brand-900 rounded-3xl p-8 text-white">
                <h3 className="text-xl font-serif mb-4">Réserver plus vite ?</h3>
                <p className="text-white/70 font-light text-sm mb-6 leading-relaxed">
                  Contactez-nous directement par téléphone ou Messenger pour une réponse immédiate.
                </p>
                <div className="space-y-3">
                  <a href={PHONE_1_TEL} className="flex items-center justify-center w-full bg-brand-accent hover:bg-white hover:text-brand-900 text-white font-medium py-3.5 rounded-full transition-colors">
                    <Phone className="w-4 h-4 mr-2" /> {PHONE_1}
                  </a>
                  <a href={PHONE_2_TEL} className="flex items-center justify-center w-full bg-brand-accent hover:bg-white hover:text-brand-900 text-white font-medium py-3.5 rounded-full transition-colors">
                    <Phone className="w-4 h-4 mr-2" /> {PHONE_2}
                  </a>
                  <a href={FB_URL} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-full border border-white/30 hover:bg-white hover:text-brand-900 text-white font-medium py-3.5 rounded-full transition-colors">
                    <Facebook className="w-4 h-4 mr-2" /> Messenger
                  </a>
                </div>
              </div>

              <div className="bg-white rounded-3xl p-8 border border-brand-900/5 shadow-sm">
                <h3 className="text-lg font-serif text-brand-900 mb-4">Bon à savoir</h3>
                <ul className="space-y-4 text-sm text-brand-900/70 font-light">
                  <li className="flex gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-brand-accent mt-2 shrink-0" />
                    La réservation immobilise le terrain pendant la vérification du titre foncier.
                  </li>
                  <li className="flex gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-brand-accent mt-2 shrink-0" />
                    Un acompte est demandé pour confirmer la réservation.
                  </li>
                  <li className="flex gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-brand-accent mt-2 shrink-0" />
                    La réservation est valable 7 jours et n'est pas remboursable.
                  </li>
                  <li className="flex gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-brand-accent mt-2 shrink-0" />
                    Tous nos terrains font l'objet d'une vérification avant la vente.
                  </li>
                </ul>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
