import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Banknote, Camera, CheckCircle2, Clock3, FileCheck2, FileText, LandPlot, MapPin, PlayCircle, ShieldCheck, UserRound, WalletCards } from 'lucide-react';
import { AppLayout, ChoiceCards, FormField, FormNav, Input, ProgressSteps, Select, UploadZone } from '../components';
import { submitSell } from '../submit';
import { MapPicker } from '../../admin/crm/kit';
import Hero from '../Hero';

const DOC_TYPES = ['Titre foncier', 'Certificat foncier', 'Plan du terrain', 'Acte de vente', 'Certificat juridique', 'Autre document'];
const MB = 1024 * 1024;

// Champs obligatoires par étape
const REQUIRED = [
  ['firstName', 'lastName', 'phone', 'email', 'birthDate', 'profession', 'idNumber'],
  ['title', 'area', 'price', 'description'],
  ['district', 'commune', 'fokontany', 'addressHint'],
  [],
  [],
];

export default function Sell() {
  const [step, setStep] = useState(0);
  const [sent, setSent] = useState(null);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [files, setFiles] = useState({ id: [], photos: [], video: [], docs: [] });
  const [form, setForm] = useState({
    firstName: '', lastName: '', phone: '', email: '', birthDate: '', profession: '', country: 'Madagascar', bank: 'Oui',
    idType: 'CIN', idNumber: '',
    title: '', area: '', price: '', perSqm: '', description: '', relief: 'Plat', access: 'Route goudronnée', water: 'Oui', electricity: 'Oui',
    region: 'Analamanga', district: '', commune: '', fokontany: '', addressHint: '', lat: undefined, lng: undefined,
    docTypes: [], payment: 'Les deux', duration: '10–12 mois', deposit: '25–35 %', customDeposit: '',
    confirm1: true, confirm2: true, confirm3: true,
  });
  const update = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const setFileList = (k, max, maxMb) => (list) => {
    const ok = list.filter((f) => f.size <= maxMb * MB);
    if (ok.length < list.length) setError(`Certains fichiers dépassent ${maxMb} Mo et ont été ignorés.`);
    setFiles((x) => ({ ...x, [k]: ok.slice(0, max) }));
  };
  const autoPerSqm = form.area && form.price ? Math.round(+form.price / +form.area) : '';

  const go = (n) => {
    if (n > step) {
      if (REQUIRED[step].some((k) => !String(form[k]).trim())) return setError('Veuillez compléter les champs obligatoires avant de continuer.');
      if (step === 0 && !/^\S+@\S+\.\S+$/.test(form.email)) return setError('Adresse email invalide.');
      if (step === 0 && !files.id.length) return setError('Ajoutez votre justificatif d’identité.');
      if (step === 2 && form.lat === undefined) return setError('Placez le terrain sur la carte.');
      if (step === 3 && files.photos.length < 3) return setError('Ajoutez au moins 3 photos (vue générale, accès, limites).');
      if (step === 3 && !files.docs.length) return setError('Ajoutez au moins un document foncier.');
    }
    setError(''); setStep(n);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const submit = async () => {
    if (!form.confirm1 || !form.confirm2 || !form.confirm3) return setError('Merci de cocher les trois confirmations.');
    if (form.deposit === 'Personnalisé' && !(+form.customDeposit > 0 && +form.customDeposit <= 100)) return setError('Pourcentage d’acompte entre 1 et 100 %.');
    setSending(true);
    try {
      setSent(await submitSell(form, files));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch {
      setError('L’envoi a échoué (fichiers trop volumineux pour ce navigateur ?). Réessayez avec moins de fichiers.');
    } finally {
      setSending(false);
    }
  };

  if (sent) return <AppLayout><section className="confirmation-page seller-confirmation"><div className="confirmation-card">
    <span className="success-mark"><CheckCircle2 size={43}/></span><span className="eyebrow">Dépôt reçu</span>
    <h1>Votre terrain a bien été proposé.</h1>
    <p>Merci pour votre confiance. Votre annonce ne sera pas publiée immédiatement : notre équipe doit d’abord contrôler vos informations et vos documents.</p>
    <div className="status-timeline"><div className="active"><span><CheckCircle2/></span><p><strong>En attente de vérification</strong><small>{new Date().toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short' })}</small></p></div><i/><div><span><FileText/></span><p><strong>Documents contrôlés</strong><small>Prochaine étape</small></p></div><i/><div><span><ShieldCheck/></span><p><strong>Terrain vérifié</strong><small>Après contrôle</small></p></div></div>
    <div className="request-recap"><div><small>Référence du dépôt</small><strong>{sent.ref}</strong></div><div><small>Statut actuel</small><span className="pending-dot"><i/>En attente de vérification</span></div><div><small>Délai moyen</small><strong>2–5 jours ouvrés</strong></div></div>
    <div className="info-callout"><ShieldCheck size={20}/><p><strong>Important</strong> Un conseiller CA IMMO peut vous contacter si un document est incomplet.</p></div>
    <div className="confirmation-actions"><Link to="/" className="btn btn-primary">Retour à l’accueil</Link><Link to="/acheter" className="btn btn-secondary">Voir les terrains</Link></div>
  </div></section></AppLayout>;

  return <AppLayout>
    <Hero crumb="Vendre" pill="Vendre avec CA IMMO" title="Proposez votre terrain en" highlight="toute confiance" text="Déposez votre dossier en ligne. Notre équipe le vérifie avant toute publication et vous accompagne jusqu’à la vente." image="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=80"/>
    <section className="seller-benefits"><div className="container"><div><ShieldCheck/><span><strong>Vérification sérieuse</strong><small>Un dossier fiable pour les acheteurs</small></span></div><div><Camera/><span><strong>Mise en valeur</strong><small>Une annonce professionnelle</small></span></div><div><UserRound/><span><strong>Conseiller dédié</strong><small>Un suivi à chaque étape</small></span></div></div></section>
    <section className="form-page"><div className="container form-page-layout seller-layout">
      <aside className="form-aside"><div className="form-aside-card dark"><span className="aside-icon"><LandPlot size={25}/></span><h2>Avant de commencer</h2><p>Préparez les éléments suivants pour compléter votre dépôt sans interruption.</p><div className="check-list"><span><i>1</i>Pièce d’identité valide</span><span><i>2</i>Photos récentes du terrain</span><span><i>3</i>Document foncier ou justificatif</span><span><i>4</i>Localisation précise</span></div></div><div className="seller-note"><FileCheck2/><p><strong>Aucune publication automatique</strong>Chaque terrain passe par notre processus de contrôle.</p></div></aside>
      <div className="multi-form-card wide">
        <ProgressSteps steps={['Propriétaire', 'Terrain', 'Localisation', 'Médias & documents', 'Conditions']} current={step}/>
        <div className="form-content">
          {error && <div className="form-error">{error}</div>}
          {step === 0 && <div className="form-step"><div className="form-step-heading"><span>Étape 1 sur 5</span><h2>Informations du propriétaire</h2><p>Renseignez l’identité de la personne légalement habilitée à vendre le terrain.</p></div>
            <div className="form-grid cols-2">
              <FormField label="Prénom" required><Input placeholder="Votre prénom" value={form.firstName} onChange={(e) => update('firstName', e.target.value)}/></FormField>
              <FormField label="Nom" required><Input placeholder="Votre nom" value={form.lastName} onChange={(e) => update('lastName', e.target.value)}/></FormField>
              <FormField label="Téléphone" required><Input type="tel" placeholder="+261 34 00 000 00" value={form.phone} onChange={(e) => update('phone', e.target.value)}/></FormField>
              <FormField label="Adresse email" required><Input type="email" placeholder="vous@exemple.com" value={form.email} onChange={(e) => update('email', e.target.value)}/></FormField>
              <FormField label="Date de naissance" required><Input type="date" value={form.birthDate} onChange={(e) => update('birthDate', e.target.value)}/></FormField>
              <FormField label="Profession" required><Input placeholder="Votre profession" value={form.profession} onChange={(e) => update('profession', e.target.value)}/></FormField>
              <FormField label="Pays de résidence" required><Select value={form.country} onChange={(e) => update('country', e.target.value)}><option>Madagascar</option><option>France</option><option>La Réunion</option><option>Autre</option></Select></FormField>
              <FormField label="Titulaire d’un compte bancaire ?" required><Select value={form.bank} onChange={(e) => update('bank', e.target.value)}><option>Oui</option><option>Non</option></Select></FormField>
            </div>
            <div className="form-divider"><span>Justificatif d’identité</span></div>
            <div className="form-grid cols-2">
              <FormField label="Type de pièce" required><Select value={form.idType} onChange={(e) => update('idType', e.target.value)}><option>CIN</option><option>Passeport</option><option>Carte de résident</option><option>Autre</option></Select></FormField>
              <FormField label="Numéro de pièce" required><Input placeholder="Numéro du document" value={form.idNumber} onChange={(e) => update('idNumber', e.target.value)}/></FormField>
            </div>
            <UploadZone title="Ajouter le justificatif d’identité" text="CIN recto/verso ou passeport • PDF, JPG ou PNG • 10 Mo max." accept="image/*,.pdf" multiple onFiles={setFileList('id', 2, 10)} files={files.id}/>
            <div className="privacy-note"><ShieldCheck/><span>Les justificatifs sont stockés de manière sécurisée et ne sont jamais publiés.</span></div>
          </div>}
          {step === 1 && <div className="form-step"><div className="form-step-heading"><span>Étape 2 sur 5</span><h2>Informations du terrain</h2><p>Donnez aux acheteurs toutes les informations essentielles.</p></div>
            <div className="form-grid cols-2">
              <FormField label="Titre ou référence interne" required><Input placeholder="Ex. Terrain résidentiel Ivato" value={form.title} onChange={(e) => update('title', e.target.value)}/></FormField>
              <FormField label="Superficie totale" required><div className="input-suffix"><input type="number" placeholder="Ex. 650" value={form.area} onChange={(e) => update('area', e.target.value)}/><span>m²</span></div></FormField>
              <FormField label="Prix total souhaité" required><div className="input-suffix"><input type="number" placeholder="Ex. 120 000 000" value={form.price} onChange={(e) => update('price', e.target.value)}/><span>Ar</span></div></FormField>
              <FormField label="Prix au m²" hint={autoPerSqm ? `Calculé : ${autoPerSqm.toLocaleString('fr-FR')} Ar/m²` : 'Calculé automatiquement'}><div className="input-suffix"><input type="number" placeholder={autoPerSqm ? String(autoPerSqm) : 'Calculé ou personnalisé'} value={form.perSqm} onChange={(e) => update('perSqm', e.target.value)}/><span>Ar/m²</span></div></FormField>
            </div>
            <FormField label="Description du terrain" required hint="Décrivez l’environnement, les atouts, les limites et l’usage idéal."><textarea rows="5" placeholder="Ex. Parcelle calme, bornée, à proximité de…" value={form.description} onChange={(e) => update('description', e.target.value)}/></FormField>
            <FormField label="Type de relief" required><ChoiceCards columns={3} value={form.relief} onChange={(v) => update('relief', v)} options={[{ value: 'Plat', label: 'Terrain plat', description: 'Faible dénivelé' }, { value: 'Pente douce', label: 'Pente douce', description: 'Dénivelé modéré' }, { value: 'Pente forte', label: 'Pente forte', description: 'Dénivelé important' }]}/></FormField>
            <div className="form-grid cols-3">
              <FormField label="Accessibilité" required><Select value={form.access} onChange={(e) => update('access', e.target.value)}><option>Route goudronnée</option><option>Route pavée</option><option>Piste carrossable</option><option>Accès piéton</option></Select></FormField>
              <FormField label="Eau disponible ?" required><Select value={form.water} onChange={(e) => update('water', e.target.value)}><option>Oui</option><option>Non</option><option>À proximité</option></Select></FormField>
              <FormField label="Électricité disponible ?" required><Select value={form.electricity} onChange={(e) => update('electricity', e.target.value)}><option>Oui</option><option>Non</option><option>À proximité</option></Select></FormField>
            </div>
          </div>}
          {step === 2 && <div className="form-step"><div className="form-step-heading"><span>Étape 3 sur 5</span><h2>Localisez précisément le terrain</h2><p>Ces informations permettront à notre équipe de le retrouver et d’organiser la vérification.</p></div>
            <div className="form-grid cols-2">
              <FormField label="Région" required><Select value={form.region} onChange={(e) => update('region', e.target.value)}><option>Analamanga</option><option>Vakinankaratra</option><option>Itasy</option><option>Autre</option></Select></FormField>
              <FormField label="District" required><Input placeholder="Ex. Ambohidratrimo" value={form.district} onChange={(e) => update('district', e.target.value)}/></FormField>
              <FormField label="Commune" required><Input placeholder="Ex. Ivato" value={form.commune} onChange={(e) => update('commune', e.target.value)}/></FormField>
              <FormField label="Fokontany" required><Input placeholder="Nom du fokontany" value={form.fokontany} onChange={(e) => update('fokontany', e.target.value)}/></FormField>
            </div>
            <FormField label="Indication ou adresse" required><textarea rows="3" placeholder="Décrivez l’accès depuis un point de repère connu…" value={form.addressHint} onChange={(e) => update('addressHint', e.target.value)}/></FormField>
            <FormField label="Position exacte sur la carte" required hint="Cliquez sur la carte pour placer le marqueur, ou utilisez « Ma position » sur place."><span/></FormField>
            <MapPicker lat={form.lat} lng={form.lng} onChange={(lat, lng) => setForm((f) => ({ ...f, lat, lng }))} height="h-80"/>
            {form.lat !== undefined && <div className="coordinate-box"><MapPin/><span><strong>Emplacement enregistré</strong><small>Latitude {form.lat} • Longitude {form.lng}</small></span><CheckCircle2/></div>}
          </div>}
          {step === 3 && <div className="form-step"><div className="form-step-heading"><span>Étape 4 sur 5</span><h2>Photos et documents</h2><p>Des visuels clairs et des justificatifs complets accélèrent la vérification.</p></div>
            <div className="upload-section"><h3><Camera/>Photos du terrain <em>*</em></h3><p>Ajoutez au moins 3 photos : vue générale, accès et limites du terrain.</p><UploadZone title="Ajouter les photos" text="JPG, PNG ou WEBP • 15 Mo max. par photo • jusqu’à 12 photos" accept="image/jpeg,image/png,image/webp" multiple onFiles={setFileList('photos', 12, 15)} files={files.photos}/></div>
            <div className="upload-section"><h3><PlayCircle/>Vidéo du terrain <span>Facultatif</span></h3><p>Une courte vidéo aide les acheteurs à mieux visualiser le terrain.</p><UploadZone title="Ajouter une vidéo" text="MP4 ou MOV • 100 Mo max." accept="video/mp4,video/quicktime" onFiles={setFileList('video', 1, 100)} files={files.video}/></div>
            <div className="upload-section"><h3><FileText/>Documents fonciers <em>*</em></h3><p>Cochez les documents dont vous disposez puis téléversez-les. Ils resteront confidentiels.</p>
              <div className="document-type-grid">{DOC_TYPES.map((d) => <label key={d}><input type="checkbox" checked={form.docTypes.includes(d)} onChange={() => update('docTypes', form.docTypes.includes(d) ? form.docTypes.filter((x) => x !== d) : [...form.docTypes, d])}/><span><FileText/>{d}<i>+</i></span></label>)}</div>
              <UploadZone title="Téléverser les documents" text="PDF, JPG ou PNG • 20 Mo max. par fichier" accept=".pdf,image/*" multiple onFiles={setFileList('docs', 10, 20)} files={files.docs}/>
            </div>
            <div className="privacy-note"><ShieldCheck/><span>Seule l’équipe de vérification accède aux documents. Ils ne seront jamais visibles publiquement.</span></div>
          </div>}
          {step === 4 && <div className="form-step"><div className="form-step-heading"><span>Étape 5 sur 5</span><h2>Conditions de vente</h2><p>Précisez les modalités que vous êtes prêt(e) à accepter.</p></div>
            <FormField label="Mode de paiement accepté" required><ChoiceCards columns={3} value={form.payment} onChange={(v) => update('payment', v)} options={[{ value: 'Comptant', label: 'Comptant', description: 'Paiement en une fois', icon: Banknote }, { value: 'Facilité', label: 'Facilité', description: 'Paiement échelonné', icon: WalletCards }, { value: 'Les deux', label: 'Les deux', description: 'Comptant ou facilité', icon: CheckCircle2 }]}/></FormField>
            {form.payment !== 'Comptant' && <FormField label="Durée maximale acceptée" required><Select value={form.duration} onChange={(e) => update('duration', e.target.value)}><option>0–4 mois</option><option>4–6 mois</option><option>6–10 mois</option><option>10–12 mois</option><option>Autre durée</option></Select></FormField>}
            <FormField label="Acompte minimum demandé" required><ChoiceCards columns={4} value={form.deposit} onChange={(v) => update('deposit', v)} options={['15–25 %', '25–35 %', '35–45 %', '45–55 %', '55–65 %', '65–80 %', '80–100 %', 'Personnalisé']}/></FormField>
            {form.deposit === 'Personnalisé' && <FormField label="Pourcentage personnalisé"><div className="input-suffix"><input type="number" min="1" max="100" value={form.customDeposit} onChange={(e) => update('customDeposit', e.target.value)}/><span>%</span></div></FormField>}
            <div className="submission-recap seller-recap"><h3>Avant d’envoyer votre dossier</h3><p>En soumettant ce terrain, vous confirmez que :</p>
              <label className="consent-row"><input type="checkbox" checked={form.confirm1} onChange={(e) => update('confirm1', e.target.checked)}/><span><CheckCircle2/></span><p>Les informations fournies sont exactes et vous êtes autorisé(e) à proposer ce terrain.</p></label>
              <label className="consent-row"><input type="checkbox" checked={form.confirm2} onChange={(e) => update('confirm2', e.target.checked)}/><span><CheckCircle2/></span><p>Vous acceptez qu’un conseiller vous contacte pour organiser la vérification.</p></label>
              <label className="consent-row"><input type="checkbox" checked={form.confirm3} onChange={(e) => update('confirm3', e.target.checked)}/><span><CheckCircle2/></span><p>Vous comprenez que le terrain ne sera publié qu’après validation du dossier.</p></label>
            </div>
            <div className="status-preview"><span><Clock3/></span><div><small>Statut après soumission</small><strong>En attente de vérification</strong></div></div>
          </div>}
        </div>
        <FormNav step={step} setStep={go} max={5} submitLabel={sending ? 'Envoi en cours…' : 'Soumettre mon terrain'} onSubmit={() => !sending && submit()}/>
      </div>
    </div></section>
  </AppLayout>;
}
