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
    { name: "Reports", path: "/reports" },
  ];
  const Location = window.location.pathname;

  return (
    <nav className=" lg:max-w-7xl mx-auto py-6 flex justify-between items-center">
      <h1 className="flex items-center text-2xl text-secondary font-bold">
        <HiWallet className="inline-block mr-2" />
        SmartSpend
      </h1>
      <div className="flex justify-between items-center gap-x-6">
        {/* Search Bar */}
        <label className="flex bg-white items-center group gap-2 border border-gray-300 rounded-lg px-4 py-2 focus-within:ring-2 focus-within:ring-blue-500">
          <BiSearch
            className="text-gray-500 group-focus-within:text-secondary"
            size={20}
          />
          <input
            type="text"
            placeholder="Search..."
            className="w-full hidden lg:flex bg-transparent outline-none"
          />
        </label>
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
