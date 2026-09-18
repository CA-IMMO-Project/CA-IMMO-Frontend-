import { Phone, MapPin, Facebook } from 'lucide-react';
import { Link } from 'react-router-dom';
import { FB_URL, PHONE_1, PHONE_1_TEL, PHONE_2, PHONE_2_TEL } from '../lib/contact';

export default function Footer() {
  return (
    <footer className="bg-brand-900 text-white/70 py-16 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="space-y-6">
            <div className="flex items-center text-white">
              <img src="/Logo.jpeg" alt="CA IMMO" className="h-16 w-16 rounded-xl object-cover" />
            </div>
            <p className="text-sm font-light leading-relaxed">
              Chargé d'Affaire Immobilier spécialisé dans la vente de terrains à Madagascar. Titres sécurisés, accompagnement de confiance, à chaque étape de votre projet.
            </p>
            <div className="flex space-x-5 pt-2">
              <a
                href={FB_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/60 hover:text-brand-accent transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-white font-serif text-lg tracking-wide mb-6">Navigation</h3>
            <ul className="space-y-3 text-sm font-light">
              <li><Link to="/terrains" className="hover:text-brand-accent transition-colors">Nos Terrains</Link></li>
              <li><Link to="/reservation" className="hover:text-brand-accent transition-colors">Réservation</Link></li>
              <li><Link to="/about" className="hover:text-brand-accent transition-colors">À Propos</Link></li>
              <li><Link to="/contact" className="hover:text-brand-accent transition-colors">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-serif text-lg tracking-wide mb-6">Services</h3>
            <ul className="space-y-3 text-sm font-light">
              <li className="text-white/70">Vente de terrains</li>
              <li className="text-white/70">Vérification de titres fonciers</li>
              <li className="text-white/70">Accompagnement juridique</li>
              <li className="text-white/70">Bornage & prospection</li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-serif text-lg tracking-wide mb-6">Contact</h3>
            <ul className="space-y-4 text-sm font-light">
              <li className="flex items-start">
                <MapPin className="w-5 h-5 mr-3 text-brand-accent shrink-0" />
                <span>Intervention dans toute Madagascar</span>
              </li>
              <li className="flex items-center">
                <Phone className="w-5 h-5 mr-3 text-brand-accent shrink-0" />
                <span className="flex flex-col">
                  <a href={PHONE_1_TEL} className="hover:text-brand-accent transition-colors">{PHONE_1}</a>
                  <a href={PHONE_2_TEL} className="hover:text-brand-accent transition-colors">{PHONE_2}</a>
                </span>
              </li>
              <li className="flex items-center">
                <Facebook className="w-5 h-5 mr-3 text-brand-accent shrink-0" />
                <a href={FB_URL} target="_blank" rel="noopener noreferrer" className="hover:text-brand-accent transition-colors">CA IMMO sur Facebook</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center text-xs font-light text-white/40">
          <p>&copy; {new Date().getFullYear()} CA IMMO. Tous droits réservés.</p>
          <p className="mt-4 md:mt-0">Chargé d'Affaire Immobilier — Madagascar</p>
        </div>
      </div>
    </footer>
  );
}
