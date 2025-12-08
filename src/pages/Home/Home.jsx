import React, { useContext } from "react";
import UserContext from "../../context/userContext";
import { useNavigate } from "react-router-dom";

function Home() {
  const { user, logout } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">SmartSpend</h1>
          <div className="flex items-center space-x-4">
            <span className="text-gray-700">Welcome, {user?.name || user?.email}</span>
            <button
              onClick={handleLogout}
              className="bg-secondary text-white px-4 py-2 rounded-md hover:bg-primary-dark transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </header>
      <main className="grow">
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="border-4 border-dashed border-gray-200 rounded-lg h-96 p-4">
              <h2 className="text-2xl font-semibold mb-4">Dashboard</h2>
              <p className="text-gray-600">Your expense tracking dashboard will appear here.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Home;