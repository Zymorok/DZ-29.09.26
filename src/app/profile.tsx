import { useState } from "react";
import {
  ActivityIndicator,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "convex/react";
import { useAuthActions } from "@convex-dev/auth/react";
import { useRouter } from "expo-router";
import { api } from "@/convex/_generated/api";

export default function ProfileScreen() {
  const router = useRouter();
  const user = useQuery(api.users.currentUser);
  const { signOut } = useAuthActions();
  const [confirmSignOut, setConfirmSignOut] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignOut = async () => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      await signOut();
      router.replace("/sign-in");
    } catch {
      setError("Не вдалося вийти з акаунта.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#0F172A" }}>
      <View className="flex-row items-center border-b border-surfaceLight px-5 py-4">
        <TouchableOpacity
          accessibilityRole="button"
          onPress={() => router.back()}
          className="py-2 pr-4"
        >
          <Text className="text-blue-300">Назад</Text>
        </TouchableOpacity>
        <Text className="text-lg font-bold text-white">Профіль</Text>
      </View>
      {user === undefined ? (
        <ActivityIndicator className="mt-12" color="#3B82F6" />
      ) : (
        <View className="items-center p-6">
          <View className="mt-6 h-24 w-24 items-center justify-center overflow-hidden rounded-full border-2 border-primary bg-secondary">
            {user?.image ? (
              <Image source={{ uri: user.image }} className="h-24 w-24" />
            ) : (
              <Ionicons name="person-outline" size={44} color="#93C5FD" />
            )}
          </View>
          <Text className="mt-5 text-2xl font-bold text-white">
            {user?.name || "Гравець"}
          </Text>
          <Text className="mt-2 text-sm text-textMuted">{user?.email}</Text>
          {confirmSignOut ? (
            <View className="mt-10 w-full rounded-2xl border border-surfaceLight p-5">
              <Text className="text-center text-white">Вийти з акаунта?</Text>
              <TouchableOpacity
                accessibilityRole="button"
                onPress={handleSignOut}
                disabled={isLoading}
                className="mt-4 rounded-xl bg-danger p-4"
              >
                {isLoading ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text className="text-center font-bold text-white">
                    Так, вийти
                  </Text>
                )}
              </TouchableOpacity>
              <TouchableOpacity
                accessibilityRole="button"
                disabled={isLoading}
                onPress={() => setConfirmSignOut(false)}
                className="mt-2 p-3"
              >
                <Text className="text-center text-textMuted">Скасувати</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              accessibilityRole="button"
              onPress={() => setConfirmSignOut(true)}
              className="mt-10 w-full rounded-2xl border border-red-400/40 bg-red-500/10 p-4"
            >
              <Text className="text-center font-bold text-red-400">
                Вийти з акаунта
              </Text>
            </TouchableOpacity>
          )}
          {error ? (
            <Text accessibilityRole="alert" className="mt-4 text-red-400">
              {error}
            </Text>
          ) : null}
        </View>
      )}
    </SafeAreaView>
  );
}
