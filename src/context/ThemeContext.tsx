import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Палітра кольорів для гри
export interface ThemeColors {
  bg: string;              // Головний фон екрану
  surface: string;         // Фон карток, клітинок, панелей
  surfaceHighlight: string;// Фон при натисканні / активний елемент
  text: string;            // Основний текст
  textMuted: string;       // Другорядний текст (сірий)
  border: string;          // Межі та розділювачі
  primary: string;         // Акцентний колір (кнопки, активні таби)
  xMark: string;           // Колір хрестика X
  oMark: string;           // Колір нулика O
  winnerBg: string;        // Фон клітинок переможця
  winnerBorder: string;    // Межа клітинок переможця
  draw: string;            // Колір для нічиєї
  danger: string;          // Колір для кнопки скидання
  dangerDisabled: string;  // Колір неактивної кнопки скидання
  cardShadow: string;      // Колір тіні
  statusBarStyle: "light" | "dark";
}

// Світла тема
export const lightColors: ThemeColors = {
  bg: "#F0F2F5",
  surface: "#FFFFFF",
  surfaceHighlight: "#E2E8F0",
  text: "#1F2937",
  textMuted: "#6B7280",
  border: "#E5E7EB",
  primary: "#007BFF",
  xMark: "#E74C3C",
  oMark: "#007BFF",
  winnerBg: "#2ECC71",
  winnerBorder: "#27AE60",
  draw: "#F59E0B",
  danger: "#DC2626",
  dangerDisabled: "#9CA3AF",
  cardShadow: "#000000",
  statusBarStyle: "dark",
};

// Темна тема
export const darkColors: ThemeColors = {
  bg: "#0F172A", // Глибокий темно-синій
  surface: "#1E293B", // Темний Slate
  surfaceHighlight: "#334155",
  text: "#F8FAFC", // Майже білий
  textMuted: "#94A3B8", // Приглушений сірий
  border: "#334155",
  primary: "#3B82F6",
  xMark: "#F87171", // Яскравий червоний
  oMark: "#60A5FA", // Яскравий блакитний
  winnerBg: "#059669", // Смарагдовий
  winnerBorder: "#10B981",
  draw: "#F59E0B",
  danger: "#DC2626",
  dangerDisabled: "#475569",
  cardShadow: "#000000",
  statusBarStyle: "light",
};

interface ThemeContextType {
  isDarkMode: boolean;
  colors: ThemeColors;
  toggleTheme: () => Promise<void>;
}

const THEME_STORAGE_KEY = "@tictactoe_theme_mode";

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  // Зчитуємо збережену тему при завантаженні
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        if (savedTheme !== null) {
          setIsDarkMode(JSON.parse(savedTheme));
        }
      } catch (error) {
        console.error("Помилка завантаження теми з AsyncStorage:", error);
      }
    };
    loadTheme();
  }, []);

  // Перемикання теми зі збереженням
  const toggleTheme = async () => {
    try {
      const nextMode = !isDarkMode;
      setIsDarkMode(nextMode);
      await AsyncStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(nextMode));
    } catch (error) {
      console.error("Помилка збереження теми:", error);
    }
  };

  const currentColors = isDarkMode ? darkColors : lightColors;

  return (
    <ThemeContext.Provider
      value={{
        isDarkMode,
        colors: currentColors,
        toggleTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};