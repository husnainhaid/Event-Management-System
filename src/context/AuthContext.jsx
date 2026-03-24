import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { loginUser, registerUser, logoutUser, getCurrentUser, getToken } from "../services/authService";
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true); 

   
    useEffect(() => {
        const savedUser = getCurrentUser();
        const savedToken = getToken();
        if (savedUser && savedToken) {
            setUser(savedUser);
            setToken(savedToken);
        }
        setLoading(false);
    }, []);

     const login = useCallback(async (email, password) => {
        const { user: u, token: t } = await loginUser({ email, password });
        setUser(u);
        setToken(t);
        return u;
    }, []);
             const register = useCallback(async ({ name, email, password }) => {
        const { user: u, token: t } = await registerUser({ name, email, password });
        setUser(u);
        setToken(t);
        return u;
    }, []);
             const logout = useCallback(() => {
        logoutUser();
        setUser(null);
        setToken(null);
    }, [])



    
  }
  export default AuthContext;
