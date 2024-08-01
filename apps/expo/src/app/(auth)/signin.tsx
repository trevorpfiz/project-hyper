import { useState } from "react";
import {
  Alert,
  Keyboard,
  ScrollView,
  TouchableWithoutFeedback,
} from "react-native";
import { AvoidSoftInputView } from "react-native-avoid-softinput";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  useSessionContext,
  useSupabaseClient,
} from "@supabase/auth-helpers-react";

import type { SignInFormProps } from "~/components/auth/signin-form";
import { SignInForm } from "~/components/auth/signin-form";

export default function SignInScreen() {
  const { isLoading: isLoadingSession } = useSessionContext();
  const supabase = useSupabaseClient();
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit: SignInFormProps["onSubmit"] = async (data) => {
    if (isLoadingSession) {
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (error) {
        Alert.alert("Error", error.message);
      }
    } catch (err: unknown) {
      console.error(JSON.stringify(err, null, 2));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView edges={["left", "right", "bottom"]} style={{ flex: 1 }}>
      <AvoidSoftInputView style={{ flex: 1 }}>
        <TouchableWithoutFeedback
          onPress={Keyboard.dismiss}
          style={{ flex: 1 }}
        >
          <ScrollView
            bounces={false}
            contentInsetAdjustmentBehavior="always"
            overScrollMode="always"
            showsVerticalScrollIndicator={true}
            className="flex-1 bg-secondary px-4 py-8"
          >
            <SignInForm onSubmit={onSubmit} isLoading={isLoading} />
          </ScrollView>
        </TouchableWithoutFeedback>
      </AvoidSoftInputView>
    </SafeAreaView>
  );
}
