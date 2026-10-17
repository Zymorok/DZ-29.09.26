import { useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export default function ChatScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const room = useQuery(api.rooms.getRoom, { roomId: id });
  const messages = useQuery(api.messages.listMessages, { chatRoomId: id });
  const user = useQuery(api.users.currentUser);
  const sendMessage = useMutation(api.messages.sendMessage);
  const listRef = useRef<FlatList>(null);
  const [text, setText] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState("");

  const handleSend = async () => {
    if (!room || !text.trim() || isSending) return;
    const content = text.trim();
    setText("");
    setError("");
    setIsSending(true);
    try {
      await sendMessage({ chatRoomId: room._id, content });
    } catch {
      setText(content);
      setError("Повідомлення не надіслано. Спробуйте ще раз.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#0F172A" }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <View className="flex-row items-center border-b border-surfaceLight px-4 py-4">
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel="Назад"
            onPress={() =>
              router.canGoBack() ? router.back() : router.replace("/chat")
            }
            className="p-2"
          >
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <View className="mx-3 flex-1">
            <Text className="text-lg font-bold text-white" numberOfLines={1}>
              {room?.title ?? "Чат"}
            </Text>
            <Text className="mt-1 text-xs text-textMuted">
              Повідомлення в реальному часі
            </Text>
          </View>
          {room ? (
            <TouchableOpacity
              accessibilityRole="button"
              accessibilityLabel="Інформація про кімнату"
              onPress={() =>
                router.push({
                  pathname: "/settings/[id]",
                  params: { id: room._id },
                })
              }
              className="p-2"
            >
              <Ionicons
                name="information-circle-outline"
                size={26}
                color="#93C5FD"
              />
            </TouchableOpacity>
          ) : null}
        </View>
        {room === undefined ? (
          <ActivityIndicator className="mt-12" size="large" color="#3B82F6" />
        ) : room === null ? (
          <View className="flex-1 items-center justify-center px-6">
            <Text className="text-center text-lg font-bold text-white">
              Кімнату видалено або не знайдено
            </Text>
            <TouchableOpacity
              accessibilityRole="button"
              onPress={() => router.replace("/chat")}
              className="mt-5 rounded-xl bg-primary px-5 py-3"
            >
              <Text className="font-bold text-white">До списку кімнат</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {messages === undefined ? (
              <ActivityIndicator
                className="mt-12 flex-1"
                size="large"
                color="#3B82F6"
              />
            ) : (
              <FlatList
                ref={listRef}
                data={messages}
                keyExtractor={(item) => item._id}
                contentContainerStyle={{ padding: 16, gap: 12, flexGrow: 1 }}
                onContentSizeChange={(_, height) =>
                  listRef.current?.scrollToOffset({
                    offset: height,
                    animated: true,
                  })
                }
                keyboardShouldPersistTaps="handled"
                ListEmptyComponent={
                  <View className="flex-1 items-center justify-center py-12">
                    <Text className="text-center text-textMuted">
                      Повідомлень ще немає. Напишіть першим!
                    </Text>
                  </View>
                }
                renderItem={({ item }) => {
                  const isMe = item.senderId === user?._id;
                  return (
                    <View
                      className={`flex-row items-end gap-2 ${isMe ? "justify-end" : "justify-start"}`}
                    >
                      {!isMe ? (
                        <View className="h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-secondary">
                          {item.senderPhoto ? (
                            <Image
                              source={{ uri: item.senderPhoto }}
                              className="h-8 w-8"
                            />
                          ) : (
                            <Text className="font-bold text-blue-300">
                              {item.senderName[0]?.toUpperCase() ?? "Г"}
                            </Text>
                          )}
                        </View>
                      ) : null}
                      <View
                        className={`max-w-[78%] rounded-2xl px-4 py-3 ${isMe ? "rounded-br-none bg-primary" : "rounded-bl-none border border-surfaceLight bg-secondary"}`}
                      >
                        {!isMe ? (
                          <Text className="mb-1 text-xs font-bold text-blue-300">
                            {item.senderName}
                          </Text>
                        ) : null}
                        <Text className="text-base leading-6 text-white">
                          {item.content}
                        </Text>
                        <Text
                          className={`mt-1 text-right text-xs ${isMe ? "text-blue-100" : "text-textMuted"}`}
                        >
                          {new Date(item._creationTime).toLocaleTimeString(
                            "uk-UA",
                            { hour: "2-digit", minute: "2-digit" },
                          )}
                        </Text>
                      </View>
                    </View>
                  );
                }}
              />
            )}
            {error ? (
              <Text
                accessibilityRole="alert"
                className="px-4 pb-2 text-red-400"
              >
                {error}
              </Text>
            ) : null}
            <View className="flex-row items-end gap-3 border-t border-surfaceLight px-4 py-3">
              <TextInput
                accessibilityLabel="Повідомлення"
                placeholder="Повідомлення..."
                placeholderTextColor="#94A3B8"
                value={text}
                onChangeText={setText}
                editable={!isSending}
                maxLength={2000}
                multiline
                className="max-h-28 min-h-[48px] flex-1 rounded-2xl border border-surfaceLight bg-secondary px-4 py-3 text-base text-white"
              />
              <TouchableOpacity
                accessibilityRole="button"
                accessibilityLabel="Надіслати"
                onPress={handleSend}
                disabled={!text.trim() || isSending}
                className={`h-12 w-12 items-center justify-center rounded-2xl ${text.trim() && !isSending ? "bg-primary" : "bg-secondary"}`}
              >
                {isSending ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Ionicons
                    name="send"
                    size={22}
                    color={text.trim() ? "#FFFFFF" : "#94A3B8"}
                  />
                )}
              </TouchableOpacity>
            </View>
          </>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
