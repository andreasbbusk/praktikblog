"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import SignInForm from "../auth/signin";
import { useSession, signOut } from "next-auth/react";
import AddBlogPostForm from "./AddBlogPostForm";
const LoginButton: React.FC = () => {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const [isAddBlogOpen, setAddBlogOpen] = useState(false);

  if (session) {
    return (
      <>
        <Button
          onClick={() => setAddBlogOpen(true)}
          variant="default"
          aria-label="Tilføj nyt blogindlæg"
        >
          Tilføj blogindlæg
        </Button>
        <Button
          onClick={() => signOut()}
          variant="destructive" 
          className="ml-4"
          aria-label="Log ud af admin"
        >
          Log ud
        </Button>
        <Dialog open={isAddBlogOpen} onOpenChange={setAddBlogOpen}>
          <DialogContent>
            <AddBlogPostForm onClose={() => setAddBlogOpen(false)} />
          </DialogContent>
        </Dialog>
      </>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default" aria-label="Åbn admin login">
          Admin log ind
        </Button>
      </DialogTrigger>
      <DialogContent>
        <SignInForm />
      </DialogContent>
    </Dialog>
  );
};

export default LoginButton;
