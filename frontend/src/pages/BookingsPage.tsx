import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { bookingsApi, Booking } from '../api';
import BookingStatusBadge from '../components/BookingStatusBadge';
import './Bookings.css';

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchBookings = async () => {
    try {
      const { data } = await bookingsApi.getAll();
      setBookings(data);
    } catch {
      setError('Не удалось загрузить заявки');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBookings(); }, []);

  const handleCancel = async (id: number) => {
    if (!confirm('Отменить запись?')) return;
    try {
      const { data } = await bookingsApi.cancel(id);
      setBookings((prev) => prev.map((b) => (b.id === id ? data : b)));
    } catch (err: any) {
      alert(err.response?.data?.message || 'Не удалось отменить');
    }
  };

  if (loading) return <div className="spinner" />;
  if (error) return <p className="error-text">{error}</p>;

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Мои записи</h1>
        <Link to="/bookings/new" className="btn btn-primary">+ Записаться</Link>
      </div>

      {bookings.length === 0 ? (
        <div className="empty-state card">
          <p>У вас пока нет записей</p>
          <Link to="/bookings/new" className="btn btn-primary" style={{ marginTop: 16 }}>
            Записаться к мастеру
          </Link>
        </div>
      ) : (
        <div className="bookings-list">
          {bookings.map((booking) => (
            <div key={booking.id} className="booking-card card">
              <div className="booking-card-top">
                <div>
                  <p className="booking-master">{booking.master.fullName}</p>
                  <p className="booking-specialty">{booking.master.specialty}</p>
                </div>
                <BookingStatusBadge status={booking.status} />
              </div>
              <div className="booking-card-bottom">
                <div className="booking-info">
                  <span>📅 {new Date(booking.bookingDate).toLocaleString('ru-RU', {
                    day: '2-digit', month: '2-digit', year: 'numeric',
                    hour: '2-digit', minute: '2-digit',
                  })}</span>
                  <span>📋 Заявка №{booking.id}</span>
                </div>
                {booking.status === 'NEW' && (
                  <button className="btn btn-danger btn-sm" onClick={() => handleCancel(booking.id)}>
                    Отменить
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
