import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import UserContext from "../../context/userContext";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useContext(UserContext);
  // Show loading state while checking auth status
  if (loading) {
    return <div>Loading...</div>;
  }

  // If user is not authenticated, redirect to login
  if (!user) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;