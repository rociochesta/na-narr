// src/components/MilestoneIcon.jsx
import React from "react";
import { Star, Crown } from "lucide-react";
import ChipCircle from "./ChipCircle.jsx";

export default function MilestoneIcon({ milestone, isToday = false }) {
  const { isOfficial, color, special } = milestone;

  // 9 años → estrella
  if (special === "star") {
    return (
      <Star
        size={16}
        className={`text-[#d4b06a] ${isToday ? "icon-shimmer" : ""}`}
      />
    );
  }

  // 10 años → corona
  if (special === "crown") {
    return (
      <Crown
        size={16}
        className={`text-[#d4b06a] ${isToday ? "icon-shimmer" : ""}`}
      />
    );
  }

  // Oficiales → círculo relleno, color desde constants
  if (isOfficial) {
    return (
      <ChipCircle
        size={14}
        color={color || "#c6a56b"}
        filled={true}
        className={isToday ? "icon-shimmer" : ""}
      />
    );
  }

  // No oficiales (semanas, 4m, 5m, 7m, 8m, 10m, 11m) → círculo vacío
  return (
    <ChipCircle
      size={14}
      color="#c6a56b"
      filled={false}
      className={isToday ? "icon-shimmer" : ""}
    />
  );
}
