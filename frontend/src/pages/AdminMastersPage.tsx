import React, { useEffect, useState } from 'react';
import { mastersApi, Master } from '../api';
import './Masters.css';

export default function AdminMastersPage() {
  const [masters, setMasters] = useState<Master[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ fullName: '', specialty: '' });
  const [error, setError] = useState('');
  const [adding, setAdding] = useState(false);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    mastersApi.getAll()
      .then(({ data }) => setMasters(data))
      .finally(() => setLoading(false));
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.fullName.trim() || !form.specialty.trim()) {
      setError('Заполните все поля');
      return;
    }
    setAdding(true);
    setError('');
    try {
      const { data } = await mastersApi.create(form);
      setMasters((prev) => [...prev, data]);
      setForm({ fullName: '', specialty: '' });
      setShowForm(false);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Ошибка добавления');
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Удалить мастера?')) return;
    try {
      await mastersApi.delete(id);
      setMasters((prev) => prev.filter((m) => m.id !== id));
    } catch (err: any) {
      alert(err.response?.data?.message || 'Ошибка удаления');
    }
  };

  if (loading) return <div className="spinner" />;

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Мастера</h1>
        <button className="btn btn-primary" onClick={() => setShowForm((v) => !v)}>
          {showForm ? 'Отмена' : '+ Добавить мастера'}
        </button>
      </div>

      {showForm && (
        <div className="card" style={{ maxWidth: 500, marginBottom: 24 }}>
          <h3 style={{ marginBottom: 16, fontSize: 16 }}>Новый мастер</h3>
          <form onSubmit={handleAdd}>
            <div className="form-group">
              <label className="form-label">ФИО мастера</label>
              <input
                className="form-input"
                placeholder="Иванов Иван Иванович"
                value={form.fullName}
                onChange={(e) => { setForm((p) => ({ ...p, fullName: e.target.value })); setError(''); }}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Специализация</label>
              <input
                className="form-input"
                placeholder="Барбер, Стилист, Колорист..."
                value={form.specialty}
                onChange={(e) => { setForm((p) => ({ ...p, specialty: e.target.value })); setError(''); }}
              />
            </div>
            {error && <p className="error-text">{error}</p>}
            <button type="submit" className="btn btn-primary" disabled={adding}>
              {adding ? 'Добавление...' : 'Добавить'}
            </button>
          </form>
        </div>
      )}

      <div className="masters-grid">
        {masters.length === 0 ? (
          <p style={{ color: 'var(--color-text-muted)' }}>Мастера не добавлены</p>
        ) : (
          masters.map((master) => (
            <div key={master.id} className="master-card card">
              <div className="master-avatar">{master.fullName.charAt(0)}</div>
              <div className="master-info">
                <p className="master-name">{master.fullName}</p>
                <p className="master-specialty">{master.specialty}</p>
              </div>
              <button className="btn btn-danger btn-sm" onClick={() => handleDelete(master.id)}>
                Удалить
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
