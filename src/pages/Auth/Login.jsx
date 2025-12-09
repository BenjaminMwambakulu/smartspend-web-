import React, { useState, useContext } from "react";
import { motion } from "framer-motion";
import { HiMiniWallet } from "react-icons/hi2";
import { Link, useNavigate } from "react-router-dom";
import UserContext from "../../context/userContext";

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const { login, loading } = useContext(UserContext);
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await login(formData.email, formData.password);
      navigate("/home");
    } catch (error) {
      setError(error.message || "An unknown error occurred");
    }
  };
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="h-screen w-screen bg-primary flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, translateY: -20 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ duration: 0.5 }}
        exit={{ opacity: 0, translateY: -20 }}
        className="p-8 bg-white rounded-3xl shadow"
      >
        <h1 className="text-3xl text-secondary w-full text-center flex items-center justify-center">
          <HiMiniWallet className="inline-block mr-2" />
          SmartSpend
        </h1>
        <p className="mb-6 text-gray-500 text-center">
          Please login to your account
        </p>
        {error && (
          <motion.p
            initial={{ opacity: 0, translateY: -10 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ duration: 0.5 }}
            className="text-red-500 p-2 text-center bg-red-50 border border-red-500 rounded-md  mb-4"
          >
            {error}
          </motion.p>
        )}
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            required
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <input
            type="password"
            required
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            placeholder="Password"
            className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={loading}
            className="bg-secondary my-3 text-white py-3 rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50"
          >
            {loading ? "Loading..." : "Login"}
          </motion.button>
        </form>
        <p className="text-center text-gray-500 mt-4">
          Don't have an account?{" "}
          <Link to="/signup" className="text-secondary hover:underline">
            Sign up
          </Link>
        </p>
        <p className="text-center mt-2">
          <Link
            to="/forgot-password"
            className="text-secondary hover:underline"
          >
            Forgot Password
          </Link>
        </p>
      </motion.div>
    </div>
  );
}

export default Login;
