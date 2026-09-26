import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Banknote, Building2, CheckCircle2, Clock3, Home, LandPlot, MapPin, Search, ShieldCheck, Sparkles, Store, Tractor, TrendingUp, WalletCards } from 'lucide-react';
import { AppLayout, ChoiceCards, FormField, FormNav, Input, ProgressSteps, Select } from '../components';
import { getProperties } from '../data';
import { submitSearch } from '../submit';
import { MapPicker } from '../../admin/crm/kit';
import Hero from '../Hero';
import { PHONE_1 } from '../../lib/contact';

const ZONES = ['Ivato', 'Talatamaty', 'Ambohidratrimo', 'Andoharanofotsy', 'Ambohimangakely', 'Imerintsiatosika', 'Antsirabe', 'Autre zone'];
const RADII = [2, 5, 8, 15, 30];

export default function SearchRequest() {
  const [step, setStep] = useState(0);
  const [sent, setSent] = useState(null);
  const [form, setForm] = useState({
    firstName: '', lastName: '', phone: '', email: '', birthDate: '', profession: '', country: 'Madagascar', bank: 'Oui',
    zone: 'Ivato', customZone: '', otherZones: '', radius: 8, flexible: 'Oui', lat: undefined, lng: undefined,
    budget: '100 000–150 000 Ar', customBudget: '', area: '500–1 000 m²', customArea: '', relief: 'Sans préférence', usage: 'Maison',
    payment: 'Facilité de paiement', duration: '6–10 mois', contribution: '', info: '', consent: true,
  });
  const update = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const [error, setError] = useState('');
  const zone = form.zone === 'Autre zone' ? form.customZone : form.zone;

  const next = (n) => {
    if (n > step && step === 0) {
      if (!form.firstName || !form.lastName || !form.phone || !form.email || !form.birthDate || !form.profession) return setError('Veuillez compléter les champs obligatoires avant de continuer.');
      if (!/^\S+@\S+\.\S+$/.test(form.email)) return setError('Adresse email invalide.');
    }
    if (n > step && step === 1 && !zone.trim()) return setError('Indiquez la zone recherchée.');
    setError(''); setStep(n);
  };
  const submit = () => {
    if (!form.consent) return setError('Merci d’accepter d’être contacté(e) pour que nous puissions traiter votre recherche.');
    const s = submitSearch({ ...form, zone });
    setSent(s);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const matches = useMemo(() => {
    if (!sent) return 0;
    const z = zone.toLowerCase();
    return getProperties().filter((p) => p.available && (`${p.location} ${p.region}`.toLowerCase().includes(z) || form.otherZones.toLowerCase().split(',').some((o) => o.trim() && p.location.toLowerCase().includes(o.trim())))).length;
  }, [sent]);

  if (sent) return <AppLayout><section className="confirmation-page"><div className="confirmation-card">
    <span className="success-mark"><CheckCircle2 size={43}/></span><span className="eyebrow">Demande transmise</span>
    <h1>Votre recherche est entre de bonnes mains.</h1>
    <p>Notre équipe va étudier vos critères et vérifier les terrains disponibles. Vous serez contacté(e) dès qu’une correspondance pertinente sera prête.</p>
    {matches > 0 && <Link to="/acheter" className="match-highlight"><span><Sparkles size={23}/></span><div><strong>{matches} terrain{matches > 1 ? 's' : ''} du catalogue dans cette zone</strong><p>autour de {zone}</p></div><ArrowRight size={20}/></Link>}
    <div className="request-recap"><div><small>Numéro de demande</small><strong>{sent.ref}</strong></div><div><small>Statut</small><span className="pending-dot"><i/>En attente de traitement</span></div><div><small>Délai de réponse estimé</small><strong>24–48 h ouvrées</strong></div></div>
    <div className="next-steps"><h3>Et maintenant ?</h3><div><span>1</span><p><strong>Analyse de votre demande</strong>Un conseiller compare vos critères aux terrains vérifiés.</p></div><div><span>2</span><p><strong>Sélection personnalisée</strong>Vous recevez les meilleures correspondances.</p></div><div><span>3</span><p><strong>Visite accompagnée</strong>Nous organisons vos visites selon vos disponibilités.</p></div></div>
    <div className="confirmation-actions"><Link to="/acheter" className="btn btn-primary">Explorer les terrains <ArrowRight size={17}/></Link><Link to="/" className="btn btn-secondary">Retour à l’accueil</Link></div>
  </div></section></AppLayout>;

  return <AppLayout>
    <Hero crumb="Rechercher un terrain" pill="Recherche personnalisée" title="Confiez-nous la recherche de" highlight="votre terrain" text="Décrivez votre projet en quelques étapes. Notre équipe locale cherche et vérifie les terrains pour vous." image="https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1600&q=80"/>
    <section className="form-page"><div className="container form-page-layout">
      <aside className="form-aside">
        <div className="form-aside-card"><span className="aside-icon"><Search size={25}/></span><h2>Une recherche vraiment sur mesure</h2><p>Votre demande n’est pas une simple alerte. Elle est étudiée par un conseiller qui connaît le marché local.</p><div className="aside-points"><span><CheckCircle2/>Sélection selon vos critères</span><span><ShieldCheck/>Terrains contrôlés</span><span><Clock3/>Réponse sous 24–48 h</span></div></div>
        <div className="helper-card"><div className="helper-avatar">CA</div><div><small>Besoin d’aide ?</small><strong>L’équipe CA IMMO vous accompagne</strong><p>{PHONE_1}</p></div></div>
      </aside>
      <div className="multi-form-card">
        <ProgressSteps steps={['Profil', 'Localisation', 'Projet', 'Financement']} current={step}/>
        <div className="form-content">
          {error && <div className="form-error">{error}</div>}
          {step === 0 && <div className="form-step"><div className="form-step-heading"><span>Étape 1 sur 4</span><h2>Parlons un peu de vous</h2><p>Ces informations permettent à votre conseiller de vous recontacter.</p></div>
            <div className="form-grid cols-2">
              <FormField label="Prénom" required><Input placeholder="Ex. Andry" value={form.firstName} onChange={(e) => update('firstName', e.target.value)}/></FormField>
              <FormField label="Nom" required><Input placeholder="Ex. Rakoto" value={form.lastName} onChange={(e) => update('lastName', e.target.value)}/></FormField>
              <FormField label="Téléphone" required><Input type="tel" placeholder="+261 34 00 000 00" value={form.phone} onChange={(e) => update('phone', e.target.value)}/></FormField>
              <FormField label="Adresse email" required><Input type="email" placeholder="vous@exemple.com" value={form.email} onChange={(e) => update('email', e.target.value)}/></FormField>
              <FormField label="Date de naissance" required><Input type="date" value={form.birthDate} onChange={(e) => update('birthDate', e.target.value)}/></FormField>
              <FormField label="Profession" required><Input placeholder="Ex. Responsable commercial" value={form.profession} onChange={(e) => update('profession', e.target.value)}/></FormField>
              <FormField label="Pays de résidence" required><Select value={form.country} onChange={(e) => update('country', e.target.value)}><option>Madagascar</option><option>France</option><option>La Réunion</option><option>Belgique</option><option>Autre</option></Select></FormField>
              <FormField label="Titulaire d’un compte bancaire ?" required><Select value={form.bank} onChange={(e) => update('bank', e.target.value)}><option>Oui</option><option>Non</option></Select></FormField>
            </div>
            <div className="privacy-note"><ShieldCheck size={17}/><span>Vos informations restent confidentielles. Aucune donnée bancaire sensible ne vous sera demandée.</span></div>
          </div>}
          {step === 1 && <div className="form-step"><div className="form-step-heading"><span>Étape 2 sur 4</span><h2>Où souhaitez-vous investir ?</h2><p>Indiquez votre zone prioritaire et les alternatives possibles.</p></div>
            <FormField label="Zone principale recherchée" required><Select value={form.zone} onChange={(e) => update('zone', e.target.value)}>{ZONES.map((z) => <option key={z}>{z}</option>)}</Select></FormField>
            {form.zone === 'Autre zone' && <FormField label="Précisez la zone" required><Input placeholder="Commune, quartier…" value={form.customZone} onChange={(e) => update('customZone', e.target.value)}/></FormField>}
            <FormField label="Autres zones acceptées" hint="Séparez plusieurs zones par une virgule."><Input placeholder="Ex. Talatamaty, Ambohidratrimo…" value={form.otherZones} onChange={(e) => update('otherZones', e.target.value)}/></FormField>
            <div className="zone-preview"><MapPin size={21}/><div><strong>Zone ciblée : {zone || '—'}</strong><p>Rayon suggéré : {form.radius} km {form.lat !== undefined ? '• point placé sur la carte' : '• cliquez sur la carte pour préciser'}</p></div></div>
            <FormField label="Rayon suggéré"><ChoiceCards columns={5} value={form.radius} onChange={(v) => update('radius', v)} options={RADII.map((r) => ({ value: r, label: `${r} km` }))}/></FormField>
            <MapPicker lat={form.lat} lng={form.lng} radiusKm={form.radius} onChange={(lat, lng) => setForm((f) => ({ ...f, lat, lng }))} height="h-72"/>
            <FormField label="Êtes-vous flexible sur la localisation ?" required><ChoiceCards value={form.flexible} onChange={(v) => update('flexible', v)} options={[{ value: 'Oui', label: 'Oui, je suis flexible', description: 'Proposez-moi les zones proches' }, { value: 'Non', label: 'Non, uniquement cette zone', description: 'Respectez la localisation exacte' }]}/></FormField>
          </div>}
          {step === 2 && <div className="form-step"><div className="form-step-heading"><span>Étape 3 sur 4</span><h2>Décrivez le terrain idéal</h2><p>Plus vos critères sont précis, meilleures seront nos propositions.</p></div>
            <FormField label="Budget total" required><ChoiceCards columns={3} value={form.budget} onChange={(v) => update('budget', v)} options={['60 000–100 000 Ar', '100 000–150 000 Ar', '150 000 Ar et plus', 'Budget personnalisé']}/></FormField>
            {form.budget === 'Budget personnalisé' && <FormField label="Votre budget personnalisé"><Input type="number" placeholder="Montant en Ariary" value={form.customBudget} onChange={(e) => update('customBudget', e.target.value)}/></FormField>}
            <FormField label="Superficie souhaitée" required><ChoiceCards columns={3} value={form.area} onChange={(v) => update('area', v)} options={['Moins de 300 m²', '300–500 m²', '500–1 000 m²', '1 000–2 000 m²', 'Plus de 2 000 m²', 'Surface personnalisée']}/></FormField>
            {form.area === 'Surface personnalisée' && <FormField label="Surface personnalisée"><Input type="number" placeholder="Surface en m²" value={form.customArea} onChange={(e) => update('customArea', e.target.value)}/></FormField>}
            <FormField label="Type de terrain souhaité" required><ChoiceCards columns={4} value={form.relief} onChange={(v) => update('relief', v)} options={['Plat', 'Pente douce', 'Pente forte', 'Sans préférence']}/></FormField>
            <FormField label="Usage prévu du terrain" required><ChoiceCards columns={3} value={form.usage} onChange={(v) => update('usage', v)} options={[{ value: 'Maison', label: 'Construction maison', icon: Home }, { value: 'Commerce', label: 'Commerce', icon: Store }, { value: 'Investissement', label: 'Investissement', icon: TrendingUp }, { value: 'Agriculture', label: 'Agriculture', icon: Tractor }, { value: 'Location', label: 'Projet locatif', icon: Building2 }, { value: 'Autre', label: 'Autre usage', icon: LandPlot }]}/></FormField>
          </div>}
          {step === 3 && <div className="form-step"><div className="form-step-heading"><span>Étape 4 sur 4</span><h2>Votre mode de financement</h2><p>Ces informations nous aident à proposer des terrains avec des conditions adaptées.</p></div>
            <FormField label="Mode de paiement souhaité" required><ChoiceCards value={form.payment} onChange={(v) => update('payment', v)} options={[{ value: 'Comptant', label: 'Paiement comptant', description: 'Règlement en une fois', icon: Banknote }, { value: 'Facilité de paiement', label: 'Facilité de paiement', description: 'Paiement échelonné', icon: WalletCards }]}/></FormField>
            {form.payment === 'Facilité de paiement' && <div className="form-grid cols-2">
              <FormField label="Durée souhaitée" required><Select value={form.duration} onChange={(e) => update('duration', e.target.value)}><option>0–4 mois</option><option>4–6 mois</option><option>6–10 mois</option><option>10–12 mois</option><option>Autre durée</option></Select></FormField>
              <FormField label="Apport initial disponible" required><Input type="number" placeholder="Montant en Ariary" value={form.contribution} onChange={(e) => update('contribution', e.target.value)}/></FormField>
            </div>}
            <FormField label="Informations supplémentaires"><textarea rows="5" placeholder="Parlez-nous de vos délais, contraintes, préférences ou de tout autre élément utile…" value={form.info} onChange={(e) => update('info', e.target.value)}/></FormField>
            <div className="submission-recap"><h3>Résumé de votre recherche</h3><div><span><MapPin/>Zone</span><strong>{zone} ({form.radius} km)</strong></div><div><span><Banknote/>Budget</span><strong>{form.budget}</strong></div><div><span><LandPlot/>Superficie</span><strong>{form.area}</strong></div><div><span><WalletCards/>Paiement</span><strong>{form.payment}</strong></div></div>
            <label className="consent-row"><input type="checkbox" checked={form.consent} onChange={(e) => update('consent', e.target.checked)}/><span><CheckCircle2/></span><p>J’accepte d’être contacté(e) par CA IMMO au sujet de ma recherche et j’ai lu la politique de confidentialité.</p></label>
          </div>}
        </div>
        <FormNav step={step} setStep={next} max={4} submitLabel="Envoyer ma recherche" onSubmit={submit}/>
      </div>
    </div></section>
  </AppLayout>;
}
