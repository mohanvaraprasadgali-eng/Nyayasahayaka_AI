import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Pre-seed default as Ramesh Kumar (Citizen) for seamless initial view
  const [currentUser, setCurrentUser] = useState({
    id: 1,
    name: "Ramesh Kumar",
    email: "citizen@nyaya.ai",
    phone: "+91 98765 43210",
    role: "citizen",
    location: "Madhapur, Hyderabad",
    city: "Hyderabad",
    state: "Telangana",
    language: "en"
  });
  const [token, setToken] = useState("demo-citizen-token");
  const [demoUsers, setDemoUsers] = useState([]);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'register'
  const [authRoleChoice, setAuthRoleChoice] = useState('citizen'); // 'citizen' or 'lawyer'
  const [isLoggedOut, setIsLoggedOut] = useState(false);

  const fetchDemoUsers = async () => {
    try {
      const res = await api.getDemoUsers();
      if (res.success) {
        setDemoUsers(res.demo_users);
      }
    } catch (e) {
      console.warn("Error fetching demo personas:", e);
    }
  };

  useEffect(() => {
    fetchDemoUsers();
  }, []);

  const loginWithCredentials = async (email, password) => {
    try {
      const res = await api.login(email, password);
      if (res.success) {
        setCurrentUser(res.user);
        setToken(res.token);
        setIsLoggedOut(false);
        localStorage.setItem('nyaya_token', res.token);
        localStorage.setItem('nyaya_user', JSON.stringify(res.user));
        return { success: true, user: res.user };
      }
      return res;
    } catch (e) {
      return { success: false, error: e.message || "Login failed" };
    }
  };

  const registerUser = async (formData) => {
    try {
      const res = await api.register(formData);
      if (res.success) {
        setCurrentUser(res.user);
        setToken(res.token);
        setIsLoggedOut(false);
        localStorage.setItem('nyaya_token', res.token);
        localStorage.setItem('nyaya_user', JSON.stringify(res.user));
        return { success: true, user: res.user };
      }
      return res;
    } catch (e) {
      return { success: false, error: e.message || "Registration failed" };
    }
  };

  /**
   * Full Logout:
   * 1. Clears JWT token from localStorage
   * 2. Clears user state (all roles: citizen / lawyer / admin)
   * 3. Clears any sensitive cached data
   * 4. Sets isLoggedOut=true to block protected route access
   */
  const logout = () => {
    // Clear JWT and user from localStorage
    localStorage.removeItem('nyaya_token');
    localStorage.removeItem('nyaya_user');

    // Clear any case/document session data that may be cached
    sessionStorage.clear();

    // Clear auth state — protects against stale API calls
    setCurrentUser(null);
    setToken(null);
    setIsLoggedOut(true);

    // Defensive: clear any queued fetches referencing old token
    // (React state reset already handles this via component unmounting)
  };

  // 1-Click Persona Switcher for Hackathon Evaluators
  const switchPersona = async (personaKey) => {
    let email = "citizen@nyaya.ai";
    let password = "pass123";

    if (personaKey === 'citizen_ramesh') {
      email = "citizen@nyaya.ai";
    } else if (personaKey === 'citizen_sunita') {
      email = "sunita@nyaya.ai";
    } else if (personaKey === 'lawyer_priya') {
      email = "priya@nyaya.ai";
    } else if (personaKey === 'lawyer_rahul') {
      email = "rahul@nyaya.ai";
    } else if (personaKey === 'lawyer_amit') {
      email = "amit@nyaya.ai";
    } else if (personaKey === 'admin') {
      email = "admin@nyaya.ai";
      password = "admin123";
    }

    return await loginWithCredentials(email, password);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        token,
        isLoggedOut,
        demoUsers,
        showAuthModal,
        setShowAuthModal,
        authMode,
        setAuthMode,
        authRoleChoice,
        setAuthRoleChoice,
        loginWithCredentials,
        registerUser,
        logout,
        switchPersona
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
