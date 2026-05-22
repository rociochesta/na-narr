// src/pages/BossAccess.jsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { BOSS_PIN } from "../constants/bossConfig.js";
import { ArrowLeft } from "lucide-react";
import BottomNav from "../components/BottomNav";


export default function BossAccess() {
  const nav = useNavigate();
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (pin === BOSS_PIN) {
      window.localStorage.setItem("na_boss", "1");
      nav("/admin");
    } else {
      setError("Invalid pin.");
      setPin("");
    }
  }

  return (
    <div className="min-h-screen bg-[#0b0c0f] text-[#e5d3ad] flex flex-col items-center justify-center">
      <main className="w-full max-w-xs px-4 py-10 space-y-6">

        <Link
          to="/"
          className="inline-flex items-center gap-1 text-[11px] text-[#6b7078] hover:text-[#c6a56b] transition-colors"
        >
          <ArrowLeft size={14} />
          <span>Back</span>
        </Link>

        <div className="text-center space-y-1">
          <p className="text-[10px] uppercase tracking-[0.24em] text-[#6f5630]">
            Restricted waters
          </p>
          <h1 className="text-sm font-semibold text-[#e5d3ad]">
            Captain's quarters
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="relative bg-[#0f1012]/70 border border-[#6f5630]/25 rounded-xl p-4 space-y-3">
            <div className="absolute top-0 left-0 right-0 h-px rounded-t-xl bg-gradient-to-r from-transparent via-[#c6a56b]/25 to-transparent" />

            <input
              type="password"
              className="w-full bg-[#0b0c0f] border border-[#6f5630]/35 rounded-md px-3 py-2 text-[13px] text-[#e5d3ad] placeholder:text-[#4a4f58] outline-none focus:border-[#c6a56b]/70 transition-colors"
              placeholder="Enter PIN"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
            />

            {error && (
              <p className="text-[11px] text-[#c97070] text-center">{error}</p>
            )}

            <button
              type="submit"
              className="w-full text-[12px] border border-[#6f5630]/40 bg-[#15171b] text-[#8d9199] rounded-full py-1.5 hover:border-[#c6a56b]/70 hover:text-[#e5d3ad] transition-colors"
            >
              Unlock
            </button>
          </div>
        </form>

      </main>
      <BottomNav />
    </div>
  );
}
