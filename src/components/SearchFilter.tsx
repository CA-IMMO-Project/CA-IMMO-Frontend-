import { useState } from 'react';
import { Search, SlidersHorizontal, Square, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { formatAriary } from '../lib/format';

const USAGE_OPTIONS = [
  { value: 'residentiel', label: 'Résidentiel' },
  { value: 'agricole', label: 'Agricole' },
  { value: 'commercial', label: 'Commercial' },
  { value: 'touristique', label: 'Touristique' },
];

const TITLE_STATUS_OPTIONS = ['Titre Foncier', 'Titre en cours', 'Cadastré'];

interface SearchFilterProps {
  search: string;
  onSearchChange: (v: string) => void;
  region: string;
  onRegionChange: (v: string) => void;
  maxPrice: number;
  onMaxPriceChange: (v: number) => void;
  minArea: number;
  onMinAreaChange: (v: number) => void;
  usage: string;
  onUsageChange: (v: string) => void;
  titleStatus: string;
  onTitleStatusChange: (v: string) => void;
  regions: string[];
}

export default function SearchFilter({
  search,
  onSearchChange,
  region,
  onRegionChange,
  maxPrice,
  onMaxPriceChange,
  minArea,
  onMinAreaChange,
  usage,
  onUsageChange,
  titleStatus,
  onTitleStatusChange,
  regions,
}: SearchFilterProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  return (
    <div className="bg-white p-8 rounded-2xl shadow-xl shadow-brand-900/5 border border-brand-50/20 mb-12">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-grow relative">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-900/40" />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Rechercher par ville, quartier, région..."
            className="w-full pl-14 pr-6 py-4 bg-brand-50/50 border border-brand-900/10 rounded-full focus:ring-2 focus:ring-brand-accent focus:border-brand-accent transition-all duration-300 font-light text-brand-900 placeholder-brand-900/40"
          />
        </div>
        <div className="flex gap-4">
          <select
            value={region}
            onChange={(e) => onRegionChange(e.target.value)}
            className="px-6 py-4 bg-brand-50/50 border border-brand-900/10 rounded-full focus:ring-2 focus:ring-brand-accent focus:border-brand-accent transition-all duration-300 font-light text-brand-900 cursor-pointer appearance-none"
          >
            <option value="">Toutes les régions</option>
            {regions.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
          <select
            value={usage}
            onChange={(e) => onUsageChange(e.target.value)}
            className="px-6 py-4 bg-brand-50/50 border border-brand-900/10 rounded-full focus:ring-2 focus:ring-brand-accent focus:border-brand-accent transition-all duration-300 font-light text-brand-900 cursor-pointer appearance-none"
          >
            <option value="">Tous les besoins</option>
            {USAGE_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className={`flex items-center justify-center px-6 py-4 rounded-full transition-all duration-300 font-medium ${
              showAdvanced ? 'bg-brand-900 text-white' : 'bg-brand-50 hover:bg-brand-900/5 text-brand-900 border border-brand-900/10'
            }`}
          >
            <SlidersHorizontal className="w-5 h-5 mr-3" />
            Filtres {showAdvanced ? <ChevronUp className="w-4 h-4 ml-2" /> : <ChevronDown className="w-4 h-4 ml-2" />}
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
            <div className="pt-8 mt-8 border-t border-brand-900/10 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="flex items-center text-sm font-medium text-brand-900 mb-5">
                  Budget maximum : <span className="ml-2 font-light">{formatAriary(maxPrice)}</span>
                </label>
                <input
                  type="range"
                  min="10000000"
                  max="200000000"
                  step="5000000"
                  value={maxPrice}
                  onChange={(e) => onMaxPriceChange(Number(e.target.value))}
                  className="w-full h-1.5 bg-brand-900/10 rounded-lg appearance-none cursor-pointer accent-brand-accent"
                />
                <div className="flex justify-between text-xs font-light text-brand-900/50 mt-3">
                  <span>{formatAriary(10000000)}</span>
                  <span>{formatAriary(200000000)}</span>
                </div>
              </div>

              <div>
                <label className="flex items-center text-sm font-medium text-brand-900 mb-3">
                  <Square className="w-4 h-4 mr-2 text-brand-accent" />
                  Surface minimum (m²)
                </label>
                <input
                  type="number"
                  min="0"
                  step="100"
                  value={minArea || ''}
                  onChange={(e) => onMinAreaChange(Number(e.target.value))}
                  placeholder="Ex: 500"
                  className="w-full px-5 py-3 bg-brand-50/50 border border-brand-900/10 rounded-xl focus:ring-2 focus:ring-brand-accent focus:border-brand-accent transition-all duration-300 font-light"
                />
              </div>

              <div>
                <label className="flex items-center text-sm font-medium text-brand-900 mb-3">
                  Statut du titre
                </label>
                <select
                  value={titleStatus}
                  onChange={(e) => onTitleStatusChange(e.target.value)}
                  className="w-full px-5 py-3 bg-brand-50/50 border border-brand-900/10 rounded-xl focus:ring-2 focus:ring-brand-accent focus:border-brand-accent transition-all duration-300 font-light cursor-pointer appearance-none"
                >
                  <option value="">Tous les statuts</option>
                  {TITLE_STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
