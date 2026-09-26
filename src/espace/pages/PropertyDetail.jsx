import React, { useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft, ArrowRight, Banknote, CalendarDays, CheckCircle2, ChevronRight,
  Clock3, Droplets, FileCheck2, LandPlot, MapPin, Maximize2, MessageCircle, Phone, Route, ShieldCheck,
  WalletCards, Zap,
} from 'lucide-react';
import { AppLayout, ChoiceCards, FormField, Input, Modal, PropertyCard, Select, VerifiedBadge } from '../components';
import { formatAr, getProperties, getProperty } from '../data';
import { submitInterest, submitVisit } from '../submit';
import { MapPicker } from '../../admin/crm/kit';
import { PHONE_1, PHONE_1_TEL } from '../../lib/contact';

const emptyInterest = { firstName: '', lastName: '', phone: '', email: '', birthDate: '', profession: '', country: 'Madagascar', bank: 'Oui', payment: 'Comptant', duration: '6–10 mois', deposit: '', info: '' };

function InterestForm({ property, lotId, onDone }) {
  const [step, setStep] = useState(0);
  const [f, setF] = useState(emptyInterest);
  const [error, setError] = useState('');
  const set = (k, v) => setF((x) => ({ ...x, [k]: v }));
  const lot = property.lots.find((l) => l.id === lotId);
  const next = () => {
    if (!f.firstName || !f.lastName || !f.phone || !f.email || !f.birthDate || !f.profession) return setError('Veuillez compléter les champs obligatoires.');
    if (!/^\S+@\S+\.\S+$/.test(f.email)) return setError('Adresse email invalide.');
    setError(''); setStep(1);
  };
  const send = () => {
    if (f.payment === 'Facilité' && !f.deposit) return setError('Indiquez votre apport initial.');
    onDone(submitInterest(property, lotId, f).ref);
  };
  return <div className="qualification-form">
    <div className="mini-progress"><span className="active">1</span><i className={step > 0 ? 'active' : ''}/><span className={step > 0 ? 'active' : ''}>2</span><small>{step === 0 ? 'Vos informations' : 'Votre projet d’achat'}</small></div>
    {error && <div className="form-error">{error}</div>}
    {step === 0 ? <>
      <div className="form-grid cols-2">
        <FormField label="Prénom" required><Input placeholder="Votre prénom" value={f.firstName} onChange={(e) => set('firstName', e.target.value)}/></FormField>
        <FormField label="Nom" required><Input placeholder="Votre nom" value={f.lastName} onChange={(e) => set('lastName', e.target.value)}/></FormField>
        <FormField label="Téléphone" required><Input type="tel" placeholder="+261 34 00 000 00" value={f.phone} onChange={(e) => set('phone', e.target.value)}/></FormField>
        <FormField label="Adresse email" required><Input type="email" placeholder="vous@exemple.com" value={f.email} onChange={(e) => set('email', e.target.value)}/></FormField>
        <FormField label="Date de naissance" required><Input type="date" value={f.birthDate} onChange={(e) => set('birthDate', e.target.value)}/></FormField>
        <FormField label="Profession" required><Input placeholder="Ex. Entrepreneur" value={f.profession} onChange={(e) => set('profession', e.target.value)}/></FormField>
        <FormField label="Pays de résidence" required><Select value={f.country} onChange={(e) => set('country', e.target.value)}><option>Madagascar</option><option>France</option><option>La Réunion</option><option>Autre</option></Select></FormField>
        <FormField label="Titulaire d’un compte bancaire ?" required><Select value={f.bank} onChange={(e) => set('bank', e.target.value)}><option>Oui</option><option>Non</option></Select></FormField>
      </div>
      <div className="privacy-note"><ShieldCheck size={17}/><span>Vos données sont protégées. Nous ne demandons jamais vos coordonnées bancaires sensibles.</span></div>
      <div className="modal-actions"><span/><button className="btn btn-primary" onClick={next}>Continuer <ChevronRight size={17}/></button></div>
    </> : <>
      <FormField label="Mode de paiement souhaité" required><ChoiceCards value={f.payment} onChange={(v) => set('payment', v)} options={[{ value: 'Comptant', label: 'Paiement comptant', description: 'Règlement en une fois', icon: Banknote }, { value: 'Facilité', label: 'Facilité de paiement', description: 'Paiement échelonné', icon: WalletCards }]}/></FormField>
      {f.payment === 'Facilité' && <div className="form-grid cols-2">
        <FormField label="Durée souhaitée" required><Select value={f.duration} onChange={(e) => set('duration', e.target.value)}><option>0–4 mois</option><option>4–6 mois</option><option>6–10 mois</option><option>10–12 mois</option><option>Autre durée</option></Select></FormField>
        <FormField label="Apport initial disponible" required><Input type="number" placeholder="Ex. 35 000 000 Ar" value={f.deposit} onChange={(e) => set('deposit', e.target.value)}/></FormField>
      </div>}
      <FormField label="Informations supplémentaires"><textarea rows="4" placeholder="Précisez votre projet, vos disponibilités ou toute information utile…" value={f.info} onChange={(e) => set('info', e.target.value)}/></FormField>
      <div className="summary-strip"><LandPlot size={19}/><div><strong>{property.title}{lot ? ` — ${lot.number}` : ''}</strong><span>{formatAr(lot?.price ?? property.price)} • Réf. CA-{String(property.id).padStart(4, '0')}</span></div></div>
      <div className="modal-actions"><button className="btn btn-ghost" onClick={() => setStep(0)}><ArrowLeft size={16}/> Retour</button><button className="btn btn-primary" onClick={send}>Envoyer ma demande <ArrowRight size={17}/></button></div>
    </>}
  </div>;
}

