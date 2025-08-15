import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    // Check localStorage first, then system preference
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      return savedTheme;
    }
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  });

  useEffect(() => {
    // Update localStorage and HTML class when theme changes
    localStorage.setItem("theme", theme);

    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
      console.log("Dark theme applied");
    } else {
      root.classList.remove("dark");
      console.log("Light theme applied");
    }
  }, [theme]);

  const toggleTheme = () => {
    console.log("Toggling theme from:", theme);
    setTheme((prevTheme) => {
      const newTheme = prevTheme === "light" ? "dark" : "light";
      console.log("New theme:", newTheme);
      return newTheme;
    });
  };

  const value = {
    theme,
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};
