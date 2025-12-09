import { createContext, useState, useCallback, useEffect } from "react";
import { account } from "../config/appwrite";
import {
  loginWithEmail,
  registerWithEmail,
  logout as appwriteLogout,
} from "../services/authService";

const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in
  const checkAuth = useCallback(async () => {
    try {
      const userData = await account.get();
      setUser(userData);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // Run on mount
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Login
  const login = useCallback(async (email, password) => {
    try {
      const response = await loginWithEmail(email, password);
      if (response.error) throw new Error(response.error);

      const userData = await account.get();
      setUser(userData);
      return userData;
    } catch (error) {
      throw error;
    }
  }, []);

  // Register
  const register = useCallback(async (email, password, name) => {
    try {
      const response = await registerWithEmail(email, password, name);
      if (response.error) throw new Error(response.error);

      // No need to create another session since registerWithEmail already does that
      const userData = await account.get();
      setUser(userData);
      return userData;
    } catch (error) {
      throw error;
    }
  }, []);

  // Logout
  const logout = useCallback(async () => {
    try {
      await appwriteLogout(); // call service logout
      setUser(null);
    } catch (error) {
      console.error("Logout error:", error);
      setUser(null); // Even if API fails, clear local state
    }
  }, []);

  return (
    <UserContext.Provider
      value={{ user, loading, login, register, logout }}
    >
      {children}
    </UserContext.Provider>
  );
}

export default UserContext;