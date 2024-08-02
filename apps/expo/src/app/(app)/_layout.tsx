import { TouchableOpacity } from "react-native";
import { Stack } from "expo-router";
import {
  useSessionContext,
  useSupabaseClient,
} from "@supabase/auth-helpers-react";

import { ThemeToggle } from "~/components/theme-toggle";
import { LogOut } from "~/lib/icons/log-out";

const Layout = () => {
  return (
    <Stack>
      <Stack.Screen
        name="sandbox"
        options={{
          title: "Sandbox",
          headerLeft: () => <SignOut />,
          headerRight: () => <ThemeToggle />,
        }}
      />
    </Stack>
  );
};

const SignOut = () => {
  const { isLoading } = useSessionContext();
  const supabase = useSupabaseClient();

  if (isLoading) {
    return null;
  }
  return (
    <TouchableOpacity
      onPress={async () => {
        await supabase.auth.signOut();
      }}
    >
      <LogOut size={23} strokeWidth={1.5} className="text-foreground" />
    </TouchableOpacity>
  );
};

export default Layout;
