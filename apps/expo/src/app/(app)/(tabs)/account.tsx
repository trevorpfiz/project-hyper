import { View } from "react-native";
import { useRouter } from "expo-router";
import {
  useSessionContext,
  useSupabaseClient,
  useUser,
} from "@supabase/auth-helpers-react";

import { ThemeToggle } from "~/components/theme-toggle";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";

export default function AccountScreen() {
  const router = useRouter();

  const user = useUser();

  const SignOut = () => {
    const { isLoading } = useSessionContext();
    const supabase = useSupabaseClient();

    if (isLoading) {
      return null;
    }
    return (
      <View className="flex-row items-center justify-between gap-2 p-4">
        <Button
          onPress={async () => {
            await supabase.auth.signOut();
          }}
        >
          <Text>Sign Out</Text>
        </Button>
        <Button
          onPress={() => {
            router.replace("/(home)");
          }}
        >
          <Text>root</Text>
        </Button>
        <ThemeToggle />
      </View>
    );
  };

  return (
    <View>
      <Text>Account Screen</Text>
      {user?.id && <SignOut />}
    </View>
  );
}
