import React, { useContext, useEffect, useState } from "react";
import { BiSearch } from "react-icons/bi";
import { HiWallet } from "react-icons/hi2";
import { Link } from "react-router-dom";
import UserContext from "../context/userContext.jsx";
import { tableDB } from "../config/appwrite.js";
import { databaseID } from "../config/db.js";
import { Query } from "appwrite";

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
  const [loading, setLoading] = useState(false);
  const { user } = useContext(UserContext);

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
  
  useEffect(() => {
    profileData();
  }, [user]);

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
          <div className="flex items-center">
            {profile ? (
              <>
                <img
                  src={
                    profile.profilePicture ??
                    `https://ui-avatars.com/api/?name=${profile.username}`
                  }
                  alt="user profile"
                  className="h-10 w-10 rounded-full"
                />
                <p className="text-gray-600ml-2 font-bold ">
                  {profile.username}
                </p>
              </>
            ) : (
              <p className="text-gray-600 font-bold">User</p>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}