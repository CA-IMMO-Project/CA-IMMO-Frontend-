/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route, Outlet, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import AdminLayout, { AdminLogin } from './admin/AdminLayout';
import Dashboard from './admin/Dashboard';
import AdminLands from './admin/AdminLands';
import { AdminMessages } from './admin/AdminRequests';
import { BuyRequestDetail, BuyRequestForm, BuyRequestList } from './admin/BuyRequests';
import { LandFileDetail, LandFileForm, LandFileList } from './admin/LandFiles';
import { ClientDetail, ClientList } from './admin/Clients';
import { SearchDetail, SearchList } from './admin/Searches';
import AdminRealisations from './admin/Realisations';
import Agenda from './admin/Agenda';
import Realisations from './pages/Realisations';
import Buy from './espace/pages/Buy';
import PropertyDetail from './espace/pages/PropertyDetail';
import SearchRequest from './espace/pages/SearchRequest';
import Sell from './espace/pages/Sell';

function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-brand-50 text-brand-900 font-sans">
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/acheter" element={<Buy />} />
          <Route path="/terrain/:id" element={<PropertyDetail />} />
          <Route path="/recherche" element={<SearchRequest />} />
          <Route path="/vendre" element={<Sell />} />
          {/* Anciennes adresses redirigées vers l'espace client */}
          <Route path="/terrains" element={<Navigate to="/acheter" replace />} />
          <Route path="/reservation" element={<Navigate to="/acheter" replace />} />
          <Route path="/recherche-terrain" element={<Navigate to="/recherche" replace />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/realisations" element={<Realisations />} />
        </Route>
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="achats" element={<BuyRequestList />} />
          <Route path="achats/nouveau" element={<BuyRequestForm />} />
          <Route path="achats/:id" element={<BuyRequestDetail />} />
          <Route path="achats/:id/modifier" element={<BuyRequestForm key="edit" />} />
          <Route path="dossiers-terrains" element={<LandFileList />} />
          <Route path="dossiers-terrains/nouveau" element={<LandFileForm />} />
          <Route path="dossiers-terrains/:id" element={<LandFileDetail />} />
          <Route path="dossiers-terrains/:id/modifier" element={<LandFileForm key="edit" />} />
          <Route path="terrains" element={<AdminLands />} />
          <Route path="agenda" element={<Agenda />} />
          <Route path="clients" element={<ClientList />} />
          <Route path="clients/:id" element={<ClientDetail />} />
          <Route path="recherches" element={<SearchList />} />
          <Route path="recherches/:id" element={<SearchDetail />} />
          <Route path="realisations" element={<AdminRealisations />} />
          <Route path="messages" element={<AdminMessages />} />
        </Route>
      </Routes>
    </Router>
  );
}
