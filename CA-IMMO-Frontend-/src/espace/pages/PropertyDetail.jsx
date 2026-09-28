import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

import {
  ArrowLeft,
  ArrowRight,
  Banknote,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Droplets,
  FileCheck2,
  LandPlot,
  MapPin,
  Maximize2,
  MessageCircle,
  Phone,
  Route,
  ShieldCheck,
  WalletCards,
  Zap,
} from 'lucide-react';

import {
  AppLayout,
  ChoiceCards,
  FormField,
  Input,
  Modal,
  PropertyCard,
  Select,
  VerifiedBadge,
} from '../components';

import { formatAr } from '../data';
import api from '../../services/api';

import { MapPicker } from '../../admin/crm/kit';
import { PHONE_1, PHONE_1_TEL } from '../../lib/contact';


/* =========================================================
   FORMULAIRE D'INTERET
========================================================= */

const emptyInterest = {
  firstName: '',
  lastName: '',
  phone: '',
  email: '',
  birthDate: '',
  profession: '',
  country: 'Madagascar',
  bank: 'Oui',
  payment: 'Comptant',
  duration: '6–10 mois',
  deposit: '',
  info: '',
};


function InterestForm({ property, onDone }) {

  const [step, setStep] = useState(0);
  const [f, setF] = useState(emptyInterest);
  const [error, setError] = useState('');
  const [sending, setSending] = useState(false);

  const set = (key, value) => {
    setF((current) => ({
      ...current,
      [key]: value,
    }));
  };


  /* =========================
     ETAPE 1
  ========================= */

  const next = () => {

    if (
      !f.firstName ||
      !f.lastName ||
      !f.phone ||
      !f.email ||
      !f.birthDate ||
      !f.profession
    ) {
      setError('Veuillez compléter les champs obligatoires.');
      return;
    }

    if (!/^\S+@\S+\.\S+$/.test(f.email)) {
      setError('Adresse email invalide.');
      return;
    }

    setError('');
    setStep(1);
  };


  /* =========================
     ENVOI AU BACKEND
  ========================= */

  const send = async () => {

    if (f.payment === 'Facilité' && !f.deposit) {
      setError('Indiquez votre apport initial.');
      return;
    }

    try {

      setSending(true);
      setError('');

      const response = await api.post(
        `/properties/${property.id}/purchase-requests`,
        {
          first_name: f.firstName,
          last_name: f.lastName,
          phone: f.phone,
          email: f.email,
          birth_date: f.birthDate,
          profession: f.profession,
          country: f.country,

          has_bank_account: f.bank === 'Oui',

          payment_method: f.payment,
          duration: f.payment === 'Facilité'
            ? f.duration
            : null,

          initial_payment:
            f.payment === 'Facilité'
              ? Number(f.deposit)
              : null,

          message: f.info || null,
        }
      );

      /*
       * Le backend retourne normalement :
       * {
       *   message: "...",
       *   request: {...}
       * }
       */

      const request =
        response.data?.request ||
        response.data?.data ||
        response.data;

      const reference =
        request?.request_number ||
        response.data?.request_number ||
        'Demande enregistrée';

      onDone(reference);

    } catch (err) {

      console.error(
        'Erreur demande d’achat :',
        err
      );

      setError(
        err.response?.data?.message ||
        'Impossible d’envoyer votre demande. Veuillez réessayer.'
      );

    } finally {

      setSending(false);

    }
  };


  return (
    <div className="qualification-form">

      {/* PROGRESSION */}

      <div className="mini-progress">

        <span className="active">
          1
        </span>

        <i className={step > 0 ? 'active' : ''} />

        <span className={step > 0 ? 'active' : ''}>
          2
        </span>

        <small>
          {step === 0
            ? 'Vos informations'
            : 'Votre projet d’achat'
          }
        </small>

      </div>


      {error && (
        <div className="form-error">
          {error}
        </div>
      )}


      {/* =================================================
          ETAPE 1
      ================================================= */}

      {step === 0 ? (

        <>
          <div className="form-grid cols-2">

            <FormField label="Prénom" required>
              <Input
                placeholder="Votre prénom"
                value={f.firstName}
                onChange={(e) =>
                  set('firstName', e.target.value)
                }
              />
            </FormField>


            <FormField label="Nom" required>
              <Input
                placeholder="Votre nom"
                value={f.lastName}
                onChange={(e) =>
                  set('lastName', e.target.value)
                }
              />
            </FormField>


            <FormField label="Téléphone" required>
              <Input
                type="tel"
                placeholder="+261 34 00 000 00"
                value={f.phone}
                onChange={(e) =>
                  set('phone', e.target.value)
                }
              />
            </FormField>


            <FormField label="Adresse email" required>
              <Input
                type="email"
                placeholder="vous@exemple.com"
                value={f.email}
                onChange={(e) =>
                  set('email', e.target.value)
                }
              />
            </FormField>


            <FormField label="Date de naissance" required>
              <Input
                type="date"
                value={f.birthDate}
                onChange={(e) =>
                  set('birthDate', e.target.value)
                }
              />
            </FormField>


            <FormField label="Profession" required>
              <Input
                placeholder="Ex. Entrepreneur"
                value={f.profession}
                onChange={(e) =>
                  set('profession', e.target.value)
                }
              />
            </FormField>


            <FormField
              label="Pays de résidence"
              required
            >
              <Select
                value={f.country}
                onChange={(e) =>
                  set('country', e.target.value)
                }
              >
                <option>Madagascar</option>
                <option>France</option>
                <option>La Réunion</option>
                <option>Autre</option>
              </Select>
            </FormField>


            <FormField
              label="Titulaire d’un compte bancaire ?"
              required
            >
              <Select
                value={f.bank}
                onChange={(e) =>
                  set('bank', e.target.value)
                }
              >
                <option>Oui</option>
                <option>Non</option>
              </Select>
            </FormField>

          </div>


          <div className="privacy-note">
            <ShieldCheck size={17} />

            <span>
              Vos données sont protégées.
              Nous ne demandons jamais vos
              coordonnées bancaires sensibles.
            </span>
          </div>


          <div className="modal-actions">

            <span />

            <button
              type="button"
              className="btn btn-primary"
              onClick={next}
            >
              Continuer
              <ChevronRight size={17} />
            </button>

          </div>
        </>

      ) : (

        /* =================================================
           ETAPE 2
        ================================================= */

        <>

          <FormField
            label="Mode de paiement souhaité"
            required
          >

            <ChoiceCards
              value={f.payment}
              onChange={(value) =>
                set('payment', value)
              }
              options={[
                {
                  value: 'Comptant',
                  label: 'Paiement comptant',
                  description: 'Règlement en une fois',
                  icon: Banknote,
                },
                {
                  value: 'Facilité',
                  label: 'Facilité de paiement',
                  description: 'Paiement échelonné',
                  icon: WalletCards,
                },
              ]}
            />

          </FormField>


          {f.payment === 'Facilité' && (

            <div className="form-grid cols-2">

              <FormField
                label="Durée souhaitée"
                required
              >

                <Select
                  value={f.duration}
                  onChange={(e) =>
                    set('duration', e.target.value)
                  }
                >
                  <option>0–4 mois</option>
                  <option>4–6 mois</option>
                  <option>6–10 mois</option>
                  <option>10–12 mois</option>
                  <option>Autre durée</option>
                </Select>

              </FormField>


              <FormField
                label="Apport initial disponible"
                required
              >

                <Input
                  type="number"
                  placeholder="Ex. 35 000 000 Ar"
                  value={f.deposit}
                  onChange={(e) =>
                    set('deposit', e.target.value)
                  }
                />

              </FormField>

            </div>

          )}


          <FormField label="Informations supplémentaires">

            <textarea
              rows="4"
              placeholder="Précisez votre projet, vos disponibilités ou toute information utile…"
              value={f.info}
              onChange={(e) =>
                set('info', e.target.value)
              }
            />

          </FormField>


          <div className="summary-strip">

            <LandPlot size={19} />

            <div>

              <strong>
                {property.title}
              </strong>

              <span>
                {formatAr(property.price)}
                {' • '}
                Réf. {property.reference}
              </span>

            </div>

          </div>


          <div className="modal-actions">

            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => setStep(0)}
              disabled={sending}
            >
              <ArrowLeft size={16} />
              Retour
            </button>


            <button
              type="button"
              className="btn btn-primary"
              onClick={send}
              disabled={sending}
            >

              {sending
                ? 'Envoi...'
                : 'Envoyer ma demande'
              }

              {!sending && (
                <ArrowRight size={17} />
              )}

            </button>

          </div>

        </>

      )}

    </div>
  );
}


