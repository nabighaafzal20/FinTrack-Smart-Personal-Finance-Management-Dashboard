import { createContext, useState, useEffect, useCallback } from "react";
import { KEYS, getItem, setItem } from "../services/storageService";

export const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => getItem(KEYS.THEME, "light"));

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    setItem(KEYS.THEME, theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
