import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Loader from "./Loader";

function AdminRoute({ children }) {
    const { user, isAuthenticated, loading } = useAuth();

    if (loading) return <Loader fullScreen message="Checking permissions…" />;

  
    if (!isAuthenticated) return <Navigate to="/login" replace />;

    
    if (user?.role !== "admin") return <Navigate to="/" replace />;

    return children;
}

export default AdminRoute;
