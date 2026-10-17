import { Pressable, StyleSheet, Text } from "react-native";
import type { CellValue } from "@/types";
import {ThemeColors, useTheme} from "@/context/ThemeContext";

interface CellProps {
  value: CellValue;
  onCellClick: () => void;
  isWinner: boolean;
}

export function Cell({ value, onCellClick, isWinner }: CellProps) {

  const { colors } = useTheme()
  const styles = createStyles(colors)

  return (
    <Pressable
      onPress={onCellClick}
      style={({ pressed }) => [
        styles.cell,
        isWinner && styles.winner,
        pressed && styles.pressed,
      ]}
    >
      <Text
        style={[
          styles.cellText,
          value === "X" && styles.xMark,
          value === "O" && styles.oMark,
          isWinner && styles.winnerText,
        ]}
      >
        {value}
      </Text>
    </Pressable>
  );
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  cell: {
    width: 90,
    height: 90,
    backgroundColor: colors.surface,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: colors.cardShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  winner: {
    backgroundColor: colors.winnerBg,
    borderColor: colors.winnerBorder,
    borderWidth: 2,
  },
  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.96 }],
  },
  cellText: {
    fontSize: 40,
    fontWeight: "bold",
  },
  xMark: {
    color: colors.xMark,
  },
  oMark: {
    color: colors.oMark,
  },
  winnerText: {
    color: colors.text,
  },
});