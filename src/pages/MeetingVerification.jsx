// src/pages/MeetingVerification.jsx
import React, { useState } from "react";
import { Anchor, ShieldCheck, Zap } from "lucide-react";
import PublicHeader from "../components/PublicHeader.jsx";
import shipImg from "../assets/ship.png";
import shipLog from "../assets/shiplog.png";
import rangersLogo from "../assets/rangerslogo.png";
import useHomeTheme from "../hooks/useHomeTheme.js";
import "./RangersHome.css";
import "./MeetingVerification.css";

const WORDS = ["NARR", "RANG", "RECOV", "HOPE", "UNITY", "CLEAN", "BRAVE", "RISE", "LIGHT", "PATH"];
const EMAILJS_URL = "https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js";
const inputClass = "w-full rounded-xl border border-[#6f5630]/50 bg-[#0b0c0f] px-4 py-3 text-sm text-[#e5d3ad] placeholder:text-[#6b7078] outline-none focus:border-[#c6a56b] focus:ring-2 focus:ring-[#c6a56b]/20";
const labelClass = "mb-2 block text-[10px] font-semibold uppercase tracking-[0.18em] text-[#c6a56b]";

function localDate(date) {
  return [date.getFullYear(), String(date.getMonth() + 1).padStart(2, "0"), String(date.getDate()).padStart(2, "0")].join("-");
}
function parseDate(value) {
  const [y, m, d] = value.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  return localDate(date) === value ? date : null;
}
function loadEmailJs() {
  if (window.emailjs) return Promise.resolve(window.emailjs);
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = EMAILJS_URL;
    script.async = true;
    script.onload = () => window.emailjs ? resolve(window.emailjs) : reject(new Error("EmailJS unavailable"));
    script.onerror = () => reject(new Error("EmailJS failed to load"));
    document.head.appendChild(script);
  });
}

