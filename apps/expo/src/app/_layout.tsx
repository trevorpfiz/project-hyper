/* eslint-disable @typescript-eslint/no-floating-promises */

import "../global.css";

import type { Theme } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { Platform, View } from "react-native";
import { useSafeAreaEnv } from "react-native-css-interop/dist/runtime/api";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import {
  initialWindowMetrics,
  SafeAreaProvider,
} from "react-native-safe-area-context";
import { SplashScreen, Stack, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ThemeProvider } from "@react-navigation/native";
import { PortalHost } from "@rn-primitives/portal";
import { SessionContextProvider } from "@supabase/auth-helpers-react";
import { DateTime } from "luxon";

// import * as SystemUI from "expo-system-ui";

import { HeaderCloseButton } from "~/components/header";
import { setAndroidNavigationBar } from "~/lib/android-navigation-bar";
import { NAV_THEME } from "~/lib/constants";
import { useColorScheme } from "~/lib/use-color-scheme";
import { useGlucoseStore } from "~/stores/glucose-store";
import { TRPCProvider } from "~/utils/api";
import { supabase } from "~/utils/supabase";

const LIGHT_THEME: Theme = {
  dark: false,
  colors: NAV_THEME.light,
};
const DARK_THEME: Theme = {
  dark: true,
  colors: NAV_THEME.dark,
};

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

// Prevent the splash screen from auto-hiding before getting the color scheme.
SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
  // Ensure any route can link back to `/`
  initialRouteName: "(home)/index",
};

const InitialLayout = () => {
  const router = useRouter();
  const segments = useSegments();
  const [isLoaded, setIsLoaded] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsSignedIn(!!session);
      setIsLoaded(true);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsSignedIn(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!isLoaded) {
      return;
    }

    const inAppGroup = segments[0] === "(app)";

    if (isSignedIn && !inAppGroup) {
      router.replace("/(tabs)");
    } else if (!isSignedIn && inAppGroup) {
      router.replace("/(home)");
    }
  }, [isLoaded, isSignedIn, segments, router]);

  if (!isLoaded) {
    return null;
  }

  return (
    <>
      <SafeAreaEnv>
        <Stack>
          <Stack.Screen
            name="(home)/index"
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="(auth)/signup"
            options={{
              presentation: "modal",
              title: "Sign Up",
              headerTitle: "",
              headerLeft: HeaderCloseButton,
            }}
          />
          <Stack.Screen
            name="(auth)/signin"
            options={{
              presentation: "modal",
              title: "Sign In",
              headerTitle: "",
              headerLeft: HeaderCloseButton,
            }}
          />
          <Stack.Screen
            name="(auth)/reset-password"
            options={{
              presentation: "modal",
              title: "Reset Password",
              headerTitle: "",
              headerLeft: HeaderCloseButton,
            }}
          />
          <Stack.Screen name="(app)" options={{ headerShown: false }} />
        </Stack>

        <PortalHost />
      </SafeAreaEnv>
    </>
  );
};

// This is the main layout of the app
// It wraps your pages with the providers they need
export default function RootLayout() {
  const { colorScheme, setColorScheme, isDarkColorScheme } = useColorScheme();
  const [isColorSchemeLoaded, setIsColorSchemeLoaded] = useState(false);
  const { setUserTimezone } = useGlucoseStore();

  useEffect(() => {
    (async () => {
      const theme = await AsyncStorage.getItem("theme");
      if (Platform.OS === "web") {
        // Adds the background color to the html element to prevent white background on overscroll.
        document.documentElement.classList.add("bg-background");
      }

      // Set user's timezone if needed (e.g. background fetch recaps)
      const detectedTimezone = DateTime.local().zoneName;
      setUserTimezone(detectedTimezone);

      if (!theme) {
        setAndroidNavigationBar(colorScheme);
        AsyncStorage.setItem("theme", colorScheme);
        setIsColorSchemeLoaded(true);
        return;
      }
      const colorTheme = theme === "dark" ? "dark" : "light";
      setAndroidNavigationBar(colorTheme);
      if (colorTheme !== colorScheme) {
        setColorScheme(colorTheme);

        setIsColorSchemeLoaded(true);
        return;
      }
      setIsColorSchemeLoaded(true);
    })().finally(() => {
      SplashScreen.hideAsync();
    });
  }, [colorScheme, setColorScheme, setUserTimezone]);

  // useEffect(() => {
  //   if (isDarkColorScheme) {
  //     SystemUI.setBackgroundColorAsync("white");
  //   } else {
  //     SystemUI.setBackgroundColorAsync("black");
  //   }
  // }, [isDarkColorScheme]);

  if (!isColorSchemeLoaded) {
    return null;
  }

  return (
    <SessionContextProvider supabaseClient={supabase}>
      <TRPCProvider>
        <ThemeProvider value={isDarkColorScheme ? DARK_THEME : LIGHT_THEME}>
          <StatusBar style={isDarkColorScheme ? "light" : "dark"} />

          <GestureHandlerRootView style={{ flex: 1 }}>
            <SafeAreaProvider initialMetrics={initialWindowMetrics}>
              <InitialLayout />
            </SafeAreaProvider>
          </GestureHandlerRootView>
        </ThemeProvider>
      </TRPCProvider>
    </SessionContextProvider>
  );
}

function SafeAreaEnv({ children }: { children: React.ReactNode }) {
  // Add the safe area insets to the render tree
  return <View style={[{ flex: 1 }, useSafeAreaEnv()]}>{children}</View>;
}
