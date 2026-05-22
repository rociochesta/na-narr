// src/pages/SoberDate.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sunrise, AlertTriangle } from "lucide-react";
import Header3PM from "../components/Header3PM";
import BottomNav from "../components/BottomNav";


export default function SoberDate() {
  const navigate = useNavigate();
  const [date, setDate] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [hadExistingDate, setHadExistingDate] = useState(false);

  // leer sober date si ya existe (local)
  useEffect(() => {
    try {
      const stored = window.localStorage.getItem("na_soberDate");
      if (stored) {
        setDate(stored); // asumimos formato YYYY-MM-DD
        setHadExistingDate(true);
      }
    } catch {
      // ignore
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!date) {
      setError("Pick a date. Any date that actually exists.");
      return;
    }

    const chosen = new Date(date);
    const today = new Date();
    chosen.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    if (Number.isNaN(chosen.getTime())) {
      setError("That doesn’t look like a real date.");
      return;
    }

    if (chosen > today) {
      setError("Future clean time doesn’t count yet.");
      return;
    }

    setSaving(true);

    try {
      // 1) guardar localmente para que la app funcione aunque falle el backend
      window.localStorage.setItem("na_soberDate", date);

      // 2) intentar guardar en la base de datos vía Netlify function
      try {
        const memberId = window.localStorage.getItem("na_memberId");

        if (!memberId) {
          console.warn(
            "No na_memberId in localStorage; skipping DB update for sober date."
          );
        } else {
          const res = await fetch("/.netlify/functions/update-sober-date", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              memberId: Number(memberId),
              soberDate: date, // YYYY-MM-DD
            }),
          });

          if (!res.ok) {
            console.warn(
              "Failed to update sober date in DB:",
              res.status,
              await res.text()
            );
          } else {
            const data = await res.json();
            console.log("Sober date saved in DB:", data);
          }
        }
      } catch (dbErr) {
        console.warn("Error calling update-sober-date function:", dbErr);
      }

      // 3) back home
      navigate("/");
    } finally {
      setSaving(false);
    }
  };

  const handleClear = () => {
    if (!date) {
      setError("");
      return;
    }

    const ok = window.confirm(
      "Clear your clean date? This doesn’t erase your story or your wreckage — it just resets the counter."
    );
    if (!ok) return;

    try {
      window.localStorage.removeItem("na_soberDate");
    } catch {
      // ignore
    }
    setDate("");
    setError("");
    setHadExistingDate(false);
  };

  return (
    <div className="min-h-screen bg-[#0b0c0f] text-[#e5d3ad] flex flex-col">
      <Header3PM />

      <main className="flex-1">
        <div className="max-w-md mx-auto px-4 py-10 space-y-6">

          {/* Hero */}
          <section className="relative overflow-hidden rounded-2xl border border-[#8a642f]/45 bg-[#080b0d] px-4 py-6 shadow-[0_12px_35px_rgba(0,0,0,0.55)]">
            <div className="absolute inset-0 rounded-2xl pointer-events-none border border-[#d6a84f]/20" />
            <div className="absolute top-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-[#f0c56e]/60 to-transparent" />
            <div className="pointer-events-none absolute -right-8 -top-10 h-28 w-28 rounded-full bg-[#c6a56b]/10 blur-3xl" />

            <div className="flex items-start gap-3 relative">
              <div className="mt-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#17120d] border border-[#c6a56b]/70 shadow-[0_0_14px_rgba(198,165,107,0.2)]">
                <Sunrise size={22} className="text-[#d4b06a]" />
              </div>
              <div className="space-y-2">
                <h1 className="text-xl font-semibold tracking-tight text-[#f3dfb1]">
                  {hadExistingDate
                    ? "When did yer clean voyage actually set sail?"
                    : "When did ye stop lettin' the bottle steer the ship?"}
                </h1>
                <p className="text-sm text-[#8d9199]">
                  No confession needed — just the day yer chaos dropped anchor.
                </p>
                <p className="text-xs text-[#6b7078]">
                  Bein' honest about this date don't sink yer clean time. It just keeps yer counter from lyin' on yer behalf.
                </p>
              </div>
            </div>
          </section>

          {/* Form card */}
          <section className="relative rounded-2xl border border-[#6f5630]/25 bg-[#0f1012]/90 px-4 py-6 space-y-4 shadow-xl shadow-black/40">
            <div className="absolute top-0 left-0 right-0 h-px rounded-t-2xl bg-gradient-to-r from-transparent via-[#c6a56b]/30 to-transparent" />

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label
                  htmlFor="soberDate"
                  className="block text-xs font-medium uppercase tracking-[0.18em] text-[#c6a56b]"
                >
                  Date ye dropped anchor
                </label>
                <input
                  id="soberDate"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-[#0b0c0f] border border-[#6f5630]/35 rounded-lg px-3 py-2.5 text-sm text-[#e5d3ad] focus:outline-none focus:border-[#c6a56b]/70 focus:ring-1 focus:ring-[#c6a56b]/40 transition-colors"
                />
                <p className="text-xs text-[#4a4f58]">
                  Choose the first full day ye weren't usin'. If ye're changin' this, we still won't ask what happened.
                </p>
              </div>

              {error && (
                <p className="text-xs text-[#c97070] bg-[#2a0f0f]/50 border border-[#7a3535]/50 rounded-md px-3 py-2">
                  {error}
                </p>
              )}

              <div className="space-y-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="w-full text-sm font-semibold tracking-wide rounded-xl py-2.5 border border-[#c6a56b]/70 bg-[#c6a56b]/10 text-[#e5d3ad] hover:bg-[#c6a56b]/18 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-[0_0_18px_rgba(198,165,107,0.12)]"
                >
                  {saving ? "Loggin' it..." : "Log the date"}
                </button>

                <button
                  type="button"
                  onClick={() => navigate("/")}
                  className="w-full text-sm font-semibold tracking-wide rounded-xl py-2.5 border border-[#6f5630]/30 text-[#8d9199] hover:bg-[#17120d] hover:text-[#e5d3ad] transition-colors"
                >
                  Back to ship
                </button>

                <button
                  type="button"
                  onClick={handleClear}
                  className="w-full mt-1 inline-flex items-center justify-center gap-2 text-xs text-[#7a3535] hover:text-[#c97070] transition-colors"
                >
                  <AlertTriangle size={13} />
                  <span>Clear clean date</span>
                </button>
              </div>
            </form>

            <p className="pt-2 text-center text-[11px] text-[#4a4f58]">
              Updatin' this date don't make ye a failure. It makes ye a brutally honest pirate — which be basically a superpower in this program.
            </p>
          </section>
        </div>
      </main>
      {/* <BottomNav /> */}
    </div>
  );
}
