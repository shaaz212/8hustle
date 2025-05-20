import { createContext, useContext, useState, useMemo } from "react";
import type { ReactNode } from "react";
import { ThemeProvider as MuiThemeProvider, createTheme } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";

type ThemeMode = "light" | "dark";
type ColorPreset = "default" | "blue" | "green" | "purple" | "custom";

interface ThemeContextType {
  mode: ThemeMode;
  colorPreset: ColorPreset;
  toggleMode: () => void;
  setColorPreset: (preset: ColorPreset) => void;
  setCustomColor: (color: string) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const colorPresets = {
  default: "#1976d2",
  blue: "#2196f3",
  green: "#4caf50",
  purple: "#9c27b0",
  custom: "#1976d2",
};

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<ThemeMode>("light");
  const [colorPreset, setColorPreset] = useState<ColorPreset>("default");
  const [customColor, setCustomColor] = useState("#1976d2");

  const theme = useMemo(() => {
    const primaryColor =
      colorPreset === "custom" ? customColor : colorPresets[colorPreset];

    return createTheme({
      palette: {
        mode,
        primary: {
          main: primaryColor,
          light: primaryColor + "33",
          dark: primaryColor + "99",
        },
        secondary: {
          main: "#dc004e",
          light: "#dc004e33",
          dark: "#dc004e99",
        },
        background: {
          default: mode === "light" ? "#f5f5f5" : "#121212",
          paper: mode === "light" ? "#ffffff" : "#1e1e1e",
        },
      },
      components: {
        MuiButton: {
          styleOverrides: {
            root: {
              textTransform: "none",
            },
            contained: {
              boxShadow: "none",
              "&:hover": {
                boxShadow: "none",
              },
            },
          },
        },
        MuiCard: {
          styleOverrides: {
            root: {
              backgroundImage: "none",
              borderRadius: 12,
              boxShadow:
                mode === "light"
                  ? "0 0 2px 0 rgba(145, 158, 171, 0.2), 0 12px 24px -4px rgba(145, 158, 171, 0.12)"
                  : "0 0 2px 0 rgba(145, 158, 171, 0.2), 0 12px 24px -4px rgba(0, 0, 0, 0.4)",
            },
          },
        },
        MuiAppBar: {
          styleOverrides: {
            root: {
              backgroundColor: mode === "light" ? "#ffffff" : "#1e1e1e",
              color: mode === "light" ? "#212B36" : "#ffffff",
            },
          },
        },
      },
    });
  }, [mode, colorPreset, customColor]);

  const toggleMode = () => {
    setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
  };

  const value = {
    mode,
    colorPreset,
    toggleMode,
    setColorPreset,
    setCustomColor,
  };

  return (
    <ThemeContext.Provider value={value}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
