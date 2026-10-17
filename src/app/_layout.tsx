import "../../global.css";
import { ThemeProvider, useTheme } from "@/context/ThemeContext";
import { ConvexAuthProvider } from "@convex-dev/auth/react";
import { Authenticated, AuthLoading, ConvexReactClient, Unauthenticated } from "convex/react";
import * as SecureStore from "expo-secure-store";
import { Stack, usePathname } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ActivityIndicator, View, Platform } from "react-native";

const convex = new ConvexReactClient(process.env.EXPO_PUBLIC_CONVEX_URL!, {
  unsavedChangesWarning: false,
});

// Адаптер SecureStore для збереження токенів сесії у React Native (Expo)
const secureStorage = {
  getItem: SecureStore.getItemAsync,
  setItem: SecureStore.setItemAsync,
  removeItem: SecureStore.deleteItemAsync,
};

function RootNavigation() {
  const { colors, isDarkMode } = useTheme();
  const pathname = usePathname();
  const isChatScreen = pathname.startsWith("/chat") || pathname.startsWith("/settings/") || pathname === "/new-room" || pathname === "/profile";

  return (
    <>
      <StatusBar style={isChatScreen || isDarkMode ? "light" : "dark"} />

      {/* 1. Стан перевірки авторизації */}
      <AuthLoading>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: colors.bg,
          }}
        >
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </AuthLoading>

      {/* 2. Неавторизований користувач -> Екрани входу та реєстрації */}
      <Unauthenticated>
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: colors.bg },
          }}
        >
          <Stack.Screen name="sign-in" />
          <Stack.Screen name="sign-up" />
          <Stack.Protected guard={false}>
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="new-room" />
            <Stack.Screen name="chat/[id]" />
            <Stack.Screen name="settings/[id]" />
            <Stack.Screen name="profile" />
          </Stack.Protected>
        </Stack>
      </Unauthenticated>

      {/* 3. Авторизований гравець -> Основний додаток з табами */}
      <Authenticated>
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: colors.bg },
          }}
        >
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="new-room" options={{ presentation: "modal" }} />
          <Stack.Screen name="chat/[id]" />
          <Stack.Screen name="settings/[id]" options={{ presentation: "modal" }} />
          <Stack.Screen name="profile" options={{ presentation: "modal" }} />
          <Stack.Protected guard={false}>
            <Stack.Screen name="sign-in" />
            <Stack.Screen name="sign-up" />
          </Stack.Protected>
        </Stack>
      </Authenticated>
    </>
  );
}

export default function RootLayout() {
  return (
    <ConvexAuthProvider client={convex} storage={
      Platform.OS === "android" || Platform.OS === "ios"
        ? secureStorage
        : undefined
    }>
      <ThemeProvider>
        <RootNavigation />
      </ThemeProvider>
    </ConvexAuthProvider>
  );
}
