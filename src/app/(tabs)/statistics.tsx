import {
  Text,
  View,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useTheme } from "@/context/ThemeContext";
import { Switch } from "react-native";
import { createStyles } from "@/styles/statisticsStyles";
import { useAuthActions } from "@convex-dev/auth/react";
import { useRouter } from "expo-router";
import { Alert } from "react-native";

export default function StatisticsScreen() {

  const { isDarkMode, colors, toggleTheme } = useTheme()
  const styles = createStyles(colors);

  const { signOut } = useAuthActions();
  const router = useRouter();
  const user = useQuery(api.users.currentUser);

  const handleSignOut = () => {
    Alert.alert("Вихід з акаунта", "Ви впевнені, що хочете вийти з гри?", [
      { text: "Скасувати", style: "cancel" },
      {
        text: "Вийти",
        style: "destructive",
        onPress: async () => {
          await signOut();
          router.replace("/sign-in");
        },
      },
    ]);
  };

  const stats = useQuery(api.stats.getStats);
  const resetStats = useMutation(api.stats.resetStats);

  const handleConfirmReset = () => {
    resetStats();
  };

  const currentStats = stats ?? {
    totalGames: 0,
    winsX: 0,
    winsO: 0,
    draws: 0,
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Статистика ігор</Text>

        <View style={styles.userCard}>
          <View style={styles.userAvatar}>
            <MaterialIcons name="sports-esports" size={28} color="#FFFFFF" />
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>Вітаємо, {user?.name ?? "гравцю"}!</Text>
            <Text style={styles.userEmail}>{user?.email ?? ""}</Text>
          </View>
          <TouchableOpacity
            style={styles.signOutBtn}
            onPress={handleSignOut}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <MaterialIcons name="logout" size={22} color={colors.textMuted} />
          </TouchableOpacity>
        </View>

        {/* Блок перемикання теми */}
        <View style={styles.themeCard}>
          <View style={styles.themeInfo}>
            <MaterialIcons
              name={isDarkMode ? "dark-mode" : "light-mode"}
              size={24}
              color={isDarkMode ? "#FBBF24" : "#F59E0B"}
            />
            <Text style={styles.themeText}>
              {isDarkMode ? "Темна тема" : "Світла тема"}
            </Text>
          </View>
          <Switch
            value={isDarkMode}
            onValueChange={toggleTheme}
            trackColor={{ false: "#D1D5DB", true: colors.primary }}
            thumbColor="#FFFFFF"
          />
        </View>


        <View style={styles.grid}>
          {/* Картка 1: Загальна кількість зіграних партій */}
          <View style={[styles.card, styles.cardTotal]}>
            <MaterialIcons name="videogame-asset" size={32} color="#4b5563" />
            <Text style={styles.cardNumber}>{currentStats.totalGames}</Text>
            <Text style={styles.cardLabel}>Зіграно партій</Text>
          </View>

          {/* Картка 2: Перемоги гравця X */}
          <View style={[styles.card, styles.cardX]}>
            <Text style={styles.playerBadgeX}>X</Text>
            <Text style={styles.cardNumber}>{currentStats.winsX}</Text>
            <Text style={styles.cardLabel}>Перемог X</Text>
          </View>

          {/* Картка 3: Перемоги гравця O */}
          <View style={[styles.card, styles.cardO]}>
            <Text style={styles.playerBadgeO}>O</Text>
            <Text style={styles.cardNumber}>{currentStats.winsO}</Text>
            <Text style={styles.cardLabel}>Перемог O</Text>
          </View>

          {/* Картка 4: Нічиї */}
          <View style={[styles.card, styles.cardDraw]}>
            <MaterialIcons name="handshake" size={32} color="#f59e0b" />
            <Text style={styles.cardNumber}>{currentStats.draws}</Text>
            <Text style={styles.cardLabel}>Нічиїх</Text>
          </View>
        </View>

        {/* Кнопка скидання статистики */}
        <TouchableOpacity
          style={[
            styles.resetButton,
            currentStats.totalGames === 0 && styles.resetButtonDisabled,
          ]}
          onPress={handleConfirmReset}
          activeOpacity={0.8}
        >
          <MaterialIcons name="delete-outline" size={20} color="#ffffff" />
          <Text style={styles.resetText}>Очистити статистику</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
