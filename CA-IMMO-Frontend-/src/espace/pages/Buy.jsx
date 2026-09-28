import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Grid2X2, List, Search } from 'lucide-react';
import { AppLayout, EmptyState, PropertyCard, Select } from '../components';
import Hero from '../Hero';
import api from '../../services/api';

export default function Buy() {
  const [params] = useSearchParams();

  const [properties, setProperties] = useState([]);
  const [query, setQuery] = useState(
    params.get('zone') || params.get('q') || ''
  );

  const [sort, setSort] = useState('recent');
  const [view, setView] = useState('grid');

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  /*
   * Récupération des terrains depuis Laravel
   *
   * GET /api/properties
   */
  const fetchProperties = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await api.get('/properties');

      /*
       * Laravel peut retourner :
       * { data: [...] }
       *
       * ou directement [...]
       */
      const data = response.data?.data ?? response.data;

      setProperties(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Erreur récupération terrains :', err);

      setError(
        err.response?.data?.message ||
        'Impossible de charger les terrains.'
      );

      setProperties([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  /*
   * Recherche locale dans les terrains déjà récupérés.
   *
   * Cela permet de rechercher :
   * - titre
   * - commune
   * - région
   * - description
   */
  const results = [...properties]
    .filter((property) => {
      const q = query.trim().toLowerCase();

      if (!q) {
        return true;
      }

      return `
        ${property.title || ''}
        ${property.location || ''}
        ${property.region || ''}
        ${property.district || ''}
        ${property.commune || ''}
        ${property.fokontany || ''}
        ${property.description || ''}
      `
        .toLowerCase()
        .includes(q);
    })
    .sort((a, b) => {
      if (sort === 'priceAsc') {
        return Number(a.price || 0) - Number(b.price || 0);
      }

      if (sort === 'priceDesc') {
        return Number(b.price || 0) - Number(a.price || 0);
      }

      if (sort === 'area') {
        return Number(b.area || 0) - Number(a.area || 0);
      }

      // Plus récents
      return Number(b.id || 0) - Number(a.id || 0);
    });

  /*
   * Adapter les données Laravel au format utilisé
   * par PropertyCard.
   *
   * Si ton PropertyCard utilise déjà directement les
   * champs Laravel, cette partie peut rester telle quelle.
   */
  const formattedResults = results.map((property) => ({
    ...property,

    location:
      property.location ||
      [
        property.fokontany,
        property.commune,
        property.district,
        property.region,
      ]
        .filter(Boolean)
        .join(', '),

    image:
      property.image ||
      property.media?.find((media) => media.type === 'photo')?.path ||
      property.media?.[0]?.path ||
      null,

    verified:
      property.verified === true ||
      property.verified === 1,

    available:
      property.available === true ||
      property.available === 1,
  }));

  return (
    <AppLayout>

      {/* =========================
          HERO
      ========================= */}
      <Hero
        crumb="Acheter"
        pill="Terrains à vendre"
        title="Trouvez l’emplacement de votre"
        highlight="prochain projet"
        text="Explorez les terrains sélectionnés et contrôlés par CA IMMO à Madagascar : titres vérifiés, accompagnement de confiance."
        image="https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1600&q=80"
      >
        <form
          className="buy-quick-search"
          onSubmit={(e) => e.preventDefault()}
        >
          <Search size={19} />

          <input
            placeholder="Rechercher une commune, un quartier ou un terrain…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />

          <button
            type="submit"
            className="btn btn-primary"
          >
            Rechercher
          </button>
        </form>
      </Hero>

      {/* =========================
          RESULTATS
      ========================= */}
      <section className="section buy-page">
        <div className="container">

          <div className="results-area">

            {/* TOOLBAR */}
            <div className="results-toolbar">

              <div>
                <h2>
                  {loading
                    ? 'Chargement...'
                    : `${formattedResults.length} terrain${
                        formattedResults.length > 1 ? 's' : ''
                      } disponible${
                        formattedResults.length > 1 ? 's' : ''
                      }`
                  }
                </h2>

                <p>
                  Catalogue CA IMMO · Madagascar
                </p>
              </div>

              <div className="toolbar-actions">

                {/* GRILLE / LISTE */}
                <div className="view-toggle">

                  <button
                    type="button"
                    className={view === 'grid' ? 'active' : ''}
                    onClick={() => setView('grid')}
                    aria-label="Grille"
                  >
                    <Grid2X2 size={17} />
                  </button>

                  <button
                    type="button"
                    className={view === 'list' ? 'active' : ''}
                    onClick={() => setView('list')}
                    aria-label="Liste"
                  >
                    <List size={18} />
                  </button>

                </div>

                {/* TRI */}
                <div className="sort-select">

                  <span>Trier :</span>

                  <Select
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                  >
                    <option value="recent">
                      Plus récents
                    </option>

                    <option value="priceAsc">
                      Prix croissant
                    </option>

                    <option value="priceDesc">
                      Prix décroissant
                    </option>

                    <option value="area">
                      Plus grande surface
                    </option>
                  </Select>

                </div>

              </div>
            </div>

            {/* ERREUR */}
            {error && !loading && (
              <div className="error-message">
                {error}
              </div>
            )}

            {/* CHARGEMENT */}
            {loading ? (
              <div className="loading-state">
                <p>Chargement des terrains...</p>
              </div>
            ) : formattedResults.length > 0 ? (

              /* RESULTATS */
              <div className={`property-results ${view}`}>

                {formattedResults.map((property) => (
                  <PropertyCard
                    property={property}
                    horizontal={view === 'list'}
                    key={property.id}
                  />
                ))}

              </div>

            ) : (

              /* AUCUN RESULTAT */
              <EmptyState
                title="Aucun terrain ne correspond"
                text="Essayez une autre commune ou confiez votre recherche à notre équipe."
                action="Voir tous les terrains"
                onAction={() => setQuery('')}
              />

            )}

          </div>

        </div>
      </section>

    </AppLayout>
  );
}
