import React, { useEffect, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  ArrowRight, Bell, Building2, CalendarDays, Check, CheckCircle2, ChevronDown,
  ChevronLeft, ChevronRight, CircleDollarSign, Clock3, Eye, FileCheck2, Heart,
  Home, Image as ImageIcon, LandPlot, LocateFixed, MapPin, Menu, MessageSquare,
  Phone, Search, ShieldCheck, SlidersHorizontal, Sparkles, UploadCloud, UserRound,
  UsersRound, X, Zap, Droplets, Route, Maximize2
} from 'lucide-react';
import { formatAr, notifications } from './data';
import './espace.css';

export function Logo({ light = false }) {
  return (
    <Link to="/" className={`logo ${light ? 'logo-light' : ''}`} aria-label="CA IMMO — Accueil">
      <span className="logo-mark"><LandPlot size={24} strokeWidth={2.3} /></span>
      <span className="logo-text">Mada<span>Tany</span><small>L’immobilier en confiance</small></span>
    </Link>
  );
}

export function Header() {
  const [mobile, setMobile] = useState(false);
  const [notifsOpen, setNotifsOpen] = useState(false);
  return (
    <header className="site-header">
      <div className="header-inner container">
        <Logo />
        <nav className={`main-nav ${mobile ? 'open' : ''}`}>
          <NavLink to="/acheter" onClick={() => setMobile(false)}>Acheter</NavLink>
          <NavLink to="/recherche" onClick={() => setMobile(false)}>Rechercher un terrain</NavLink>
          <NavLink to="/vendre" onClick={() => setMobile(false)}>Vendre</NavLink>
          <NavLink to="/a-propos" onClick={() => setMobile(false)}>Notre expertise</NavLink>
          <div className="mobile-nav-actions">
            <Link to="/compte" className="btn btn-ghost">Mon compte</Link>
            <Link to="/vendre" className="btn btn-primary">Déposer un terrain</Link>
          </div>
        </nav>
        <div className="header-actions">
          <button className="icon-button notification-btn" onClick={() => setNotifsOpen(!notifsOpen)} aria-label="Notifications">
            <Bell size={19} /> <span className="notification-dot">2</span>
          </button>
          <Link to="/compte" className="account-link"><span className="avatar-sm">NR</span><span>Mon compte</span></Link>
          <Link to="/vendre" className="btn btn-primary btn-sm">Déposer un terrain</Link>
          <button className="icon-button menu-button" onClick={() => setMobile(!mobile)} aria-label="Menu">{mobile ? <X /> : <Menu />}</button>
        </div>
        {notifsOpen && (
          <>
            <button className="overlay-click" onClick={() => setNotifsOpen(false)} aria-label="Fermer" />
            <div className="notifications-popover">
              <div className="popover-title"><div><strong>Notifications</strong><span>2 nouvelles</span></div><button onClick={() => setNotifsOpen(false)}><X size={18} /></button></div>
              {notifications.map(n => (
                <div className={`notification-item ${n.unread ? 'unread' : ''}`} key={n.id}>
                  <span className={`notif-icon ${n.type}`}>
                    {n.type === 'match' ? <Sparkles size={17}/> : n.type === 'visit' ? <CalendarDays size={17}/> : <CheckCircle2 size={17}/>} 
                  </span>
                  <div><strong>{n.title}</strong><p>{n.text}</p><small>{n.time}</small></div>
                </div>
              ))}
              <Link to="/compte?tab=notifications" className="popover-footer" onClick={() => setNotifsOpen(false)}>Voir toutes les notifications <ArrowRight size={15}/></Link>
            </div>
          </>
        )}
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div className="footer-brand">
          <Logo light />
          <p>La plateforme foncière de confiance qui sécurise et simplifie votre projet immobilier à Madagascar.</p>
          <div className="footer-contact"><Phone size={16}/> +261 34 12 345 67</div>
          <div className="footer-contact"><MessageSquare size={16}/> contact@madatany.mg</div>
        </div>
        <div><h4>Explorer</h4><Link to="/acheter">Terrains disponibles</Link><Link to="/recherche">Confier ma recherche</Link><Link to="/vendre">Vendre mon terrain</Link><Link to="/a-propos">Notre expertise</Link></div>
        <div><h4>Votre espace</h4><Link to="/compte">Mon compte</Link><Link to="/compte">Mes demandes</Link><Link to="/compte">Mes visites</Link><Link to="/admin">Espace entreprise</Link></div>
        <div><h4>Informations</h4><a href="#confidentialite">Confidentialité</a><a href="#conditions">Conditions générales</a><a href="#mentions">Mentions légales</a><a href="#aide">Centre d’aide</a></div>
      </div>
      <div className="container footer-bottom"><span>© 2026 CA IMMO. Tous droits réservés.</span><span>Fait avec soin à Antananarivo, Madagascar 🇲🇬</span></div>
    </footer>
  );
}

