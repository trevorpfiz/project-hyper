import type { BottomSheetBackgroundProps } from "@gorhom/bottom-sheet";
import React, { useMemo, useRef } from "react";
import { Alert } from "react-native";
import Animated, {
  interpolateColor,
  useAnimatedStyle,
} from "react-native-reanimated";
import * as AppleAuthentication from "expo-apple-authentication";
import { Link } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { useSupabaseClient } from "@supabase/auth-helpers-react";

import { GoogleNative } from "~/components/auth/google-native";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { initiateAppleSignIn } from "~/utils/auth";

const CustomBackground: React.FC<BottomSheetBackgroundProps> = ({
  style,
  animatedIndex,
}) => {
  //#region styles
  const containerAnimatedStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      animatedIndex.value,
      [0, 1],
      ["#000", "#000"],
    ),
    borderRadius: 20,
  }));
  const containerStyle = useMemo(
    () => [style, containerAnimatedStyle],
    [style, containerAnimatedStyle],
  );
  //#endregion

  // render
  return <Animated.View pointerEvents="none" style={containerStyle} />;
};

const LoginBottomSheet = () => {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ["36%"], []);
  const supabase = useSupabaseClient();

  const signInWithApple = async () => {
    try {
      const { token, nonce } = await initiateAppleSignIn();
      const { error } = await supabase.auth.signInWithIdToken({
        provider: "apple",
        token,
        nonce,
      });
      if (error) return Alert.alert("Error", error.message);
    } catch (e) {
      if (typeof e === "object" && !!e && "code" in e) {
        if (e.code === "ERR_REQUEST_CANCELED") {
          // handle that the user canceled the sign-in flow
        } else {
          // handle other errors
        }
      } else {
        console.error("Unexpected error from Apple SignIn: ", e);
      }
    }
  };

  return (
    <BottomSheet
      ref={bottomSheetRef}
      snapPoints={snapPoints}
      backgroundComponent={CustomBackground}
    >
      <BottomSheetView className="flex-1 gap-4 p-4">
        {/* Apple Button */}
        <AppleAuthentication.AppleAuthenticationButton
          buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
          buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.WHITE}
          cornerRadius={12}
          onPress={signInWithApple}
          style={{ height: 48 }}
        />
        {/* Google Button */}
        <GoogleNative />
        {/* Email Sign Up Button */}
        <Link href={{ pathname: "/(auth)/signup" }} asChild>
          <Button
            size="lg"
            className="flex-row items-center gap-2 rounded-xl bg-zinc-600"
          >
            <Ionicons name="mail" size={20} color="#fff" />
            <Text className="font-semibold text-white">Sign up with email</Text>
          </Button>
        </Link>
        {/* Email Log In Button */}
        <Link href={{ pathname: "/(auth)/signin" }} asChild>
          <Button
            variant="outline"
            size="lg"
            className="flex-row items-center gap-2 rounded-xl border-zinc-600 bg-black active:bg-white"
            textClassName="group-active:text-black"
          >
            <Text className="font-semibold text-white">Log in</Text>
          </Button>
        </Link>
      </BottomSheetView>
    </BottomSheet>
  );
};

export default LoginBottomSheet;
