import { motion } from 'motion/react';
import { Search, MapPin, Building, Home as HomeIcon, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import PropertyCard from '../components/PropertyCard';
import { mockProperties } from '../data/mockData';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=2075&q=80" 
            alt="Luxury Home" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-brand-900/40" />
        </div>

        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center mt-16">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-5xl md:text-7xl lg:text-8xl font-serif text-brand-50 mb-6 leading-tight"
          >
            L'Art de <br className="hidden md:block" />
            <span className="italic text-brand-200 font-light">Vivre</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
            className="text-lg md:text-xl text-brand-50/80 mb-12 max-w-2xl mx-auto font-light tracking-wide"
          >
            Découvrez une collection exclusive de propriétés de prestige, où chaque détail incarne l'élégance absolue.
          </motion.p>

          {/* Search Box */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
            className="bg-brand-50/10 backdrop-blur-md p-2 rounded-full w-full max-w-4xl mx-auto flex flex-col md:flex-row gap-2 border border-brand-50/20"
          >
            <div className="flex-1 flex items-center bg-brand-50/90 rounded-full px-6 py-4 transition-all">
              <MapPin className="w-5 h-5 text-brand-900/50 mr-3" />
              <input 
                type="text" 
                placeholder="Où cherchez-vous ?" 
                className="bg-transparent border-none focus:outline-none w-full text-brand-900 placeholder:text-brand-900/50 font-medium"
              />
            </div>
            <div className="flex-1 flex items-center bg-brand-50/90 rounded-full px-6 py-4 transition-all">
              <Building className="w-5 h-5 text-brand-900/50 mr-3" />
              <select className="bg-transparent border-none focus:outline-none w-full text-brand-900 cursor-pointer font-medium appearance-none">
                <option value="">Type de bien</option>
                <option value="house">Maison / Villa</option>
                <option value="apartment">Appartement</option>
                <option value="land">Terrain</option>
                <option value="hotel">Hôtel</option>
              </select>
            </div>
            <button className="bg-brand-accent hover:bg-brand-900 text-brand-50 px-8 py-4 rounded-full font-medium tracking-widest uppercase text-sm transition-colors flex items-center justify-center">
              <Search className="w-4 h-4 mr-2" />
              Rechercher
            </button>
          </motion.div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-32 bg-brand-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-serif text-brand-900 mb-6">Nos Services Exclusifs</h2>
            <div className="w-24 h-px bg-brand-accent mx-auto mb-6"></div>
            <p className="text-brand-900/70 max-w-2xl mx-auto text-lg font-light">Découvrez notre gamme complète de services immobiliers adaptés à vos besoins les plus exigeants.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              {
                title: 'Propriétés de Luxe',
                desc: 'Des villas et appartements d\'exception sélectionnés pour vous.',
                icon: <HomeIcon className="w-6 h-6 text-brand-900" />,
                link: '/properties',
                img: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80'
              },
              {
                title: 'Terrains Constructibles',
                desc: 'Les meilleurs emplacements pour construire votre projet.',
                icon: <MapPin className="w-6 h-6 text-brand-900" />,
                link: '/lands',
                img: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80'
              },
              {
                title: 'Réservation d\'Hôtels',
                desc: 'Des séjours inoubliables dans nos hôtels partenaires.',
                icon: <Building className="w-6 h-6 text-brand-900" />,
                link: '/hotels',
                img: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80'
              }
            ].map((service, idx) => (
              <motion.div 
                key={idx}
                whileHover={{ y: -10 }}
                className="group flex flex-col bg-white rounded-t-full overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-brand-900/5"
              >
                <div className="h-80 overflow-hidden relative rounded-t-full m-2">
                  <img src={service.img} alt={service.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" referrerPolicy="no-referrer" />
                  <div className="absolute inset-0 bg-brand-900/20 group-hover:bg-transparent transition-colors duration-500" />
                </div>
                <div className="p-8 text-center flex flex-col items-center flex-grow">
                  <div className="w-12 h-12 rounded-full border border-brand-900/10 flex items-center justify-center mb-6">
                    {service.icon}
                  </div>
                  <h3 className="text-2xl font-serif text-brand-900 mb-3">{service.title}</h3>
                  <p className="text-brand-900/60 mb-8 font-light leading-relaxed">{service.desc}</p>
                  <Link to={service.link} className="mt-auto inline-flex items-center text-xs uppercase tracking-widest font-medium text-brand-accent hover:text-brand-900 transition-colors">
                    Découvrir <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Latest Properties Section */}
      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-serif text-brand-900 mb-6">Dernières Propriétés</h2>
            <div className="w-24 h-px bg-brand-accent mx-auto mb-6"></div>
            <p className="text-brand-900/70 max-w-2xl mx-auto text-lg font-light">Découvrez nos biens les plus récents, sélectionnés pour leur caractère exceptionnel.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {mockProperties.slice(-3).reverse().map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
          
          <div className="mt-16 text-center">
            <Link to="/properties" className="inline-flex items-center justify-center px-8 py-4 border border-brand-900 text-brand-900 hover:bg-brand-900 hover:text-brand-50 transition-colors duration-300 rounded-full uppercase tracking-widest text-sm font-medium">
              Voir toutes les propriétés
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
