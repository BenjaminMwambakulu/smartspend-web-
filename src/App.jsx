import React, { useContext, lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { HiMiniWallet } from "react-icons/hi2"; // Import the wallet icon
import Login from "./pages/Auth/Login";
import Signup from "./pages/Auth/Signup";
import { UserProvider, default as UserContext } from "./context/userContext";
import ProtectedRoute from "./pages/Auth/ProtectedRoute";

// Lazy load pages for better performance
const Home = lazy(() => import("./pages/Home/Home"));
const Revenue = lazy(() => import("./pages/Revenue/Revenue"));
const Expenses = lazy(() => import("./pages/Expenses/Expenses"));
const BudgetsPage = lazy(() => import("./pages/Budgets/BudgetsPage"));
const GoalsPage = lazy(() => import("./pages/Goals/GoalsPage"));
const ProfilePage = lazy(() => import("./pages/Profile/ProfilePage"));

// Custom Loader Component
const AppLoader = () => {
  return (
    <div className="h-screen w-screen bg-primary flex items-center justify-center">
      <div className="text-center">
        <HiMiniWallet className="inline-block text-5xl text-secondary mx-auto mb-4 animate-pulse" />
        <h1 className="text-3xl text-secondary font-bold">SmartSpend</h1>
        <p className="mt-2 text-gray-600">Loading your finances...</p>
        <div className="mt-4 w-12 h-1 bg-secondary rounded-full mx-auto overflow-hidden">
          <div className="h-full bg-gray-300 rounded-full animate-progress origin-left"></div>
        </div>
      </div>
    </div>
  );
};

function AppContent() {
  const { user, loading } = useContext(UserContext);

  if (loading) {
    return <AppLoader />;
  }

  return (
    <div className="bg-primary min-h-screen max-h-screen overflow-y-auto">
      <BrowserRouter>
        <AnimatePresence mode="wait">
          <Suspense fallback={<AppLoader />}>
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
                path="/expenses"
                element={
                  <ProtectedRoute>
                    <Expenses />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/revenue"
                element={
                  <ProtectedRoute>
                    <Revenue />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/budget"
                element={
                  <ProtectedRoute>
                    <BudgetsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/goals"
                element={
                  <ProtectedRoute>
                    <GoalsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="*"
                element={
                  user ? (
                    <Navigate to="/home" replace />
                  ) : (
                    <Navigate to="/" replace />
                  )
                }
              />
            </Routes>
          </Suspense>
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