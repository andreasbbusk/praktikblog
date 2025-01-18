"use client";

import React from "react";
import { Card } from "@/components/ui/card";

export default function LaeringsmaalPage() {
  const learningGoals = [
    {
      id: 1,
      goal: "Få bedre indsigt i, hvordan projekter planlægges og styres, fra idé til levering, og lære at overholde deadlines i en travl arbejdssituation."
    },
    {
      id: 2, 
      goal: "Opnå en dybere forståelse for, hvordan jeg effektivt kan anvende relevante UX-principper i design- og udviklingsprocessen."
    },
    {
      id: 3,
      goal: "Få en bedre forståelse for hvordan et udviklerteam arbejder sammen for at opnå et fælles mål."
    },
    {
      id: 4,
      goal: "Videreudvikling af min forståelse og anvendelse af API'er i applikations- og webudvikling."
    },
    {
      id: 5,
      goal: "Styrke mine kompetencer inden for moderne frameworks herunder, React og Next.js."
    }
  ];

  return (
    <div className="px-16 py-8">
      <h1 className="text-8xl font-bold text-center mb-8 mt-12">Læringsmål</h1>
      <div className="grid gap-6 max-w-4xl mx-auto">
        {learningGoals.map((item) => (
          <Card key={item.id} className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <span className="text-xl font-bold text-primary">{item.id}</span>
              </div>
              <p className="text-lg leading-relaxed">{item.goal}</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
