"use client";

import BlogList from "./components/BlogList";

export default function Home() {
  return (
    <div className="px-16 py-8">
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
    </div>
  );
}
