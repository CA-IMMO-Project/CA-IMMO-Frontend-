import { motion } from 'motion/react';
import { Building2, Mail, Lock, User, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Register() {
  return (
    <div className="min-h-screen bg-brand-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <Building2 className="h-14 w-14 text-brand-accent" />
        </div>
        <h2 className="mt-8 text-center text-3xl font-serif text-brand-900 tracking-wide">
          Créer un compte
        </h2>
        <p className="mt-3 text-center text-sm text-brand-900/60 font-light">
          Ou{' '}
          <Link to="/login" className="font-medium text-brand-accent hover:text-brand-900 transition-colors">
            connectez-vous à votre compte existant
          </Link>
        </p>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-md">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white py-10 px-4 shadow-xl shadow-brand-900/5 sm:rounded-3xl sm:px-10 border border-brand-50/20"
        >
          <form className="space-y-6" action="#" method="POST" onSubmit={(e) => e.preventDefault()}>
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-brand-900 mb-2">
                Nom complet
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-brand-900/40" />
                </div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  className="focus:ring-2 focus:ring-brand-accent focus:border-brand-accent block w-full pl-12 sm:text-sm border-brand-900/10 rounded-xl py-4 border bg-brand-50/50 transition-all duration-300 font-light text-brand-900 placeholder-brand-900/40"
                  placeholder="Jean Dupont"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-brand-900 mb-2">
                Adresse email
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-brand-900/40" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="focus:ring-2 focus:ring-brand-accent focus:border-brand-accent block w-full pl-12 sm:text-sm border-brand-900/10 rounded-xl py-4 border bg-brand-50/50 transition-all duration-300 font-light text-brand-900 placeholder-brand-900/40"
                  placeholder="vous@exemple.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-brand-900 mb-2">
                Mot de passe
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-brand-900/40" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="focus:ring-2 focus:ring-brand-accent focus:border-brand-accent block w-full pl-12 sm:text-sm border-brand-900/10 rounded-xl py-4 border bg-brand-50/50 transition-all duration-300 font-light text-brand-900 placeholder-brand-900/40"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="flex items-center">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                required
                className="h-4 w-4 text-brand-accent focus:ring-brand-accent border-brand-900/20 rounded accent-brand-accent"
              />
              <label htmlFor="terms" className="ml-2 block text-sm text-brand-900/70 font-light">
                J'accepte les <a href="#" className="text-brand-accent hover:text-brand-900 transition-colors">conditions d'utilisation</a>
              </label>
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center items-center py-4 px-4 border border-transparent rounded-full shadow-lg shadow-brand-900/20 text-sm font-medium text-brand-50 bg-brand-900 hover:bg-brand-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-900 transition-all duration-300"
              >
                Créer mon compte
                <ArrowRight className="ml-2 h-4 w-4" />
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
