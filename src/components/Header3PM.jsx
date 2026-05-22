// src/components/Header3PM.jsx
import React, { useState, useEffect } from "react";
import { User } from "lucide-react";
import ProfileMenu from "./ProfileMenu.jsx";
import naIcon from "../assets/naicon.png";
import disclaimerImg from "../assets/disclaimer.png";

export default function Header3PM({ showMenu = true }) {
  const [userProfile, setUserProfile] = useState(null);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem("na_userProfile");
      if (raw) setUserProfile(JSON.parse(raw));
    } catch (err) {
      console.error("Error loading sailor profile:", err);
    }
  }, []);

  const userInitial =
    (userProfile?.display_name || userProfile?.name || "")
      .trim()
      .charAt(0)
      .toUpperCase() || null;

  return (
    <>
      <header
        className="
          sticky top-0 z-20
          border-b border-[#6f5630]/35
          bg-[#090807]/95
          backdrop-blur-xl
          shadow-[0_8px_30px_rgba(0,0,0,0.55)]
        "
      >
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#c6a56b]/45 to-transparent" />

        <div className="max-w-md mx-auto px-3 py-2.5 flex items-center gap-3">
          <div
            className="
              h-10 w-10 shrink-0 rounded-full
              border border-[#c6a56b]/75
              bg-gradient-to-br from-[#211609] via-[#0e0d0b] to-[#050505]
              flex items-center justify-center
              overflow-hidden
              shadow-[0_0_16px_rgba(198,165,107,0.25),inset_0_0_10px_rgba(255,205,105,0.08)]
            "
          >
            <img src={naIcon} alt="NA" className="h-full w-full object-cover" />
          </div>

          <div className="min-w-0 shrink-0">
            <p className="text-[15px] leading-none font-semibold tracking-[0.28em] text-[#f4d48a]">
              NARR
            </p>
            <p className="mt-1 text-[11px] leading-none text-[#9b8c72]">
              Recovery crew
            </p>
          </div>

          <div className="flex-1 min-w-0 rotate-[-1deg]">
            <img
              src={disclaimerImg}
              alt="Disclaimer: NARR stands for NA Rocio Recovery"
              className="w-full h-auto object-contain"
            />
          </div>

          {/* Profile button */}
          {showMenu && (
            <button
              type="button"
              onClick={() => setIsProfileMenuOpen(true)}
              className="
                h-10 w-10 shrink-0 rounded-full
                border border-[#6f5630]/55
                bg-[#121214]
                text-[#9b9da3]
                hover:text-[#f4d48a]
                hover:border-[#c6a56b]/80
                transition-colors
                flex items-center justify-center
                text-[12px] font-semibold
                shadow-[inset_0_0_10px_rgba(255,205,105,0.04)]
              "
            >
              {userInitial ? <span>{userInitial}</span> : <User size={16} />}
            </button>
          )}
        </div>
      </header>

      {isProfileMenuOpen && (
        <ProfileMenu
          userProfile={userProfile}
          onClose={() => setIsProfileMenuOpen(false)}
        />
      )}
    </>
  );
}