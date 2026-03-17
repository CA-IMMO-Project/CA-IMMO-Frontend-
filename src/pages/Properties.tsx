import { useState } from 'react';
import { motion } from 'motion/react';
import PropertyCard from '../components/PropertyCard';
import SearchFilter from '../components/SearchFilter';
import Pagination from '../components/Pagination';
import { mockProperties } from '../data/mockData';

const ITEMS_PER_PAGE = 9;

export default function Properties() {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(mockProperties.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentItems = mockProperties.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  // Scroll to top when page changes
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
            Propriétés d'Exception
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
            Découvrez notre collection exclusive de résidences de prestige. L'élégance et le raffinement à chaque adresse.
          </motion.p>
        </div>

        <SearchFilter />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mt-12">
          {currentItems.map((property, idx) => (
            <motion.div
              key={property.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <PropertyCard property={property} />
            </motion.div>
          ))}
        </div>

        <Pagination 
          currentPage={currentPage} 
          totalPages={totalPages} 
          onPageChange={handlePageChange} 
        />
      </div>
    </div>
  );
}
