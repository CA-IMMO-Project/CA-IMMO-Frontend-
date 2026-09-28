import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Phone, MapPin, Send, CheckCircle, X, Facebook, Clock } from 'lucide-react';
import { FB_URL, PHONE_1, PHONE_1_TEL, PHONE_2, PHONE_2_TEL } from '../lib/contact';
import { createContactMessage } from '../lib/api';
import Hero from '../espace/Hero';

const IMG_CONTACT = 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80';

const field =
  'w-full px-4 py-3 bg-mist border border-navy-900/10 rounded-xl text-sm text-navy-900 placeholder-navy-900/40 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-gold-500 transition';
const label = 'block text-sm font-semibold text-navy-900 mb-2';

export default function Contact() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('Achat de terrain');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      await createContactMessage({ firstName, lastName, phone, email: email || undefined, subject, message });
      setIsSubmitted(true);
      setFirstName('');
      setLastName('');
      setPhone('');
      setEmail('');
      setMessage('');
      setTimeout(() => setIsSubmitted(false), 5000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue. Merci de réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const infos = [
    { icon: MapPin, title: 'Zone d’intervention', body: <>Antananarivo et toute Madagascar</> },
    {
      icon: Phone,
      title: 'Téléphone',
      body: (
        <>
          <a href={PHONE_1_TEL} className="block hover:text-gold-600 transition-colors">{PHONE_1}</a>
          <a href={PHONE_2_TEL} className="block hover:text-gold-600 transition-colors">{PHONE_2}</a>
        </>
      ),
    },
    { icon: Facebook, title: 'Facebook', body: <a href={FB_URL} target="_blank" rel="noopener noreferrer" className="hover:text-gold-600 transition-colors">CA IMMO</a> },
    { icon: Clock, title: 'Disponibilité', body: <>Lun-Sam, 8h-18h</> },
  ];

  return (
    <div className="font-display bg-white">
      <Hero
        crumb="Nous contacter"
        pill="Parlons de votre projet"
        title="Nous"
        highlight="contacter"
        text="Une question sur un terrain, un titre foncier, une vente ou une recherche ? Notre équipe vous répond rapidement."
        image={IMG_CONTACT}
      >
        <div className="flex flex-wrap gap-4">
          <a
            href={PHONE_1_TEL}
            className="inline-flex items-center gap-2 rounded-full bg-gold-500 px-7 py-3.5 text-sm font-semibold text-navy-900 shadow-lg shadow-gold-500/30 transition hover:bg-gold-400 hover:-translate-y-0.5"
          >
            <Phone className="w-4 h-4" /> Appeler maintenant
          </a>
        </div>
      </Hero>

      <section className="bg-mist py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Coordonnées */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-4"
          >
            <p className="flex items-center gap-3 text-sm font-semibold text-navy-900">
              <span className="h-[3px] w-7 rounded-full bg-gold-500" /> Nos coordonnées
            </p>
            <h2 className="text-2xl md:text-3xl font-extrabold text-navy-900 tracking-tight">Une équipe à votre écoute</h2>
            <div className="space-y-3 pt-2">
              {infos.map(({ icon: Icon, title, body }) => (
                <div key={title} className="flex items-start gap-4 rounded-2xl bg-white p-5 shadow-xl shadow-navy-900/5 border border-navy-900/5">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gold-500/15 text-gold-600">
                    <Icon className="w-5 h-5" />
                  </span>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-navy-900/60">{title}</p>
                    <div className="mt-1 text-sm font-medium text-navy-900">{body}</div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Formulaire */}
          <motion.div
            id="formulaire"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-2 relative rounded-2xl bg-white p-6 sm:p-10 shadow-xl shadow-navy-900/5 border border-navy-900/5 scroll-mt-24"
          >
            <p className="flex items-center gap-3 text-sm font-semibold text-navy-900">
              <span className="h-[3px] w-7 rounded-full bg-gold-500" /> Formulaire de contact
            </p>
            <h2 className="mt-2 mb-8 text-2xl md:text-3xl font-extrabold text-navy-900 tracking-tight">Envoyez-nous un message</h2>

            <AnimatePresence>
              {isSubmitted && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mb-6 flex items-center justify-between gap-3 rounded-xl border border-gold-500 bg-gold-400/15 px-5 py-4 text-navy-900"
                >
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-6 h-6 text-gold-600 shrink-0" />
                    <div>
                      <p className="font-semibold">Message envoyé avec succès !</p>
                      <p className="text-sm text-navy-900/70">Notre équipe vous contactera dans les plus brefs délais.</p>
                    </div>
                  </div>
                  <button onClick={() => setIsSubmitted(false)} className="rounded-full p-2 hover:bg-gold-400/30" aria-label="Fermer">
                    <X className="w-5 h-5" />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {error && <div className="mb-6 px-5 py-4 rounded-xl bg-red-50 text-red-700 text-sm">{error}</div>}

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="firstName" className={label}>Prénom</label>
                  <input type="text" id="firstName" required value={firstName} onChange={(e) => setFirstName(e.target.value)} className={field} placeholder="Rakoto" />
                </div>
                <div>
                  <label htmlFor="lastName" className={label}>Nom</label>
                  <input type="text" id="lastName" required value={lastName} onChange={(e) => setLastName(e.target.value)} className={field} placeholder="Andrianina" />
                </div>
                <div>
                  <label htmlFor="phone" className={label}>Téléphone</label>
                  <input type="tel" id="phone" required value={phone} onChange={(e) => setPhone(e.target.value)} className={field} placeholder="034 XX XXX XX" />
                </div>
                <div>
                  <label htmlFor="email" className={label}>Email <span className="font-normal text-navy-900/50">(facultatif)</span></label>
                  <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} className={field} placeholder="vous@exemple.com" />
                </div>
              </div>

              <div>
                <label htmlFor="subject" className={label}>Sujet</label>
                <select id="subject" value={subject} onChange={(e) => setSubject(e.target.value)} className={field}>
                  <option>Achat de terrain</option>
                  <option>Vente de terrain</option>
                  <option>Recherche de terrain</option>
                  <option>Vérification de titre foncier</option>
                  <option>Construction</option>
                  <option>Autre demande</option>
                </select>
              </div>

              <div>
                <label htmlFor="message" className={label}>Message</label>
                <textarea id="message" required rows={6} value={message} onChange={(e) => setMessage(e.target.value)} className={`${field} resize-none`} placeholder="Décrivez votre projet ou votre question..." />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-full bg-gold-500 px-8 py-3.5 text-sm font-semibold text-navy-900 shadow-lg shadow-gold-500/30 transition hover:bg-gold-400 hover:-translate-y-0.5 disabled:opacity-60 disabled:hover:translate-y-0"
              >
                <Send className="w-4 h-4" />
                {isSubmitting ? 'Envoi en cours...' : 'Envoyer le message'}
              </button>
            </form>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
