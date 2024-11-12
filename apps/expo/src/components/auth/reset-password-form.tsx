import type { SubmitHandler } from "react-hook-form";
import { View } from "react-native";
import Animated, { FadeInDown, FadeOutUp } from "react-native-reanimated";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, FormProvider, useForm } from "react-hook-form";

import type { RequestPasswordReset } from "@stable/validators/auth";
import { RequestPasswordResetSchema } from "@stable/validators/auth";

import { ResetPasswordVerificationForm } from "~/components/auth/reset-password-verification-form";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Text } from "~/components/ui/text";
import { Loader2 } from "~/lib/icons/loader-2";
import { cn } from "~/lib/utils";

export interface ResetPasswordFormProps {
  onSubmit: SubmitHandler<RequestPasswordReset>;
  isLoading: boolean;
  error: string;
  successfulCreation: boolean;
  onVerificationSuccess: () => void;
}

const ResetPasswordForm: React.FC<ResetPasswordFormProps> = ({
  onSubmit,
  isLoading,
  error,
  successfulCreation,
  onVerificationSuccess,
}) => {
  const form = useForm<RequestPasswordReset>({
    resolver: zodResolver(RequestPasswordResetSchema),
    defaultValues: {
      email: "",
    },
  });

  return (
    <View className="flex-1 justify-center gap-8">
      <Text className="text-3xl font-bold">Reset Password</Text>

      {!successfulCreation && (
        <FormProvider {...form}>
          <View className="flex-1 flex-col gap-6">
            <Controller
              control={form.control}
              name="email"
              render={({
                field: { onChange, onBlur, value },
                fieldState: { error },
              }) => (
                <View className="flex-col gap-2">
                  <Label
                    className={cn(error && "text-destructive")}
                    nativeID="emailLabel"
                  >
                    Email address
                  </Label>
                  <Input
                    placeholder="Enter your email"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    accessibilityLabel="Email address"
                    accessibilityLabelledBy="emailLabel"
                    autoCapitalize="none"
                    className="native:h-14"
                  />
                  {error && (
                    <Animated.Text
                      entering={FadeInDown}
                      exiting={FadeOutUp.duration(275)}
                      className="px-1 text-sm text-destructive"
                      role="alert"
                    >
                      {error.message}
                    </Animated.Text>
                  )}
                </View>
              )}
            />
            <Button
              size={"lg"}
              onPress={form.handleSubmit(onSubmit)}
              disabled={isLoading}
            >
              {isLoading ? (
                <View className="flex-row items-center justify-center gap-3">
                  <Loader2
                    size={24}
                    color="white"
                    strokeWidth={3}
                    className="animate-spin"
                  />
                  <Text className="text-xl font-medium text-primary-foreground">
                    Sending...
                  </Text>
                </View>
              ) : (
                <Text className="text-xl font-medium text-primary-foreground">
                  Send Reset Email
                </Text>
              )}
            </Button>
            {error && <Text className="mt-4 text-red-500">{error}</Text>}
          </View>
        </FormProvider>
      )}

      {successfulCreation && (
        <ResetPasswordVerificationForm onSuccess={onVerificationSuccess} />
      )}
    </View>
  );
};

export { ResetPasswordForm };
