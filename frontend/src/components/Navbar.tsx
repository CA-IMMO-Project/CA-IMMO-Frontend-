import { Link } from 'react-router-dom';
import { Home, Map, Info, Phone, CalendarCheck, Menu, X, Facebook } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FB_URL, PHONE_1, PHONE_1_TEL } from '../lib/contact';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: 'Accueil', path: '/', icon: <Home className="w-4 h-4 mr-2" /> },
    { name: 'Terrains', path: '/terrains', icon: <Map className="w-4 h-4 mr-2" /> },
    { name: 'À Propos', path: '/about', icon: <Info className="w-4 h-4 mr-2" /> },
    { name: 'Réservation', path: '/reservation', icon: <CalendarCheck className="w-4 h-4 mr-2" /> },
    { name: 'Contact', path: '/contact', icon: <Phone className="w-4 h-4 mr-2" /> },
  ];

  return (
    <>
      {/* Top bar */}
      <div className="bg-brand-900 text-white/80 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-9 flex items-center justify-between">
          <span className="hidden sm:inline">Chargé d'Affaire Immobilier — Vente de terrains à Madagascar</span>
          <div className="flex items-center gap-4 ml-auto">
            <a href={PHONE_1_TEL} className="flex items-center hover:text-brand-accent transition-colors">
              <Phone className="w-3.5 h-3.5 mr-1.5" /> {PHONE_1}
            </a>
            <a href={FB_URL} target="_blank" rel="noopener noreferrer" className="flex items-center hover:text-brand-accent transition-colors">
              <Facebook className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>

      <nav className="bg-white border-b border-brand-900/10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20">
            <div className="flex items-center">
              <Link to="/" className="flex items-center group">
                <img
                  src="/Logo.jpeg"
                  alt="CA IMMO"
                  className="h-14 w-14 rounded-xl object-cover transition-transform group-hover:scale-105"
                />
              </Link>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
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

            <div className="hidden md:flex items-center">
              <Link
                to="/reservation"
                className="px-6 py-2.5 text-xs uppercase tracking-widest font-medium text-white bg-brand-accent rounded-full hover:bg-brand-900 transition-colors"
              >
                Réserver un terrain
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
              className="md:hidden border-t border-brand-900/10 bg-white overflow-hidden"
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
                <Link
                  to="/reservation"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center px-3 py-3 mt-2 text-sm uppercase tracking-widest text-white bg-brand-accent rounded-full hover:bg-brand-900"
                >
                  Réserver un terrain
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </>
  );
}
