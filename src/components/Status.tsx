import { StyleSheet, Text, View } from "react-native";
import type { CellValue, Player } from "@/types";
import {useTheme, type ThemeColors} from "@/context/ThemeContext";

interface StatusProps {
  player: Player;
  winner: CellValue;
  isDraw: boolean;
}

export function Status({ player, winner, isDraw }: StatusProps) {

  const {colors} = useTheme()
  const styles = createStyles(colors)
  
  if (winner) {
    return (
      <View style={styles.turn}>
        <Text style={styles.turnText}>
          Гравець{" "}
          <Text style={winner === "X" ? styles.xMark : styles.oMark}>
            {winner}
          </Text>{" "}
          переміг!
        </Text>
      </View>
    );
  }

  if (isDraw) {
    return (
      <View style={styles.turn}>
        <Text style={styles.turnText}>Нічия!</Text>
      </View>
    );
  }

  return (
    <View style={styles.turn}>
      <Text style={styles.turnText}>
        Хід гравця{" "}
        <Text style={player === "X" ? styles.xMark : styles.oMark}>
          {player}
        </Text>
      </Text>
    </View>
  );
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  turn: {
    marginBottom: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: colors.surface,
    borderRadius: 30,
    shadowColor: colors.cardShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 3, // для android тіні
    alignSelf: "center",
  },
  turnText: {
    fontSize: 18,
    color: colors.text,
    fontWeight: "500",
  },
  xMark: {
    color: colors.xMark,
    fontWeight: "bold",
  },
  oMark: {
    color: colors.oMark,
    fontWeight: "bold",
  },
});