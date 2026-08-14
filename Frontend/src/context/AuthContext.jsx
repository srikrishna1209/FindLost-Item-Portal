import { createContext, useContext, useState } from "react";
import api from "../services/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(
    localStorage.getItem("token")
  );

  const login = async (email, password) => {
    const response = await api.post("/api/users/login", {
      email,
      password,
    });

    const receivedToken = response.data.token;

    localStorage.setItem("token", receivedToken);

    setToken(receivedToken);

    return response.data;
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        login,
        logout,
        isAuthenticated: !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}