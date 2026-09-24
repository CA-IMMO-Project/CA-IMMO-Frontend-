import { useMemo, useState } from 'react';
import { Plus, Pencil, Trash2, Search, RotateCcw, X } from 'lucide-react';
import { Land, TitleStatus } from '../types';
import { deleteLand, getLands, newId, resetLands, saveLand } from '../lib/store';
import { formatAriary, formatArea } from '../lib/format';
import { Badge, Card, PageHeader, btnGhost, btnPrimary, inputClass } from './ui';

const TITLE_STATUSES: TitleStatus[] = ['Titre Foncier', 'Titre en cours', 'Cadastré'];
const LAND_STATUSES: Land['status'][] = ['disponible', 'réservé', 'vendu'];

const emptyLand = (): Land => ({
  id: newId(),
  title: '',
  description: '',
  price: 0,
  region: '',
  location: '',
  imageUrl: '',
  features: [],
  area: 0,
  titleStatus: 'Titre Foncier',
  status: 'disponible',
});

export default function AdminLands() {
  const [lands, setLands] = useState(getLands);
  const [editing, setEditing] = useState<Land | null>(null);
  const [q, setQ] = useState('');
  const [status, setStatus] = useState('');

  const refresh = () => setLands(getLands());

  const filtered = useMemo(() => {
    const s = q.toLowerCase();
    return lands.filter(
      (l) =>
        (!s || l.title.toLowerCase().includes(s) || l.location.toLowerCase().includes(s)) &&
        (!status || l.status === status),
    );
  }, [lands, q, status]);

  const remove = (land: Land) => {
    if (!confirm(`Supprimer « ${land.title} » ?`)) return;
    deleteLand(land.id);
    refresh();
  };

  const reset = () => {
    if (!confirm('Réinitialiser la liste des terrains avec les données d\'origine ? Vos modifications seront perdues.')) return;
    resetLands();
    refresh();
  };

  return (
    <>
      <PageHeader
        title="Terrains"
        subtitle={`${lands.length} terrain(s) au catalogue`}
        action={
          <div className="flex gap-2">
            <button onClick={reset} className={btnGhost}><RotateCcw className="w-4 h-4" /> Réinitialiser</button>
            <button onClick={() => setEditing(emptyLand())} className={btnPrimary}><Plus className="w-4 h-4" /> Ajouter un terrain</button>
          </div>
        }
      />

      <Card className="p-4 mb-4 flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Rechercher par titre ou localisation…" className={`${inputClass} pl-9`} />
        </div>
        <select value={status} onChange={(e) => setStatus(e.target.value)} className={`${inputClass} w-auto`}>
          <option value="">Tous les statuts</option>
          {LAND_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </Card>

      <Card className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left text-gray-500">
            <tr>
              <th className="p-3 font-medium">Terrain</th>
              <th className="p-3 font-medium">Région</th>
              <th className="p-3 font-medium">Surface</th>
              <th className="p-3 font-medium">Prix</th>
              <th className="p-3 font-medium">Statut</th>
              <th className="p-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map((land) => (
              <tr key={land.id} className="hover:bg-gray-50">
                <td className="p-3">
                  <div className="flex items-center gap-3">
                    {land.imageUrl && <img src={land.imageUrl} alt="" className="w-14 h-10 rounded object-cover" referrerPolicy="no-referrer" />}
                    <div>
                      <p className="font-medium text-navy-900">{land.title}</p>
                      <p className="text-xs text-gray-500">{land.titleStatus}</p>
                    </div>
                  </div>
                </td>
                <td className="p-3">{land.region}</td>
                <td className="p-3 whitespace-nowrap">{formatArea(land.area)}</td>
                <td className="p-3 whitespace-nowrap">{formatAriary(land.price)}</td>
                <td className="p-3"><Badge value={land.status} /></td>
                <td className="p-3 whitespace-nowrap text-right">
                  <button onClick={() => setEditing({ ...land })} className={btnGhost} aria-label="Modifier"><Pencil className="w-4 h-4" /></button>
                  <button onClick={() => remove(land)} className={`${btnGhost} hover:text-red-600`} aria-label="Supprimer"><Trash2 className="w-4 h-4" /></button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={6} className="p-6 text-center text-gray-500">Aucun terrain trouvé.</td></tr>
            )}
          </tbody>
        </table>
      </Card>

      {editing && (
        <LandForm
          land={editing}
          onClose={() => setEditing(null)}
          onSave={(land) => { saveLand(land); refresh(); setEditing(null); }}
        />
      )}
    </>
  );
}

