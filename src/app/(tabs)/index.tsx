import { useState, useEffect, useRef } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Cell } from "@/components/Cell";
import { Status } from "@/components/Status";
import { TitleGame } from "@/components/TitleGame";
import type { BoardState, Player } from "@/types";
import { checkWinner } from "@/utils/";
import { useMutation} from "convex/react";
import { api } from "@/convex/_generated/api";
import { createStyles } from "@/styles/gameStyles";
import {useTheme} from "@/context/ThemeContext";

export default function GameScreen() {

  const {colors} = useTheme()
  const styles = createStyles(colors)
  
  const [cells, setCells] = useState<BoardState>(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState<Player>("X");

  const recordGameResult = useMutation(api.stats.recordGameResult);
  const recordHistory = useMutation(api.gameHistory.recordHistory);

  // Прапорець, щоб зараховувати результат гри лише 1 раз за партію
  const gameRecordedRef = useRef(false);

  const winnerResult = checkWinner(cells);
  const winner = winnerResult ? winnerResult.winner : null;
  const winnerCombination = winnerResult ? winnerResult.combination : [];
  const isDraw = !winner && cells.every((cell) => cell != null);

  // Автоматичний запис результату при завершенні партії
  useEffect(() => {
    if (winner && !gameRecordedRef.current) {
      recordGameResult({ result: winner });
      recordHistory({ winner, board:cells, winnerCombination });
      gameRecordedRef.current = true;
    } else if (isDraw && !gameRecordedRef.current) {
      recordGameResult({ result: "DRAW" });
      recordHistory({ winner: "DRAW", board:cells, winnerCombination });
      gameRecordedRef.current = true;
    }
  }, [winner, isDraw, cells, winnerCombination, recordGameResult, recordHistory]);

  const handleCellClick = (index: number): void => {
    if (cells[index] || winner || isDraw) {
      return;
    }

    const newCells = [...cells];
    newCells[index] = currentPlayer;
    setCells(newCells);
    setCurrentPlayer(currentPlayer === "X" ? "O" : "X");
  };

  const handleReset = () => {
    setCells(Array(9).fill(null));
    gameRecordedRef.current = false; // Дозволяємо запис для нової партії
    if (winner) {
      setCurrentPlayer(winner === "X" ? "O" : "X");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.game}>
        <TitleGame title="Хрестики-Нулики" />
        <Status player={currentPlayer} winner={winner} isDraw={isDraw} />

        <View style={styles.board}>
          {cells.map((cell, index) => (
            <Cell
              value={cell}
              key={index}
              onCellClick={() => handleCellClick(index)}
              isWinner={winnerCombination.includes(index)}
            />
          ))}
        </View>

        <TouchableOpacity
          style={styles.resetButton}
          onPress={handleReset}
          activeOpacity={0.8}
        >
          <Text style={styles.resetText}>Нова гра</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
