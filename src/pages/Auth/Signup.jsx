import React, { useState } from "react";
import { motion } from "framer-motion";
import { HiMiniWallet } from "react-icons/hi2";
import { Link } from "react-router-dom";
import { registerWithEmail } from "../../services/authService";

function Signup() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await registerWithEmail(
        formData.name,
        formData.email,
        formData.password
      );

      if (res.error) {
        setError(res.error);
      } else {
        setSuccess(res.success);
      }
    } catch (error) {
      setError(error.message || "An unknown error occurred");
    }

    setLoading(false);
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
          Create your account
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
        {success && (
          <motion.p
            initial={{ opacity: 0, translateY: -10 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ duration: 0.5 }}
            className="text-green-500 p-2 text-center bg-green-50 border border-green-500 rounded-md  mb-4"
          >
            {success}
          </motion.p>
        )}
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Full Name"
            required
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <input
            type="email"
            placeholder="Email"
            required
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <input
            type="password"
            required
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="bg-secondary my-3 text-white py-3 rounded-lg hover:bg-primary-dark transition-colors"
          >
            {loading ? "Loading..." : "Sign Up"}
          </motion.button>
        </form>
        <p className="text-center text-gray-500 mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-secondary hover:underline">
            Login
          </Link>
        </p>
      </motion.div>
    </div>
  );
}

export default Signup;
