import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export function PrivateRoute({ rolesPermitidos }) {
  const { autenticado, usuario, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center' }}>
        <div className="spinner" />
      </div>
    );
  }

  if (!autenticado) {
    return <Navigate to="/admin/login" replace />;
  }

  if (rolesPermitidos && !rolesPermitidos.includes(usuario.perfil)) {
    return <Navigate to="/admin" replace />;
  }

  return <Outlet />;
}