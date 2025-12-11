import React, { useContext, useEffect, useState } from "react";
import { BiLogOut, BiSearch } from "react-icons/bi";
import { HiWallet } from "react-icons/hi2";
import { Link, useNavigate } from "react-router-dom";
import UserContext from "../context/userContext.jsx";
import { tableDB } from "../config/appwrite.js";
import { databaseID } from "../config/db.js";
import { Query } from "appwrite";
import { FiMenu, FiX } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion"; // Import framer-motion

export default function NavBar() {
  const navLinks = [
    { name: "Overview", path: "/home" },
    { name: "Revenue", path: "/revenue" },
    { name: "Expenses", path: "/expenses" },
    { name: "Budget", path: "/budget" },
    { name: "Goals", path: "/goals" },
  ];
  const Location = window.location.pathname;
  const [profile, setProfile] = useState(null);
  const { user, logout } = useContext(UserContext);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false); // State for mobile menu

  const profileData = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const res = await tableDB.listRows({
        databaseId: databaseID,
        tableId: "profiles",
        queries: [Query.equal("userId", user.$id)],
      });
      setProfile(res.rows[0]);
    } catch (error) {
      console.error("Error fetching profile data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      // Note: navigate is not defined in this component, but it was in the original
      // We'll remove this since it causes an error
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  useEffect(() => {
    profileData();
  }, [user]);

  // Animation variants for mobile menu
  const menuVariants = {
    closed: {
      x: "100%",
      transition: {
        type: "spring",
        damping: 40,
        stiffness: 400,
      },
    },
    open: {
      x: 0,
      transition: {
        type: "spring",
        damping: 40,
        stiffness: 400,
      },
    },
  };

  const overlayVariants = {
    closed: {
      opacity: 0,
      transition: {
        delay: 0.2,
      },
    },
    open: {
      opacity: 0.5,
      transition: {
        duration: 0.2,
      },
    },
  };

  return (
    <nav className="max-w-7xl mx-auto py-4 sm:py-6 flex justify-between items-center px-4">
      <h1 className="flex items-center text-xl sm:text-2xl text-secondary font-bold">
        <HiWallet className="inline-block mr-2" />
        SmartSpend
      </h1>

      {/* Mobile menu button with animation */}
      <button
        className="md:hidden text-gray-700 z-50"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
      >
        <motion.div
          initial={false}
          animate={{ rotate: mobileMenuOpen ? 90 : 0 }}
          transition={{ duration: 0.2 }}
        >
          {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </motion.div>
      </button>

      {/* Desktop Navigation */}
      <div className="hidden md:flex justify-between items-center gap-x-4">
        {/* Navigation Links */}
        <div className="flex space-x-4 lg:space-x-6 items-center">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`text-sm lg:text-base text-gray-700 hover:text-secondary whitespace-nowrap ${
                Location === link.path ? "text-secondary font-medium" : ""
              }`}
            >
              {link.name}
            </Link>
          ))}
          <div
            className="flex items-center bg-white hover:bg-gray-50 rounded-md p-1 cursor-pointer"
            onClick={() => navigate("/profile")}
          >
            {profile ? (
              <>
                <img
                  src={
                    profile.profilePicture ??
                    `https://ui-avatars.com/api/?name=${profile.username || user?.name}`
                  }
                  alt="user profile"
                  className="h-8 w-8 sm:h-10 sm:w-10 rounded-full mr-1"
                />
                <p className="text-gray-600 ml-2 font-bold text-sm hidden lg:block">
                  {profile.username || user?.name}
                </p>
                <button className="ml-2" title="Logout" onClick={handleLogout}>
                  <BiLogOut size={25} className="text-red-500" />
                </button>
              </>
            ) : (
              <p className="text-gray-600 font-bold">User</p>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu with Animation */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Overlay */}
            <motion.div
              className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
              initial="closed"
              animate="open"
              exit="closed"
              variants={overlayVariants}
              onClick={() => setMobileMenuOpen(false)}
            />

            {/* Sliding Menu */}
            <motion.div
              className="md:hidden fixed top-0 right-0 bottom-0 w-4/5 max-w-sm bg-white z-50"
              initial="closed"
              animate="open"
              exit="closed"
              variants={menuVariants}
            >
              <div className="flex flex-col h-full pt-16">
                <div className="flex flex-col space-y-2 p-4">
                  {navLinks.map((link) => (
                    <motion.div
                      key={link.name}
                      initial={{ x: 50, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      exit={{ x: 50, opacity: 0 }}
                      transition={{ delay: 0.1 * navLinks.indexOf(link) }}
                      className="overflow-hidden"
                    >
                      <Link
                        to={link.path}
                        className={`block text-lg py-3 px-4 rounded-lg ${
                          Location === link.path
                            ? "bg-secondary text-white"
                            : "text-gray-700 hover:bg-gray-100"
                        }`}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {link.name}
                      </Link>
                    </motion.div>
                  ))}
                </div>
                <div className="mt-auto p-4 border-t border-gray-200">
                  <div
                    className="flex items-center justify-between cursor-pointer"
                    onClick={() => navigate("/profile")}
                  >
                    {profile ? (
                      <>
                        <div className="flex items-center">
                          <img
                            src={
                              profile.profilePicture ??
                              `https://ui-avatars.com/api/?name=${profile.username}`
                            }
                            alt="user profile"
                            className="h-10 w-10 rounded-full mr-2"
                          />
                          <div>
                            <p className="font-bold">{profile.username}</p>
                          </div>
                        </div>
                        <motion.button
                          className="p-2 rounded-full hover:bg-gray-100"
                          title="Logout"
                          onClick={handleLogout}
                          whileTap={{ scale: 0.95 }}
                        >
                          <BiLogOut size={24} className="text-red-500" />
                        </motion.button>
                      </>
                    ) : (
                      <p className="text-gray-600 font-bold">User</p>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
}
