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

import type { SignUpFormProps } from "~/components/auth/signup-form";
import { SignUpForm } from "~/components/auth/signup-form";

export default function SignUpScreen() {
  const { isLoading: isLoadingSession } = useSessionContext();
  const supabase = useSupabaseClient();
  const [isLoading, setIsLoading] = useState(false);
  const [pendingVerification, setPendingVerification] = useState(false);

  const onSubmit: SignUpFormProps["onSubmit"] = async (data) => {
    if (!isLoaded) {
      return;
    }

    setIsLoading(true);
    try {
      await signUp.create({
        emailAddress: data.email,
        password: data.password,
      });

      console.log("signup create done");

      // Send the email for verification
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });

      console.log("signup email sent");

      // change the UI to our pending section
      setPendingVerification(true);
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
            className="flex-1 bg-secondary p-4 py-8"
          >
            <SignUpForm />
          </ScrollView>
        </TouchableWithoutFeedback>
      </AvoidSoftInputView>
    </SafeAreaView>
  );
}
