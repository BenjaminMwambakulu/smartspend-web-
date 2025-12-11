import React, { useContext, useEffect } from "react";
import UserContext from "../../context/userContext";
import { useNavigate } from "react-router-dom";
import { tableDB } from "../../config/appwrite";
import { databaseID } from "../../config/db";
import { Query } from "appwrite";
import Overview from "../../components/Overview";
import Goals from "../../components/Goals";

function Home() {
  const { user, logout } = useContext(UserContext);
  const navigate = useNavigate();
  const [profile, setProfile] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  const profileData = async () => {
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
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="px-2 sm:px-4">
      {/* Greeting */}
      <div className="my-4 sm:my-8">
        <h1 className="text-base sm:text-lg text-secondary mb-1">Welcome</h1>
        <div className="flex items-center">
          {profile ? (
            <>
              <img
                src={
                  profile.profilePicture ??
                  `https://ui-avatars.com/api/?name=${profile.username}`
                }
                alt="user profile"
                className="h-8 w-8 sm:h-10 sm:w-10 rounded-full"
              />
              <p className="text-gray-600 text-xl sm:text-2xl ml-2 font-bold ">
                {profile.username}
              </p>
            </>
          ) : (
            <p className="text-gray-600 text-xl sm:text-2xl font-bold">User</p>
          )}
        </div>
      </div>

      <Overview />
      <Goals />
    </div>
  );
}

export default Home;