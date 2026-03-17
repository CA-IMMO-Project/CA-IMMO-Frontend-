import { useState } from 'react';
import { MapPin, Bed, Bath, Square, ArrowRight, Map as MapIcon, Image as ImageIcon } from 'lucide-react';
import { Property } from '../types';
import { Link } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useCurrency } from '../context/CurrencyContext';

// Fix for default marker icon in Leaflet with React
const customIcon = L.divIcon({
  className: 'custom-icon',
  html: `<div style="background-color: #8b7355; width: 24px; height: 24px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
  iconSize: [24, 24],
  iconAnchor: [12, 12]
});

interface PropertyCardProps {
  property: Property;
}

export default function PropertyCard({ property }: PropertyCardProps) {
  const [showMap, setShowMap] = useState(false);
  const { convertPrice } = useCurrency();

  const priceData = convertPrice(property.price);
  const formattedPrice = new Intl.NumberFormat(priceData.locale, { 
    style: 'currency', 
    currency: priceData.currency, 
    maximumFractionDigits: 0 
  }).format(priceData.value);

  return (
    <div className="bg-white rounded-none overflow-hidden group flex flex-col h-full border border-brand-900/10 hover:border-brand-accent/50 transition-colors duration-500">
      <div className="relative h-72 overflow-hidden bg-brand-50">
        {showMap && property.coordinates ? (
          <MapContainer 
            center={property.coordinates} 
            zoom={13} 
            scrollWheelZoom={false} 
            className="w-full h-full z-0"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={property.coordinates} icon={customIcon}>
              <Popup>
                <strong className="font-serif">{property.title}</strong> <br /> 
                {formattedPrice}
              </Popup>
            </Marker>
          </MapContainer>
        ) : (
          <img 
            src={property.imageUrl} 
            alt={property.title} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            referrerPolicy="no-referrer"
          />
        )}
        
        <div className="absolute top-4 left-4 z-10 bg-brand-900/90 backdrop-blur-sm px-4 py-1.5 text-xs uppercase tracking-widest font-medium text-brand-50">
          {property.status === 'for_sale' ? 'À Vendre' : 
           property.status === 'for_rent' ? 'À Louer' : 
           property.status === 'available' ? 'Disponible' : 'Réservé'}
        </div>
        
        {!showMap && (
          <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-brand-900/80 to-transparent z-10">
            <div className="text-brand-50 font-serif text-2xl tracking-wide">
              {formattedPrice}
              {property.status === 'for_rent' && <span className="text-sm font-sans font-light text-brand-50/80 ml-1">/mois</span>}
              {property.type === 'hotel' && <span className="text-sm font-sans font-light text-brand-50/80 ml-1">/nuit</span>}
            </div>
          </div>
        )}

        {property.coordinates && (
          <button 
            onClick={() => setShowMap(!showMap)}
            className="absolute top-4 right-4 z-10 bg-white/90 backdrop-blur-sm p-2.5 rounded-full text-brand-900 hover:text-brand-accent hover:bg-white transition-colors"
            title={showMap ? "Voir la photo" : "Voir sur la carte"}
          >
            {showMap ? <ImageIcon className="w-4 h-4" /> : <MapIcon className="w-4 h-4" />}
          </button>
        )}
      </div>
      
      <div className="p-8 flex flex-col flex-grow">
        <div className="flex items-center text-brand-900/50 text-xs uppercase tracking-widest mb-4">
          <MapPin className="w-3.5 h-3.5 mr-1.5" />
          {property.location}
        </div>
        <h3 className="text-2xl font-serif text-brand-900 mb-3 line-clamp-1">{property.title}</h3>
        <p className="text-brand-900/70 text-sm mb-6 line-clamp-2 flex-grow font-light leading-relaxed">{property.description}</p>
        
        <div className="flex items-center justify-between border-t border-brand-900/10 pt-6 mt-auto">
          <div className="flex space-x-6 text-brand-900/60 text-sm font-light">
            {property.bedrooms && (
              <div className="flex items-center" title="Chambres">
                <Bed className="w-4 h-4 mr-2 text-brand-accent" />
                {property.bedrooms}
              </div>
            )}
            {property.bathrooms && (
              <div className="flex items-center" title="Salles de bain">
                <Bath className="w-4 h-4 mr-2 text-brand-accent" />
                {property.bathrooms}
              </div>
            )}
            {property.area && (
              <div className="flex items-center" title="Surface">
                <Square className="w-4 h-4 mr-2 text-brand-accent" />
                {property.area} m²
              </div>
            )}
          </div>
          
          <Link to={`#`} className="text-brand-900 hover:text-brand-accent transition-colors">
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