export function AppLayout({ children }) {
  return <div className="espace">{children}</div>;
}

export function VerifiedBadge({ compact = false }) {
  return <span className={`verified-badge ${compact ? 'compact' : ''}`}><ShieldCheck size={compact ? 13 : 15} /> {compact ? 'Vérifié' : 'Terrain vérifié'}</span>;
}

export function StatusBadge({ status }) {
  const key = status.toLowerCase().replaceAll(' ', '-').replaceAll('é', 'e').replaceAll('è','e').replaceAll('à','a');
  return <span className={`status-badge status-${key}`}><span />{status}</span>;
}

export function PropertyCard({ property, horizontal = false }) {
  const navigate = useNavigate();
  const [fav, setFav] = useState(false);
  return (
    <article className={`property-card ${horizontal ? 'horizontal' : ''}`} onClick={() => navigate(`/terrain/${property.id}`)}>
      <div className="property-image-wrap">
        <img src={property.image} alt={property.title} className="property-image" />
        <div className="property-badges">
          {property.verified && <VerifiedBadge compact />}
          {property.status !== 'Disponible' && <span className="tag-badge">{property.status}</span>}
        </div>
        <button className={`favorite-button ${fav ? 'active' : ''}`} onClick={(e) => {e.stopPropagation(); setFav(!fav)}} aria-label="Ajouter aux favoris"><Heart size={18} fill={fav ? 'currentColor' : 'none'} /></button>
      </div>
      <div className="property-content">
        <div className="location-line"><MapPin size={14}/>{property.location}</div>
        <h3>{property.title}</h3>
        <div className="property-specs">
          <span><Maximize2 size={15}/><b>{property.area.toLocaleString('fr-FR')} m²</b></span>
          <span><LandPlot size={15}/>{property.relief}</span>
        </div>
        <div className="property-payment"><CircleDollarSign size={15}/>{property.payment}</div>
        <div className="property-bottom">
          <div className="property-price"><strong>{formatAr(property.price)}</strong><span>{formatAr(property.perSqm)} / m²</span></div>
          <button className="btn btn-soft btn-card">Voir le terrain <ArrowRight size={16}/></button>
        </div>
      </div>
    </article>
  );
}

export function PageHero({ eyebrow, title, text, children, compact = false }) {
  return <section className={`page-hero ${compact ? 'compact' : ''}`}><div className="container"><span className="eyebrow">{eyebrow}</span><h1>{title}</h1>{text && <p>{text}</p>}{children}</div></section>;
}

export function EmptyState({ icon: Icon = Search, title, text, action, onAction }) {
  return <div className="empty-state"><span><Icon size={28}/></span><h3>{title}</h3><p>{text}</p>{action && <button className="btn btn-secondary" onClick={onAction}>{action}</button>}</div>
}

export function FormField({ label, required, hint, children, className = '' }) {
  return <label className={`form-field ${className}`}><span className="field-label">{label}{required && <em>*</em>}</span>{children}{hint && <small className="field-hint">{hint}</small>}</label>;
}

export function Input({ icon: Icon, ...props }) {
  return <div className={`input-wrap ${Icon ? 'has-icon' : ''}`}>{Icon && <Icon size={17}/>}<input {...props} /></div>;
}

export function Select({ children, ...props }) {
  return <div className="select-wrap"><select {...props}>{children}</select><ChevronDown size={16}/></div>
}

export function ChoiceCards({ options, value, onChange, columns = 2 }) {
  return <div className={`choice-cards cols-${columns}`}>{options.map(o => {
    const option = typeof o === 'string' ? { value: o, label: o } : o;
    const Icon = option.icon;
    return <button type="button" key={option.value} className={`choice-card ${value === option.value ? 'selected' : ''}`} onClick={() => onChange(option.value)}>
      {Icon && <Icon size={20}/>}<span><strong>{option.label}</strong>{option.description && <small>{option.description}</small>}</span>{value === option.value && <CheckCircle2 size={18} className="choice-check"/>}
    </button>
  })}</div>
}

export function ProgressSteps({ steps, current }) {
  return <div className="progress-steps">{steps.map((step, i) => <React.Fragment key={step}>
    <div className={`progress-step ${i < current ? 'done' : ''} ${i === current ? 'active' : ''}`}><span>{i < current ? <Check size={15}/> : i + 1}</span><small>{step}</small></div>
    {i < steps.length - 1 && <div className={`progress-line ${i < current ? 'done' : ''}`}/>} 
  </React.Fragment>)}</div>
}

