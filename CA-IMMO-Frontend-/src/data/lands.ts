import { Land, Lot } from '../types';

const BASE_LANDS: Land[] = [
    {
        "id": "1",
        "title": "Terrain résidentiel à Ambohidratrimo",
        "description": "Belle parcelle plate idéale pour construction de villa, dans un quartier résidentiel calme en pleine expansion, à 15 minutes d'Antananarivo.",
        "price": 45000000,
        "region": "Antananarivo",
        "location": "Ambohidratrimo, Antananarivo",
        "coordinates": [
            -18.8167,
            47.4333
        ],
        "imageUrl": "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80",
        "features": [
            "Terrain plat",
            "Accès route bitumée",
            "Eau et électricité à proximité",
            "Quartier résidentiel"
        ],
        "area": 800,
        "titleStatus": "Titre Foncier",
        "status": "disponible"
    },
    {
        "id": "2",
        "title": "Grand lot constructible à Ivato",
        "description": "Vaste terrain proche de l'aéroport international d'Ivato, parfait pour un projet immobilier ou commercial d'envergure.",
        "price": 120000000,
        "region": "Antananarivo",
        "location": "Ivato, Antananarivo",
        "coordinates": [
            -18.7969,
            47.4788
        ],
        "imageUrl": "https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=1200&q=80",
        "features": [
            "Proche aéroport",
            "Grande superficie",
            "Idéal projet commercial",
            "Bornage effectué"
        ],
        "area": 2500,
        "titleStatus": "Titre Foncier",
        "status": "disponible"
    },
    {
        "id": "3",
        "title": "Parcelle avec vue sur Antananarivo",
        "description": "Terrain en hauteur offrant une vue panoramique sur la capitale, environnement calme et sécurisé à Itaosy.",
        "price": 32000000,
        "region": "Antananarivo",
        "location": "Itaosy, Antananarivo",
        "coordinates": [
            -18.9333,
            47.4667
        ],
        "imageUrl": "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80",
        "features": [
            "Vue panoramique",
            "Terrain en pente douce",
            "Quartier sécurisé"
        ],
        "area": 600,
        "titleStatus": "Cadastré",
        "status": "disponible"
    },
    {
        "id": "4",
        "title": "Terrain bord de mer à Toamasina",
        "description": "Rare opportunité en bord de mer, proche du port de Toamasina. Idéal pour résidence secondaire ou investissement touristique.",
        "price": 85000000,
        "region": "Toamasina",
        "location": "Toamasina I, Atsinanana",
        "coordinates": [
            -18.1492,
            49.4023
        ],
        "imageUrl": "https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=1200&q=80",
        "features": [
            "Bord de mer",
            "Proche port",
            "Potentiel touristique",
            "Accès direct plage"
        ],
        "area": 1500,
        "titleStatus": "Titre Foncier",
        "status": "disponible"
    },
    {
        "id": "5",
        "title": "Terrain agricole fertile à Brickaville",
        "description": "Grande étendue de terre fertile propice à l'agriculture (litchis, girofle, vanille), route praticable toute l'année.",
        "price": 60000000,
        "region": "Toamasina",
        "location": "Brickaville, Atsinanana",
        "coordinates": [
            -18.8167,
            49.0667
        ],
        "imageUrl": "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1200&q=80",
        "features": [
            "Sol fertile",
            "Culture de rente",
            "Point d'eau naturel",
            "Accès route"
        ],
        "area": 30000,
        "titleStatus": "Titre en cours",
        "status": "disponible"
    },
    {
        "id": "6",
        "title": "Terrain constructible à Mahajanga",
        "description": "Parcelle proche du centre-ville de Mahajanga, quartier dynamique, idéale pour construction ou commerce.",
        "price": 55000000,
        "region": "Mahajanga",
        "location": "Mahajanga Be, Boeny",
        "coordinates": [
            -15.7167,
            46.3167
        ],
        "imageUrl": "https://images.unsplash.com/photo-1464082354059-27db6ce50048?auto=format&fit=crop&w=1200&q=80",
        "features": [
            "Proche centre-ville",
            "Terrain plat",
            "Fort potentiel commercial"
        ],
        "area": 900,
        "titleStatus": "Titre Foncier",
        "status": "réservé"
    },
    {
        "id": "7",
        "title": "Terrain vue mer à Nosy Be",
        "description": "Superbe terrain surplombant l'océan Indien à Nosy Be, emplacement recherché pour projet hôtelier ou villa de luxe.",
        "price": 180000000,
        "region": "Nosy Be",
        "location": "Nosy Be, Diana",
        "coordinates": [
            -13.3167,
            48.2667
        ],
        "imageUrl": "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=1200&q=80",
        "features": [
            "Vue mer imprenable",
            "Zone touristique",
            "Potentiel hôtelier",
            "Accès route"
        ],
        "area": 3000,
        "titleStatus": "Titre Foncier",
        "status": "disponible"
    },
    {
        "id": "8",
        "title": "Terrain résidentiel à Fianarantsoa",
        "description": "Belle parcelle dans les hauts plateaux, climat tempéré, idéale pour construction familiale.",
        "price": 22000000,
        "region": "Fianarantsoa",
        "location": "Fianarantsoa, Haute Matsiatra",
        "coordinates": [
            -21.4536,
            47.0854
        ],
        "imageUrl": "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80",
        "features": [
            "Climat tempéré",
            "Terrain plat",
            "Quartier calme"
        ],
        "area": 700,
        "titleStatus": "Cadastré",
        "status": "disponible"
    },
    {
        "id": "9",
        "title": "Terrain proche plage à Toliara",
        "description": "Parcelle à quelques minutes des plages de Toliara, environnement paisible, idéal projet résidentiel ou touristique.",
        "price": 40000000,
        "region": "Toliara",
        "location": "Toliara, Atsimo-Andrefana",
        "coordinates": [
            -23.35,
            43.6667
        ],
        "imageUrl": "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80",
        "features": [
            "Proche plage",
            "Climat ensoleillé",
            "Potentiel touristique"
        ],
        "area": 1000,
        "titleStatus": "Titre en cours",
        "status": "disponible"
    },
    {
        "id": "10",
        "title": "Lot à Ambatobe, quartier résidentiel prisé",
        "description": "Terrain dans un des quartiers les plus recherchés de la capitale, entouré de résidences de standing.",
        "price": 95000000,
        "region": "Antananarivo",
        "location": "Ambatobe, Antananarivo",
        "coordinates": [
            -18.8833,
            47.5333
        ],
        "imageUrl": "https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=1200&q=80",
        "features": [
            "Quartier de standing",
            "Sécurisé",
            "Proche écoles internationales"
        ],
        "area": 1000,
        "titleStatus": "Titre Foncier",
        "status": "disponible"
    },
    {
        "id": "11",
        "title": "Terrain à Ankadikely Ilafy",
        "description": "Parcelle bien située à proximité des grands axes routiers, en pleine zone de développement urbain.",
        "price": 38000000,
        "region": "Antananarivo",
        "location": "Ankadikely Ilafy, Antananarivo",
        "coordinates": [
            -18.85,
            47.55
        ],
        "imageUrl": "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80",
        "features": [
            "Zone en développement",
            "Accès grand axe",
            "Bornage effectué"
        ],
        "area": 750,
        "titleStatus": "Titre Foncier",
        "status": "vendu"
    },
    {
        "id": "12",
        "title": "Terrain à Diego Suarez (Antsiranana)",
        "description": "Belle parcelle dans la baie de Diego Suarez, proche des plages et du centre économique du Nord.",
        "price": 70000000,
        "region": "Diego Suarez",
        "location": "Antsiranana, Diana",
        "coordinates": [
            -12.2787,
            49.2917
        ],
        "imageUrl": "https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=1200&q=80",
        "features": [
            "Proche baie",
            "Zone économique",
            "Potentiel touristique"
        ],
        "area": 1200,
        "titleStatus": "Titre Foncier",
        "status": "disponible"
    }
];

