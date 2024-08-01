import { useState } from "react";
import { Keyboard, ScrollView, TouchableWithoutFeedback } from "react-native";
import { AvoidSoftInputView } from "react-native-avoid-softinput";
import { SafeAreaView } from "react-native-safe-area-context";

import type { ResetPasswordFormProps } from "~/components/auth/reset-password-form";
import { ResetPasswordForm } from "~/components/auth/reset-password-form";

export default function ResetPasswordScreen() {
  const { signIn } = useSignIn();
  const [successfulCreation, setSuccessfulCreation] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const onSubmit: ResetPasswordFormProps["onSubmit"] = async (data) => {
    setIsLoading(true);
    try {
      await signIn!.create({
        strategy: "reset_password_email_code",
        identifier: data.email,
      });
      setSuccessfulCreation(true);
      setError("");
    } catch (err: unknown) {
      setError(err.errors[0].message);
    } finally {
      setIsLoading(false);
    }
  };

  const onVerificationSuccess = () => {
    setSuccessfulCreation(false);
    // Add any additional logic needed after successful verification
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
            <ResetPasswordForm
              onSubmit={onSubmit}
              isLoading={isLoading}
              error={error}
              successfulCreation={successfulCreation}
              onVerificationSuccess={onVerificationSuccess}
            />
          </ScrollView>
        </TouchableWithoutFeedback>
      </AvoidSoftInputView>
    </SafeAreaView>
  );
}
