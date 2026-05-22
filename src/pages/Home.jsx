// src/pages/Home.jsx
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ChessQueen,
  ChessKing,
  Medal,
  Sparkles,
  Flame,
  ChevronUp,
  ChevronDown,
  Target,
  Award, // Oldcomers
  CircleDot, // (no se usa aún)
  BookOpen,
  Users, // Group milestones
  Wrench, // Today's tool
} from "lucide-react";
import HeaderGeneric from "../components/HeaderGeneric.jsx";
import Header3PM from "../components/Header3PM.jsx";
import NeonBadge from "../components/NeonBadge.jsx";
import { motion } from "framer-motion";
import { useTodayJFT } from "../hooks/useTodayJFT.js";
import { OLDCOMERS } from "../constants/oldcomers.js";
import { getCleanTime } from "../utils/getCleanTime.js";
import { getMilestoneDate } from "../utils/getMilestoneDate.js";
import { getDaysClean } from "../utils/getDaysClean.js";
import { getGratitudeStats } from "../utils/getGratitudeStats.js";
import { getPunchline } from "../utils/getPunchline.js";
import { getMilestonesStatus } from "../utils/getMilestonesStatus.js";
import { getMilestonePunchline } from "../utils/getMilestonePunchline.js";
import { getCleanTimePhrase } from "../utils/getCleanTimePhrase.js";
//import { loadGroupMembers } from "../constants/groupMembers.js";
import {
  getGroupUpcomingMilestones,
  getGroupAllNextMilestones,
} from "../utils/getGroupUpcomingMilestones.js";
import { getRandomToolPunchline } from "../utils/getToolPunchline.js";
import MilestoneIcon from "../components/MilestoneIcon.jsx";
import RecoveryMedallion from "../components/RecoveryMedallion.jsx";
import { useGuidedToolForToday } from "../hooks/useGuidedToolForToday.js";
import GuidedToolModal from "../components/GuidedToolModal.jsx";
import { getSlogan } from "../utils/getSlogan.js";
import homeIcon from "../assets/homeicon.png";
import lanternImg from "../assets/lantern.png";

const ICONS = {
  queen: ChessQueen,
  king: ChessKing,
  medal: Medal,
};
import BottomNav from "../components/BottomNav";
import { AnimatePresence } from "framer-motion";
import { getTimeUntilMeeting } from "../utils/getTimeUntilMeeting.js";

import { Video, RefreshCcw, Anchor } from "lucide-react";
import shipImg from "../assets/ship.png";

