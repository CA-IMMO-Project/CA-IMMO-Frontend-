import { motion } from 'motion/react';
import { Award, Users, Shield, Clock } from 'lucide-react';

export default function About() {
  return (
    <div className="bg-brand-50 min-h-screen">
      {/* Hero */}
      <section className="relative py-32 bg-brand-900 overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <img 
            src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=2000&q=80" 
            alt="Office" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-brand-900/50 to-brand-900"></div>
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-6xl font-serif text-brand-50 mb-8 tracking-wide"
          >
            Notre Histoire, Votre Avenir
          </motion.h1>
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="w-24 h-1 bg-brand-accent mx-auto mb-8"
          />
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-brand-50/80 font-light max-w-3xl mx-auto leading-relaxed"
          >
            Depuis plus de 15 ans, ImmoLuxe redéfinit les standards de l'immobilier de prestige, de la vente de terrains exclusifs et de l'hôtellerie de luxe.
          </motion.p>
        </div>
      </section>

      {/* Stats/Features */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            {[
              { icon: <Award className="w-8 h-8 text-brand-accent" />, title: "Excellence", desc: "Service primé à de multiples reprises" },
              { icon: <Users className="w-8 h-8 text-brand-accent" />, title: "10k+ Clients", desc: "Une communauté de clients satisfaits" },
              { icon: <Shield className="w-8 h-8 text-brand-accent" />, title: "Confiance", desc: "Transactions 100% sécurisées" },
              { icon: <Clock className="w-8 h-8 text-brand-accent" />, title: "Disponibilité", desc: "Support client 24/7" },
            ].map((item, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.6 }}
                className="p-10 bg-white rounded-2xl border border-brand-50/20 shadow-xl shadow-brand-900/5 text-center group hover:-translate-y-2 transition-transform duration-300"
              >
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-brand-50/50 mb-6 group-hover:scale-110 transition-transform duration-300">
                  {item.icon}
                </div>
                <h3 className="text-2xl font-serif text-brand-900 mb-3">{item.title}</h3>
                <p className="text-brand-900/60 font-light">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Content */}
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
                src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1000&q=80" 
                alt="Notre équipe" 
                className="relative rounded-3xl shadow-2xl object-cover h-[600px] w-full"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="lg:w-1/2 space-y-8">
              <h2 className="text-4xl font-serif text-brand-900 leading-tight">Une vision moderne de l'immobilier d'exception</h2>
              <div className="w-16 h-1 bg-brand-accent"></div>
              <p className="text-lg text-brand-900/70 font-light leading-relaxed">
                Nous croyons que la recherche d'un bien immobilier, qu'il s'agisse d'une résidence principale, d'un terrain pour construire votre projet ou d'un hôtel pour vos vacances, doit être une expérience fluide, transparente et agréable.
              </p>
              <p className="text-lg text-brand-900/70 font-light leading-relaxed">
                Notre équipe d'experts passionnés utilise les dernières technologies pour vous offrir des visites virtuelles immersives, des estimations précises basées sur l'IA et un accompagnement personnalisé à chaque étape.
              </p>
              <ul className="space-y-5 mt-10">
                {[
                  "Accompagnement sur-mesure",
                  "Expertise locale approfondie",
                  "Réseau international exclusif",
                  "Démarches administratives simplifiées"
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
    </div>
  );
}
