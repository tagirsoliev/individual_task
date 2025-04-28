import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';

import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import BookingsPage from './pages/BookingsPage';
import NewBookingPage from './pages/NewBookingPage';
import AdminBookingsPage from './pages/AdminBookingsPage';
import AdminMastersPage from './pages/AdminMastersPage';

function RootRedirect() {
  const { isAuthenticated, isAdmin } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <Navigate to={isAdmin ? '/admin/bookings' : '/bookings'} replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Публичные маршруты */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Клиентские маршруты */}
          <Route
            path="/bookings"
            element={
              <ProtectedRoute>
                <Layout><BookingsPage /></Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/bookings/new"
            element={
              <ProtectedRoute>
                <Layout><NewBookingPage /></Layout>
              </ProtectedRoute>
            }
          />

          {/* Админские маршруты */}
          <Route
            path="/admin/bookings"
            element={
              <ProtectedRoute adminOnly>
                <Layout><AdminBookingsPage /></Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/masters"
            element={
              <ProtectedRoute adminOnly>
                <Layout><AdminMastersPage /></Layout>
              </ProtectedRoute>
            }
          />

          {/* Редирект с корня */}
          <Route path="/" element={<RootRedirect />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
