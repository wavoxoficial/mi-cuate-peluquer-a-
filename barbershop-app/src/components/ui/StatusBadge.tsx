import { BookingStatus } from '../../types';

const labels: Record<BookingStatus, string> = {
  pending:     'Pendiente',
  confirmed:   'Confirmada',
  'in-progress': 'En curso',
  completed:   'Completada',
  cancelled:   'Cancelada',
};

export default function StatusBadge({ status }: { status: BookingStatus }) {
  return (
    <span className={`badge status-${status}`}>
      {labels[status]}
    </span>
  );
}
