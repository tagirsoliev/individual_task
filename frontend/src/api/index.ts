import axios from 'axios';

const api = axios.create({ baseURL: '/api' });

// Автоматически добавляем токен в каждый запрос
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// При 401 — выкидываем пользователя
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;

// --- Типы ---
export interface User {
  id: number;
  fullName: string;
  phone: string;
  email: string;
  role: 'CLIENT' | 'ADMIN';
  createdAt: string;
}

export interface Master {
  id: number;
  fullName: string;
  specialty: string;
}

export type BookingStatus = 'NEW' | 'CONFIRMED' | 'REJECTED';

export interface Booking {
  id: number;
  userId: number;
  masterId: number;
  bookingDate: string;
  status: BookingStatus;
  createdAt: string;
  master: Master;
  user: Pick<User, 'id' | 'fullName' | 'phone' | 'email'>;
}

// --- Auth ---
export const authApi = {
  register: (data: { fullName: string; phone: string; email: string; password: string }) =>
    api.post<{ token: string; user: User }>('/auth/register', data),
  login: (data: { email: string; password: string }) =>
    api.post<{ token: string; user: User }>('/auth/login', data),
};

// --- Masters ---
export const mastersApi = {
  getAll: () => api.get<Master[]>('/masters'),
  create: (data: { fullName: string; specialty: string }) => api.post<Master>('/masters', data),
  delete: (id: number) => api.delete(`/masters/${id}`),
};

// --- Bookings ---
export const bookingsApi = {
  getAll: () => api.get<Booking[]>('/bookings'),
  create: (data: { masterId: number; bookingDate: string }) => api.post<Booking>('/bookings', data),
  updateStatus: (id: number, status: BookingStatus) =>
    api.patch<Booking>(`/bookings/${id}/status`, { status }),
  cancel: (id: number) => api.patch<Booking>(`/bookings/${id}/cancel`),
};

// --- Users ---
export const usersApi = {
  getMe: () => api.get<User>('/users/me'),
  getAll: () => api.get<User[]>('/users'),
};
