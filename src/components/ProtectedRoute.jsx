import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export function ProtectedRoute({ roles }) {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return <div className="page-shell grid min-h-screen place-items-center text-lg font-bold text-green-700">Loading CampusQ...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (roles && !roles.includes(profile?.role)) {
    return <Navigate to={profile?.role ? `/${profile.role}` : '/login'} replace />;
  }

  if (profile?.disabled) {
    return <Navigate to="/disabled" replace />;
  }

  return <Outlet />;
}
