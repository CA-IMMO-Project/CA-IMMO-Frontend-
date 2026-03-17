import { Building2, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-brand-900 text-brand-50/70 py-16 border-t border-brand-50/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="space-y-6">
            <div className="flex items-center text-brand-50">
              <Building2 className="h-8 w-8 text-brand-accent" />
              <span className="ml-3 text-2xl font-serif tracking-wide">ImmoLuxe</span>
            </div>
            <p className="text-sm font-light leading-relaxed">
              Votre partenaire de confiance pour l'immobilier, l'achat de terrains et la réservation d'hôtels de luxe. L'excellence à chaque étape de votre projet.
            </p>
            <div className="flex space-x-5 pt-2">
              <a href="#" className="text-brand-50/50 hover:text-brand-accent transition-colors"><Facebook className="w-5 h-5" /></a>
              <a href="#" className="text-brand-50/50 hover:text-brand-accent transition-colors"><Twitter className="w-5 h-5" /></a>
              <a href="#" className="text-brand-50/50 hover:text-brand-accent transition-colors"><Instagram className="w-5 h-5" /></a>
              <a href="#" className="text-brand-50/50 hover:text-brand-accent transition-colors"><Linkedin className="w-5 h-5" /></a>
            </div>
          </div>

          <div>
            <h3 className="text-brand-50 font-serif text-lg tracking-wide mb-6">Navigation</h3>
            <ul className="space-y-3 text-sm font-light">
              <li><Link to="/properties" className="hover:text-brand-accent transition-colors">Propriétés d'Exception</Link></li>
              <li><Link to="/lands" className="hover:text-brand-accent transition-colors">Terrains Exclusifs</Link></li>
              <li><Link to="/hotels" className="hover:text-brand-accent transition-colors">Hôtels de Prestige</Link></li>
              <li><Link to="/about" className="hover:text-brand-accent transition-colors">Notre Maison</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-brand-50 font-serif text-lg tracking-wide mb-6">Services</h3>
            <ul className="space-y-3 text-sm font-light">
              <li><a href="#" className="hover:text-brand-accent transition-colors">Achat & Vente</a></li>
              <li><a href="#" className="hover:text-brand-accent transition-colors">Gestion Privée</a></li>
              <li><a href="#" className="hover:text-brand-accent transition-colors">Conciergerie</a></li>
              <li><a href="#" className="hover:text-brand-accent transition-colors">Estimation Confidentielle</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-brand-50 font-serif text-lg tracking-wide mb-6">Contact</h3>
            <ul className="space-y-4 text-sm font-light">
              <li className="flex items-start">
                <MapPin className="w-5 h-5 mr-3 text-brand-accent shrink-0" />
                <span>123 Avenue des Champs-Élysées<br/>75008 Paris, France</span>
              </li>
              <li className="flex items-center">
                <Phone className="w-5 h-5 mr-3 text-brand-accent shrink-0" />
                <span>+33 1 23 45 67 89</span>
              </li>
              <li className="flex items-center">
                <Mail className="w-5 h-5 mr-3 text-brand-accent shrink-0" />
                <span>contact@immoluxe.fr</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-brand-50/10 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center text-xs font-light text-brand-50/40">
          <p>&copy; {new Date().getFullYear()} ImmoLuxe. Tous droits réservés.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-brand-50 transition-colors">Mentions Légales</a>
            <a href="#" className="hover:text-brand-50 transition-colors">Politique de Confidentialité</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
