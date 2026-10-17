import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Id } from "@/convex/_generated/dataModel";
import { MiniBoard } from "./MiniBoard";
import { TouchableOpacity, View, Text } from "react-native";
import { useTheme } from "@/context/ThemeContext";
import { createStyles } from "@/styles/historyStyles";

export interface HistoryItemProps {
  item: {
    _id: Id<"gameHistory">;
    winner: "X" | "O" | "DRAW";
    board: (string | null)[];
    winnerCombination?: number[];
    createdAt: number;
  };
  handleDeleteItem: (id: Id<"gameHistory">) => void;
}

export function HistoryItem({ item, handleDeleteItem }: HistoryItemProps) {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  const isWinnerX = item.winner === "X";
  const isWinnerO = item.winner === "O";
  const isDraw = item.winner === "DRAW";

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    const day = date.toLocaleDateString("uk-UA", {
      day: "2-digit",
      month: "short",
    });
    const time = date.toLocaleTimeString("uk-UA", {
      hour: "2-digit",
      minute: "2-digit",
    });
    return `${day}, ${time}`;
  };

  return (
    <View style={styles.card}>
      <View style={styles.cardLeft}>
        <View
          style={[
            styles.resultBadge,
            isDraw && styles.resultBadgeDraw,
            isWinnerX && styles.resultBadgeX,
            isWinnerO && styles.resultBadgeO,
          ]}
        >
          <Text
            style={[
              styles.badgeText,
              isDraw && styles.badgeTextDraw,
              isWinnerX && styles.badgeTextX,
              isWinnerO && styles.badgeTextO,
            ]}
          >
            {isDraw ? "=" : item.winner}
          </Text>
        </View>

        <View style={styles.cardInfo}>
          <Text style={styles.resultTitle}>
            {isDraw ? "Нічия" : `Перемога ${item.winner}`}
          </Text>
          <Text style={styles.resultTime}>
            {formatTime(item.createdAt)}
          </Text>
        </View>
      </View>

      {/* Права колонка: міні-дошка та кнопка видалення */}
      <View style={styles.cardRight}>
        <MiniBoard
          board={item.board}
          winningCombination={item.winnerCombination}
        />

        <TouchableOpacity
          style={styles.deleteItemBtn}
          onPress={() => handleDeleteItem(item._id)}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <MaterialIcons
            name="close"
            size={18}
            color={colors.textMuted}
          />
        </TouchableOpacity>
      </View>
    </View>
  )
}

