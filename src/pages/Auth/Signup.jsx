import React, { useState, useContext } from "react";
import { motion } from "framer-motion";
import { HiMiniWallet } from "react-icons/hi2";
import { Link, useNavigate } from "react-router-dom";
import UserContext from "../../context/userContext";

function Signup() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const { register, loading } = useContext(UserContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await register(formData.email, formData.password, formData.name);
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
        <p className="mb-6 text-gray-500 text-center">Create your account</p>
        {error && (
          <motion.pname
            initial={{ opacity: 0, translateY: -10 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ duration: 0.5 }}
            className="text-red-500 flex flex-wrap text-wrap max-w-full p-2 text-center bg-red-50 border border-red-500 rounded-md  mb-4"
          >
            {error}
          </motion.pname>
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
            placeholder="Username"
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
            disabled={loading}
            className="bg-secondary my-3 text-white py-3 rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50"
          >
            {loading ? "Loading..." : "Sign Up"}
          </motion.button>
        </form>
        <p className="text-center text-gray-500 mt-4">
          Already have an account?{" "}
          <Link to="/" className="text-secondary hover:underline">
            Login
          </Link>
        </p>
      </motion.div>
    </div>
  );
}

export default Signup;
