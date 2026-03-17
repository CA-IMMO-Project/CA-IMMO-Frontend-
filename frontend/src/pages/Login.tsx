import { motion } from 'motion/react';
import { Building2, Mail, Lock, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Login() {
  return (
    <div className="min-h-screen bg-brand-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <Building2 className="h-14 w-14 text-brand-accent" />
        </div>
        <h2 className="mt-8 text-center text-3xl font-serif text-brand-900 tracking-wide">
          Bon retour parmi nous
        </h2>
        <p className="mt-3 text-center text-sm text-brand-900/60 font-light">
          Ou{' '}
          <Link to="/register" className="font-medium text-brand-accent hover:text-brand-900 transition-colors">
            créez un compte gratuitement
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
                  autoComplete="current-password"
                  required
                  className="focus:ring-2 focus:ring-brand-accent focus:border-brand-accent block w-full pl-12 sm:text-sm border-brand-900/10 rounded-xl py-4 border bg-brand-50/50 transition-all duration-300 font-light text-brand-900 placeholder-brand-900/40"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-brand-accent focus:ring-brand-accent border-brand-900/20 rounded accent-brand-accent"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-brand-900/70 font-light">
                  Se souvenir de moi
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-medium text-brand-accent hover:text-brand-900 transition-colors">
                  Mot de passe oublié ?
                </a>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center items-center py-4 px-4 border border-transparent rounded-full shadow-lg shadow-brand-900/20 text-sm font-medium text-brand-50 bg-brand-900 hover:bg-brand-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-900 transition-all duration-300"
              >
                Se connecter
                <ArrowRight className="ml-2 h-4 w-4" />
              </button>
            </div>
          </form>

          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-brand-900/10" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-brand-900/50 font-light">Ou continuer avec</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4">
              <div>
                <a
                  href="#"
                  className="w-full inline-flex justify-center py-3 px-4 border border-brand-900/10 rounded-xl shadow-sm bg-white text-sm font-medium text-brand-900/70 hover:bg-brand-50 transition-colors"
                >
                  <span className="sr-only">Se connecter avec Google</span>
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z" />
                  </svg>
                </a>
              </div>
              <div>
                <a
                  href="#"
                  className="w-full inline-flex justify-center py-3 px-4 border border-brand-900/10 rounded-xl shadow-sm bg-white text-sm font-medium text-brand-900/70 hover:bg-brand-50 transition-colors"
                >
                  <span className="sr-only">Se connecter avec Facebook</span>
                  <svg className="w-5 h-5 text-[#1877F2]" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
