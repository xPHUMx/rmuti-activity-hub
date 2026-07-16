import { useEffect, useState } from "react";

// Global listeners registry to synchronize theme state across hook instances
const listeners = new Set<(theme: "light" | "dark") => void>();
let globalTheme: "light" | "dark" = "dark";

// Helper to update the global theme and notify listeners
const setGlobalTheme = (nextTheme: "light" | "dark") => {
  globalTheme = nextTheme;
  localStorage.setItem("theme", nextTheme);
  if (nextTheme === "dark") {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
  listeners.forEach((listener) => listener(nextTheme));
};

export function useTheme() {
  const [theme, setTheme] = useState<"light" | "dark">("dark");

  useEffect(() => {
    // Sync initial state on mount
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
    if (savedTheme) {
      globalTheme = savedTheme;
    }
    setTheme(globalTheme);

    // Listen to changes from other hook instances
    const handleChange = (newTheme: "light" | "dark") => {
      setTheme(newTheme);
    };
    listeners.add(handleChange);

    return () => {
      listeners.delete(handleChange);
    };
  }, []);

  const toggleTheme = () => {
    const nextTheme = globalTheme === "dark" ? "light" : "dark";
    setGlobalTheme(nextTheme);
  };

  return { theme, toggleTheme };
}