/* =========================================================
   FORMULAIRE VISITE
========================================================= */

function VisitForm({ property, onDone }) {

  const tomorrow = new Date(
    Date.now() + 86400000
  )
    .toISOString()
    .slice(0, 10);


  const [v, setV] = useState({
    date: tomorrow,
    time: '10:00',
    fullName: '',
    phone: '',
    comment: '',
  });


  const [error, setError] = useState('');
  const [sending, setSending] = useState(false);


  const set = (key, value) => {
    setV((current) => ({
      ...current,
      [key]: value,
    }));
  };


  const send = async () => {

    if (
      !v.date ||
      !v.fullName.trim() ||
      !v.phone.trim()
    ) {
      setError(
        'Veuillez compléter les champs obligatoires.'
      );

      return;
    }


    try {

      setSending(true);
      setError('');


      const response = await api.post(
        `/properties/${property.id}/visit-requests`,
        {
          visit_date: v.date,
          visit_time: v.time,
          full_name: v.fullName,
          phone: v.phone,
          comment: v.comment || null,
        }
      );


      const request =
        response.data?.request ||
        response.data?.data ||
        response.data;


      const reference =
        request?.request_number ||
        response.data?.request_number ||
        'Demande enregistrée';


      onDone(reference);

    } catch (err) {

      console.error(
        'Erreur demande visite :',
        err
      );


      setError(
        err.response?.data?.message ||
        'Impossible d’envoyer la demande de visite.'
      );

    } finally {

      setSending(false);

    }
  };


  return (
    <div className="visit-form">

      <div className="visit-advisor">

        <span>CA</span>

        <div>

          <small>
            Votre conseiller
          </small>

          <strong>
            Équipe CA IMMO
          </strong>

          <p>
            <CheckCircle2 size={13} />
            Disponible pour vous accompagner
          </p>

        </div>

      </div>


      {error && (
        <div className="form-error">
          {error}
        </div>
      )}


      <div className="form-grid cols-2">

        <FormField
          label="Date souhaitée"
          required
        >

          <Input
            type="date"
            min={tomorrow}
            value={v.date}
            onChange={(e) =>
              set('date', e.target.value)
            }
          />

        </FormField>


        <FormField
          label="Heure souhaitée"
          required
        >

          <Select
            value={v.time}
            onChange={(e) =>
              set('time', e.target.value)
            }
          >

            {[
              '09:00',
              '10:00',
              '11:30',
              '14:00',
              '15:30',
            ].map((time) => (

              <option key={time}>
                {time}
              </option>

            ))}

          </Select>

        </FormField>

      </div>


      <FormField
        label="Votre nom et prénom"
        required
      >

        <Input
          placeholder="Nom complet"
          value={v.fullName}
          onChange={(e) =>
            set('fullName', e.target.value)
          }
        />

      </FormField>


      <FormField
        label="Numéro de téléphone"
        required
      >

        <Input
          type="tel"
          placeholder="+261 34 00 000 00"
          value={v.phone}
          onChange={(e) =>
            set('phone', e.target.value)
          }
        />

      </FormField>


      <FormField label="Commentaire (facultatif)">

        <textarea
          rows="3"
          placeholder="Une question ou une précision pour la visite ?"
          value={v.comment}
          onChange={(e) =>
            set('comment', e.target.value)
          }
        />

      </FormField>


      <p className="visit-info">
        <Clock3 size={15} />
        CA IMMO confirmera le créneau par téléphone ou SMS.
      </p>


      <div className="modal-actions">

        <span />

        <button
          type="button"
          className="btn btn-primary"
          onClick={send}
          disabled={sending}
        >

          {sending
            ? 'Envoi...'
            : 'Demander cette visite'
          }

          {!sending && (
            <CalendarDays size={17} />
          )}

        </button>

      </div>

    </div>
  );
}


