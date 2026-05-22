// src/components/RecoveryMedallion.jsx
import React from "react";

export default function RecoveryMedallion({ days }) {
  return (
    <div className="relative h-20 w-20 shrink-0 rounded-full">
      <div className="absolute inset-0 rounded-full bg-[#c6a56b]/25 blur-md" />

      <div
        className="
          relative h-full w-full rounded-full
          border border-[#f2d27f]/70
          bg-[radial-gradient(circle_at_35%_30%,#f4d48a_0%,#9a6b24_28%,#20160b_62%,#080604_100%)]
          shadow-[inset_0_0_12px_rgba(0,0,0,0.75),0_0_18px_rgba(198,165,107,0.25)]
          flex items-center justify-center
        "
      >
        <div className="absolute inset-[7px] rounded-full border border-[#2a1b0b]/80" />
        <div className="absolute inset-[12px] rounded-full border border-[#e0b85d]/35" />

        <div className="text-center leading-none">
          <div className="text-[24px] font-black text-[#fff0b8] drop-shadow">
            {days}
          </div>
          <div className="mt-1 text-[7px] uppercase tracking-[0.18em] text-[#1b1208] font-black">
            days
          </div>
        </div>
      </div>
    </div>
  );
}