function VisitForm({ property, lotId, onDone }) {
  const tomorrow = new Date(Date.now() + 86400000).toISOString().slice(0, 10);
  const [v, setV] = useState({ date: tomorrow, time: '10:00', fullName: '', phone: '', comment: '' });
  const [error, setError] = useState('');
  const set = (k, val) => setV((x) => ({ ...x, [k]: val }));
  const send = () => {
    if (!v.date || !v.fullName.trim() || !v.phone.trim()) return setError('Veuillez compléter les champs obligatoires.');
    onDone(submitVisit(property, lotId, v).ref);
  };
  return <div className="visit-form">
    <div className="visit-advisor"><span>CA</span><div><small>Votre conseiller</small><strong>Équipe CA IMMO</strong><p><CheckCircle2 size={13}/> Disponible pour vous accompagner</p></div></div>
    {error && <div className="form-error">{error}</div>}
    <div className="form-grid cols-2">
      <FormField label="Date souhaitée" required><Input type="date" min={tomorrow} value={v.date} onChange={(e) => set('date', e.target.value)}/></FormField>
      <FormField label="Heure souhaitée" required><Select value={v.time} onChange={(e) => set('time', e.target.value)}>{['09:00', '10:00', '11:30', '14:00', '15:30'].map((t) => <option key={t}>{t}</option>)}</Select></FormField>
    </div>
    <FormField label="Votre nom et prénom" required><Input placeholder="Nom complet" value={v.fullName} onChange={(e) => set('fullName', e.target.value)}/></FormField>
    <FormField label="Numéro de téléphone" required><Input type="tel" placeholder="+261 34 00 000 00" value={v.phone} onChange={(e) => set('phone', e.target.value)}/></FormField>
    <FormField label="Commentaire (facultatif)"><textarea rows="3" placeholder="Une question ou une précision pour la visite ?" value={v.comment} onChange={(e) => set('comment', e.target.value)}/></FormField>
    <p className="visit-info"><Clock3 size={15}/> CA IMMO confirmera le créneau par téléphone ou SMS.</p>
    <div className="modal-actions"><span/><button className="btn btn-primary" onClick={send}>Demander cette visite <CalendarDays size={17}/></button></div>
  </div>;
}

