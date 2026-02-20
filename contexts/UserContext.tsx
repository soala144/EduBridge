"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { MOCK_USERS, getCurrentUser, setCurrentUser as saveCurrentUser, type MockUser } from "@/lib/mock-users";

interface UserContextType {
  currentUser: MockUser | null;
  setUser: (user: MockUser) => void;
  switchUser: (email: string) => void;
  isLoading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUserState] = useState<MockUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load user from localStorage on mount
    const user = getCurrentUser();
    setCurrentUserState(user);
    setIsLoading(false);
  }, []);

  const setUser = (user: MockUser) => {
    saveCurrentUser(user);
    setCurrentUserState(user);
  };

  const switchUser = (email: string) => {
    const user = MOCK_USERS.find((u) => u.email === email);
    if (user) {
      saveCurrentUser(user);
      setCurrentUserState(user);
    }
  };

  return (
    <UserContext.Provider value={{ currentUser, setUser, switchUser, isLoading }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