export function FormNav({ step, setStep, max, submitLabel = 'Envoyer ma demande', onSubmit, canNext = true }) {
  return <div className="form-nav">
    {step > 0 ? <button type="button" className="btn btn-ghost" onClick={() => setStep(step - 1)}><ChevronLeft size={17}/> Retour</button> : <span/>}
    {step < max - 1 ? <button type="button" className="btn btn-primary" disabled={!canNext} onClick={() => setStep(step + 1)}>Continuer <ChevronRight size={17}/></button> : <button type="button" className="btn btn-primary" onClick={onSubmit}>{submitLabel} <ArrowRight size={17}/></button>}
  </div>
}

export function UploadZone({ title, text, accept = 'image/*', multiple = false, onFiles, files = [] }) {
  const inputId = `upload-${title.replace(/\s/g,'-')}`;
  return <div>
    <label className="upload-zone" htmlFor={inputId}><UploadCloud size={30}/><strong>{title}</strong><p>{text}</p><span className="btn btn-soft btn-sm">Choisir des fichiers</span><input id={inputId} type="file" accept={accept} multiple={multiple} onChange={(e) => onFiles?.([...e.target.files])}/></label>
    {files.length > 0 && <div className="uploaded-files">{files.map((f,i) => <span key={i}><FileCheck2 size={15}/>{f.name}<CheckCircle2 size={15}/></span>)}</div>}
  </div>
}

export function MapVisual({ interactive = false, marker, onMarker }) {
  const [placed, setPlaced] = useState(Boolean(marker));
  const handle = (e) => { if (!interactive) return; setPlaced(true); onMarker?.('Marqueur placé'); };
  return <div className={`map-visual ${interactive ? 'interactive' : ''}`} onClick={handle}>
    <svg viewBox="0 0 800 330" preserveAspectRatio="none" aria-hidden="true">
      <rect width="800" height="330" fill="#eef1f7"/>
      <path d="M0 55 C180 95 210 20 390 58 S600 130 800 55" fill="none" stroke="#cfd6e4" strokeWidth="52"/>
      <path d="M-20 270 C130 190 245 300 400 220 S650 155 830 235" fill="none" stroke="#dde2ec" strokeWidth="74"/>
      <path d="M0 63 C180 103 210 28 390 66 S600 138 800 63" fill="none" stroke="#fff" strokeWidth="8"/>
      <path d="M-20 265 C130 185 245 295 400 215 S650 150 830 230" fill="none" stroke="#fff" strokeWidth="10"/>
      <path d="M540 -10 C525 80 590 115 565 200 S500 280 530 350" fill="none" stroke="#bfcce3" strokeWidth="24"/>
      <g fill="#d6dcea"><path d="M85 150h125v63H85z"/><path d="M620 85h115v55H620z"/><path d="M290 90h85v47H290z"/></g>
      <g fill="#8e9bb8" fontSize="13"><text x="110" y="185">IVATO</text><text x="625" y="117">TALATAMATY</text><text x="275" y="260">RN 4</text></g>
    </svg>
    {(placed || !interactive) && <div className="map-pin"><MapPin size={23} fill="currentColor"/></div>}
    <div className="map-controls"><button type="button">+</button><button type="button">−</button></div>
    {interactive && <div className="map-hint"><LocateFixed size={15}/>{placed ? 'Emplacement sélectionné' : 'Cliquez pour placer le terrain'}</div>}
  </div>
}

export function Modal({ open, onClose, title, subtitle, children, size = '' }) {
  useEffect(() => {
    const close = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', close); return () => window.removeEventListener('keydown', close);
  }, [onClose]);
  if (!open) return null;
  return <div className="modal-overlay" onMouseDown={onClose}><div className={`modal ${size}`} onMouseDown={e => e.stopPropagation()}>
    <div className="modal-header"><div><h2>{title}</h2>{subtitle && <p>{subtitle}</p>}</div><button className="icon-button" onClick={onClose}><X size={20}/></button></div>
    <div className="modal-body">{children}</div>
  </div></div>
}

export function Toast({ toast, onClose }) {
  useEffect(() => { if (toast) { const t = setTimeout(onClose, 4000); return () => clearTimeout(t); }}, [toast, onClose]);
  if (!toast) return null;
  return <div className={`toast ${toast.type || 'success'}`}><span>{toast.type === 'error' ? <X size={18}/> : <CheckCircle2 size={18}/>}</span><div><strong>{toast.title}</strong>{toast.text && <p>{toast.text}</p>}</div><button onClick={onClose}><X size={16}/></button></div>
}

export function SectionHeading({ eyebrow, title, text, action }) {
  return <div className="section-heading"><div><span className="eyebrow">{eyebrow}</span><h2>{title}</h2>{text && <p>{text}</p>}</div>{action}</div>
}

export function MiniFeature({ icon: Icon, title, text }) {
  return <div className="mini-feature"><span><Icon size={20}/></span><div><strong>{title}</strong><p>{text}</p></div></div>
}

export const icons = { Search, SlidersHorizontal, ShieldCheck, CalendarDays, Building2, UsersRound, Home, Zap, Droplets, Route, Eye, ImageIcon, Clock3 };
