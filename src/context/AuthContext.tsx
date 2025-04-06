import React, { createContext, useContext, useState, useEffect } from "react";
import { User } from "../models/User";
import { UserRepository } from "../repositories/UserRepository";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (
    username: string,
    email: string,
    password: string
  ) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const userRepository = new UserRepository();

  useEffect(() => {
    // Check for stored user on mount
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        localStorage.removeItem("user");
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setError(null);
      // In a real app, you'd make an API call here
      const user = userRepository.findByEmail(email);

      if (user && user.password === password) {
        // In real apps, use proper password comparison
        setUser(user);
        localStorage.setItem("user", JSON.stringify(user));
        return true;
      }

      setError("Invalid email or password");
      return false;
    } catch (error) {
      setError("Login failed. Please try again.");
      return false;
    }
  };

  const register = async (
    username: string,
    email: string,
    password: string
  ): Promise<boolean> => {
    try {
      setError(null);
      // Check if user already exists
      const existingUser = userRepository.findByEmail(email);
      if (existingUser) {
        setError("Email already in use");
        return false;
      }

      // Create new user
      const newUser = userRepository.create({
        username,
        email,
        password, // In real apps, hash the password
        role: "customer",
      });

      setUser(newUser);
      localStorage.setItem("user", JSON.stringify(newUser));
      return true;
    } catch (error) {
      setError("Registration failed. Please try again.");
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        register,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