export default function Home() {
  const navigate = useNavigate();

  const [soberDate, setSoberDate] = useState(null);
  const [daysClean, setDaysClean] = useState(null);

  // punchline antiguo, lo dejamos por si lo usamos en otros lugares más adelante
  const [punchline] = useState(() => getPunchline());
  const [cleanPhrase] = useState(() => getCleanTimePhrase());

  const { entry: jftEntry, loading: jftLoading, error: jftError } =
    useTodayJFT();

  const [isToolOpen, setIsToolOpen] = useState(true);
  const [isMilestonesOpen, setIsMilestonesOpen] = useState(false);
  const [isGroupOpen, setIsGroupOpen] = useState(false);
  const [isGratsOpen, setIsGratsOpen] = useState(false);
  const [isWhyOpen, setIsWhyOpen] = useState(false);
  const [isOldOpen, setIsOldOpen] = useState(false);
  const [isJftOpen, setIsJftOpen] = useState(false);
  const [isToolGuideOpen, setIsToolGuideOpen] = useState(false);
  const [userProfile, setUserProfile] = useState(null);

  const [groupMembers, setGroupMembers] = useState([]);
const memberId = window.localStorage.getItem("na_memberId");
const isGuest = !memberId;

  const [gratitudeStats, setGratitudeStats] = useState({
    thisWeek: 0,
    lastText: null,
  });

  const [savedWhy, setSavedWhy] = useState("");
  const [showAllGroup, setShowAllGroup] = useState(false);

  const [toolDone, setToolDone] = useState(false);
  const [toolDoneLine, setToolDoneLine] = useState(null);
  const [rotatingSlogan, setRotatingSlogan] = useState(() => getSlogan({ groupKey: "3PM" }));

  // punchline del ÚLTIMO milestone alcanzado (async vía JSON)
  const [lastPunch, setLastPunch] = useState(null);

  // 🔹 mensajes de bienvenida rotativos desde Supabase
  const [welcomeHeadline, setWelcomeHeadline] = useState("Welcome back.");
  const [welcomeSubline, setWelcomeSubline] = useState("");
const [timeUntilMeeting, setTimeUntilMeeting] = useState("");
const [showHiLine] = useState(() => Math.random() < 0.35); // 35% de las veces

const displayName =
  userProfile?.name ||
  window.localStorage.getItem("na_memberName") ||
  "";


  // ─────────────────────────────────────────────
  // Cargar welcome message desde Netlify function
  // ─────────────────────────────────────────────

  // ─────────────────────────────────────────────
// Welcome message (DB via Netlify function)
// ─────────────────────────────────────────────
const gid = window.localStorage.getItem("na_groupId");
if (gid && !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(gid)) {
  window.localStorage.removeItem("na_groupId");
}
useEffect(() => {
  const loadWelcome = async () => {
    try {
      const groupId = window.localStorage.getItem("na_groupId");

      const url = groupId
        ? `/.netlify/functions/get-welcome?groupId=${encodeURIComponent(groupId)}`
        : "/.netlify/functions/get-welcome";

      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data = await res.json();

      setWelcomeHeadline(
        data?.headline || "Welcome back. Again. That's how recovery works."
      );
      setWelcomeSubline(
        data?.subline || "The server is hungover, but you still logged in. Bold move."
      );
    } catch (err) {
      console.error("Failed to load welcome message:", err);

      // fallback local
   setWelcomeHeadline("Welcome back. Still breathing. Still trying.");
setWelcomeSubline("We don't grade your days. We just keep you company in them.");

    }
  };

  loadWelcome();
}, []);

useEffect(() => {
  (async () => {
    // 1) Clean date from localStorage
    let storedSoberDate = null;
    try {
      const stored = window.localStorage.getItem("na_soberDate");
      if (stored) {
        storedSoberDate = stored;
        setSoberDate(stored);
        setDaysClean(getDaysClean(stored));
      }
    } catch {
      // ignore
    }

    // 2) User profile (local)
    try {
      const rawProfile = window.localStorage.getItem("na_userProfile");
      if (rawProfile) setUserProfile(JSON.parse(rawProfile));
    } catch (err) {
      console.error("User profile load error:", err);
    }

    // 3) Try to read sober_date from DB (if we have memberId)
    try {
      const memberId = window.localStorage.getItem("na_memberId");

      if (memberId) {
        const res = await fetch("/.netlify/functions/get-member", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ memberId }), // ✅ uuid (NO Number)
        });

        if (!res.ok) {
          console.warn("Failed to load member from DB:", res.status);
        } else {
          const data = await res.json();
          if (data && data.sober_date) {
            const dbDate = String(data.sober_date).slice(0, 10);

            if (!storedSoberDate || storedSoberDate !== dbDate) {
              window.localStorage.setItem("na_soberDate", dbDate);
              setSoberDate(dbDate);
              setDaysClean(getDaysClean(dbDate));
            }
          }
        }
      }
    } catch (err) {
      console.warn("Error fetching sober date from DB:", err);
    }

    // 4) Group members (DB)
    try {
      const groupId = window.localStorage.getItem("na_groupId");

      if (groupId) {
        const res = await fetch("/.netlify/functions/get-group-members", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ groupId }),
        });

        const data = await res.json();

        if (!res.ok) {
          console.warn("Failed to load group members from DB:", data);
          setGroupMembers([]);
        } else {
          // normalize for existing utils expecting { name, soberDate }
          const normalized = (data.members || []).map((m) => ({
            id: m.id,
            name: m.display_name,
            soberDate: m.sober_date, // can be null
            role: m.role,
          }));

          setGroupMembers(normalized);
        }
      } else {
        setGroupMembers([]);
      }
    } catch (err) {
      console.warn("Group members DB fetch error:", err);
      setGroupMembers([]);
    }

    // 5) My Why
    try {
      const w = window.localStorage.getItem("na_myWhy");
      if (w) setSavedWhy(w);
    } catch {
      // ignore
    }

    // 6) Gratitudes
    try {
      const stats = getGratitudeStats();
      if (stats) setGratitudeStats(stats);
    } catch {
      // ignore
    }

    // 7) Today's tool done?
    try {
      const todayKey = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
      const doneKey = `na_toolDone_${todayKey}`;
      const punchKey = `na_toolDoneLine_${todayKey}`;

      const storedDone = window.localStorage.getItem(doneKey);
      const storedLine = window.localStorage.getItem(punchKey);

      setToolDone(storedDone === "1");
      if (storedLine) setToolDoneLine(storedLine);
    } catch {
      // ignore
    }
  })();
}, []);


  const hasSoberDate = Boolean(soberDate) && daysClean !== null;

  // TODAY'S TOOL – usando hook + JSON
  const {
    tool: todaysTool,
    index: todaysToolIndex,
    allTools: allGuidedTools,
    loading: toolLoading,
    error: toolError,
  } = useGuidedToolForToday({ hasSoberDate, daysClean });

  const todaysToolTitle =
    todaysTool?.title ||
    (toolLoading ? "Today's tool is loading..." : "No tool available today");

  const { reached: reachedMilestones, next: nextMilestone } =
    getMilestonesStatus(daysClean);

  // cargar punchline async cuando cambien los milestones alcanzados
  useEffect(() => {
    if (!reachedMilestones || reachedMilestones.length === 0) {
      setLastPunch(null);
      return;
    }

    const last = reachedMilestones[reachedMilestones.length - 1];
    let cancelled = false;

    getMilestonePunchline(last.id).then((text) => {
      if (!cancelled) setLastPunch(text);
    });

    return () => {
      cancelled = true;
    };
  }, [reachedMilestones]);
