// src/pages/PublicHome.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Video, Anchor } from "lucide-react";
import PublicHeader from "../components/PublicHeader.jsx";
import { getTimeUntilMeeting } from "../utils/getTimeUntilMeeting.js";
import narrIcon from "../assets/narrrnewicon.png";
import shipImg from "../assets/ship.png";
import RangersHome from "./RangersHome.jsx";
import useHomeTheme from "../hooks/useHomeTheme.js";
import "./RangersHome.css";

const ZOOM_URL = "https://zoom.us/whatever";

export default function PublicHome() {
  const [theme, changeTheme] = useHomeTheme();
  const [timeUntilMeeting, setTimeUntilMeeting] = useState("");

  const hasProfile =
    Boolean(window.localStorage.getItem("na_userProfile")) ||
    Boolean(window.localStorage.getItem("na_memberId"));

  useEffect(() => {
    function update() {
      setTimeUntilMeeting(getTimeUntilMeeting());
    }
    update();
    const id = setInterval(update, 30 * 1000);
    return () => clearInterval(id);
  }, []);

  if (theme === "rangers") {
    return <RangersHome timeUntilMeeting={timeUntilMeeting} hasProfile={hasProfile} zoomUrl={ZOOM_URL} onThemeChange={changeTheme} />;
  }

  return (
    <div className="min-h-screen bg-[#0b0c0f] text-[#e5d3ad] flex flex-col">
      <PublicHeader theme={theme} onThemeChange={changeTheme} />

      <main className="flex-1">
        <div className="max-w-md md:max-w-2xl mx-auto px-4 py-8 md:py-12 space-y-6">
          {/* Welcome hero */}
          <section
            className="
              relative overflow-hidden
              rounded-2xl
              border border-[#8a642f]/45
              bg-[#080b0d]
              px-5 py-8 md:py-10
              text-center
              shadow-[0_12px_35px_rgba(0,0,0,0.55),inset_0_0_30px_rgba(198,165,107,0.06)]
            "
          >
            <div className="absolute inset-0 rounded-2xl pointer-events-none border border-[#d6a84f]/20" />
            <div className="absolute top-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-[#f0c56e]/60 to-transparent" />

            <img
              src={narrIcon}
              alt="NARR"
              className="mx-auto h-28 w-28 md:h-32 md:w-32 object-contain drop-shadow-[0_0_18px_rgba(198,165,107,0.45)]"
            />

            <h1 className="mt-4 text-2xl md:text-3xl font-semibold tracking-[0.08em] text-[#f3dfb1]">
              NA RECOVERY RANGERS
            </h1>
            <p className="mt-2 text-sm text-[#8d9199] max-w-sm mx-auto">
              Whoever you are, however you got here — there's a cabin for you.
            </p>
          </section>

          {/* Next meeting */}
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
            <div className="absolute inset-0 rounded-2xl pointer-events-none border border-[#d6a84f]/20" />
            <div className="absolute top-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-[#f0c56e]/60 to-transparent" />

            <img
              src={shipImg}
              alt=""
              className="absolute left-0 top-0 h-full w-36 object-cover object-right opacity-30 pointer-events-none"
              style={{
                maskImage: "linear-gradient(to right, transparent, black 60%)",
                WebkitMaskImage: "linear-gradient(to right, transparent, black 60%)",
              }}
            />

            <div className="relative pl-28 md:pl-32">
              <p className="text-[10px] uppercase tracking-[0.28em] text-[#c6a56b] mb-1">
                Next meeting
              </p>

              <div className="flex items-end justify-between gap-3 flex-wrap">
                <div>
                  <p className="text-[28px] font-bold leading-none text-[#f3dfb1] tracking-tight">
                    {timeUntilMeeting}
                  </p>
                  <p className="text-[11px] text-[#6b7078] mt-1">
                    NARR Homegroup • Daily
                  </p>
                </div>

                <a
                  href={ZOOM_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="shrink-0 inline-flex items-center gap-1.5 rounded-full border border-[#c6a56b]/60 bg-[#15171b] px-3 py-1.5 text-[11px] font-medium text-[#d4b06a] hover:bg-[#c6a56b]/10 hover:border-[#c6a56b]/80 transition-colors"
                >
                  <Video size={13} />
                  <span>Join Zoom</span>
                </a>
              </div>
            </div>

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

          <p className="text-center text-[11px] text-[#6b7078]">
            {hasProfile ? (
              <>
                Welcome back.{" "}
                <Link
                  to="/dashboard"
                  className="text-[#c6a56b] hover:text-[#d4b06a] underline underline-offset-4 transition-colors"
                >
                  Continue to my home
                </Link>
              </>
            ) : (
              <>
                Already part of the crew?{" "}
                <Link
                  to="/login"
                  className="text-[#c6a56b] hover:text-[#d4b06a] underline underline-offset-4 transition-colors"
                >
                  Log in
                </Link>
              </>
            )}
          </p>
        </div>
      </main>
    </div>
  );
}
