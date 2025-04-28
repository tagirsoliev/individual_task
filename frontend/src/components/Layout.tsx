import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Layout.css';

export default function Layout({ children }: { children: React.ReactNode }) {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="layout">
      <header className="navbar">
        <div className="navbar-inner">
          <Link to="/" className="navbar-logo">
            ✂️ <span>Barbershop</span>
          </Link>
          <nav className="navbar-links">
            {isAdmin ? (
              <>
                <Link to="/admin/bookings" className={isActive('/admin/bookings') ? 'active' : ''}>
                  Заявки
                </Link>
                <Link to="/admin/masters" className={isActive('/admin/masters') ? 'active' : ''}>
                  Мастера
                </Link>
              </>
            ) : (
              <>
                <Link to="/bookings" className={isActive('/bookings') ? 'active' : ''}>
                  Мои записи
                </Link>
                <Link to="/bookings/new" className={isActive('/bookings/new') ? 'active' : ''}>
                  Записаться
                </Link>
              </>
            )}
          </nav>
          <div className="navbar-user">
            <span className="navbar-username">{user?.fullName.split(' ')[0]}</span>
            {isAdmin && <span className="badge-admin">Админ</span>}
            <button className="btn btn-ghost btn-sm" onClick={handleLogout}>
              Выйти
            </button>
          </div>
        </div>
      </header>
      <main className="main-content">{children}</main>
    </div>
  );
}
