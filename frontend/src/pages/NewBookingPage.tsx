import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { mastersApi, bookingsApi, Master } from '../api';
import './Bookings.css';

export default function NewBookingPage() {
  const navigate = useNavigate();
  const [masters, setMasters] = useState<Master[]>([]);
  const [form, setForm] = useState({ masterId: '', bookingDate: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    mastersApi.getAll().then(({ data }) => setMasters(data));
  }, []);

  // Минимальная дата — сегодня
  const minDate = new Date();
  minDate.setMinutes(minDate.getMinutes() - minDate.getTimezoneOffset());
  const minDateStr = minDate.toISOString().slice(0, 16);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.masterId) { setError('Выберите мастера'); return; }
    if (!form.bookingDate) { setError('Укажите дату и время'); return; }
    setLoading(true);
    setError('');
    try {
      await bookingsApi.create({
        masterId: Number(form.masterId),
        bookingDate: new Date(form.bookingDate).toISOString(),
      });
      navigate('/bookings');
    } catch (err: any) {
      const msg = err.response?.data?.message;
      setError(Array.isArray(msg) ? msg.join('. ') : msg || 'Ошибка при подаче заявки');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="new-booking-page">
      <h1 className="page-title">Запись к мастеру</h1>
      <div className="card" style={{ maxWidth: 500 }}>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Выберите мастера</label>
            <select
              className="form-input"
              value={form.masterId}
              onChange={(e) => { setForm((p) => ({ ...p, masterId: e.target.value })); setError(''); }}
              required
            >
              <option value="">— Выберите мастера —</option>
              {masters.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.fullName} ({m.specialty})
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Дата и время</label>
            <input
              className="form-input"
              type="datetime-local"
              value={form.bookingDate}
              min={minDateStr}
              onChange={(e) => { setForm((p) => ({ ...p, bookingDate: e.target.value })); setError(''); }}
              required
            />
          </div>
          {error && <p className="error-text">{error}</p>}
          <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
            <button type="button" className="btn btn-ghost" onClick={() => navigate('/bookings')}>
              Назад
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Отправка...' : 'Подать заявку'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
