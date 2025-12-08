import React, { useContext, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import UserContext from "../../context/userContext";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useContext(UserContext);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Wait for auth check to complete
    if (!loading) {
      setIsChecking(false);
    }
  }, [loading]);

  if (isChecking) {
    return <div>Loading...</div>; // Or a spinner/loading component
  }

  // If user is not authenticated, redirect to login
  if (!user) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;