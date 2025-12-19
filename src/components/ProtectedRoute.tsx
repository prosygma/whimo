import { Navigate, Outlet } from 'react-router';
import { useTokens } from '../hooks/useTokens';

const ProtectedRoute = () => {
  const { isAuthenticated } = useTokens();

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;