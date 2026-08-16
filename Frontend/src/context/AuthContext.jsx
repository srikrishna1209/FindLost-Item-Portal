import { createContext, useContext, useState } from "react";
import api from "../services/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(
    localStorage.getItem("token")
  );

  const [role, setRole] = useState(
    localStorage.getItem("role")
  );


  const login = async (email, password) => {
    const response = await api.post(
      "/api/users/login",
      {
        email,
        password,
      }
    );


    const receivedToken =
      response.data.token;

    const receivedRole =
      response.data.role;


    localStorage.setItem(
      "token",
      receivedToken
    );


    localStorage.setItem(
      "role",
      receivedRole || ""
    );


    setToken(receivedToken);

    setRole(receivedRole || "");


    return response.data;
  };


  const logout = () => {
    localStorage.removeItem("token");

    localStorage.removeItem("role");

    setToken(null);

    setRole(null);
  };


  return (
    <AuthContext.Provider
      value={{
        token,

        role,

        login,

        logout,

        isAuthenticated: !!token,

        isAdmin:
          role?.toUpperCase() === "ADMIN",
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}


export function useAuth() {
  return useContext(AuthContext);
}