'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  register: (username: string, email: string, password: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Actual react component
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // weird javascript shenanigan:
  // (!user) "converts" the user to a boolean and inverts it (!)
  // and by adding another ! we invert the boolean again.
  // If the user is null, this will return false.
  const isAuthenticated = !!user;

  // Initialize auth state on mount
  useEffect(() => {
    const checkLoginStatus = async () => {
      await retrieveUser();
    };

    checkLoginStatus();
  }, []);


  // Get account info request
  const retrieveUser = async (): Promise<void> => {
    setIsLoading(true);

    const BASE_API_ENDPOINT: string = process.env.NEXT_PUBLIC_API_URL as string;
    fetch(BASE_API_ENDPOINT + "account", {
      credentials: "include"
    }).then(async (response) => {
      if (response.ok) {
        const user: User = await response.json();
        setUser(user);
      } else {
        setUser(null);
      }
    }).finally(() => {
      setIsLoading(false);
    })
  };

  // Login logic
  const login = async (email: string, password: string): Promise<void> => {
    setIsLoading(true);

    const BASE_API_ENDPOINT: string = process.env.NEXT_PUBLIC_API_URL as string;
    fetch(BASE_API_ENDPOINT + "auth/login", {
      method: "POST",
      body: JSON.stringify({
        email: email,
        password: password
      }),
      credentials: "include"
    }).then(async (response) => {
      if (response.ok) {
        const user: User = await response.json();
        setUser(user);
      } else {
        setUser(null);
      }
    }).finally(() => {
      setIsLoading(false);
    })
  };

  // Register logic
  const register = async (username: string, email: string, password: string): Promise<void> => {
    setIsLoading(true);

    const BASE_API_ENDPOINT: string = process.env.NEXT_PUBLIC_API_URL as string;
    fetch(BASE_API_ENDPOINT + "auth/register", {
      method: "POST",
      body: JSON.stringify({
        username: username,
        email: email,
        password: password
      }),
      credentials: "include"
    }).then(async (response) => {
      if (response.ok) {
        const user: User = await response.json();
        setUser(user);
      }
    }).finally(() => {
      setIsLoading(false);
    })
  }

  // Logout logic
  const logout = async (): Promise<void> => {
    setIsLoading(true);

    const BASE_API_ENDPOINT: string = process.env.NEXT_PUBLIC_API_URL as string;
    fetch(BASE_API_ENDPOINT + "auth/logout", {
      method: "POST",
      credentials: "include"
    }).then(response => {
      if (!response.ok) {
        throw new Error("Could not logout. Are you even logged in?")
      }
    }).finally(() => {
      setIsLoading(false);
    })
  };

  // Build the object and set it as value
  const contextValue: AuthContextType = {
    user,
    isLoading,
    isAuthenticated,
    login: login,
    logout,
    register,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);

  // Should never happen
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};