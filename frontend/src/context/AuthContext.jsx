import { createContext, useContext, useState } from "react";
import { login as loginService, register as registerService, logout as logoutService } from "../services/authServices";

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const openAuthModal = () => setIsAuthModalOpen(true);
  const closeAuthModal = () => setIsAuthModalOpen(false);

  const login = async (loginId, password) => {
    try {
      const data = await loginService(loginId, password);
      if (data && data.user) {
        setUser(data.user);
        closeAuthModal();
      }
      return data;
    } catch (error) {
      console.error("Login failed", error);
      throw error;
    }
  };

  const register = async (username, email, password) => {
    try {
      const data = await registerService(username, email, password);
      if (data && data.user) {
        setUser(data.user);
        closeAuthModal();
      }
      return data;
    } catch (error) {
      console.error("Register failed", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await logoutService();
      setUser(null);
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        isAuthModalOpen,
        openAuthModal,
        closeAuthModal,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