// Parcelles fictives (lotissement) en attendant les vraies données.
// [surface m², prix Ar, statut]
const LOTS: Record<string, [number, number, Lot['status']][]> = {
  '2': [[300, 14500000, 'disponible'], [350, 17000000, 'disponible'], [400, 19500000, 'réservé'], [450, 22000000, 'disponible'], [500, 24000000, 'vendu'], [500, 24000000, 'disponible']],
  '4': [[250, 14000000, 'disponible'], [300, 17000000, 'vendu'], [300, 17000000, 'disponible'], [300, 17000000, 'disponible'], [350, 20000000, 'réservé']],
  '5': [[1000, 2000000, 'disponible'], [1500, 3000000, 'disponible'], [2000, 4000000, 'réservé'], [2500, 5000000, 'disponible'], [3000, 6000000, 'vendu'], [5000, 10000000, 'disponible'], [5000, 10000000, 'disponible'], [10000, 20000000, 'disponible']],
  '7': [[500, 30000000, 'disponible'], [500, 30000000, 'vendu'], [600, 36000000, 'disponible'], [600, 36000000, 'réservé'], [800, 48000000, 'disponible']],
  '12': [[200, 11500000, 'disponible'], [200, 11500000, 'disponible'], [250, 14500000, 'vendu'], [250, 14500000, 'disponible'], [300, 18000000, 'disponible']],
};

const LOT_IMAGES = [
  'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=400&q=70',
  'https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=400&q=70',
  'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=400&q=70',
  'https://images.unsplash.com/photo-1464082354059-27db6ce50048?auto=format&fit=crop&w=400&q=70',
  'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=400&q=70',
];

const LOT_DETAILS = [
  'Parcelle plate en bordure de route, accès facile en voiture. Bornage effectué.',
  'Terrain en angle, bien exposé au soleil, proche de l’eau et de l’électricité (JIRAMA).',
  'Parcelle calme au fond du lotissement, idéale pour une maison familiale.',
  'Légère pente avec belle vue dégagée, sol stable et ferme.',
  'Parcelle viabilisée, à quelques minutes des écoles et commerces.',
];

export const LANDS: Land[] = BASE_LANDS.map((land) => {
  const lots = LOTS[land.id];
  if (!lots) return land;
  return {
    ...land,
    lots: lots.map(([area, price, status], i) => ({
      id: `${land.id}-${i + 1}`,
      number: `Lot ${i + 1}`,
      area,
      price,
      status,
      imageUrl: LOT_IMAGES[i % LOT_IMAGES.length],
      details: LOT_DETAILS[i % LOT_DETAILS.length],
    })),
  };
});
