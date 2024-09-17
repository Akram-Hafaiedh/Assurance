import { Navigate, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";

interface ProtectedRouteProps {
    element: React.ReactElement;
    requiredRole?: string;
}
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ element, requiredRole }) => {
    const { isAuthenticated, user, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return <div>Loading...</div>;
    }
    if (!isAuthenticated) {
        return <Navigate to="/" state={{ from: location }} />;
    }
    if (requiredRole && user?.role !== requiredRole) {
        return <Navigate to="/home" />;
    }

    return element;
};

export default ProtectedRoute;