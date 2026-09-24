import { useState } from 'react';
import { MapPin, Square, ArrowRight, Map as MapIcon, Image as ImageIcon, FileCheck } from 'lucide-react';
import { Land } from '../types';
import { Link } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { formatAriary, formatArea } from '../lib/format';

const customIcon = L.divIcon({
  className: 'custom-icon',
  html: `<div style="background-color: #2f9e5c; width: 24px; height: 24px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
  iconSize: [24, 24],
  iconAnchor: [12, 12],
});

const statusLabel: Record<Land['status'], string> = {
  disponible: 'Disponible',
  réservé: 'Réservé',
  vendu: 'Vendu',
};

interface LandCardProps {
  land: Land;
}

export default function LandCard({ land }: LandCardProps) {
  const [showMap, setShowMap] = useState(false);

  return (
    <div className="bg-white overflow-hidden group flex flex-col h-full border border-brand-900/10 hover:border-brand-accent/50 transition-colors duration-500 rounded-2xl shadow-sm hover:shadow-xl">
      <div className="relative h-64 overflow-hidden bg-brand-50">
        {showMap && land.coordinates ? (
          <MapContainer center={land.coordinates} zoom={12} scrollWheelZoom={false} className="w-full h-full z-0">
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={land.coordinates} icon={customIcon}>
              <Popup>
                <strong className="font-serif">{land.title}</strong> <br />
                {formatAriary(land.price)}
              </Popup>
            </Marker>
          </MapContainer>
        ) : (
          <img
            src={land.imageUrl}
            alt={land.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            referrerPolicy="no-referrer"
          />
        )}

        <div
          className={`absolute top-4 left-4 z-10 px-3 py-1.5 text-xs uppercase tracking-widest font-medium text-white rounded-full ${
            land.status === 'disponible' ? 'bg-brand-accent' : land.status === 'réservé' ? 'bg-amber-500' : 'bg-brand-900/70'
          }`}
        >
          {statusLabel[land.status]}
        </div>

        {!showMap && (
          <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-brand-900/85 to-transparent z-10">
            <div className="text-white font-serif text-xl tracking-wide">{formatAriary(land.price)}</div>
          </div>
        )}

        {land.coordinates && (
          <button
            onClick={() => setShowMap(!showMap)}
            className="absolute top-4 right-4 z-10 bg-white/90 backdrop-blur-sm p-2.5 rounded-full text-brand-900 hover:text-brand-accent hover:bg-white transition-colors"
            title={showMap ? 'Voir la photo' : 'Voir sur la carte'}
          >
            {showMap ? <ImageIcon className="w-4 h-4" /> : <MapIcon className="w-4 h-4" />}
          </button>
        )}
      </div>

      <div className="p-6 flex flex-col flex-grow">
        <div className="flex items-center text-brand-900/50 text-xs uppercase tracking-widest mb-3">
          <MapPin className="w-3.5 h-3.5 mr-1.5" />
          {land.location}
        </div>
        <h3 className="text-xl font-serif text-brand-900 mb-2 line-clamp-1">{land.title}</h3>
        <p className="text-brand-900/70 text-sm mb-5 line-clamp-2 flex-grow font-light leading-relaxed">{land.description}</p>

        <div className="flex items-center justify-between border-t border-brand-900/10 pt-5 mt-auto">
          <div className="flex space-x-5 text-brand-900/60 text-sm font-light">
            <div className="flex items-center" title="Surface">
              <Square className="w-4 h-4 mr-2 text-brand-accent" />
              {formatArea(land.area)}
            </div>
            <div className="flex items-center" title="Statut du titre">
              <FileCheck className="w-4 h-4 mr-2 text-brand-accent" />
              {land.titleStatus}
            </div>
          </div>

          <Link
            to={`/reservation?terrain=${land.id}`}
            className="text-brand-900 hover:text-brand-accent transition-colors"
            title="Réserver ce terrain"
          >
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
