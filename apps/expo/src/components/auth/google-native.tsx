import type { NativeModuleError } from "@react-native-google-signin/google-signin";
import { View } from "react-native";
import {
  GoogleSignin,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import { useSupabaseClient } from "@supabase/auth-helpers-react";

import GoogleSvg from "~/components/svg/google-icon";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";

const GoogleNative = () => {
  const supabase = useSupabaseClient();

  GoogleSignin.configure({
    scopes: ["https://www.googleapis.com/auth/drive.readonly"],
    webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID ?? "",
    iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID ?? "",
  });

  const handleGoogleSignIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      if (userInfo.idToken) {
        const { data, error } = await supabase.auth.signInWithIdToken({
          provider: "google",
          token: userInfo.idToken,
        });
        console.log(error, data);
        // Handle successful sign-in here (e.g., navigate to a new screen)
      } else {
        throw new Error("no ID token present!");
      }
    } catch (error) {
      if (error instanceof Error) {
        if (
          (error as NativeModuleError).code === statusCodes.SIGN_IN_CANCELLED
        ) {
          // User cancelled the login flow
          console.log("Sign-in cancelled");
        } else if (
          (error as NativeModuleError).code === statusCodes.IN_PROGRESS
        ) {
          // Operation (e.g. sign in) is in progress already
          console.log("Sign-in in progress");
        } else if (
          (error as NativeModuleError).code ===
          statusCodes.PLAY_SERVICES_NOT_AVAILABLE
        ) {
          // Play services not available or outdated
          console.log("Play services not available");
        } else {
          // Some other error happened
          console.error("Error during sign-in:", error.message);
        }
      } else {
        // In case it's not an Error object
        console.error("Unknown error during sign-in:", error);
      }
    }
  };

  return (
    <View>
      <Button
        size="lg"
        className="flex-row items-center gap-2 rounded-xl bg-zinc-600"
        onPress={handleGoogleSignIn}
      >
        <GoogleSvg size={20} />
        <Text className="font-semibold text-white">Continue with Google</Text>
      </Button>
    </View>
  );
};

export { GoogleNative };
