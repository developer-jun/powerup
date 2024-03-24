"use client";

import { ReactNode, useEffect, useState, createContext, useContext } from "react";
import { User } from '@/types/userTypes';
type Theme = "light" | "dark";

interface ThemeContextProviderProps {
  children: ReactNode;
};

interface ThemeContextType {
  theme: string;
  toggleTheme: () => void;
  userInfo: User | null;
};

const ThemeContext = createContext<ThemeContextType | null>(null);

export function ThemeContextProvider({
  children,
}: ThemeContextProviderProps) {
  const [theme, setTheme] = useState("light");
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const storedUserInfo = localStorage.getItem('userInfo');
    setUserInfo(storedUserInfo? JSON.parse(storedUserInfo):null);
  }, []);
  // const userInfo = useAuthenticateUser();

  const toggleTheme = () => {
    if (theme === "light") {
      setTheme("dark");
      window.localStorage.setItem("theme", "dark");
      document.documentElement.classList.add("dark");
    } else {
      setTheme("light");
      window.localStorage.setItem("theme", "light");
      document.documentElement.classList.remove("dark");
    }
  };

  useEffect(() => {
    
    const localTheme = window.localStorage.getItem("theme");

    if (localTheme) {
      setTheme(localTheme);

      if (localTheme === "dark") {
        document.documentElement.classList.add("dark");
      }
    } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setTheme("dark");
      document.documentElement.classList.add("dark");
    }
  }, []);
  // console.log("Theme Context loaded", userInfo);
  // console.log("Theme Context loaded");
  return (
    <ThemeContext.Provider value={{
        theme,
        toggleTheme,
        userInfo
      }}>
        {children}     
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (context === null) {
    throw new Error("useTheme must be used within a ThemeContextProvider");
  }

  return context;
}