import { Link } from 'react-router-dom';
import { Map, CheckCircle2, CalendarCheck, Mail } from 'lucide-react';
import { getLands, getMessages, getReservations } from '../lib/store';
import { formatAriary } from '../lib/format';
import { Badge, Card, PageHeader, formatDate } from './ui';

export default function Dashboard() {
  const lands = getLands();
  const reservations = getReservations();
  const messages = getMessages();

  const available = lands.filter((l) => l.status === 'disponible');
  const stats = [
    { label: 'Terrains', value: lands.length, icon: Map, to: '/admin/terrains' },
    { label: 'Disponibles', value: available.length, icon: CheckCircle2, to: '/admin/terrains' },
    { label: 'Réservations nouvelles', value: reservations.filter((r) => r.status === 'nouveau').length, icon: CalendarCheck, to: '/admin/reservations' },
    { label: 'Messages non traités', value: messages.filter((m) => m.status === 'nouveau').length, icon: Mail, to: '/admin/messages' },
  ];

  const stockValue = available.reduce((sum, l) => sum + l.price, 0);

  return (
    <>
      <PageHeader title="Tableau de bord" subtitle="Vue d'ensemble de l'activité CA IMMO" />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ label, value, icon: Icon, to }) => (
          <Link key={label} to={to}>
            <Card className="p-5 hover:border-gold-500 transition-colors">
              <Icon className="w-5 h-5 text-gold-600" />
              <p className="mt-3 text-3xl font-bold text-navy-900">{value}</p>
              <p className="text-sm text-gray-500">{label}</p>
            </Card>
          </Link>
        ))}
      </div>

      <Card className="p-5 mt-4">
        <p className="text-sm text-gray-500">Valeur totale des terrains disponibles</p>
        <p className="text-2xl font-bold text-navy-900 mt-1">{formatAriary(stockValue)}</p>
      </Card>

      <div className="grid lg:grid-cols-2 gap-4 mt-4">
        <Card className="p-5">
          <h2 className="font-semibold mb-4 font-display">Dernières réservations</h2>
          {reservations.length === 0 && <p className="text-sm text-gray-500">Aucune réservation pour l'instant.</p>}
          <ul className="divide-y divide-gray-100">
            {reservations.slice(0, 5).map((r) => (
              <li key={r.id} className="py-2 flex items-center justify-between gap-2 text-sm">
                <span>
                  <span className="font-medium">{r.fullName}</span>
                  <span className="text-gray-500"> — {r.phone}</span>
                </span>
                <span className="flex items-center gap-2 shrink-0">
                  <span className="text-xs text-gray-400">{formatDate(r.createdAt)}</span>
                  <Badge value={r.status} />
                </span>
              </li>
            ))}
          </ul>
        </Card>
        <Card className="p-5">
          <h2 className="font-semibold mb-4 font-display">Derniers messages</h2>
          {messages.length === 0 && <p className="text-sm text-gray-500">Aucun message pour l'instant.</p>}
          <ul className="divide-y divide-gray-100">
            {messages.slice(0, 5).map((m) => (
              <li key={m.id} className="py-2 flex items-center justify-between gap-2 text-sm">
                <span className="truncate">
                  <span className="font-medium">{m.firstName} {m.lastName}</span>
                  <span className="text-gray-500"> — {m.subject || m.message}</span>
                </span>
                <Badge value={m.status} />
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </>
  );
}
