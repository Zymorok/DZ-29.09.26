import {
  ActivityIndicator,
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useQuery } from "convex/react";
import { useRouter } from "expo-router";
import { api } from "@/convex/_generated/api";

export default function RoomsScreen() {
  const router = useRouter();
  const rooms = useQuery(api.rooms.listRooms);

  return (
    <SafeAreaView
      edges={["top", "left", "right"]}
      style={{ flex: 1, backgroundColor: "#0F172A" }}
    >
      <View className="flex-row items-center justify-between border-b border-surfaceLight px-5 py-4">
        <View>
          <Text className="text-2xl font-bold text-white">Modern Chat</Text>
          <Text className="mt-1 text-sm text-textMuted">
            Спілкуйтеся між партіями
          </Text>
        </View>
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel="Профіль"
          onPress={() => router.push("/profile")}
          className="h-11 w-11 items-center justify-center rounded-full bg-secondary"
        >
          <Ionicons name="person-outline" size={22} color="#93C5FD" />
        </TouchableOpacity>
      </View>
      <View className="flex-row items-center justify-between px-5 py-4">
        <Text className="text-lg font-bold text-white">Чат-кімнати</Text>
        <TouchableOpacity
          accessibilityRole="button"
          onPress={() => router.push("/new-room")}
          className="rounded-xl bg-primary px-4 py-3"
        >
          <Text className="font-bold text-white">Нова кімната</Text>
        </TouchableOpacity>
      </View>
      {rooms === undefined ? (
        <ActivityIndicator className="mt-12" size="large" color="#3B82F6" />
      ) : (
        <FlatList
          data={rooms}
          keyExtractor={(item) => item._id}
          contentContainerStyle={{
            padding: 20,
            paddingTop: 0,
            gap: 12,
            flexGrow: 1,
          }}
          ListEmptyComponent={
            <View className="flex-1 items-center justify-center py-12">
              <Ionicons name="chatbubbles-outline" size={48} color="#94A3B8" />
              <Text className="mt-4 text-lg font-bold text-white">
                Немає активних кімнат
              </Text>
              <Text className="mt-2 text-center text-textMuted">
                Створіть першу кімнату та запросіть друзів
              </Text>
            </View>
          }
          renderItem={({ item }) => (
            <TouchableOpacity
              accessibilityRole="button"
              accessibilityLabel={item.title}
              onPress={() =>
                router.push({
                  pathname: "/chat/[id]",
                  params: { id: item._id },
                })
              }
              className="rounded-2xl border border-surfaceLight bg-secondary p-4"
            >
              <View className="flex-row items-center justify-between">
                <Text
                  className="mr-3 flex-1 text-lg font-bold text-white"
                  numberOfLines={1}
                >
                  {item.title}
                </Text>
                <Ionicons name="chevron-forward" size={20} color="#94A3B8" />
              </View>
              {item.description ? (
                <Text className="mt-1 text-sm text-textMuted" numberOfLines={2}>
                  {item.description}
                </Text>
              ) : null}
              <Text className="mt-3 text-sm text-blue-300" numberOfLines={1}>
                {item.lastMessage || "Повідомлень ще немає"}
              </Text>
              <Text className="mt-2 text-xs text-textMuted">
                {new Date(
                  item.lastMessageAt ?? item._creationTime,
                ).toLocaleTimeString("uk-UA", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </Text>
            </TouchableOpacity>
          )}
        />
      )}
    </SafeAreaView>
  );
}
