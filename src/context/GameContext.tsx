import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Інтерфейс для збереження статистики
export interface GameStats {
  totalGames: number; // Загальна кількість зіграних партій
  winsX: number;      // Кількість перемог гравця X
  winsO: number;      // Кількість перемог гравця O
  draws: number;      // Кількість нічиїх
}

// Тип результату партії
export type GameResult = "X" | "O" | "DRAW";

interface GameContextType {
  stats: GameStats;
  recordGameResult: (result: GameResult) => Promise<void>;
  resetStats: () => Promise<void>;
}

// Ключ для збереження у AsyncStorage
const STORAGE_KEY = "@tictactoe_game_stats";

// Початковий стан статистики за замовчуванням
const defaultStats: GameStats = {
  totalGames: 0,
  winsX: 0,
  winsO: 0,
  draws: 0,
};

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider = ({ children }: { children: ReactNode }) => {
  const [stats, setStats] = useState<GameStats>(defaultStats);

  // 1. Зчитування збережених даних при старті додатку
  useEffect(() => {
    const loadStats = async () => {
      try {
        const savedData = await AsyncStorage.getItem(STORAGE_KEY);
        if (savedData) {
          setStats(JSON.parse(savedData));
        }
      } catch (error) {
        console.error("Помилка завантаження статистики з AsyncStorage:", error);
      }
    };

    loadStats();
  }, []);

  // 2. Функція фіксації результату завершеної партії
  const recordGameResult = async (result: GameResult) => {
    setStats((prevStats) => {
      const updatedStats: GameStats = {
        totalGames: prevStats.totalGames + 1,
        winsX: result === "X" ? prevStats.winsX + 1 : prevStats.winsX,
        winsO: result === "O" ? prevStats.winsO + 1 : prevStats.winsO,
        draws: result === "DRAW" ? prevStats.draws + 1 : prevStats.draws,
      };

      // Асинхронно записуємо оновлені дані у пам'ять
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedStats)).catch(
        (err) => console.error("Помилка збереження статистики:", err)
      );

      return updatedStats;
    });
  };

  // 3. Функція скидання всієї статистики
  const resetStats = async () => {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
      setStats(defaultStats);
    } catch (error) {
      console.error("Помилка очищення статистики:", error);
    }
  };

  return (
    <GameContext.Provider value={{ stats, recordGameResult, resetStats }}>
      {children}
    </GameContext.Provider>
  );
};

// Хук для легкого використання контексту
export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error("useGame must be used within a GameProvider");
  }
  return context;
};
