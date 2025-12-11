import React from "react";
import { motion } from "framer-motion";

export default function PrimaryButton({ text, onClick=()=>{}, className, type = '' }) {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      type={type}
      onClick={onClick}
      className={`bg-secondary text-white px-4 py-2 rounded ${className}`}
    >
      {text}
    </motion.button>
  );
}


