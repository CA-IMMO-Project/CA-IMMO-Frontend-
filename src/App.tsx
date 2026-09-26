/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route, Outlet, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Lands from './pages/Lands';
import LandDetail from './pages/LandDetail';
import SearchRequest from './pages/SearchRequest';
import About from './pages/About';
import NotFound from './pages/NotFound';
import Account from './pages/Account';
import Auth from './pages/Auth';
import Sell from './pages/Sell';
import AdminLayout, { AdminLogin } from './admin/AdminLayout';
import Dashboard from './admin/Dashboard';
import AdminLands from './admin/AdminLands';
import { AdminMessages, AdminReservations } from './admin/AdminRequests';

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
          <Route path="/terrains" element={<Lands />} />
          <Route path="/terrains/:id" element={<LandDetail />} />
          <Route path="/recherche" element={<SearchRequest />} />
          <Route path="/about" element={<About />} />
          {/* Contact (formulaire) supprimé : « Nous contacter » ouvre WhatsApp directement */}
          <Route path="/contact" element={<Navigate to="/" replace />} />
          <Route path="/connexion" element={<Auth />} />
          <Route path="/compte" element={<Account />} />
          <Route path="/vendre" element={<Sell />} />
          <Route path="/reservation" element={<Navigate to="/vendre" replace />} />
          <Route path="*" element={<NotFound />} />
        </Route>
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="terrains" element={<AdminLands />} />
          <Route path="reservations" element={<AdminReservations />} />
          <Route path="messages" element={<AdminMessages />} />
        </Route>
      </Routes>
    </Router>
  );
}
