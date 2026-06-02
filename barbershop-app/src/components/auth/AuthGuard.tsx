import { useAuthStore } from '../../store/useAuthStore';
import { UserRole } from '../../types';

interface Props {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
  fallback?: React.ReactNode;
}

export default function AuthGuard({ children, allowedRoles, fallback = null }: Props) {
  const session = useAuthStore(s => s.session);
  if (!session) return <>{fallback}</>;
  if (allowedRoles && !allowedRoles.includes(session.role)) return <>{fallback}</>;
  return <>{children}</>;
}
