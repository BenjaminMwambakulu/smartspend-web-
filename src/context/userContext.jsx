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
    const response = await loginWithEmail(email, password);
    if (response.error) throw new Error(response.error);

    const userData = await account.get();
    setUser(userData);
    return userData;
  }, []);

  // Register
  const register = useCallback(async (email, password, name) => {
    const response = await registerWithEmail(name, email, password);
    if (response.error) throw new Error(response.error);

    const session = await loginWithEmail(email, password);
    if (session.error) throw new Error(session.error);

    const userData = await account.get();
    setUser(userData);
    return userData;
  }, []);

  // Logout
  const logout = useCallback(async () => {
    await appwriteLogout(); // call service logout
    setUser(null);
  }, []);

  return (
    <UserContext.Provider
      value={{ user, loading, checkAuth, login, register, logout }}
    >
      {children}
    </UserContext.Provider>
  );
}

export default UserContext;
