import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import UserContext from "../../context/userContext";
import NavBar from "../../components/NavBar";

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

  return (
    <div className="max-w-7xl mx-auto px-2 sm:px-4">
      <NavBar />
      <div className="mt-2 sm:mt-4">
        {children}
      </div>
    </div>
  );
};

export default ProtectedRoute;