export default function MeetingVerification() {
  const [theme, changeTheme] = useHomeTheme();
  const isRangers = theme === "rangers";
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [dateValue, setDateValue] = useState(() => localDate(new Date()));
  const [code, setCode] = useState("");
  const [message, setMessage] = useState(null);
  const [sending, setSending] = useState(false);
  const [lastSubmit, setLastSubmit] = useState(0);

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage(null);
    const cleanName = name.trim();
    const cleanEmail = email.trim();
    const cleanCode = code.trim().toUpperCase();
    const error = (text) => setMessage({ type: "error", text });
    const now = Date.now();
    if (now - lastSubmit < 30000) return error("Please wait " + Math.ceil((30000 - (now - lastSubmit)) / 1000) + " seconds before trying again.");
    if (!cleanName || !cleanEmail || !cleanCode || !dateValue) return error("Please fill in all fields.");
    if (!/^[a-zA-ZÀ-ÿ\s'.-]{2,80}$/.test(cleanName)) return error("Please enter a valid name (letters only, 2–80 characters).");
    if (!/^[^\s@<>"']{1,64}@[^\s@<>"']{1,255}\.[a-zA-Z]{2,}$/.test(cleanEmail) || cleanEmail.length > 254) return error("Please enter a valid email address.");
    if (!/^[A-Z0-9]{4,10}$/.test(cleanCode)) return error("Invalid code format.");
    const selectedDate = parseDate(dateValue);
    if (!selectedDate) return error("Please select a valid meeting date.");
    const todayMidnight = new Date();
    todayMidnight.setHours(0, 0, 0, 0);
    if (selectedDate > todayMidnight) return error("Meeting date cannot be in the future.");
    const day = selectedDate.getDate();
    const expectedCode = WORDS[(day - 1) % WORDS.length] + ((day * 7 + 13) % 90 + 10);
    if (cleanCode !== expectedCode) return error("Incorrect code for the selected date. Please check with your organizer and try again.");

    setSending(true);
    try {
      const emailjs = await loadEmailJs();
      emailjs.init("JXSz6iJfy32pMsple");
      await emailjs.send("NARR2026", "RangersVerification", {
        to_name: cleanName, to_email: cleanEmail, email: cleanEmail,
        meeting_date: selectedDate.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" }),
      });
      setLastSubmit(Date.now());
      setMessage({ type: "success", text: "Attendance logged! A confirmation email is on its way to " + cleanEmail + "." });
      setName(""); setEmail(""); setCode(""); setDateValue(localDate(new Date()));
    } catch {
      error("Something went wrong sending the email. Please try again.");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className={isRangers ? "rangers-home verification-rangers" : "min-h-screen bg-[#0b0c0f] text-[#e5d3ad] flex flex-col"}>
      <PublicHeader theme={theme} onThemeChange={changeTheme} />
      <main className={isRangers ? "verification-main rangers-page-main" : "w-full max-w-md mx-auto flex-1 px-4 py-6 space-y-6"}>
        {isRangers ? (
          <section className="verification-hero">
            <img src={rangersLogo} alt="NARR" className="rangers-page-logo" />
            <p className="verification-eyebrow">Every meeting matters</p>
            <h1>Meeting verification</h1>
            <p className="verification-subtitle">You showed up. Take your next step.</p>
          </section>
        ) : (
        <section className="relative overflow-hidden rounded-2xl border border-[#8a642f]/45 bg-[#080b0d] px-4 py-7 sm:px-5 shadow-[0_12px_35px_rgba(0,0,0,0.55),inset_0_0_30px_rgba(198,165,107,0.06)]">
          <div className="absolute inset-0 rounded-2xl border border-[#d6a84f]/20 pointer-events-none" />
          <div className="absolute top-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-[#f0c56e]/60 to-transparent" />
          <div className="relative flex items-center gap-4">
            <img src={shipLog} alt="" className="h-28 w-28 sm:h-32 sm:w-32 shrink-0 object-contain drop-shadow-[0_0_14px_rgba(198,165,107,0.45)]" />
            <div className="min-w-0">
              <p className="text-[10px] uppercase tracking-[0.28em] text-[#c6a56b]">NARR Recovery Crew</p>
              <h1 className="mt-1 text-[23px] font-bold leading-tight tracking-tight text-[#f3dfb1]">Meeting verification</h1>
            </div>
          </div>
        </section>
        )}

        <section className="verification-panel relative overflow-hidden rounded-2xl border border-[#8a642f]/45 bg-[#080b0d] px-5 py-5 shadow-[0_12px_35px_rgba(0,0,0,0.55),inset_0_0_30px_rgba(198,165,107,0.06)]">
          <div className="absolute inset-0 rounded-2xl border border-[#d6a84f]/20 pointer-events-none" />
          <div className="absolute top-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-[#f0c56e]/60 to-transparent" />
          {!isRangers && <img src={shipImg} alt="" className="absolute -right-6 top-0 h-32 w-40 object-cover opacity-20 pointer-events-none" />}
          <div className="relative">
            <div className="flex items-center gap-2 text-[#d4b06a]"><ShieldCheck size={17} /><h2 className="text-sm font-semibold">Log your attendance</h2></div>
            <p className="mt-2 mb-5 text-xs leading-relaxed text-[#8d9199]">Enter the code your meeting host shared for the date you attended. We’ll email your confirmation.</p>
            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              <div><label className={labelClass} htmlFor="verification-name">Your name</label><input className={inputClass} id="verification-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="First name" autoComplete="name" required /></div>
              <div><label className={labelClass} htmlFor="verification-email">Email address</label><input className={inputClass} id="verification-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" autoComplete="email" required /></div>
              <div><label className={labelClass} htmlFor="verification-date">Meeting date</label><input className={inputClass + " [color-scheme:dark]"} id="verification-date" type="date" value={dateValue} max={localDate(new Date())} onChange={(e) => setDateValue(e.target.value)} required /></div>
              <div><label className={labelClass} htmlFor="verification-code">Meeting code</label><input className={inputClass + " text-center text-lg font-semibold tracking-[0.2em] uppercase"} id="verification-code" value={code} onChange={(e) => setCode(e.target.value)} placeholder="Enter code" maxLength={10} autoCapitalize="characters" autoComplete="off" required /></div>
              <button type="submit" disabled={sending} className="w-full rounded-xl border border-[#c6a56b]/70 bg-gradient-to-r from-[#d4b06a] to-[#a87937] px-4 py-3 text-sm font-bold text-[#17120d] shadow-[0_0_18px_rgba(198,165,107,0.18)] transition hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed">{sending ? "Sending…" : "Submit attendance"}</button>
              {message && <div role="status" aria-live="polite" className={"rounded-xl border px-4 py-3 text-xs leading-relaxed " + (message.type === "success" ? "border-emerald-500/35 bg-emerald-500/10 text-emerald-300" : "border-red-400/35 bg-red-500/10 text-red-300")}>{message.text}</div>}
            </form>
          </div>
        </section>
        <p className="verification-motto flex items-center justify-center gap-1.5 text-center text-[12px] text-[#7eb8c4]" style={{ fontFamily: "'Caveat', cursive" }}>We show up. That’s the whole toolkit. {isRangers ? <Zap size={12} /> : <Anchor size={12} />}</p>
      </main>
    </div>
  );
}
