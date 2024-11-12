import { Button } from "@stable/ui/button";

import { signOut } from "~/lib/actions/auth";

export const SignOutButton = () => {
  return (
    <form action={signOut}>
      <Button size="lg">Sign out</Button>
    </form>
  );
};
