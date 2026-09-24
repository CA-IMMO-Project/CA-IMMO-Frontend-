import { useState } from 'react';
import { Trash2, Phone, Mail as MailIcon } from 'lucide-react';
import {
  ContactMessage, RequestStatus, Reservation,
  deleteMessage, deleteReservation, getLands, getMessages, getReservations, updateMessage, updateReservation,
} from '../lib/store';
import { Card, PageHeader, REQUEST_STATUSES, btnGhost, formatDate, inputClass } from './ui';

function StatusFilter({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)} className={`${inputClass} w-auto`}>
      <option value="">Tous</option>
      {REQUEST_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
    </select>
  );
}

function StatusSelect({ value, onChange }: { value: RequestStatus; onChange: (v: RequestStatus) => void }) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value as RequestStatus)} className={`${inputClass} w-auto py-1`}>
      {REQUEST_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
    </select>
  );
}

function Contact({ phone, email }: { phone: string; email?: string }) {
  return (
    <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-600">
      <a href={`tel:${phone.replace(/\s/g, '')}`} className="flex items-center gap-1 hover:text-navy-900"><Phone className="w-3.5 h-3.5" /> {phone}</a>
      {email && <a href={`mailto:${email}`} className="flex items-center gap-1 hover:text-navy-900"><MailIcon className="w-3.5 h-3.5" /> {email}</a>}
    </div>
  );
}

export function AdminReservations() {
  const [items, setItems] = useState(getReservations);
  const [filter, setFilter] = useState('');
  const lands = getLands();

  const update = (id: string, patch: Partial<Reservation>) => { updateReservation(id, patch); setItems(getReservations()); };
  const remove = (id: string) => { if (confirm('Supprimer cette réservation ?')) { deleteReservation(id); setItems(getReservations()); } };

  const shown = items.filter((r) => !filter || r.status === filter);

  return (
    <>
      <PageHeader title="Réservations" subtitle="Demandes envoyées depuis la page Réservation" action={<StatusFilter value={filter} onChange={setFilter} />} />
      {shown.length === 0 && <Card className="p-8 text-center text-gray-500">Aucune réservation.</Card>}
      <div className="space-y-3">
        {shown.map((r) => {
          const land = lands.find((l) => l.id === String(r.landId));
          const details: [string, string | number | undefined][] = [
            ['Terrain', land?.title ?? r.projectName],
            ['Budget', r.budget],
            ['Profession', r.profession],
            ['Âge', r.age],
            ['Nationalité', r.nationality],
            ['Compte bancaire', r.bankAccount],
          ];
          return (
            <Card key={r.id} className="p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-navy-900">{r.fullName}</p>
                  <Contact phone={r.phone} email={r.email} />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400">{formatDate(r.createdAt)}</span>
                  <StatusSelect value={r.status} onChange={(status) => update(r.id, { status })} />
                  <button onClick={() => remove(r.id)} className={`${btnGhost} hover:text-red-600`} aria-label="Supprimer"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
              <dl className="mt-3 grid sm:grid-cols-3 gap-x-4 gap-y-1 text-sm">
                {details.filter(([, v]) => v !== undefined && v !== '').map(([k, v]) => (
                  <div key={k}><dt className="inline text-gray-500">{k} : </dt><dd className="inline">{v}</dd></div>
                ))}
              </dl>
              {r.message && <p className="mt-3 text-sm bg-gray-50 rounded-lg p-3 whitespace-pre-line">{r.message}</p>}
            </Card>
          );
        })}
      </div>
    </>
  );
}

export function AdminMessages() {
  const [items, setItems] = useState(getMessages);
  const [filter, setFilter] = useState('');

  const update = (id: string, patch: Partial<ContactMessage>) => { updateMessage(id, patch); setItems(getMessages()); };
  const remove = (id: string) => { if (confirm('Supprimer ce message ?')) { deleteMessage(id); setItems(getMessages()); } };

  const shown = items.filter((m) => !filter || m.status === filter);

  return (
    <>
      <PageHeader title="Messages" subtitle="Messages envoyés depuis la page Contact" action={<StatusFilter value={filter} onChange={setFilter} />} />
      {shown.length === 0 && <Card className="p-8 text-center text-gray-500">Aucun message.</Card>}
      <div className="space-y-3">
        {shown.map((m) => (
          <Card key={m.id} className="p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-semibold text-navy-900">{m.firstName} {m.lastName}</p>
                <Contact phone={m.phone} email={m.email} />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400">{formatDate(m.createdAt)}</span>
                <StatusSelect value={m.status} onChange={(status) => update(m.id, { status })} />
                <button onClick={() => remove(m.id)} className={`${btnGhost} hover:text-red-600`} aria-label="Supprimer"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
            {m.subject && <p className="mt-3 text-sm font-medium">{m.subject}</p>}
            <p className="mt-2 text-sm bg-gray-50 rounded-lg p-3 whitespace-pre-line">{m.message}</p>
          </Card>
        ))}
      </div>
    </>
  );
}