function LandForm({ land, onClose, onSave }: { land: Land; onClose: () => void; onSave: (land: Land) => void }) {
  const [form, setForm] = useState(land);
  const [features, setFeatures] = useState(land.features.join('\n'));
  const [lat, setLat] = useState(land.coordinates?.[0]?.toString() ?? '');
  const [lng, setLng] = useState(land.coordinates?.[1]?.toString() ?? '');

  const set = <K extends keyof Land>(key: K, value: Land[K]) => setForm((f) => ({ ...f, [key]: value }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...form,
      features: features.split('\n').map((f) => f.trim()).filter(Boolean),
      coordinates: lat && lng ? [Number(lat), Number(lng)] : undefined,
    });
  };

  const field = (label: string, input: React.ReactNode, full = false) => (
    <label className={`block ${full ? 'sm:col-span-2' : ''}`}>
      <span className="block text-sm font-medium text-navy-900 mb-1">{label}</span>
      {input}
    </label>
  );

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-start justify-center p-4 overflow-y-auto">
      <form onSubmit={submit} className="bg-white rounded-2xl w-full max-w-2xl my-8 shadow-xl">
        <div className="flex items-center justify-between p-5 border-b">
          <h2 className="text-lg font-bold font-display">{land.title ? 'Modifier le terrain' : 'Nouveau terrain'}</h2>
          <button type="button" onClick={onClose} className={btnGhost}><X className="w-5 h-5" /></button>
        </div>
        <div className="p-5 grid sm:grid-cols-2 gap-4">
          {field('Titre *', <input required value={form.title} onChange={(e) => set('title', e.target.value)} className={inputClass} />, true)}
          {field('Description', <textarea rows={3} value={form.description} onChange={(e) => set('description', e.target.value)} className={inputClass} />, true)}
          {field('Prix (Ar) *', <input required type="number" min={0} value={form.price || ''} onChange={(e) => set('price', Number(e.target.value))} className={inputClass} />)}
          {field('Surface (m²) *', <input required type="number" min={0} value={form.area || ''} onChange={(e) => set('area', Number(e.target.value))} className={inputClass} />)}
          {field('Région *', <input required value={form.region} onChange={(e) => set('region', e.target.value)} className={inputClass} />)}
          {field('Localisation *', <input required value={form.location} onChange={(e) => set('location', e.target.value)} className={inputClass} />)}
          {field('Latitude', <input type="number" step="any" value={lat} onChange={(e) => setLat(e.target.value)} className={inputClass} />)}
          {field('Longitude', <input type="number" step="any" value={lng} onChange={(e) => setLng(e.target.value)} className={inputClass} />)}
          {field('Statut juridique', (
            <select value={form.titleStatus} onChange={(e) => set('titleStatus', e.target.value as TitleStatus)} className={inputClass}>
              {TITLE_STATUSES.map((s) => <option key={s}>{s}</option>)}
            </select>
          ))}
          {field('Disponibilité', (
            <select value={form.status} onChange={(e) => set('status', e.target.value as Land['status'])} className={inputClass}>
              {LAND_STATUSES.map((s) => <option key={s}>{s}</option>)}
            </select>
          ))}
          {field('URL de l\'image', <input type="url" value={form.imageUrl} onChange={(e) => set('imageUrl', e.target.value)} className={inputClass} placeholder="https://…" />, true)}
          {form.imageUrl && <img src={form.imageUrl} alt="" className="sm:col-span-2 h-40 w-full object-cover rounded-lg" referrerPolicy="no-referrer" />}
          {field('Atouts (un par ligne)', <textarea rows={4} value={features} onChange={(e) => setFeatures(e.target.value)} className={inputClass} />, true)}
        </div>
        <div className="flex justify-end gap-2 p-5 border-t">
          <button type="button" onClick={onClose} className={btnGhost}>Annuler</button>
          <button type="submit" className={btnPrimary}>Enregistrer</button>
        </div>
      </form>
    </div>
  );
}
