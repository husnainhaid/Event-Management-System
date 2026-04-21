import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function HostRoute({ children }) {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== "host") {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default HostRoute;
