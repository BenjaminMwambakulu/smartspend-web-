import React, { useContext, useState, useEffect } from "react";
import UserContext from "../../context/userContext";
import { account } from "../../config/appwrite";
import PrimaryButton from "../../components/PrimaryButton";
import formatMoney from "../../utils/formatMoney";
import { getUserProfile, updateUserName } from "../../services/profileService";

const ProfilePage = () => {
  const { user, logout } = useContext(UserContext);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // success or error
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      if (user) {
        const result = await getUserProfile(user.$id);
        if (result.success) {
          setProfile(result.data);
        }
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const response = await updateUserName(name);
      if (response.success) {
        setMessage("Profile updated successfully!");
        setMessageType("success");
        setEditing(false);
      } else {
        throw new Error(response.error);
      }
    } catch (error) {
      setMessage(`Error updating profile: ${error.message}`);
      setMessageType("error");
    }
  };

  const handleMessageDismiss = () => {
    setMessage("");
    setMessageType("");
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              User Profile
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Loading profile...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            User Profile
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Personal details and account information
          </p>
        </div>
        <div className="px-4 py-5 sm:p-6">
          {message && (
            <div
              className={`rounded-md p-4 mb-4 ${
                messageType === "success"
                  ? "bg-green-50 text-green-800"
                  : "bg-red-50 text-red-800"
              }`}
            >
              <div className="flex justify-between">
                <span>{message}</span>
                <button
                  onClick={handleMessageDismiss}
                  className="text-lg font-bold"
                >
                  &times;
                </button>
              </div>
            </div>
          )}

          <div className="flex flex-col md:flex-row items-center mb-8">
            <div className="shrink-0 mb-4 md:mb-0 md:mr-6">
              <img
                className="h-24 w-24 rounded-full border-2 border-gray-300 object-cover"
                src={
                  profile?.profilePicture ||
                  `https://ui-avatars.com/api/?name=${user?.name}`
                }
                alt={user?.name}
              />
            </div>
            <div className="text-center md:text-left">
              <h2 className="text-2xl font-bold text-gray-900">{user?.name}</h2>
              <p className="text-gray-600 mt-1">{user?.email}</p>
              <p className="text-gray-500 text-sm mt-2">
                Member since{" "}
                {user?.$createdAt
                  ? new Date(user.$createdAt).toLocaleDateString()
                  : "Unknown"}
              </p>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <form onSubmit={handleUpdateProfile}>
              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                <div className="sm:col-span-6">
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Name
                  </label>
                  <div className="mt-1">
                    {editing ? (
                      <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md px-3 py-2 border"
                        required
                      />
                    ) : (
                      <p className="block w-full sm:text-sm text-gray-900">
                        {user?.name}
                      </p>
                    )}
                  </div>
                </div>

                <div className="sm:col-span-6">
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Email address
                  </label>
                  <div className="mt-1">
                    {editing ? (
                      <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md px-3 py-2 border"
                        readOnly
                      />
                    ) : (
                      <p className="block w-full sm:text-sm text-gray-900">
                        {user?.email}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                {editing ? (
                  <>
                    <PrimaryButton text={"Save Changes"} type="submit" />
                    <button
                      type="button"
                      onClick={() => {
                        setEditing(false);
                        setName(user?.name || "");
                        setEmail(user?.email || "");
                      }}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <PrimaryButton
                    onClick={() => setEditing(true)}
                    text={"Edit Profile"}
                  />
                )}

                <button
                  onClick={logout}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Sign Out
                </button>
              </div>
            </form>
          </div>

          <div className="border-t border-gray-200 pt-6 mt-8">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Account Statistics
            </h3>
            <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-3">
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="text-sm font-medium text-blue-800">
                  Total Expenses
                </div>
                <div className="mt-1 text-2xl font-semibold text-blue-900">
                  {formatMoney(1250.75)}
                </div>
              </div>
              <div className="bg-green-50 rounded-lg p-4">
                <div className="text-sm font-medium text-green-800">
                  Total Revenues
                </div>
                <div className="mt-1 text-2xl font-semibold text-green-900">
                  {formatMoney(3200.0)}
                </div>
              </div>
              <div className="bg-purple-50 rounded-lg p-4">
                <div className="text-sm font-medium text-purple-800">
                  Net Worth
                </div>
                <div className="mt-1 text-2xl font-semibold text-purple-900">
                  {formatMoney(1949.25)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
