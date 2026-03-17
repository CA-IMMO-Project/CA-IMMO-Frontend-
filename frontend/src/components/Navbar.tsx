import { Link } from 'react-router-dom';
import { Home, Building2, Map, Hotel, Info, Phone, LogIn, UserPlus, Menu, X, Globe } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useCurrency, Currency } from '../context/CurrencyContext';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { currency, setCurrency } = useCurrency();

  const navLinks = [
    { name: 'Accueil', path: '/', icon: <Home className="w-4 h-4 mr-2" /> },
    { name: 'Immobilier', path: '/properties', icon: <Building2 className="w-4 h-4 mr-2" /> },
    { name: 'Terrains', path: '/lands', icon: <Map className="w-4 h-4 mr-2" /> },
    { name: 'Hôtels', path: '/hotels', icon: <Hotel className="w-4 h-4 mr-2" /> },
    { name: 'À Propos', path: '/about', icon: <Info className="w-4 h-4 mr-2" /> },
    { name: 'Contact', path: '/contact', icon: <Phone className="w-4 h-4 mr-2" /> },
  ];

  return (
    <nav className="bg-brand-50 border-b border-brand-900/10 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <Link to="/" className="flex items-center group">
              <Building2 className="h-7 w-7 text-brand-accent transition-transform group-hover:scale-105" />
              <span className="ml-3 text-2xl font-serif text-brand-900 tracking-wide">ImmoLuxe</span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="flex items-center text-sm uppercase tracking-widest text-brand-900/70 hover:text-brand-accent transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <div className="flex items-center mr-2 border-r border-brand-900/20 pr-4">
              <Globe className="w-4 h-4 text-brand-900/50 mr-1" />
              <select 
                value={currency}
                onChange={(e) => setCurrency(e.target.value as Currency)}
                className="bg-transparent text-xs uppercase tracking-widest font-medium text-brand-900/70 focus:outline-none cursor-pointer"
              >
                <option value="EUR">EUR (€)</option>
                <option value="USD">USD ($)</option>
                <option value="GBP">GBP (£)</option>
              </select>
            </div>
            <Link
              to="/login"
              className="text-xs uppercase tracking-widest font-medium text-brand-900/70 hover:text-brand-accent transition-colors"
            >
              Connexion
            </Link>
            <Link
              to="/register"
              className="px-5 py-2.5 text-xs uppercase tracking-widest font-medium text-brand-50 bg-brand-900 rounded-full hover:bg-brand-accent transition-colors"
            >
              S'inscrire
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 text-brand-900/70 hover:text-brand-900 focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-brand-900/10 bg-brand-50 overflow-hidden"
          >
            <div className="px-4 pt-4 pb-6 space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center px-3 py-3 text-sm uppercase tracking-widest text-brand-900/80 hover:text-brand-accent"
                >
                  {link.icon}
                  {link.name}
                </Link>
              ))}
              <div className="border-t border-brand-900/10 pt-4 mt-4 space-y-3">
                <div className="flex items-center px-3 py-2 text-sm uppercase tracking-widest text-brand-900/80">
                  <Globe className="w-4 h-4 mr-3 text-brand-900/50" />
                  <select 
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value as Currency)}
                    className="bg-transparent focus:outline-none cursor-pointer w-full"
                  >
                    <option value="EUR">EUR (€)</option>
                    <option value="USD">USD ($)</option>
                    <option value="GBP">GBP (£)</option>
                  </select>
                </div>
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center px-3 py-3 text-sm uppercase tracking-widest text-brand-900/80 hover:text-brand-accent"
                >
                  <LogIn className="w-4 h-4 mr-3" />
                  Connexion
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center px-3 py-3 mt-2 text-sm uppercase tracking-widest text-brand-50 bg-brand-900 rounded-full hover:bg-brand-accent"
                >
                  <UserPlus className="w-4 h-4 mr-3" />
                  S'inscrire
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
