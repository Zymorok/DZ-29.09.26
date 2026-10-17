import { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useMutation } from "convex/react";
import { useRouter } from "expo-router";
import { api } from "@/convex/_generated/api";

export default function NewRoomScreen() {
  const router = useRouter();
  const createRoom = useMutation(api.rooms.createRoom);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCreate = async () => {
    if (!title.trim() || isLoading) return;
    setIsLoading(true);
    setError("");
    try {
      const roomId = await createRoom({
        title: title.trim(),
        description: description.trim() || undefined,
      });
      router.replace({ pathname: "/chat/[id]", params: { id: roomId } });
    } catch {
      setError("Не вдалося створити кімнату. Спробуйте ще раз.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#0F172A" }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <View className="flex-row items-center justify-between border-b border-surfaceLight px-5 py-4">
          <TouchableOpacity
            accessibilityRole="button"
            onPress={() => router.back()}
            className="py-2 pr-3"
          >
            <Text className="text-blue-300">Скасувати</Text>
          </TouchableOpacity>
          <Text className="text-lg font-bold text-white">Нова кімната</Text>
          <TouchableOpacity
            accessibilityRole="button"
            onPress={handleCreate}
            disabled={isLoading || !title.trim()}
            className={`rounded-xl bg-primary px-3 py-2 ${isLoading || !title.trim() ? "opacity-50" : ""}`}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text className="font-bold text-white">Створити</Text>
            )}
          </TouchableOpacity>
        </View>
        <ScrollView
          contentContainerStyle={{ padding: 24 }}
          keyboardShouldPersistTaps="handled"
        >
          <Text className="mb-2 text-sm text-textMuted">Назва кімнати *</Text>
          <TextInput
            accessibilityLabel="Назва кімнати"
            placeholder="Наприклад: Спілкування гравців"
            placeholderTextColor="#94A3B8"
            value={title}
            onChangeText={setTitle}
            maxLength={100}
            editable={!isLoading}
            className="rounded-2xl border border-surfaceLight bg-secondary px-4 py-4 text-base text-white"
          />
          <Text className="mb-2 mt-6 text-sm text-textMuted">
            Опис (необов'язково)
          </Text>
          <TextInput
            accessibilityLabel="Опис кімнати"
            placeholder="Про що будемо спілкуватися?"
            placeholderTextColor="#94A3B8"
            value={description}
            onChangeText={setDescription}
            maxLength={300}
            multiline
            textAlignVertical="top"
            editable={!isLoading}
            className="min-h-[120px] rounded-2xl border border-surfaceLight bg-secondary px-4 py-4 text-base text-white"
          />
          <Text className="mt-4 text-sm text-textMuted">
            Кімнату бачитимуть усі авторизовані гравці.
          </Text>
          {error ? (
            <Text accessibilityRole="alert" className="mt-4 text-red-400">
              {error}
            </Text>
          ) : null}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
