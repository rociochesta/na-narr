import React, { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Copy, LockKeyhole, Printer } from "lucide-react";
import Header3PM from "../components/Header3PM.jsx";
import lanternImg from "../assets/lantern.png";
import shipLog from "../assets/shiplog.png";
import "./codes.css";

const WORDS = ["NARR", "RANG", "RECOV", "HOPE", "UNITY", "CLEAN", "BRAVE", "RISE", "LIGHT", "PATH"];
// Keep aligned with MeetingVerification.jsx and the supplied code sheet.
const getCode = (day) => WORDS[(day - 1) % WORDS.length] + ((day * 7 + 13) % 90 + 10);

export default function Codes({ requirePasswordOnOpen = false }) {
  const [unlocked, setUnlocked] = useState(() => {
    if (requirePasswordOnOpen) return false;
    try { return sessionStorage.getItem("narr_auth") === "1"; }
    catch { return false; }
  });
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [now, setNow] = useState(() => new Date());
  const [month, setMonth] = useState(() => new Date(new Date().getFullYear(), new Date().getMonth(), 1));
  const [notice, setNotice] = useState("");
  const passwordInput = useRef(null);

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 30000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const previous = document.title;
    document.title = "NARR — Monthly Codes";
    return () => { document.title = previous; };
  }, []);

  function unlock(event) {
    event.preventDefault();
    // This preserves the reference's client-side gate; it is not server authentication.
    if (password !== "harhar") {
      setError("Incorrect password. Try again.");
      setPassword("");
      passwordInput.current?.focus();
      return;
    }
    if (!requirePasswordOnOpen) {
      try { sessionStorage.setItem("narr_auth", "1"); } catch { /* Allow this visit without storage. */ }
    }
    setPassword("");
    setError("");
    setUnlocked(true);
  }

  async function copyCode(code) {
    try {
      await navigator.clipboard.writeText(code);
      setNotice(`${code} copied!`);
    } catch {
      setNotice(`Could not copy. Please copy ${code} manually.`);
    }
  }

  function changeMonth(direction) {
    setMonth((previous) => new Date(previous.getFullYear(), previous.getMonth() + direction, 1));
    setNotice("");
  }

  const currentMonth = month.getFullYear() === now.getFullYear() && month.getMonth() === now.getMonth();
  const monthTitle = month.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  const days = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();

  return (
    <div className="codes-page min-h-screen bg-[#0b0c0f] text-[#e5d3ad]">
      <div className="codes-screen-only"></div>
      {!unlocked ? (
        <main className="mx-auto flex min-h-[75vh] max-w-md items-center px-4 py-8">
          <form onSubmit={unlock} className="codes-panel w-full p-7 text-center">
            <img src={shipLog} alt="" className="mx-auto mb-4 h-28 w-28 sm:h-32 sm:w-32 object-contain" />
            <LockKeyhole size={20} className="mx-auto mb-3 text-[#c6a56b]" />
            <h1 className="text-xl font-semibold">Admin access</h1>
            <p className="mb-6 mt-2 text-sm text-[#9b8c72]">Enter your password to view the code sheet.</p>
            <label htmlFor="codes-password" className="sr-only">Password</label>
            <input ref={passwordInput} id="codes-password" type="password" autoComplete="current-password" autoFocus required
              value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Password"
              aria-invalid={Boolean(error)} aria-describedby="codes-error"
              className="w-full rounded-lg border border-[#6f5630]/60 bg-[#0b0c0f] px-4 py-3 text-center" />
            <button type="submit" className="codes-button mt-3 w-full justify-center">Enter</button>
            <p id="codes-error" role="alert" className="mt-3 min-h-5 text-sm text-red-300">{error}</p>
          </form>
        </main>
      ) : (
        <main className="codes-sheet mx-auto max-w-md space-y-5 px-4 py-6">
          <section className="codes-panel relative overflow-hidden p-5">
            <img src={lanternImg} alt="" className="codes-lantern pointer-events-none absolute -right-3 top-0 h-full opacity-70" />
            <div className="relative pr-12">
              <p className="text-[10px] uppercase tracking-[0.2em] text-[#c6a56b]">Recovery Rangers</p>
              <h1 className="mt-2 text-2xl font-semibold">Monthly code sheet</h1>
              <p className="mt-2 text-xs text-[#9b8c72]">Private — do not share this page.</p>
            </div>
          </section>

          <div className="codes-panel flex items-center justify-between p-3">
            <button type="button" className="codes-button codes-screen-only" aria-label="Previous month" onClick={() => changeMonth(-1)}><ChevronLeft size={18} /></button>
            <h2 className="text-base font-semibold" aria-live="polite">{monthTitle}</h2>
            <button type="button" className="codes-button codes-screen-only" aria-label="Next month" onClick={() => changeMonth(1)}><ChevronRight size={18} /></button>
          </div>

          {currentMonth && (
            <section className="codes-today codes-screen-only flex items-center justify-between gap-3 rounded-xl border border-[#c6a56b]/60 bg-gradient-to-br from-[#302313] to-[#100e0b] p-5">
              <div>
                <h2 className="text-[10px] uppercase tracking-[0.18em] text-[#c6a56b]">Today's code</h2>
                <p className="mt-1 font-mono text-2xl tracking-wider text-[#f4d48a]">{getCode(now.getDate())}</p>
              </div>
              <button type="button" className="codes-button" onClick={() => copyCode(getCode(now.getDate()))}><Copy size={15} />Copy</button>
            </section>
          )}

          <div className="codes-grid grid grid-cols-2 gap-2">
            {Array.from({ length: days }, (_, index) => {
              const day = index + 1;
              const today = currentMonth && day === now.getDate();
              const past = currentMonth && day < now.getDate();
              const date = new Date(month.getFullYear(), month.getMonth(), day);
              return (
                <button key={day} type="button" onClick={() => copyCode(getCode(day))}
                  className={`codes-day flex items-center justify-between gap-2 rounded-xl border px-3 py-3 text-left ${today ? "border-[#c6a56b] bg-[#211a10]" : "border-[#6f5630]/30 bg-[#0f1012]"} ${past ? "codes-past" : ""}`}
                  aria-label={`Copy ${getCode(day)} for ${date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}`}
                  aria-current={today ? "date" : undefined}>
                  <span className="text-[11px] text-[#9b8c72]">{date.toLocaleDateString("en-US", { weekday: "short" })} {day}</span>
                  <span className="select-text font-mono text-xs text-[#e5d3ad]">{getCode(day)}</span>
                </button>
              );
            })}
          </div>
          <p role="status" className="codes-screen-only min-h-5 text-center text-xs text-[#c6a56b]">{notice || "Select any day to copy its code."}</p>
          <button type="button" className="codes-button codes-screen-only w-full justify-center" onClick={() => window.print()}><Printer size={16} />Print this month's codes</button>
        </main>
      )}
    </div>
  );
}