useEffect(() => {
  function update() {
    setTimeUntilMeeting(getTimeUntilMeeting());
  }

  update();
  const id = setInterval(update, 30 * 1000);
  return () => clearInterval(id);
}, []);




  // Fecha bonita "Since Nov 23, 2025"
  const cleanDateLabel =
    soberDate && hasSoberDate
      ? (() => {
          const [year, month, day] = soberDate.split("-");
          const monthNames = [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
          ];
          const monthIndex = Number(month) - 1;
          return `${monthNames[monthIndex]} ${Number(day)}, ${year}`;
        })()
      : "";

  const groupMilestones = getGroupUpcomingMilestones(groupMembers, 7);
  const allNextMilestones = getGroupAllNextMilestones(groupMembers);

  const lastGratitude = gratitudeStats.lastText;

  // guard / auto-register member
  useEffect(() => {
  const profileRaw = window.localStorage.getItem("na_userProfile");
  const memberId = window.localStorage.getItem("na_memberId");

  // If profile exists but no memberId -> self-register
  if (profileRaw && !memberId) {
    const profile = JSON.parse(profileRaw);

    const groupCode =
      profile?.groupCode ||
      window.localStorage.getItem("na_groupCode") ||
      "3PM";

    (async () => {
      try {
        const res = await fetch("/.netlify/functions/members-self-register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: profile.name,
            groupCode,
          }),
        });

        const data = await res.json();

        if (!res.ok) {
          console.warn("Auto self-register failed:", data);
          return;
        }

        // save uuid ids
        if (data?.member?.id) {
          window.localStorage.setItem("na_memberId", data.member.id);
          window.localStorage.setItem(
            "na_memberName",
            data.member.display_name || profile.name
          );
          console.log("Auto-saved na_memberId:", data.member.id);
        }

        if (data?.group?.id) {
          window.localStorage.setItem("na_groupId", data.group.id);
          window.localStorage.setItem("na_groupCode", data.group.code || groupCode);
        }
      } catch (err) {
        console.warn("Error calling members-self-register (auto):", err);
      }
    })();
  }
}, [navigate]);


  function handleToggleToolDone() {
    const todayKey = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
    const doneKey = `na_toolDone_${todayKey}`;
    const punchKey = `na_toolDoneLine_${todayKey}`;

    setToolDone((prev) => {
      const next = !prev;

      try {
        if (next) {
          window.localStorage.setItem(doneKey, "1");

          // 1) Intentar sacar punchline desde la tool de hoy (DB)
          let line = "";
          if (
            todaysTool &&
            Array.isArray(todaysTool.punchlines) &&
            todaysTool.punchlines.length > 0
          ) {
            const i = Math.floor(Math.random() * todaysTool.punchlines.length);
            line = todaysTool.punchlines[i];
          } else {
            // 2) Fallback: lista vieja de punchlines genéricos
            line = getRandomToolPunchline();
          }

          setToolDoneLine(line);
          window.localStorage.setItem(punchKey, line);
        } else {
          window.localStorage.removeItem(doneKey);
          window.localStorage.removeItem(punchKey);
          setToolDoneLine("");
        }
      } catch {
        // ignore
      }

      return next;
    });
  }

  const hasGroup = Boolean(userProfile?.groupCode);

  return (
    <div className="min-h-screen bg-[#0b0c0f] text-[#e5d3ad] flex flex-col">
      <Header3PM />

      {/* Main content */}
      <main className="flex-1">
        <div className="max-w-md mx-auto px-4 py-6 space-y-6">
          {/* Hero premium con welcome rotativo */}
{/* Welcome card / rotating slogan */}
<section
  className="
    relative overflow-hidden
    rounded-2xl
    border border-[#8a642f]/45
    bg-[#080b0d]
    px-4 py-4
    shadow-[0_12px_35px_rgba(0,0,0,0.55),inset_0_0_30px_rgba(198,165,107,0.06)]
  "
>
  {/* brass edge glow */}
  <div className="absolute inset-0 rounded-2xl pointer-events-none border border-[#d6a84f]/20" />
  <div className="absolute top-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-[#f0c56e]/60 to-transparent" />

  {/* lantern — absolute right, peeking out */}
  <img
    src={lanternImg}
    alt=""
    className="absolute -right-3 top-0 h-full object-contain opacity-90 drop-shadow-[0_0_18px_rgba(198,165,107,0.4)] pointer-events-none"
  />

  <div className="flex items-center gap-3 pr-20">
    <img
      src={homeIcon}
      alt=""
      className="h-20 w-20 shrink-0 object-contain drop-shadow-[0_0_14px_rgba(198,165,107,0.45)]"
    />

    <div className="min-w-0 space-y-1.5">
      <div className="flex items-start gap-1.5">
        <motion.p
          key={rotatingSlogan}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.5 }}
          className="text-[11px] leading-snug text-[#c6a56b] italic flex-1"
        >
          {rotatingSlogan}
        </motion.p>
        <button
          type="button"
          onClick={() => setRotatingSlogan(getSlogan({ groupKey: "3PM" }))}
          className="shrink-0 text-[#6f5630] hover:text-[#c6a56b] transition-colors mt-0.5"
          title="Next slogan"
        >
          <RefreshCcw size={11} />
        </button>
      </div>

      {displayName && showHiLine && (
        <p className="text-[11px] leading-snug text-[#7f858c]">
          Ahoy {displayName}. However yesterday went, ye still made it back aboard.
        </p>
      )}
    </div>
  </div>
</section>
{/* NEXT MEETING */}
<section
  className="
    relative overflow-hidden
    rounded-2xl
    border border-[#8a642f]/45
    bg-[#080b0d]
    px-5 py-5
    shadow-[0_12px_35px_rgba(0,0,0,0.55),inset_0_0_30px_rgba(198,165,107,0.06)]
  "
>
  {/* same brass edge glow as hero */}
  <div className="absolute inset-0 rounded-2xl pointer-events-none border border-[#d6a84f]/20" />
  <div className="absolute top-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-[#f0c56e]/60 to-transparent" />

  {/* ship — absolute left, fading into background */}
  <img
    src={shipImg}
    alt=""
    className="absolute left-0 top-0 h-full w-36 object-cover object-right opacity-30 pointer-events-none"
    style={{ maskImage: "linear-gradient(to right, transparent, black 60%)", WebkitMaskImage: "linear-gradient(to right, transparent, black 60%)" }}
  />

  {/* content — offset right to clear ship */}
  <div className="relative pl-28">
    <p className="text-[10px] uppercase tracking-[0.28em] text-[#c6a56b] mb-1">
      Next meeting
    </p>

    <div className="flex items-end justify-between gap-3">
      <div>
        <p className="text-[28px] font-bold leading-none text-[#f3dfb1] tracking-tight">
          {timeUntilMeeting}
        </p>
        <p className="text-[11px] text-[#6b7078] mt-1">
          NARR Homegroup • Daily
        </p>
      </div>

      <a
        href="https://zoom.us/whatever"
        target="_blank"
        rel="noreferrer"
        className="shrink-0 inline-flex items-center gap-1.5 rounded-full border border-[#c6a56b]/60 bg-[#15171b] px-3 py-1.5 text-[11px] font-medium text-[#d4b06a] hover:bg-[#c6a56b]/10 hover:border-[#c6a56b]/80 transition-colors"
      >
        <Video size={13} />
        <span>Join Zoom</span>
      </a>
    </div>
  </div>

  {/* handwritten note — Caveat font, chalk-on-dark feel */}
  <div
    className="relative mt-4 pl-4"
    style={{ fontFamily: "'Caveat', cursive" }}
  >
    <p className="text-[15px] leading-tight text-[#7eb8c4] rotate-[-0.8deg]">
      We show up.
    </p>
    <p className="text-[13px] leading-tight text-[#6aa8b4] rotate-[-0.5deg] flex items-center gap-1.5">
      We show up. That's the whole toolkit.
      <Anchor size={11} className="text-[#5a98a4] mb-0.5" />
    </p>
  </div>
</section>




{/* Badge + status — ahora más premium */}
{/* Badge + status — ahora más premium */}
<section>
  {hasSoberDate ? (
    <div className="relative">
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-[#c6a56b]/20 via-[#6f5630]/10 to-[#c6a56b]/10 blur-xl opacity-60 pointer-events-none" />

      <div className="relative overflow-hidden rounded-3xl border border-[#6f5630]/30 bg-[#0f1012]/90 px-5 py-5 shadow-xl shadow-black/40">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#c6a56b]/30 to-transparent" />

        <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.18em] text-[#6b7078] mb-1">
          <span>Recovery medallion</span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#17120d] border border-[#c6a56b]/40 text-[#c6a56b]">
            {daysClean} day{daysClean === 1 ? "" : "s"} in
          </span>
        </div>

        <div className="mt-1 flex items-center gap-3">
          <RecoveryMedallion days={daysClean} />

          <div className="flex flex-col">
            <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#e5d3ad]">
              {daysClean} days aboard
            </span>
            <span className="text-[11px] text-[#8d9199] mt-1">
              Still afloat, matey. Yer addiction hates the view.
            </span>
            {cleanDateLabel && (
              <span className="text-[10px] text-[#4a4f58] mt-1">
                Since {cleanDateLabel}. Your old dealer is bored.
              </span>
            )}
          </div>
        </div>

        {nextMilestone && (
          <div className="flex justify-end mt-3">
            <span className="inline-flex items-center rounded-full border border-[#6f5630]/35 bg-[#17120d] px-2.5 py-0.5 text-[10px] text-[#6b7078]">
              Next milestone: {nextMilestone.label}
              <span className="ml-1 text-[#4a4f58]">
                ({nextMilestone.days - daysClean} day
                {nextMilestone.days - daysClean === 1 ? "" : "s"} left)
              </span>
            </span>
          </div>
        )}

        <Link
          to="/sober-date"
          className="inline-flex items-center gap-1 text-[10px] text-[#6b7078] hover:text-[#c6a56b] underline underline-offset-2 mt-3 transition-colors"
        >
          Change date
        </Link>
      </div>
    </div>
  ) : (
    <div className="rounded-2xl border border-dashed border-[#6f5630]/35 bg-[#0f1012]/70 px-5 py-4 space-y-2">
      <p className="text-sm text-[#8d9199]">
        Set your clean date so we can start counting the days you
        didn't self-destruct on purpose.
      </p>
      <Link
        to="/sober-date"
        className="inline-flex mt-2 text-xs font-medium text-[#c6a56b] hover:text-[#d4b06a] underline underline-offset-4 transition-colors"
      >
        Set clean date
      </Link>
    </div>
  )}
</section>


{/* TODAY'S TOOL — versión premium con micro-animación */}
<section>
<div className="relative overflow-hidden rounded-2xl border border-[#6f5630]/25 bg-[#0f1012]/70 px-4 py-4 shadow-lg shadow-black/40">
    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#c6a56b]/25 to-transparent" />
    <div className="pointer-events-none absolute -right-10 -top-14 h-24 w-24 rounded-full bg-[#c6a56b]/8 blur-3xl" />

    <button
      type="button"
      onClick={() => setIsToolOpen((p) => !p)}
      className="relative z-10 w-full flex items-center justify-between text-xs uppercase tracking-[0.18em] text-[#6b7078]"
    >
      <div className="flex items-center gap-2">
        <div className="h-5 w-5 flex items-center justify-center rounded-full bg-[#17120d] border border-[#c6a56b]/40">
          <Wrench size={11} className="text-[#c6a56b]" />
        </div>
        <span>Today's tool</span>
      </div>
      {isToolOpen ? (
        <ChevronUp size={14} className="text-[#6b7078]" />
      ) : (
        <ChevronDown size={14} className="text-[#6b7078]" />
      )}
    </button>

    {isToolOpen && (
      <motion.div
        key="tool-content"
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -6 }}
        transition={{ duration: 0.22 }}
        className="relative z-10 space-y-3 pt-3"
      >
        <p className="text-[11px] text-[#6b7078]">
          One tiny action to shift the whole day.
        </p>

        {toolLoading ? (
          <p className="text-[11px] text-[#4a4f58] italic">
            Loading today's tool…
          </p>
        ) : toolError ? (
          <p className="text-[11px] text-[#c97070]">
            Couldn't load today's tool.
          </p>
        ) : (
          <>
            <p className={`text-sm leading-snug font-medium ${toolDone ? "text-[#d4b06a]" : "text-[#e5d3ad]"}`}>
              {todaysToolTitle}
            </p>

            <div className="flex justify-end pt-1">
              <motion.button
                type="button"
                onClick={handleToggleToolDone}
                whileTap={{ scale: 0.94 }}
                animate={toolDone ? { scale: 1.03 } : { scale: 1 }}
                transition={{ type: "spring", stiffness: 260, damping: 18 }}
                className="relative inline-flex items-center"
              >
                <AnimatePresence>
                  {toolDone && (
                    <motion.span
                      key="tool-glow"
                      initial={{ opacity: 0, scale: 0.6 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.6 }}
                      className="absolute inset-0 rounded-full bg-[#c6a56b]/20 blur-sm"
                    />
                  )}
                </AnimatePresence>
                <span className={`relative inline-flex items-center gap-1 rounded-full border px-3 py-1.5 text-[10px] font-medium transition-colors ${
                  toolDone
                    ? "border-[#c6a56b]/70 bg-[#c6a56b]/10 text-[#e5d3ad]"
                    : "border-[#6f5630]/40 text-[#8d9199] hover:border-[#c6a56b]/60 hover:text-[#e5d3ad]"
                }`}>
                  <span className="text-[11px]">{toolDone ? "✓" : "○"}</span>
                  <span>{toolDone ? "Done for today" : "I did this"}</span>
                </span>
              </motion.button>
            </div>

            {toolDone && toolDoneLine && (
              <p className="text-[11px] text-[#c6a56b] italic pt-2 border-l border-[#c6a56b]/30 pl-2">
                {toolDoneLine}
              </p>
            )}

            {!toolDone && todaysTool && (
              <div className="flex justify-end pt-1">
                <button
                  type="button"
                  onClick={() => setIsToolGuideOpen(true)}
                  className="inline-flex items-center gap-1 text-[10px] text-[#6b7078] underline underline-offset-2 hover:text-[#c6a56b] transition-colors"
                >
                  <span className="inline-flex items-center justify-center w-4 h-4 rounded-full border border-[#6f5630]/40 text-[9px]">
                    ?
                  </span>
                  <span>How do I do this?</span>
                </button>
              </div>
            )}
          </>
        )}
      </motion.div>
    )}
  </div>
</section>


        

        {/* JFT – Premium teaser (sin CTA) */}
{/* JFT – Premium teaser con fecha + link suave */}
<section className="pt-2">
  <div className="relative overflow-hidden rounded-2xl border border-[#6f5630]/25 bg-[#0f1012]/70 px-4 py-4 shadow-lg shadow-black/30">
    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#c6a56b]/25 to-transparent" />

    <div className="flex items-center justify-between mb-1">
      <div className="flex items-center gap-2">
        <BookOpen size={14} className="text-[#c6a56b]" />
        <span className="text-xs uppercase tracking-[0.18em] text-[#6b7078]">
          Just for Today
        </span>
      </div>
      {!jftLoading && !jftError && jftEntry && (
        <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#17120d] border border-[#6f5630]/35 text-[#6b7078]">
          {String(jftEntry.month).padStart(2, "0")}/
          {String(jftEntry.day).padStart(2, "0")}
        </span>
      )}
    </div>

    {jftLoading && (
      <p className="text-[11px] text-[#4a4f58] italic">Loading…</p>
    )}
    {jftError && (
      <p className="text-[11px] text-[#c97070]">
        Couldn't load today's meditation.
      </p>
    )}

    {!jftLoading && !jftError && jftEntry && (
      <>
        <p className="text-sm font-medium text-[#e5d3ad] leading-snug line-clamp-1">
          {jftEntry.title}
        </p>
        {Array.isArray(jftEntry.punchlines) && jftEntry.punchlines.length > 0 && (
          <p className="text-[11px] text-[#c6a56b] italic mt-1 line-clamp-1">
            "{jftEntry.punchlines[Math.floor(Math.random() * jftEntry.punchlines.length)]}"
          </p>
        )}
        {/* <div className="pt-2 flex justify-end">
          <Link
            to="/jft"
            className="text-[10px] text-[#6b7078] hover:text-[#c6a56b] underline underline-offset-4 transition-colors"
          >
            Read more
          </Link>
        </div> */}
      </>
    )}
    {!jftLoading && !jftError && !jftEntry && (
      <p className="text-[11px] text-[#4a4f58]">No entry for today.</p>
    )}
  </div>
</section>



          {/* BLOQUES INFERIORES */}
          <section className="space-y-4 pt-2">

            {/* YOUR MILESTONES */}
            {hasSoberDate && (
              <div className="relative bg-[#0f1012]/70 border border-[#6f5630]/25 rounded-xl px-4 py-3 space-y-2">
                <div className="absolute top-0 left-0 right-0 h-px rounded-t-xl bg-gradient-to-r from-transparent via-[#c6a56b]/20 to-transparent" />
                <button
                  type="button"
                  onClick={() => setIsMilestonesOpen((p) => !p)}
                  className="w-full flex items-center justify-between text-xs uppercase tracking-[0.18em] text-[#6b7078]"
                >
                  <div className="flex items-center gap-2">
                    <Target size={13} className="text-[#c6a56b]" />
                    <span>Your milestones</span>
                  </div>
                  {isMilestonesOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </button>

                {isMilestonesOpen && (
                  <motion.div
                    key="my-milestones-content"
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.18 }}
                    className="space-y-2 pt-1"
                  >
                    {reachedMilestones.length === 0 ? (
                      <p className="text-[11px] text-[#4a4f58]">
                        Your first milestone is the white chip (24 hours). You're closer than you think.
                      </p>
                    ) : (
                      <>
                        <ul className="space-y-1 text-sm text-[#e5d3ad]">
                          {reachedMilestones.map((m) => {
                            const isTodayMilestone = m.days === daysClean;
                            return (
                              <li key={m.id} className="flex justify-between">
                                <span className="flex items-center gap-1.5">
                                  <MilestoneIcon milestone={m} isToday={isTodayMilestone} />
                                  <span>{m.label}</span>
                                </span>
                                <span className="text-[#6b7078]">
                                  {getMilestoneDate(soberDate, m.days)}
                                </span>
                              </li>
                            );
                          })}
                        </ul>
                        {lastPunch && (
                          <p className="text-[11px] text-[#c6a56b] italic pt-1">
                            "{lastPunch}"
                          </p>
                        )}
                      </>
                    )}

                    {nextMilestone && (
                      <p className="text-[11px] text-[#4a4f58] pt-1 flex items-center gap-1.5">
                        Next: <MilestoneIcon milestone={nextMilestone} />
                        {nextMilestone.label} •{" "}
                        {nextMilestone.days - daysClean} day{nextMilestone.days - daysClean === 1 ? "" : "s"} to go.
                      </p>
                    )}

                    <p className="pt-1">
                      <Link to="/chips" className="text-[11px] text-[#c6a56b] underline underline-offset-4 hover:text-[#d4b06a] transition-colors">
                        What do the chips mean?
                      </Link>
                    </p>
                  </motion.div>
                )}
              </div>
            )}

            {/* GROUP MILESTONES */}
            {groupMilestones.length > 0 && (
              <div className="relative bg-[#0f1012]/70 border border-[#6f5630]/25 rounded-xl px-4 py-3 space-y-2">
                <div className="absolute top-0 left-0 right-0 h-px rounded-t-xl bg-gradient-to-r from-transparent via-[#c6a56b]/20 to-transparent" />
                <button
                  type="button"
                  onClick={() => setIsGroupOpen((p) => !p)}
                  className="w-full flex items-center justify-between text-xs uppercase tracking-[0.18em] text-[#6b7078]"
                >
                  <div className="flex items-center gap-2">
                    <Users size={13} className="text-[#c6a56b]" />
                    <span>Group milestones this week</span>
                  </div>
                  {isGroupOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </button>

                {isGroupOpen && (
                  <div className="space-y-2 pt-1">
                    <span className="inline-block text-[10px] px-2 py-0.5 rounded-full bg-[#17120d] border border-[#6f5630]/30 text-[#8d9199]">
                      your homegroup
                    </span>

                    <ul className="space-y-1 text-sm text-[#e5d3ad] mt-1">
                      {groupMilestones.map(({ member, milestone, daysToGo }) => (
                        <li key={member.name + milestone.id} className="flex gap-2">
                          <span className={`text-base mt-[2px] ${daysToGo === 0 ? "icon-shimmer" : ""}`}>
                            <MilestoneIcon milestone={milestone} />
                          </span>
                          <div className="flex-1">
                            <div className="flex justify-between">
                              <span className="font-medium">{member.name}</span>
                              <span className="text-[11px] text-[#6b7078]">{milestone.label}</span>
                            </div>
                            <p className="text-[11px] text-[#6b7078]">
                              {daysToGo === 0 ? (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-400/60 text-[10px] font-semibold icon-shimmer">
                                  <span>🎉</span><span>today</span>
                                </span>
                              ) : (
                                <>{daysToGo} day{daysToGo === 1 ? "" : "s"} to go</>
                              )}
                            </p>
                          </div>
                        </li>
                      ))}
                    </ul>

                    <button
                      type="button"
                      onClick={() => setShowAllGroup((p) => !p)}
                      className="mt-3 w-full text-[11px] text-[#6b7078] hover:text-[#c6a56b] underline underline-offset-2 transition-colors"
                    >
                      {showAllGroup ? "Hide full milestone tracker" : "View all upcoming milestones"}
                    </button>

                    {showAllGroup && (
                      <div className="mt-3 border-t border-[#6f5630]/20 pt-3 space-y-2">
                        <h4 className="text-[10px] uppercase tracking-[0.18em] text-[#6b7078]">
                          Everyone's next chip
                        </h4>
                        <ul className="space-y-1 text-sm text-[#e5d3ad]">
                          {allNextMilestones.map(({ member, milestone, daysToGo }) => (
                            <li key={"all-" + member.name + milestone.id} className="flex gap-2">
                              <span className={`text-base mt-[2px] ${daysToGo === 0 ? "icon-shimmer" : ""}`}>
                                <MilestoneIcon milestone={milestone} />
                              </span>
                              <div className="flex-1">
                                <div className="flex justify-between">
                                  <span className="font-medium">{member.name}</span>
                                  <span className="text-[11px] text-[#6b7078]">{milestone.label}</span>
                                </div>
                                <p className="text-[11px] text-[#6b7078]">
                                  {daysToGo === 0 ? (
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-400/60 text-[10px] font-semibold icon-shimmer">
                                      <span>🎉</span><span>today</span>
                                    </span>
                                  ) : (
                                    <>{daysToGo} day{daysToGo === 1 ? "" : "s"} to go</>
                                  )}
                                </p>
                              </div>
                            </li>
                          ))}
                        </ul>
                        <p className="text-[10px] text-[#4a4f58]">
                          Different milestones. Same urge to bolt. Still showed up at NARR.
                        </p>
                      </div>
                    )}

                    <p className="text-[10px] text-[#4a4f58]">
                      This isn't a competition. It's proof that people like you are still doing this.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* GRATITUDES */}
            <div className="relative bg-[#0f1012]/70 border border-[#6f5630]/25 rounded-xl px-4 py-3 space-y-2">
              <div className="absolute top-0 left-0 right-0 h-px rounded-t-xl bg-gradient-to-r from-transparent via-[#c6a56b]/20 to-transparent" />
              <button
                type="button"
                onClick={() => setIsGratsOpen((p) => !p)}
                className="w-full flex items-center justify-between text-xs uppercase tracking-[0.18em] text-[#6b7078]"
              >
                <div className="flex items-center gap-2">
                  <Sparkles size={14} className="text-[#c6a56b]" />
                  <span>Gratitudes</span>
                </div>
                {isGratsOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>

              {isGratsOpen && (
                <div className="border-t border-[#6f5630]/20 pt-2 space-y-2">
                  {gratitudeStats?.thisWeek > 0 && (
                    <p className="text-[10px] text-[#4a4f58] mb-1">
                      You've added {gratitudeStats.thisWeek} gratitude{gratitudeStats.thisWeek === 1 ? "" : "s"} this week.
                    </p>
                  )}
                  {lastGratitude ? (
                    <div className="border-l border-[#c6a56b]/30 pl-3">
                      <p className="text-[11px] text-[#6b7078] mb-1">Your latest gratitude:</p>
                      <p className="text-sm text-[#e5d3ad] leading-snug">"{lastGratitude}"</p>
                    </div>
                  ) : (
                    <p className="text-sm text-[#8d9199]">
                      Start with one sentence. It doesn't have to be deep, just honest.
                    </p>
                  )}
                  {/* <div className="flex gap-2 pt-1">
                    <Link
                      to="/gratitudes/new"
                      className="flex-1 text-[11px] text-center border border-[#c6a56b]/60 text-[#e5d3ad] rounded-lg py-1.5 hover:bg-[#c6a56b]/10 transition-colors"
                    >
                      Add gratitude
                    </Link>
                    <Link
                      to="/gratitudes"
                      className="flex-1 text-[11px] text-center border border-[#6f5630]/30 text-[#8d9199] rounded-lg py-1.5 hover:bg-[#17120d] hover:text-[#e5d3ad] transition-colors"
                    >
                      View all
                    </Link>
                  </div> */}
                </div>
              )}
            </div>

            {/* MY WHY */}
            <div className="relative bg-[#0f1012]/70 border border-[#6f5630]/25 rounded-xl px-4 py-3 space-y-2">
              <div className="absolute top-0 left-0 right-0 h-px rounded-t-xl bg-gradient-to-r from-transparent via-[#c6a56b]/20 to-transparent" />
              <button
                type="button"
                onClick={() => setIsWhyOpen((p) => !p)}
                className="w-full flex items-center justify-between text-xs uppercase tracking-[0.18em] text-[#6b7078]"
              >
                <div className="flex items-center gap-2">
                  <Flame size={14} className="text-[#c6a56b]" />
                  <span>My why</span>
                </div>
                {isWhyOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>

              {isWhyOpen && (
                <div className="border-t border-[#6f5630]/20 pt-2 space-y-2">
                  <div className="border-l border-[#c6a56b]/30 pl-3">
                    {savedWhy ? (
                      <>
                        <p className="text-[11px] text-[#6b7078] mb-1">The sentence you don't want to forget:</p>
                        <p className="text-sm text-[#e5d3ad] italic leading-snug">"{savedWhy}"</p>
                      </>
                    ) : (
                      <p className="text-sm text-[#8d9199]">
                        Save one line future you can read when everything in your head says "use".
                      </p>
                    )}
                  </div>
                  {/* <div className="flex justify-end pt-1">
                    <Link
                      to="/my-why"
                      className="text-[11px] text-[#c6a56b] underline underline-offset-4 hover:text-[#d4b06a] transition-colors"
                    >
                      {savedWhy ? "Change my why" : "Write my why"}
                    </Link>
                  </div> */}
                </div>
              )}
            </div>

            {/* OLDCOMERS */}
            <div className="relative bg-[#0f1012]/70 border border-[#6f5630]/25 rounded-xl px-4 py-3 space-y-2">
              <div className="absolute top-0 left-0 right-0 h-px rounded-t-xl bg-gradient-to-r from-transparent via-[#c6a56b]/20 to-transparent" />
              <button
                type="button"
                onClick={() => setIsOldOpen((p) => !p)}
                className="w-full flex items-center justify-between text-xs uppercase tracking-[0.18em] text-[#6b7078]"
              >
                <div className="flex items-center gap-2">
                  <Award size={13} className="text-[#d4b06a]" />
                  <span>The Oldcomers</span>
                </div>
                {isOldOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>

              {isOldOpen && (
                <>
                  <ul className="space-y-2 text-sm text-[#e5d3ad] pt-1">
                    {OLDCOMERS.map((person) => {
                      const Icon = ICONS[person.icon] || Medal;
                      return (
                        <li
                          key={person.name}
                          className="flex items-center justify-between bg-[#0b0c0f] border border-[#6f5630]/20 rounded-lg px-3 py-2"
                        >
                          <div className="flex items-center gap-2">
                            {Icon && <Icon size={16} className="text-[#c6a56b] icon-shimmer" />}
                            <span>{person.name}</span>
                          </div>
                          <span className="text-[11px] text-[#6b7078]">
                            {getCleanTime(person.soberDate)}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                  <p className="text-[10px] text-[#4a4f58] pt-1">
                    They kept coming. That's all anyone ever did.
                  </p>
                </>
              )}
            </div>
          </section>

          {/* Modal de herramienta guiada */}
          <GuidedToolModal
            open={isToolGuideOpen}
            onClose={() => setIsToolGuideOpen(false)}
            tool={todaysTool}
          />

          {/* Boss access (super stealth) */}
          <Link
            to="/boss"
            className="text-[10px] text-[#1e2025] hover:text-[#6f5630] underline underline-offset-2 block text-right transition-colors"
          >
            system / root / backdoor / control panel
          </Link>
        </div>
      </main>
      {/* <BottomNav /> */}
    </div>
  );
}
