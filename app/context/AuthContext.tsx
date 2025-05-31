'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  register: (username: string, email: string, password: string) => Promise<boolean>;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
}

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Actual react component
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setAuthenticated] = useState(false);

  const BASE_API_ENDPOINT: string = process.env.NEXT_PUBLIC_API_URL as string;

  // Initialize auth state on mount
  useEffect(() => {
    const checkLoginStatus = async () => {
      const fetchedUser: User | null = await retrieveUser();
      setUser(fetchedUser);
    };

    checkLoginStatus();
  }, []);

  useEffect(() => {
    // weird javascript shenanigan:
    // (!user) "converts" the user to a boolean and inverts it (!)
    // and by adding another ! we invert the boolean again.
    // If the user is null, this will return false.
    setAuthenticated(!!user);
  }, [user]);

  // Get account info request
  const retrieveUser = async (): Promise<User | null> => {
    setIsLoading(true);

    return fetch(BASE_API_ENDPOINT + "account", {
      credentials: "include"
    }).then(async (response) => {
      if (response.ok) {
        const user: User = await response.json();
        return user;
      } else {
        return null;
      }
    }).finally(() => {
      setIsLoading(false);
    })
  };

  // Login logic
  const login = async (email: string, password: string): Promise<boolean> => {
    return fetch(BASE_API_ENDPOINT + "auth/login", {
      method: "POST",
      body: JSON.stringify({
        email: email,
        password: password
      }),
      credentials: "include"
    }).then(async (response) => {
      if (response.ok) {
        const fetchedUser: User | null = await retrieveUser();
        setUser(fetchedUser);
        return true;
      } else {
        setUser(null);
        return false;
      }
    });
  };

  // Register logic
  const register = (username: string, email: string, password: string): Promise<boolean> => {
    return fetch(BASE_API_ENDPOINT + "auth/register", {
      method: "POST",
      body: JSON.stringify({
        username: username,
        email: email,
        password: password
      }),
      credentials: "include"
    }).then(async (response) => {
      const success: boolean = response.ok;
      if (success) {
        const fetchedUser: User | null = await retrieveUser();
        setUser(fetchedUser);
      }
      return success;
    });
  }

  // Logout logic
  const logout = async (): Promise<void> => {
    setIsLoading(true);

    fetch(BASE_API_ENDPOINT + "auth/logout", {
      method: "POST",
      credentials: "include"
    }).then(response => {
      setUser(null);
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