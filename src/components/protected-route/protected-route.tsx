import { useSelector } from '../../services/store';
import { Navigate, useLocation } from 'react-router-dom';

interface ProtectedRouteProps {
  component: React.ReactElement;
  onlyUnAuth?: boolean;
}

const ProtectedRoute = ({
  component,
  onlyUnAuth = false
}: ProtectedRouteProps) => {
  const { isAuthenticated, isAuthChecked } = useSelector((state) => state.user);
  const location = useLocation();

  if (!isAuthChecked) {
    return <div>Загрузка...</div>;
  }

  if (onlyUnAuth && isAuthenticated) {
    const from = location.state?.from || '/';
    return <Navigate to={from} replace />;
  }

  if (!onlyUnAuth && !isAuthenticated) {
    return <Navigate to='/login' state={{ from: location }} replace />;
  }

  return component;
};

export const OnlyAuth = ({ component }: { component: React.ReactElement }) => (
  <ProtectedRoute component={component} />
);

export const OnlyUnAuth = ({
  component
}: {
  component: React.ReactElement;
}) => <ProtectedRoute component={component} onlyUnAuth />;
