"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface ScoreCircleProps {
  score: number;
  size?: number;
}

function colorForScore(score: number) {
  if (score >= 70) return { stroke: "#22c55e", text: "text-green-600" };
  if (score >= 40) return { stroke: "#e8a849", text: "text-warm" };
  return { stroke: "#ef4444", text: "text-red-500" };
}

export function ScoreCircle({ score, size = 140 }: ScoreCircleProps) {
  const [animatedScore, setAnimatedScore] = useState(0);
  const { stroke, text } = colorForScore(score);

  useEffect(() => {
    const timeout = setTimeout(() => setAnimatedScore(score), 100);
    return () => clearTimeout(timeout);
  }, [score]);

  const strokeWidth = 10;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (animatedScore / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          className="text-dark/10"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={stroke}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 1s ease-out" }}
        />
      </svg>
      <span className={cn("absolute text-3xl font-extrabold", text)}>{score}</span>
    </div>
  );
}
