"use client";

import { useAction } from "next-safe-action/hooks";

import type { SignInSchemaType } from "@hyper/validators";
import { Button } from "@hyper/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  useForm,
} from "@hyper/ui/form";
import { Input } from "@hyper/ui/input";
import { SignInSchema } from "@hyper/validators";

import { FormError } from "~/components/auth/form-error";
import { signInWithPassword } from "~/lib/actions/auth";

export const SignInForm = () => {
  const form = useForm({
    schema: SignInSchema,
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { execute, result, status } = useAction(signInWithPassword);

  const onSubmit = (values: SignInSchemaType) => {
    execute(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email address</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    disabled={status === "executing"}
                    placeholder="Email address"
                    type="email"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    disabled={status === "executing"}
                    placeholder="Password"
                    type="password"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormError message={result.serverError} />

        <Button
          disabled={status === "executing"}
          type="submit"
          className="w-full"
        >
          Continue with Email
        </Button>
      </form>
    </Form>
  );
};
