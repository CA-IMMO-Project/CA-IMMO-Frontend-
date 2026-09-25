import React, { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Grid2X2, List, Search } from 'lucide-react';
import { AppLayout, EmptyState, PropertyCard, Select } from '../components';
import Hero from '../Hero';
import { getProperties } from '../data';

export default function Buy() {
  const properties = useMemo(() => getProperties(), []);
  const [params] = useSearchParams();
  const [query, setQuery] = useState(params.get('zone') || params.get('q') || '');
  const [sort, setSort] = useState('recent');
  const [view, setView] = useState('grid');

  // Recherche libre : titre, commune, région, description
  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    const found = properties.filter((p) => !q || `${p.title} ${p.location} ${p.region} ${p.description}`.toLowerCase().includes(q));
    return [...found].sort((a, b) => sort === 'priceAsc' ? a.price - b.price : sort === 'priceDesc' ? b.price - a.price : sort === 'area' ? b.area - a.area : Number(b.id) - Number(a.id));
  }, [properties, query, sort]);

  return <AppLayout>
    <Hero crumb="Acheter" pill="Terrains à vendre" title="Trouvez l’emplacement de votre" highlight="prochain projet" text="Explorez les terrains sélectionnés et contrôlés par CA IMMO à Madagascar : titres vérifiés, accompagnement de confiance." image="https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1600&q=80">
      <form className="buy-quick-search" onSubmit={(e) => e.preventDefault()}><Search size={19}/><input placeholder="Rechercher une commune, un quartier ou un terrain…" value={query} onChange={(e) => setQuery(e.target.value)}/><button className="btn btn-primary">Rechercher</button></form>
    </Hero>
    <section className="section buy-page">
      <div className="container">
        <div className="results-area">
          <div className="results-toolbar"><div><h2>{results.length} terrain{results.length > 1 ? 's' : ''} disponible{results.length > 1 ? 's' : ''}</h2><p>Catalogue CA IMMO · Madagascar</p></div><div className="toolbar-actions"><div className="view-toggle"><button className={view === 'grid' ? 'active' : ''} onClick={() => setView('grid')} aria-label="Grille"><Grid2X2 size={17}/></button><button className={view === 'list' ? 'active' : ''} onClick={() => setView('list')} aria-label="Liste"><List size={18}/></button></div><div className="sort-select"><span>Trier :</span><Select value={sort} onChange={(e) => setSort(e.target.value)}><option value="recent">Plus récents</option><option value="priceAsc">Prix croissant</option><option value="priceDesc">Prix décroissant</option><option value="area">Plus grande surface</option></Select></div></div></div>
          {results.length > 0
            ? <div className={`property-results ${view}`}>{results.map((p) => <PropertyCard property={p} horizontal={view === 'list'} key={p.id}/>)}</div>
            : <EmptyState title="Aucun terrain ne correspond" text="Essayez une autre commune ou confiez votre recherche à notre équipe." action="Voir tous les terrains" onAction={() => setQuery('')}/>}
        </div>
      </div>
    </section>
  </AppLayout>;
}
