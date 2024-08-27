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
    webClientId:
      "871950139217-r0n5aqstpokp5uf213kdedheirsuhng3.apps.googleusercontent.com",
    iosClientId:
      "871950139217-2knn7tplni9li14l489lpv9i964ujt0h.apps.googleusercontent.com",
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
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // User cancelled the login flow
        console.log("Sign-in cancelled");
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // Operation (e.g. sign in) is in progress already
        console.log("Sign-in in progress");
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // Play services not available or outdated
        console.log("Play services not available");
      } else {
        // Some other error happened
        console.error("Error during sign-in:", error);
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
