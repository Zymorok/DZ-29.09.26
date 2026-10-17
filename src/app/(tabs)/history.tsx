import { useTheme, ThemeColors } from "@/context/ThemeContext";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useMutation, useQuery } from "convex/react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  TouchableOpacity,
  View,
  Text,
} from "react-native";
import { HistoryItem } from "@/components/HistoryItem";
import { SafeAreaView } from "react-native-safe-area-context";
import { createStyles } from "@/styles/historyStyles";

export default function HistoryScreen() {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  const history = useQuery(api.gameHistory.getHistory);
  const deleteHistory = useMutation(api.gameHistory.deleteHistory);
  const clearAllHistory = useMutation(api.gameHistory.clearAllHistory);

  const handleDeleteItem = (id: Id<"gameHistory">) => {
    Alert.alert("Видалити гру:", "Ви впевнені, що хочете видалити цей запис?", [
      { text: "Скасувати", style: "cancel" },
      {
        text: "Видалити",
        style: "destructive",
        onPress: () => deleteHistory({ id }),
      },
    ]);
  };

  const handleClearAll = () => {
    if (!history || history.length === 0) return;

    Alert.alert(
      "Очищення історії:",
      "Ви впевнені, що хочете очистити всю історію зіграних партій?",
      [
        { text: "Скасувати", style: "cancel" },
        {
          text: "Очистити все",
          style: "destructive",
          onPress: () => clearAllHistory(),
        },
      ],
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Заголовок */}
      <View style={styles.header}>
        <Text style={styles.title}>Історія ігор</Text>
        {history && history.length > 0 && (
          <TouchableOpacity
            style={styles.clearBtn}
            onPress={handleClearAll}
            activeOpacity={0.7}
          >
            <MaterialIcons
              name="delete-sweep"
              size={20}
              color={colors.danger}
            />
            <Text style={styles.clearBtnText}>Очистити</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Стан завантаження */}
      {history === undefined ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : history.length === 0 ? (
        /* Стан порожнього списку */
        <View style={styles.centerContainer}>
          <MaterialIcons
            name="history-toggle-off"
            size={64}
            color={colors.textMuted}
          />
          <Text style={styles.emptyTitle}>
            Історія порожня
          </Text>
          <Text style={styles.emptySubtitle}>
            Зіграйте свою першу партію, щоб зберегти її тут!
          </Text>
        </View>
      ) : (
        /* Список партій */
        <FlatList
          data={history}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => <HistoryItem item={item} handleDeleteItem={handleDeleteItem} />}
        />
      )}
    </SafeAreaView>
  );
}