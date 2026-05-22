// src/components/NeonBadge.jsx
import React from "react";
import { motion } from "framer-motion";

export default function NeonBadge({ num, size = 64, className = "" }) {
  const dimension = size;

  return (
    <motion.svg
      width={dimension}
      height={dimension}
      viewBox="0 0 84 84"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      initial={{ scale: 1, opacity: 0.94 }}
      animate={{ scale: [1, 1.03, 1], opacity: [0.94, 1, 0.94] }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
    >
      <defs>
        {/* warm amber glow */}
        <radialGradient id="coinGlow" cx="0.5" cy="0.5" r="0.75">
          <stop offset="0%"   stopColor="#c6a56b" stopOpacity="0.45" />
          <stop offset="65%"  stopColor="#c6a56b" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#c6a56b" stopOpacity="0"    />
        </radialGradient>
        {/* inner face gradient — dark warm */}
        <radialGradient id="coinFace" cx="0.38" cy="0.35" r="0.65">
          <stop offset="0%"   stopColor="#221a0f" />
          <stop offset="100%" stopColor="#0d0b08" />
        </radialGradient>
      </defs>

      {/* Outer amber glow */}
      <circle cx="42" cy="42" r="41" fill="url(#coinGlow)" />

      {/* Outer decorative ring */}
      <circle
        cx="42" cy="42" r="38"
        fill="none"
        stroke="#6f5630"
        strokeWidth="0.8"
        opacity="0.5"
      />

      {/* Main gold ring */}
      <circle
        cx="42" cy="42" r="33"
        fill="none"
        stroke="#c6a56b"
        strokeWidth="2"
        opacity="0.80"
      />

      {/* Compass tick marks at N/E/S/W */}
      {[0, 90, 180, 270].map((deg) => {
        const rad = (deg * Math.PI) / 180;
        const x1 = 42 + 33 * Math.sin(rad);
        const y1 = 42 - 33 * Math.cos(rad);
        const x2 = 42 + 28 * Math.sin(rad);
        const y2 = 42 - 28 * Math.cos(rad);
        return (
          <line
            key={deg}
            x1={x1} y1={y1} x2={x2} y2={y2}
            stroke="#c6a56b"
            strokeWidth="1.5"
            opacity="0.55"
          />
        );
      })}

      {/* Inner face */}
      <circle
        cx="42" cy="42" r="26"
        fill="url(#coinFace)"
        stroke="rgba(198,165,107,0.3)"
        strokeWidth="1.2"
      />

      {/* Subtle inner highlight arc */}
      <path
        d="M 28 32 A 16 16 0 0 1 56 32"
        fill="none"
        stroke="rgba(255,255,255,0.06)"
        strokeWidth="3"
        strokeLinecap="round"
      />

      {/* Number */}
      <text
        x="42"
        y="42"
        textAnchor="middle"
        dominantBaseline="central"
        fill="#e5d3ad"
        fontSize="26"
        fontFamily="Inter, system-ui, -apple-system, BlinkMacSystemFont, sans-serif"
        fontWeight="700"
      >
        {num}
      </text>
    </motion.svg>
  );
}