/* =========================================================
   PAGE DETAIL
========================================================= */

export default function PropertyDetail() {

  const { id } = useParams();
  const navigate = useNavigate();


  const [property, setProperty] = useState(null);
  const [others, setOthers] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');


  const [activeImage, setActiveImage] = useState(0);

  const [interest, setInterest] = useState(false);
  const [visit, setVisit] = useState(false);

  const [success, setSuccess] = useState(null);


  /* =======================================================
     CHARGER LE TERRAIN DEPUIS LARAVEL
  ======================================================= */

  useEffect(() => {

    const fetchProperty = async () => {

      try {

        setLoading(true);
        setError('');


        const response = await api.get(
          `/properties/${id}`
        );


        const data =
          response.data?.data ||
          response.data;


        setProperty(data);


        /* -----------------------------------------------
           Terrains similaires
        ------------------------------------------------ */

        try {

          const relatedResponse =
            await api.get(
              `/properties/${id}/related`
            );


          const relatedData =
            relatedResponse.data?.data ||
            relatedResponse.data;


          setOthers(
            Array.isArray(relatedData)
              ? relatedData
              : []
          );

        } catch (relatedError) {

          console.warn(
            'Impossible de charger les terrains similaires',
            relatedError
          );

          setOthers([]);

        }

      } catch (err) {

        console.error(
          'Erreur chargement terrain :',
          err
        );


        setError(
          err.response?.data?.message ||
          'Terrain introuvable.'
        );


        setProperty(null);

      } finally {

        setLoading(false);

      }

    };


    fetchProperty();

  }, [id]);


  /* =======================================================
     CHARGEMENT
  ======================================================= */

  if (loading) {

    return (
      <AppLayout>

        <section className="confirmation-page">

          <div className="confirmation-card">

            <h1>
              Chargement...
            </h1>

            <p>
              Récupération des informations du terrain.
            </p>

          </div>

        </section>

      </AppLayout>
    );

  }


  /* =======================================================
     ERREUR / TERRAIN INTROUVABLE
  ======================================================= */

  if (!property) {

    return (
      <AppLayout>

        <section className="confirmation-page">

          <div className="confirmation-card">

            <h1>
              Terrain introuvable
            </h1>

            <p>
              {error ||
                'Ce terrain n’est plus disponible.'
              }
            </p>

            <div className="confirmation-actions">

              <Link
                to="/acheter"
                className="btn btn-primary"
              >
                Voir les terrains
              </Link>

            </div>

          </div>

        </section>

      </AppLayout>
    );

  }


  /* =======================================================
     DONNEES DU TERRAIN
  ======================================================= */

  const price = Number(property.price || 0);
  const area = Number(property.area || 0);

  const reference =
    property.reference ||
    `CA-${String(property.id).padStart(4, '0')}`;


  const gallery =
    property.media
      ?.filter((media) => media.type === 'photo')
      ?.map((media) => {

        /*
         * Si Laravel retourne une URL complète,
         * on la garde.
         *
         * Sinon on utilise storage.
         */

        if (
          media.path?.startsWith('http://') ||
          media.path?.startsWith('https://')
        ) {
          return media.path;
        }

        return `http://localhost:8000/storage/${media.path}`;

      }) || [];


  const finalGallery =
    gallery.length > 0
      ? gallery
      : property.image
        ? [property.image]
        : [
            'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1600&q=80'
          ];


  const location =
    property.location ||
    [
      property.fokontany,
      property.commune,
      property.district,
      property.region,
    ]
      .filter(Boolean)
      .join(', ');


  const isAvailable =
    property.available === true ||
    property.available === 1;


  const isVerified =
    property.verified === true ||
    property.verified === 1;


  const waterAvailable =
    property.water === true ||
    property.water === 1 ||
    property.water === 'Oui';


  const electricityAvailable =
    property.electricity === true ||
    property.electricity === 1 ||
    property.electricity === 'Oui';


  const coordinates =
    property.latitude &&
    property.longitude
      ? [
          Number(property.latitude),
          Number(property.longitude),
        ]
      : null;


  const done = (type, ref) => {

    setInterest(false);
    setVisit(false);

    setSuccess({
      type,
      ref,
    });

  };


  return (
    <AppLayout>

      {/* =================================================
          BREADCRUMB
      ================================================= */}

      <div className="bg-navy-900 font-display">

        <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4 flex flex-wrap items-center gap-1 text-xs text-white/70">

          <Link
            to="/"
            className="hover:text-gold-500"
          >
            Accueil
          </Link>

          <ChevronRight size={12} />

          <Link
            to="/acheter"
            className="hover:text-gold-500"
          >
            Acheter
          </Link>

          <ChevronRight size={12} />

          <span className="text-white truncate">
            {property.title}
          </span>


          <button
            type="button"
            onClick={() => navigate(-1)}
            className="ml-auto inline-flex items-center gap-1 rounded-full border border-white/40 px-3 py-1 text-white hover:bg-white hover:text-navy-900 transition"
          >
            <ArrowLeft size={14} />
            Retour
          </button>

        </nav>

      </div>


      <div className="h-6" />


      {/* =================================================
          GALERIE
      ================================================= */}

      <section className="gallery container">

        <button
          type="button"
          className="gallery-main"
          onClick={() => {}}
        >

          <img
            src={finalGallery[activeImage] || finalGallery[0]}
            alt={property.title}
          />

        </button>


        {finalGallery
          .slice(0, 3)
          .map((image, index) => (

            <button
              type="button"
              key={`${image}-${index}`}
              onClick={() =>
                setActiveImage(index)
              }
            >

              <img
                src={image}
                alt={`Vue ${index + 1} du terrain`}
              />

            </button>

          ))}

      </section>


      {/* =================================================
          DETAIL
      ================================================= */}

      <section className="detail-section">

        <div className="container detail-layout">

          <div className="detail-main">

            {/* =============================================
                TITRE
            ============================================= */}

            <div className="detail-heading">

              <div className="detail-badges">

                {isVerified && (
                  <VerifiedBadge />
                )}

                <span className="availability">

                  <i />

                  {property.status ||
                    (isAvailable
                      ? 'Disponible'
                      : 'Indisponible')
                  }

                </span>

              </div>


              <h1>
                {property.title}
              </h1>


              <p>
                <MapPin size={17} />
                {location}
              </p>

            </div>


            {/* =============================================
                CARACTERISTIQUES
            ============================================= */}

            <div className="key-specs">

              <div>

                <span>
                  <Maximize2 />
                </span>

                <small>
                  Superficie
                </small>

                <strong>
                  {area.toLocaleString('fr-FR')} m²
                </strong>

              </div>


              <div>

                <span>
                  <LandPlot />
                </span>

                <small>
                  Type de relief
                </small>

                <strong>
                  {property.relief || 'Non précisé'}
                </strong>

              </div>


              <div>

                <span>
                  <Route />
                </span>

                <small>
                  Accessibilité
                </small>

                <strong>
                  {property.access || 'Non précisée'}
                </strong>

              </div>


              <div>

                <span>
                  <Zap />
                </span>

                <small>
                  Électricité
                </small>

                <strong>
                  {electricityAvailable
                    ? 'Disponible'
                    : 'À vérifier'
                  }
                </strong>

              </div>


              <div>

                <span>
                  <Droplets />
                </span>

                <small>
                  Eau
                </small>

                <strong>
                  {waterAvailable
                    ? 'Disponible'
                    : 'À vérifier'
                  }
                </strong>

              </div>

            </div>


            {/* =============================================
                DESCRIPTION
            ============================================= */}

            <div className="detail-block">

              <h2>
                À propos de ce terrain
              </h2>

              <p>
                {property.description}
              </p>


              {property.features &&
                property.features.length > 0 && (

                  <div className="document-list">

                    {property.features.map(
                      (feature) => (

                        <div key={feature}>

                          <span>
                            <CheckCircle2 size={19} />
                          </span>

                          <div>
                            <strong>
                              {feature}
                            </strong>
                          </div>

                        </div>

                      )
                    )}

                  </div>

                )}

            </div>


            {/* =============================================
                REFERENCE
            ============================================= */}

            <div className="reference-row">

              <span>
                Référence du terrain
              </span>

              <strong>
                {reference}
              </strong>

            </div>


            {/* =============================================
                LOCALISATION
            ============================================= */}

            {coordinates && (

              <div className="detail-block">

                <div className="block-heading">

                  <h2>
                    Localisation
                  </h2>

                  <a
                    className="text-link"
                    target="_blank"
                    rel="noopener noreferrer"
                    href={`https://www.google.com/maps?q=${coordinates[0]},${coordinates[1]}`}
                  >
                    Itinéraire
                  </a>

                </div>


                <MapPicker
                  lat={coordinates[0]}
                  lng={coordinates[1]}
                  readOnly
                  height="h-72"
                />


                <p className="map-address">

                  <MapPin size={16} />

                  <span>

                    <strong>
                      {location}
                    </strong>

                    <small>
                      Emplacement approximatif —
                      la position exacte est communiquée
                      lors de la visite.
                    </small>

                  </span>

                </p>

              </div>

            )}


            {/* =============================================
                DOCUMENTS
            ============================================= */}

            <div className="detail-block">

              <h2>
                Documents disponibles
              </h2>

              <p>
                Documents contrôlés par notre équipe
                et consultables sur rendez-vous.
              </p>


              <div className="document-list">

                {property.documents &&
                property.documents.length > 0 ? (

                  property.documents.map(
                    (document, index) => {

                      const documentName =
                        typeof document === 'string'
                          ? document
                          : document.original_name ||
                            document.type ||
                            `Document ${index + 1}`;

                      return (

                        <div
                          key={
                            document.id ||
                            `${documentName}-${index}`
                          }
                        >

                          <span>
                            <FileCheck2 size={19} />
                          </span>

                          <div>

                            <strong>
                              {documentName}
                            </strong>

                            <small>
                              Document contrôlé
                              par CA IMMO
                            </small>

                          </div>

                          <CheckCircle2 size={18} />

                        </div>

                      );

                    }
                  )

                ) : (

                  <div>

                    <span>
                      <FileCheck2 size={19} />
                    </span>

                    <div>

                      <strong>
                        Documents disponibles sur rendez-vous
                      </strong>

                      <small>
                        Les documents sont consultables
                        auprès de CA IMMO.
                      </small>

                    </div>

                  </div>

                )}

              </div>


              {isVerified && (

                <div className="verified-note">

                  <ShieldCheck size={22} />

                  <div>

                    <strong>
                      Dossier vérifié par CA IMMO
                    </strong>

                    <p>
                      L’identité du propriétaire et
                      la cohérence des documents ont
                      été contrôlées.
                    </p>

                  </div>

                </div>

              )}

            </div>


            {/* =============================================
                CONDITIONS DE PAIEMENT
            ============================================= */}

            <div className="detail-block">

              <h2>
                Conditions de paiement
              </h2>


              <div className="payment-detail-grid">

                <div>

                  <Banknote />

                  <span>

                    <small>
                      Prix total
                    </small>

                    <strong>
                      {formatAr(price)}
                    </strong>

                  </span>

                </div>


                <div>

                  <LandPlot />

                  <span>

                    <small>
                      Prix au m²
                    </small>

                    <strong>
                      {formatAr(
                        area
                          ? price / area
                          : 0
                      )}
                    </strong>

                  </span>

                </div>


                <div>

                  <WalletCards />

                  <span>

                    <small>
                      Acompte demandé
                    </small>

                    <strong>
                      {property.deposit
                        ? `${property.deposit}%`
                        : property.downPayment ||
                          'À définir'
                      }
                    </strong>

                  </span>

                </div>


                <div>

                  <Clock3 />

                  <span>

                    <small>
                      Durée maximale
                    </small>

                    <strong>
                      {property.duration ||
                        property.installments ||
                        'À définir'
                      }
                    </strong>

                  </span>

                </div>

              </div>


              <p className="negotiation-note">
                Les conditions finales sont soumises
                à l’accord du propriétaire et
                formalisées par CA IMMO.
              </p>

            </div>

          </div>


          {/* =================================================
              SIDEBAR
          ================================================= */}

          <aside className="detail-sidebar">

            {/* =============================================
                ACHAT
            ============================================= */}

            <div className="purchase-card">

              <span className="purchase-label">
                Prix du terrain
              </span>

              <strong>
                {formatAr(price)}
              </strong>

              <small>
                soit {formatAr(
                  area
                    ? price / area
                    : 0
                )} / m²
              </small>

              <hr />


              <div className="purchase-terms">

                <span>
                  <CheckCircle2 />
                  {property.status ||
                    (isAvailable
                      ? 'Disponible'
                      : 'Indisponible')
                  }
                </span>


                <span>
                  <WalletCards />
                  {property.payment ||
                    'Conditions à définir'
                  }
                </span>


                {isVerified && (

                  <span>
                    <ShieldCheck />
                    Terrain vérifié
                  </span>

                )}

              </div>


              <button
                type="button"
                className="btn btn-primary btn-full btn-lg"
                disabled={!isAvailable}
                onClick={() =>
                  setInterest(true)
                }
              >
                Je suis intéressé
                <ArrowRight size={18} />
              </button>


              <button
                type="button"
                className="btn btn-secondary btn-full"
                disabled={!isAvailable}
                onClick={() =>
                  setVisit(true)
                }
              >
                <CalendarDays size={18} />
                Demander une visite
              </button>


              <p>
                Réponse d’un conseiller sous
                24 h ouvrées.
              </p>

            </div>


            {/* =============================================
                CONSEILLER
            ============================================= */}

            <div className="advisor-card">

              <div className="advisor-head">

                <span>
                  CA
                </span>

                <div>

                  <small>
                    Votre conseiller
                  </small>

                  <strong>
                    CA IMMO
                  </strong>

                  <p>
                    <i />
                    {PHONE_1}
                  </p>

                </div>

              </div>


              <div className="advisor-actions">

                <a href={PHONE_1_TEL}>

                  <Phone size={17} />

                  Appeler

                </a>


                <a
                  href={`https://wa.me/${PHONE_1_TEL.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >

                  <MessageCircle size={17} />

                  WhatsApp

                </a>

              </div>

            </div>


            {/* =============================================
                SECURITE
            ============================================= */}

            <div className="safety-card">

              <ShieldCheck size={19} />

              <div>

                <strong>
                  Conseil sécurité
                </strong>

                <p>
                  Ne versez aucun acompte sans
                  document officiel de CA IMMO.
                </p>

              </div>

            </div>

          </aside>

        </div>

      </section>


      {/* =================================================
          TERRAINS SIMILAIRES
      ================================================= */}

      {others.length > 0 && (

        <section className="section related-section">

          <div className="container">

            <div className="section-heading">

              <div>

                <span className="eyebrow">
                  À découvrir aussi
                </span>

                <h2>
                  Terrains similaires
                </h2>

              </div>


              <Link
                to="/acheter"
                className="text-link"
              >
                Voir tous les terrains
                <ArrowRight size={17} />
              </Link>

            </div>


            <div className="property-grid">

              {others.map((property) => (

                <PropertyCard
                  property={property}
                  key={property.id}
                />

              ))}

            </div>

          </div>

        </section>

      )}


      {/* =================================================
          MODAL INTERET
      ================================================= */}

      <Modal
        open={interest}
        onClose={() => setInterest(false)}
        title="Votre projet d’achat"
        subtitle={`Terrain ${reference} • ${location}`}
        size="large"
      >

        <InterestForm
          property={property}
          onDone={(ref) =>
            done('interest', ref)
          }
        />

      </Modal>


      {/* =================================================
          MODAL VISITE
      ================================================= */}

      <Modal
        open={visit}
        onClose={() => setVisit(false)}
        title="Planifier une visite"
        subtitle={`${property.title} • ${location}`}
      >

        <VisitForm
          property={property}
          onDone={(ref) =>
            done('visit', ref)
          }
        />

      </Modal>


      {/* =================================================
          MODAL SUCCES
      ================================================= */}

      <Modal
        open={!!success}
        onClose={() => setSuccess(null)}
        title=""
        size="success-modal"
      >

        <div className="success-content">

          <span>
            <CheckCircle2 size={38} />
          </span>


          <h2>
            {success?.type === 'visit'
              ? 'Demande de visite envoyée !'
              : 'Votre intérêt est enregistré !'
            }
          </h2>


          <p>
            {success?.type === 'visit'
              ? 'Notre équipe vérifie la disponibilité du conseiller. Vous recevrez une confirmation par téléphone ou SMS.'
              : 'Un conseiller CA IMMO vous contactera sous 24 heures ouvrées pour étudier votre projet.'
            }
          </p>


          <div className="request-number">

            <small>
              Numéro de demande
            </small>

            <strong>
              {success?.ref}
            </strong>

          </div>


          <button
            type="button"
            className="btn btn-primary btn-full"
            onClick={() =>
              setSuccess(null)
            }
          >
            Terminé
          </button>

        </div>

      </Modal>

    </AppLayout>
  );
}
