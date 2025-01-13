"use client";

import React, { useState } from "react";
import BlogList from "./components/BlogList";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import SignInForm from "./auth/signin";
import AddBlogPostForm from "./components/AddBlogPostForm";

export default function Home() {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const [isAddBlogOpen, setAddBlogOpen] = useState(false);

  return (
    <div className="px-16 py-8">
      <div className="flex justify-end items-center mb-6">
        {session ? (
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
          </>
        ) : (
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
        )}
      </div>

      <h1 className="text-8xl font-bold text-center mb-8 mt-12">
        Refleksioner & udvikling
      </h1>
      <p className="text-base mb-8 text-center max-w-4xl mx-auto">
        I dette afsnit vil jeg reflektere over mine erfaringer og udvikling
        gennem praktikforløbet. Gennem både spontanlog og refleksionslog vil jeg
        beskrive de oplevelser, der har haft størst betydning for min faglige og
        personlige udvikling. Spontanloggen giver et indblik i de daglige
        opgaver og situationer, mens refleksionsloggen dykker ned i de tanker og
        læring, der er opstået som resultat af disse oplevelser.
      </p>
      <div className="border-b-2 border-gray-200 dark:border-gray-700 mb-16" />
      <BlogList sortBy="oldest" />
      <Dialog open={isAddBlogOpen} onOpenChange={setAddBlogOpen}>
        <DialogContent>
          <AddBlogPostForm onClose={() => setAddBlogOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