export default function PropertyDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const property = useMemo(() => getProperty(id), [id]);
  const others = useMemo(() => getProperties().filter((p) => p.id !== id).slice(0, 3), [id]);
  const [activeImage, setActiveImage] = useState(0);
  const [lotId, setLotId] = useState('');
  const [interest, setInterest] = useState(false);
  const [visit, setVisit] = useState(false);
  const [success, setSuccess] = useState(null);

  if (!property) return <AppLayout><section className="confirmation-page"><div className="confirmation-card"><h1>Terrain introuvable</h1><p>Ce terrain n’est plus disponible.</p><div className="confirmation-actions"><Link to="/acheter" className="btn btn-primary">Voir les terrains</Link></div></div></section></AppLayout>;

  const lot = property.lots.find((l) => l.id === lotId);
  const price = lot?.price ?? property.price;
  const area = lot?.area ?? property.area;
  const done = (type, ref) => { setInterest(false); setVisit(false); setSuccess({ type, ref }); };
  const gallery = property.gallery.length ? property.gallery : [property.image];
  const reference = `CA-${String(property.id).padStart(4, '0')}`;

  return <AppLayout>
    <div className="bg-navy-900 font-display">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4 flex flex-wrap items-center gap-1 text-xs text-white/70">
        <Link to="/" className="hover:text-gold-500">Accueil</Link><ChevronRight size={12}/>
        <Link to="/acheter" className="hover:text-gold-500">Acheter</Link><ChevronRight size={12}/>
        <span className="text-white truncate">{property.title}</span>
        <button onClick={() => navigate(-1)} className="ml-auto inline-flex items-center gap-1 rounded-full border border-white/40 px-3 py-1 text-white hover:bg-white hover:text-navy-900 transition"><ArrowLeft size={14}/> Retour</button>
      </nav>
    </div>
    <div className="h-6"/>
    <section className="gallery container">
      <button className="gallery-main"><img src={gallery[activeImage] ?? gallery[0]} alt={property.title}/></button>
      {gallery.slice(0, 3).map((g, i) => <button key={g} onClick={() => setActiveImage(i)}><img src={g} alt={`Vue ${i + 1} du terrain`}/></button>)}
    </section>

    <section className="detail-section"><div className="container detail-layout">
      <div className="detail-main">
        <div className="detail-heading"><div className="detail-badges">{property.verified && <VerifiedBadge/>}<span className="availability"><i/> {property.status}</span></div><h1>{property.title}</h1><p><MapPin size={17}/>{property.location}</p></div>
        <div className="key-specs">
          <div><span><Maximize2/></span><small>Superficie</small><strong>{area.toLocaleString('fr-FR')} m²</strong></div>
          <div><span><LandPlot/></span><small>Type de relief</small><strong>{property.relief}</strong></div>
          <div><span><Route/></span><small>Accessibilité</small><strong>{property.access}</strong></div>
          <div><span><Zap/></span><small>Électricité</small><strong>{property.electricity ? 'Disponible' : 'À vérifier'}</strong></div>
          <div><span><Droplets/></span><small>Eau</small><strong>{property.water ? 'Disponible' : 'À vérifier'}</strong></div>
        </div>
        <div className="detail-block"><h2>À propos de ce terrain</h2><p>{property.description}</p>
          {property.features.length > 0 && <div className="document-list">{property.features.map((x) => <div key={x}><span><CheckCircle2 size={19}/></span><div><strong>{x}</strong></div></div>)}</div>}
          <div className="reference-row"><span>Référence du terrain</span><strong>{reference}</strong></div>
        </div>

        {property.lots.length > 0 && <div className="detail-block"><h2>Parcelles disponibles</h2><p>Ce terrain est loti. Choisissez la parcelle qui vous intéresse.</p>
          <div className="choice-cards cols-2">
            {property.lots.map((l) => {
              const free = l.status === 'disponible';
              return <button type="button" key={l.id} disabled={!free} onClick={() => setLotId(lotId === l.id ? '' : l.id)} className={`choice-card ${lotId === l.id ? 'selected' : ''}`} style={free ? undefined : { opacity: 0.5, cursor: 'not-allowed' }}>
                {l.imageUrl && <img src={l.imageUrl} alt="" style={{ width: 64, height: 52, objectFit: 'cover', borderRadius: 10, flexShrink: 0 }}/>}
                <span><strong>{l.number} · {l.area.toLocaleString('fr-FR')} m²</strong><small>{formatAr(l.price)} · {free ? 'Disponible' : l.status === 'réservé' ? 'Réservée' : 'Vendue'}</small>{l.details && <small>{l.details}</small>}</span>
                {lotId === l.id && <CheckCircle2 size={18} className="choice-check"/>}
              </button>;
            })}
          </div>
        </div>}

        {property.coordinates && <div className="detail-block"><div className="block-heading"><h2>Localisation</h2><a className="text-link" target="_blank" rel="noopener noreferrer" href={`https://www.google.com/maps?q=${property.coordinates[0]},${property.coordinates[1]}`}>Itinéraire</a></div>
          <MapPicker lat={property.coordinates[0]} lng={property.coordinates[1]} readOnly height="h-72"/>
          <p className="map-address"><MapPin size={16}/><span><strong>{property.location}</strong><small>Emplacement approximatif — la position exacte est communiquée lors de la visite.</small></span></p>
        </div>}

        <div className="detail-block"><h2>Documents disponibles</h2><p>Documents contrôlés par notre équipe et consultables sur rendez-vous.</p><div className="document-list">{property.documents.map((d) => <div key={d}><span><FileCheck2 size={19}/></span><div><strong>{d}</strong><small>Document contrôlé par CA IMMO</small></div><CheckCircle2 size={18}/></div>)}</div><div className="verified-note"><ShieldCheck size={22}/><div><strong>Dossier vérifié par CA IMMO</strong><p>L’identité du propriétaire et la cohérence des documents ont été contrôlées.</p></div></div></div>
        <div className="detail-block"><h2>Conditions de paiement</h2><div className="payment-detail-grid"><div><Banknote/><span><small>Prix {lot ? 'de la parcelle' : 'total'}</small><strong>{formatAr(price)}</strong></span></div><div><LandPlot/><span><small>Prix au m²</small><strong>{formatAr(area ? price / area : 0)}</strong></span></div><div><WalletCards/><span><small>Acompte demandé</small><strong>{property.downPayment}</strong></span></div><div><Clock3/><span><small>Durée maximale</small><strong>{property.installments}</strong></span></div></div><p className="negotiation-note">Les conditions finales sont soumises à l’accord du propriétaire et formalisées par CA IMMO.</p></div>
      </div>
      <aside className="detail-sidebar">
        <div className="purchase-card"><span className="purchase-label">{lot ? `Prix — ${lot.number}` : 'Prix du terrain'}</span><strong>{formatAr(price)}</strong><small>soit {formatAr(area ? price / area : 0)} / m²</small><hr/>
          <div className="purchase-terms"><span><CheckCircle2/>{property.status}</span><span><WalletCards/>{property.payment}</span>{property.verified && <span><ShieldCheck/>{property.titleStatus}</span>}</div>
          <button className="btn btn-primary btn-full btn-lg" disabled={!property.available} onClick={() => setInterest(true)}>Je suis intéressé <ArrowRight size={18}/></button>
          <button className="btn btn-secondary btn-full" disabled={!property.available} onClick={() => setVisit(true)}><CalendarDays size={18}/> Demander une visite</button>
          <p>Réponse d’un conseiller sous 24 h ouvrées.</p></div>
        <div className="advisor-card"><div className="advisor-head"><span>CA</span><div><small>Votre conseiller</small><strong>CA IMMO</strong><p><i/> {PHONE_1}</p></div></div><div className="advisor-actions"><a href={PHONE_1_TEL}><Phone size={17}/> Appeler</a><a href={`https://wa.me/${PHONE_1_TEL.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer"><MessageCircle size={17}/> WhatsApp</a></div></div>
        <div className="safety-card"><ShieldCheck size={19}/><div><strong>Conseil sécurité</strong><p>Ne versez aucun acompte sans document officiel de CA IMMO.</p></div></div>
      </aside>
    </div></section>

    {others.length > 0 && <section className="section related-section"><div className="container"><div className="section-heading"><div><span className="eyebrow">À découvrir aussi</span><h2>Terrains similaires</h2></div><Link to="/acheter" className="text-link">Voir tous les terrains <ArrowRight size={17}/></Link></div><div className="property-grid">{others.map((p) => <PropertyCard property={p} key={p.id}/>)}</div></div></section>}

    <Modal open={interest} onClose={() => setInterest(false)} title="Votre projet d’achat" subtitle={`Terrain ${reference} • ${property.location}`} size="large"><InterestForm property={property} lotId={lotId} onDone={(ref) => done('interest', ref)}/></Modal>
    <Modal open={visit} onClose={() => setVisit(false)} title="Planifier une visite" subtitle={`${property.title} • ${property.location}`}><VisitForm property={property} lotId={lotId} onDone={(ref) => done('visit', ref)}/></Modal>
    <Modal open={!!success} onClose={() => setSuccess(null)} title="" size="success-modal"><div className="success-content"><span><CheckCircle2 size={38}/></span><h2>{success?.type === 'visit' ? 'Demande de visite envoyée !' : 'Votre intérêt est enregistré !'}</h2><p>{success?.type === 'visit' ? 'Notre équipe vérifie la disponibilité du conseiller. Vous recevrez une confirmation par téléphone ou SMS.' : 'Un conseiller CA IMMO vous contactera sous 24 heures ouvrées pour étudier votre projet.'}</p><div className="request-number"><small>Numéro de demande</small><strong>{success?.ref}</strong></div><button className="btn btn-primary btn-full" onClick={() => setSuccess(null)}>Terminé</button></div></Modal>
  </AppLayout>;
}
