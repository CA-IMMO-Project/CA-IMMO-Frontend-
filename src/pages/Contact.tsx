import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Phone, MapPin, Send, CheckCircle, X } from 'lucide-react';

export default function Contact() {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    // Optional: Auto-hide after 5 seconds
    setTimeout(() => {
      setIsSubmitted(false);
    }, 5000);
  };

  return (
    <div className="bg-brand-50 min-h-screen py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl font-serif text-brand-900 mb-6 tracking-wide"
          >
            Contactez-nous
          </motion.h1>
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="w-24 h-1 bg-brand-accent mx-auto mb-6"
          />
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-brand-900/70 font-light max-w-2xl mx-auto leading-relaxed"
          >
            Notre équipe est à votre disposition pour répondre à toutes vos questions et vous accompagner dans vos projets les plus ambitieux.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          {/* Contact Info */}
          <div className="lg:col-span-1 space-y-8">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="bg-white p-10 rounded-3xl shadow-xl shadow-brand-900/5 border border-brand-50/20"
            >
              <h3 className="text-2xl font-serif text-brand-900 mb-8">Informations</h3>
              <div className="space-y-8">
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-14 h-14 bg-brand-50/50 rounded-full flex items-center justify-center text-brand-accent">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div className="ml-5">
                    <p className="text-sm font-medium text-brand-900 uppercase tracking-wider">Notre Maison</p>
                    <p className="text-sm text-brand-900/70 font-light mt-2 leading-relaxed">123 Avenue des Champs-Élysées<br/>75008 Paris, France</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-14 h-14 bg-brand-50/50 rounded-full flex items-center justify-center text-brand-accent">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div className="ml-5">
                    <p className="text-sm font-medium text-brand-900 uppercase tracking-wider">Téléphone</p>
                    <p className="text-sm text-brand-900/70 font-light mt-2">+33 1 23 45 67 89</p>
                    <p className="text-xs text-brand-900/50 font-light mt-1">Lun-Ven, 9h-18h</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-14 h-14 bg-brand-50/50 rounded-full flex items-center justify-center text-brand-accent">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div className="ml-5">
                    <p className="text-sm font-medium text-brand-900 uppercase tracking-wider">Email</p>
                    <p className="text-sm text-brand-900/70 font-light mt-2">contact@immoluxe.fr</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Contact Form */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="lg:col-span-2 bg-white p-10 md:p-12 rounded-3xl shadow-xl shadow-brand-900/5 border border-brand-50/20 relative"
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
                      <p className="font-medium">Message envoyé avec succès !</p>
                      <p className="text-sm text-emerald-700/80 font-light mt-0.5">Notre équipe vous contactera dans les plus brefs délais.</p>
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

            <form className="space-y-8" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-brand-900 mb-3">Prénom</label>
                  <input type="text" id="firstName" required className="w-full px-5 py-4 bg-brand-50/50 border border-brand-900/10 rounded-xl focus:ring-2 focus:ring-brand-accent focus:border-brand-accent transition-all duration-300 font-light text-brand-900 placeholder-brand-900/40" placeholder="Jean" />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-brand-900 mb-3">Nom</label>
                  <input type="text" id="lastName" required className="w-full px-5 py-4 bg-brand-50/50 border border-brand-900/10 rounded-xl focus:ring-2 focus:ring-brand-accent focus:border-brand-accent transition-all duration-300 font-light text-brand-900 placeholder-brand-900/40" placeholder="Dupont" />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-brand-900 mb-3">Email</label>
                  <input type="email" id="email" required className="w-full px-5 py-4 bg-brand-50/50 border border-brand-900/10 rounded-xl focus:ring-2 focus:ring-brand-accent focus:border-brand-accent transition-all duration-300 font-light text-brand-900 placeholder-brand-900/40" placeholder="jean@exemple.com" />
                </div>
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-brand-900 mb-3">Sujet</label>
                  <select id="subject" className="w-full px-5 py-4 bg-brand-50/50 border border-brand-900/10 rounded-xl focus:ring-2 focus:ring-brand-accent focus:border-brand-accent transition-all duration-300 font-light text-brand-900 appearance-none">
                    <option>Achat immobilier</option>
                    <option>Vente de bien</option>
                    <option>Achat de terrain</option>
                    <option>Réservation d'hôtel</option>
                    <option>Autre demande</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-brand-900 mb-3">Message</label>
                <textarea id="message" required rows={6} className="w-full px-5 py-4 bg-brand-50/50 border border-brand-900/10 rounded-xl focus:ring-2 focus:ring-brand-accent focus:border-brand-accent transition-all duration-300 font-light text-brand-900 placeholder-brand-900/40 resize-none" placeholder="Comment pouvons-nous vous accompagner ?"></textarea>
              </div>

              <button type="submit" className="w-full bg-brand-900 hover:bg-brand-800 text-brand-50 font-medium py-4 px-8 rounded-full transition-all duration-300 flex items-center justify-center shadow-lg shadow-brand-900/20">
                <Send className="w-5 h-5 mr-3" />
                Envoyer le message
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
