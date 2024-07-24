import type { BottomSheetBackgroundProps } from "@gorhom/bottom-sheet";
import React, { useMemo, useRef } from "react";
import Animated, {
  interpolateColor,
  useAnimatedStyle,
} from "react-native-reanimated";
import { Link } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";

import { ContinueWithOAuth } from "~/components/auth/continue-with-oauth";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";

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

  return (
    <BottomSheet
      ref={bottomSheetRef}
      snapPoints={snapPoints}
      backgroundComponent={CustomBackground}
    >
      <BottomSheetView className="flex-1 gap-4 p-4">
        <ContinueWithOAuth provider="apple" />
        <ContinueWithOAuth provider="google" />
        <Link href={{ pathname: "/signup" }} asChild>
          <Button
            size="lg"
            className="flex-row items-center gap-2 rounded-xl bg-zinc-600"
          >
            <Ionicons name="mail" size={20} color="#fff" />
            <Text className="font-semibold text-white">Sign up with email</Text>
          </Button>
        </Link>
        <Link href={{ pathname: "/signin" }} asChild>
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
