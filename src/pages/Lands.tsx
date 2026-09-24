import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'motion/react';
import LandCard from '../components/LandCard';
import SearchFilter from '../components/SearchFilter';
import Pagination from '../components/Pagination';
import { Land } from '../types';
import { fetchLands, fetchRegions } from '../lib/api';

const ITEMS_PER_PAGE = 9;

export default function Lands() {
  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get('q') ?? '');
  const [region, setRegion] = useState(searchParams.get('region') ?? '');
  const [maxPrice, setMaxPrice] = useState(200000000);
  const [minArea, setMinArea] = useState(0);
  const [usage, setUsage] = useState('');
  const [titleStatus, setTitleStatus] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const [regions, setRegions] = useState<string[]>([]);
  const [lands, setLands] = useState<Land[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchRegions().then(setRegions).catch(() => setRegions([]));
  }, []);

  useEffect(() => {
    setLoading(true);
    setError(null);
    const timeout = setTimeout(() => {
      fetchLands({
        q: search || undefined,
        region: region || undefined,
        maxPrice,
        minArea: minArea || undefined,
        usage: usage || undefined,
        titleStatus: titleStatus || undefined,
      })
        .then((data) => {
          setLands(data);
          setCurrentPage(1);
        })
        .catch(() => setError("Impossible de charger les terrains pour le moment. Vérifiez que l'API est démarrée."))
        .finally(() => setLoading(false));
    }, 300);

    return () => clearTimeout(timeout);
  }, [search, region, maxPrice, minArea, usage, titleStatus]);

  const totalPages = Math.max(1, Math.ceil(lands.length / ITEMS_PER_PAGE));
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentItems = lands.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="bg-brand-50 min-h-screen py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-serif text-brand-900 mb-6 tracking-wide"
          >
            Nos Terrains
          </motion.h1>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="w-24 h-1 bg-brand-accent mx-auto mb-6"
          />
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-brand-900/70 font-light max-w-2xl mx-auto"
          >
            Parcourez notre sélection de terrains vérifiés à travers Madagascar — titres sécurisés et accompagnement inclus.
          </motion.p>
        </div>

        <SearchFilter
          search={search}
          onSearchChange={(v) => setSearch(v)}
          region={region}
          onRegionChange={(v) => setRegion(v)}
          maxPrice={maxPrice}
          onMaxPriceChange={(v) => setMaxPrice(v)}
          minArea={minArea}
          onMinAreaChange={(v) => setMinArea(v)}
          usage={usage}
          onUsageChange={(v) => setUsage(v)}
          titleStatus={titleStatus}
          onTitleStatusChange={(v) => setTitleStatus(v)}
          regions={regions}
        />

        {error && (
          <div className="text-center py-6 mb-6 rounded-2xl bg-red-50 text-red-700 text-sm">{error}</div>
        )}

        {loading ? (
          <div className="text-center py-20 text-brand-900/50 font-light">Chargement des terrains...</div>
        ) : currentItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {currentItems.map((land, idx) => (
              <motion.div
                key={land.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              >
                <LandCard land={land} />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-brand-900/50 font-light">
            Aucun terrain ne correspond à votre recherche pour le moment.
          </div>
        )}

        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
      </div>
    </div>
  );
}
