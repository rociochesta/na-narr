// src/components/ChipCircle.jsx
import React from "react";

export default function ChipCircle({
  size = 14,
  color = "#c6a56b",
  filled = false,
  className = "",
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      className={className}
    >
      {/* subtle outer glow */}
      <circle
        cx="10"
        cy="10"
        r="8.5"
        fill="transparent"
        stroke="rgba(198,165,107,0.18)"
        strokeWidth="1.5"
      />

      {/* main ring */}
      <circle
        cx="10"
        cy="10"
        r="7"
        stroke={color}
        strokeWidth="2"
        fill={filled ? color : "rgba(198,165,107,0.05)"}
      />

      {/* tiny inner highlight */}
      {filled && (
        <circle
          cx="8"
          cy="7"
          r="1.4"
          fill="rgba(255,255,255,0.28)"
        />
      )}
    </svg>
  );
}