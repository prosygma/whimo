import { Navigate } from 'react-router-dom';
import { useTokens } from '../hooks/useTokens';

const RootRedirect = () => {
  const { isAuthenticated } = useTokens();

  return <Navigate to={isAuthenticated ? '/transactions' : '/login'} replace />;
};

export default RootRedirect;
