import { useState } from 'react';
import { Search, SlidersHorizontal, Bed, Bath, Euro, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useCurrency } from '../context/CurrencyContext';

export default function SearchFilter() {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [priceRange, setPriceRange] = useState(500000);
  const { convertPrice } = useCurrency();

  const priceData = convertPrice(priceRange);
  const formattedPrice = new Intl.NumberFormat(priceData.locale, { 
    style: 'currency', 
    currency: priceData.currency, 
    maximumFractionDigits: 0 
  }).format(priceData.value);

  const minPriceData = convertPrice(50000);
  const maxPriceData = convertPrice(5000000);

  return (
    <div className="bg-white p-8 rounded-2xl shadow-xl shadow-brand-900/5 border border-brand-50/20 mb-12">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-grow relative">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-900/40" />
          <input 
            type="text" 
            placeholder="Rechercher par ville, quartier..." 
            className="w-full pl-14 pr-6 py-4 bg-brand-50/50 border border-brand-900/10 rounded-full focus:ring-2 focus:ring-brand-accent focus:border-brand-accent transition-all duration-300 font-light text-brand-900 placeholder-brand-900/40"
          />
        </div>
        <div className="flex gap-4">
          <button 
            onClick={() => setShowAdvanced(!showAdvanced)}
            className={`flex items-center justify-center px-6 py-4 rounded-full transition-all duration-300 font-medium ${showAdvanced ? 'bg-brand-900 text-brand-50' : 'bg-brand-50 hover:bg-brand-900/5 text-brand-900 border border-brand-900/10'}`}
          >
            <SlidersHorizontal className="w-5 h-5 mr-3" />
            Filtres {showAdvanced ? <ChevronUp className="w-4 h-4 ml-2" /> : <ChevronDown className="w-4 h-4 ml-2" />}
          </button>
          <button className="bg-brand-accent hover:bg-brand-accent/90 text-white px-8 py-4 rounded-full font-medium transition-all duration-300 shadow-lg shadow-brand-accent/20">
            Rechercher
          </button>
        </div>
      </div>

      <AnimatePresence>
        {showAdvanced && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="pt-8 mt-8 border-t border-brand-900/10 grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Price Range */}
              <div>
                <label className="flex items-center text-sm font-medium text-brand-900 mb-5">
                  <span className="font-serif text-lg mr-2 text-brand-accent">{priceData.symbol}</span>
                  Budget maximum : <span className="ml-2 font-light">{formattedPrice}</span>
                </label>
                <input
                  type="range"
                  min="50000"
                  max="5000000"
                  step="50000"
                  value={priceRange}
                  onChange={(e) => setPriceRange(Number(e.target.value))}
                  className="w-full h-1.5 bg-brand-900/10 rounded-lg appearance-none cursor-pointer accent-brand-accent"
                />
                <div className="flex justify-between text-xs font-light text-brand-900/50 mt-3">
                  <span>{new Intl.NumberFormat(minPriceData.locale, { style: 'currency', currency: minPriceData.currency, maximumFractionDigits: 0 }).format(minPriceData.value)}</span>
                  <span>{new Intl.NumberFormat(maxPriceData.locale, { style: 'currency', currency: maxPriceData.currency, maximumFractionDigits: 0 }).format(maxPriceData.value)}</span>
                </div>
              </div>

              {/* Bedrooms */}
              <div>
                <label className="flex items-center text-sm font-medium text-brand-900 mb-3">
                  <Bed className="w-4 h-4 mr-2 text-brand-accent" />
                  Chambres (min)
                </label>
                <input
                  type="number"
                  min="0"
                  max="10"
                  placeholder="Ex: 2"
                  className="w-full px-5 py-3 bg-brand-50/50 border border-brand-900/10 rounded-xl focus:ring-2 focus:ring-brand-accent focus:border-brand-accent transition-all duration-300 font-light"
                />
              </div>

              {/* Bathrooms */}
              <div>
                <label className="flex items-center text-sm font-medium text-brand-900 mb-3">
                  <Bath className="w-4 h-4 mr-2 text-brand-accent" />
                  Salles de bain (min)
                </label>
                <input
                  type="number"
                  min="0"
                  max="10"
                  placeholder="Ex: 1"
                  className="w-full px-5 py-3 bg-brand-50/50 border border-brand-900/10 rounded-xl focus:ring-2 focus:ring-brand-accent focus:border-brand-accent transition-all duration-300 font-light"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
