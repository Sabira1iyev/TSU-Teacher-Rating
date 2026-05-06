"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface User {
  firstName: string;
  lastName: string;
  email: string;
  faculty: string;
  studyYear: string;
  userId: number;
}

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
}

const UserContext = createContext<UserContextType | null>(null);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("teacherrating_user");
    if (storedUser) {
      try {
        setUserState(JSON.parse(storedUser));
      } catch (e) {
        console.error("Failed to parse user from localStorage");
      }
    }
  }, []);

  const setUser = (newUser: User | null) => {
    setUserState(newUser);
    if (newUser) {
      localStorage.setItem("teacherrating_user", JSON.stringify(newUser));
    } else {
      localStorage.removeItem("teacherrating_user");
    }
  };

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
