import React from "react";
import { BiSearch } from "react-icons/bi";
import { HiWallet } from "react-icons/hi2";
import { Link } from "react-router-dom";

export default function NavBar() {
  const navLinks = [
    { name: "Overview", path: "/home" },
    { name: "Revenue", path: "/revenue" },
    { name: "Expenses", path: "/expenses" },
    { name: "Budget", path: "/budget" },
    { name: "Goals", path: "/goals" },
  ];
  const Location = window.location.pathname;

  return (
    <nav className=" lg:max-w-7xl mx-auto py-6 flex justify-between items-center">
      <h1 className="flex items-center text-2xl text-secondary font-bold">
        <HiWallet className="inline-block mr-2" />
        SmartSpend
      </h1>
      <div className="flex justify-between items-center gap-x-6">
        {/* Navigation Links */}
        <div className="hidden md:flex space-x-6">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`text-gray-700 hover:text-secondary ${
                Location === link.path ? "text-secondary" : ""
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
