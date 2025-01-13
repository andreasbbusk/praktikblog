import React from "react";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const SignInForm: React.FC = () => {
  const handleSignIn = async (event: React.FormEvent) => {
    event.preventDefault();
    const password = (event.target as HTMLFormElement).password.value;
    await signIn("credentials", { password });
  };

  return (
    <form onSubmit={handleSignIn} className="space-y-4">
      <div className="grid gap-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          required
          className="col-span-3"
        />
      </div>
      <Button type="submit" className="w-full">
        Log ind
      </Button>
    </form>
  );
};

export default SignInForm;
