import React, { useContext } from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Login from "./pages/Auth/Login";
import Signup from "./pages/Auth/Signup";
import Home from "./pages/Home/Home";
import { UserProvider, default as UserContext } from "./context/userContext";
import ProtectedRoute from "./pages/Auth/ProtectedRoute";

function AppContent() {
  const { user, loading } = useContext(UserContext);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <BrowserRouter>
        <AnimatePresence mode="wait">
          <Routes>
            <Route 
              path="/" 
              element={user ? <Navigate to="/home" replace /> : <Login />} 
            />
            <Route 
              path="/signup" 
              element={user ? <Navigate to="/home" replace /> : <Signup />} 
            />
            <Route
              path="/home"
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              }
            />
            <Route
              path="*"
              element={user ? <Navigate to="/home" replace /> : <Navigate to="/" replace />}
            />
          </Routes>
        </AnimatePresence>
      </BrowserRouter>
    </div>
  );
}

function App() {
  return (
    <UserProvider>
      <AppContent />
    </UserProvider>
  );
}

export default App;