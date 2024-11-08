import type { ConfigContext, ExpoConfig } from "@expo/config";

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: "hyper",
  slug: "hyper",
  scheme: "expo",
  version: "0.1.0",
  orientation: "portrait",
  icon: "./assets/icon.png",
  userInterfaceStyle: "automatic",
  newArchEnabled: true,
  splash: {
    image: "./assets/icon.png",
    resizeMode: "contain",
    backgroundColor: "#18181A",
  },
  updates: {
    fallbackToCacheTimeout: 0,
  },
  assetBundlePatterns: ["**/*"],
  ios: {
    userInterfaceStyle: "automatic",
    bundleIdentifier: "com.projecthyper.app",
    supportsTablet: true,
    usesAppleSignIn: true,
    config: {
      usesNonExemptEncryption: false,
    },
    infoPlist: {
      UIBackgroundModes: ["fetch", "remote-notification", "processing"],
    },
  },
  android: {
    userInterfaceStyle: "automatic",
    package: "com.projecthyper.app",
    adaptiveIcon: {
      foregroundImage: "./assets/icon.png",
      backgroundColor: "#18181A",
    },
  },
  web: {
    bundler: "metro",
    output: "single",
    favicon: "./assets/icon.png",
  },
  experiments: {
    tsconfigPaths: true,
    typedRoutes: true,
  },
  extra: {
    router: {
      origin: false,
    },
    eas: {
      projectId: "914f340a-b357-48a8-8536-3c4b68dfcdad",
    },
  },
  owner: "project-hyper",
  plugins: [
    "expo-router",
    "expo-secure-store",
    "expo-apple-authentication",
    "expo-font",
    "expo-localization",
    [
      "react-native-vision-camera",
      {
        cameraPermissionText: "$(PRODUCT_NAME) needs access to your Camera.",

        // optionally, if you want to record audio:
        enableMicrophonePermission: true,
        microphonePermissionText:
          "$(PRODUCT_NAME) needs access to your Microphone.",
        enableCodeScanner: true,
      },
    ],
    [
      "@react-native-google-signin/google-signin",
      {
        iosUrlScheme:
          "com.googleusercontent.apps.871950139217-2knn7tplni9li14l489lpv9i964ujt0h",
      },
    ],
    "react-native-health",
  ],
});
