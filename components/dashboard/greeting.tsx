"use client";

import { useEffect, useState } from "react";

function greetingForHour(hour: number) {
  if (hour < 11) return "Selamat pagi";
  if (hour < 15) return "Selamat siang";
  if (hour < 18) return "Selamat sore";
  return "Selamat malam";
}

export function Greeting({ name }: { name: string }) {
  const [greeting, setGreeting] = useState("Halo");

  useEffect(() => {
    setGreeting(greetingForHour(new Date().getHours()));
  }, []);

  return (
    <h1 className="text-2xl font-bold text-dark">
      {greeting}, {name.split(" ")[0]}
    </h1>
  );
}
