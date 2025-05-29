import React, { useEffect, useState } from 'react';
import { bookingsApi, Booking, BookingStatus } from '../api';
import BookingStatusBadge from '../components/BookingStatusBadge';
import './Bookings.css';

const STATUS_OPTIONS: BookingStatus[] = ['NEW', 'CONFIRMED', 'REJECTED'];
const STATUS_LABELS: Record<BookingStatus, string> = {
  NEW: 'Новое',
  CONFIRMED: 'Подтверждено',
  REJECTED: 'Отклонено',
};

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<BookingStatus | 'ALL'>('ALL');
  const [updating, setUpdating] = useState<number | null>(null);

  useEffect(() => {
    bookingsApi.getAll()
      .then(({ data }) => setBookings(data))
      .finally(() => setLoading(false));
  }, []);

  const handleStatusChange = async (id: number, status: BookingStatus) => {
    setUpdating(id);
    try {
      const { data } = await bookingsApi.updateStatus(id, status);
      setBookings((prev) => prev.map((b) => (b.id === id ? data : b)));
    } catch (err: any) {
      alert(err.response?.data?.message || 'Ошибка обновления статуса');
    } finally {
      setUpdating(null);
    }
  };

  const filtered = filter === 'ALL' ? bookings : bookings.filter((b) => b.status === filter);

  if (loading) return <div className="spinner" />;

  return (
    <div>
      <h1 className="page-title">Все заявки</h1>

      <div className="filter-bar">
        <select
          className="filter-select"
          value={filter}
          onChange={(e) => setFilter(e.target.value as BookingStatus | 'ALL')}
        >
          <option value="ALL">Все статусы ({bookings.length})</option>
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {STATUS_LABELS[s]} ({bookings.filter((b) => b.status === s).length})
            </option>
          ))}
        </select>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="bookings-table-wrap">
          <table className="bookings-table">
            <thead>
              <tr>
                <th>№</th>
                <th>Клиент</th>
                <th>Телефон</th>
                <th>Мастер</th>
                <th>Дата и время</th>
                <th>Статус</th>
                <th>Действие</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', color: 'var(--color-text-muted)', padding: 32 }}>
                    Заявок нет
                  </td>
                </tr>
              ) : (
                filtered.map((booking) => (
                  <tr key={booking.id}>
                    <td style={{ color: 'var(--color-text-muted)' }}>#{booking.id}</td>
                    <td>
                      <div style={{ fontWeight: 500 }}>{booking.user.fullName}</div>
                      <div style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>{booking.user.email}</div>
                    </td>
                    <td style={{ color: 'var(--color-text-muted)' }}>{booking.user.phone}</td>
                    <td>
                      <div>{booking.master.fullName}</div>
                      <div style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>{booking.master.specialty}</div>
                    </td>
                    <td>
                      {new Date(booking.bookingDate).toLocaleString('ru-RU', {
                        day: '2-digit', month: '2-digit', year: 'numeric',
                        hour: '2-digit', minute: '2-digit',
                      })}
                    </td>
                    <td><BookingStatusBadge status={booking.status} /></td>
                    <td>
                      <select
                        className="status-select"
                        value={booking.status}
                        disabled={updating === booking.id}
                        onChange={(e) => handleStatusChange(booking.id, e.target.value as BookingStatus)}
                      >
                        {STATUS_OPTIONS.map((s) => (
                          <option key={s} value={s}>{STATUS_LABELS[s]}</option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
