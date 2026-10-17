import { useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export default function RoomSettingsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const room = useQuery(api.rooms.getRoom, { roomId: id });
  const user = useQuery(api.users.currentUser);
  const deleteRoom = useMutation(api.rooms.deleteRoom);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState("");

  const handleDelete = async () => {
    if (!room || isDeleting) return;
    setIsDeleting(true);
    setError("");
    try {
      await deleteRoom({ roomId: room._id });
      router.dismissAll();
      router.replace("/chat");
    } catch {
      setError("Не вдалося видалити кімнату.");
    } finally {
      setIsDeleting(false);
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
        <Text className="flex-1 text-lg font-bold text-white">
          Інформація про кімнату
        </Text>
      </View>
      {room === undefined ? (
        <ActivityIndicator className="mt-12" color="#3B82F6" />
      ) : room === null ? (
        <View className="items-center px-6 py-12">
          <Text className="text-center text-white">
            Кімнату видалено або не знайдено
          </Text>
          <TouchableOpacity
            accessibilityRole="button"
            onPress={() => router.replace("/chat")}
            className="mt-5 rounded-xl bg-primary px-5 py-3"
          >
            <Text className="text-white">До списку кімнат</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView contentContainerStyle={{ padding: 24 }}>
          <View className="rounded-2xl border border-surfaceLight bg-secondary p-5">
            <Text className="text-sm text-textMuted">Назва</Text>
            <Text className="mt-2 text-xl font-bold text-white">
              {room.title}
            </Text>
            {room.description ? (
              <>
                <Text className="mt-5 text-sm text-textMuted">Опис</Text>
                <Text className="mt-2 text-base text-white">
                  {room.description}
                </Text>
              </>
            ) : null}
            <Text className="mt-5 text-sm text-textMuted">
              {room.creatorId === user?._id
                ? "Ви автор цієї кімнати"
                : "Видалити кімнату може тільки її автор"}
            </Text>
          </View>
          {room.creatorId === user?._id ? (
            confirmDelete ? (
              <View className="mt-6 rounded-2xl border border-red-400/40 p-5">
                <Text className="text-base text-white">
                  Видалити кімнату та всі її повідомлення?
                </Text>
                <TouchableOpacity
                  accessibilityRole="button"
                  onPress={handleDelete}
                  disabled={isDeleting}
                  className="mt-4 rounded-xl bg-danger p-4"
                >
                  {isDeleting ? (
                    <ActivityIndicator color="#FFFFFF" />
                  ) : (
                    <Text className="text-center font-bold text-white">
                      Так, видалити
                    </Text>
                  )}
                </TouchableOpacity>
                <TouchableOpacity
                  accessibilityRole="button"
                  disabled={isDeleting}
                  onPress={() => setConfirmDelete(false)}
                  className="mt-2 p-3"
                >
                  <Text className="text-center text-textMuted">Скасувати</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                accessibilityRole="button"
                onPress={() => setConfirmDelete(true)}
                className="mt-6 rounded-2xl border border-red-400/40 bg-red-500/10 p-4"
              >
                <Text className="text-center font-bold text-red-400">
                  Видалити кімнату
                </Text>
              </TouchableOpacity>
            )
          ) : null}
          {error ? (
            <Text accessibilityRole="alert" className="mt-4 text-red-400">
              {error}
            </Text>
          ) : null}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
