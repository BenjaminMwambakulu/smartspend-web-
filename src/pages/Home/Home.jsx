import React, { useContext, useEffect } from "react";
import UserContext from "../../context/userContext";
import { useNavigate } from "react-router-dom";
import { tableDB } from "../../config/appwrite";
import { databaseID } from "../../config/db";
import { Query } from "appwrite";

function Home() {
  const { user, logout } = useContext(UserContext);
  const navigate = useNavigate();
  const [profile, setProfile] = React.useState(null);
  const profileData = async () => {
    try {
      const res = await tableDB.listRows({
        databaseId: databaseID,
        tableId: "profiles",
        queries: [Query.equal("userId", user.$id)],
      });
      setProfile(res.rows[0]);
    } catch (error) {
      console.error("Error fetching profile data:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  useEffect(() => {
    profileData();
  }, []);

  return (
    <div>
      {/* Greeting */}
      <div className="my-8">
        <h1 className="text-lg text-secondary mb-1">Welcome</h1>
        <div className="flex items-center">
          <img
            src={profile.profilePicture ?? ""}
            alt="user profile"
            className="h-10 w-10 rounded-full"
          />
          <p className="text-gray-600 text-2xl ml-2 font-bold ">{profile.username}</p>
        </div>
      </div>
    </div>
  );
}

export default Home;
