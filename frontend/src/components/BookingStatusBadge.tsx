import React from 'react';
import { BookingStatus } from '../api';

const labels: Record<BookingStatus, string> = {
  NEW: 'Новое',
  CONFIRMED: 'Подтверждено',
  REJECTED: 'Отклонено',
};

const classes: Record<BookingStatus, string> = {
  NEW: 'badge badge-new',
  CONFIRMED: 'badge badge-confirmed',
  REJECTED: 'badge badge-rejected',
};

export default function BookingStatusBadge({ status }: { status: BookingStatus }) {
  return <span className={classes[status]}>{labels[status]}</span>;
}
