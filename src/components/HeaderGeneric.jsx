// src/components/HeaderGeneric.jsx
import React, { useEffect, useMemo, useState } from "react";
import { Menu } from "lucide-react";
import { getSlogan } from "../utils/getSlogan.js";

// Abbreviate a group name to at most 4 chars (e.g. "3PM Recovery" → "3PM")
function abbreviate(name) {
  const words = name.trim().split(/\s+/);
  if (words.length === 1) return words[0].slice(0, 4).toUpperCase();
  return words.map((w) => w[0]).join("").slice(0, 4).toUpperCase();
}

export default function HeaderGeneric({ group = "NA Group", showMenu = true }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [slogan, setSlogan] = useState("…");

  const groupId = useMemo(() => {
    try { return window.localStorage.getItem("na_groupId") || null; } catch { return null; }
  }, []);

  const groupCode = useMemo(() => {
    try { return window.localStorage.getItem("na_groupCode") || null; } catch { return null; }
  }, []);

  useEffect(() => {
    const loadSloganFromDb = async () => {
      try {
        const url = groupId
          ? `/.netlify/functions/get-slogan?groupId=${encodeURIComponent(groupId)}`
          : "/.netlify/functions/get-slogan";

        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const data = await res.json();
        if (data?.text) setSlogan(data.text);
        else setSlogan(getSlogan({ groupKey: groupCode || undefined }));
      } catch (err) {
        console.error("No se pudo cargar el slogan desde la DB:", err);
        setSlogan(getSlogan({ groupKey: groupCode || undefined }));
      }
    };

    loadSloganFromDb();
  }, [groupId, groupCode]);

  return (
    <>
      <header
        className="
          sticky top-0 z-20
          border-b border-[#6f5630]/25
          bg-[#0b0c0f]/95
          backdrop-blur-xl
        "
      >
        {/* subtle gold glow line */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#c6a56b]/35 to-transparent" />

        <div className="max-w-md mx-auto px-4 py-3 flex items-center justify-between gap-3">

          {/* Group badge */}
          <div className="flex items-center gap-2">
            <div
              className="
                h-8 w-8 rounded-full
                border border-[#c6a56b]/70
                bg-[#17120d]
                flex items-center justify-center
                text-[10px] font-semibold
                text-[#d4b06a]
                shadow-[0_0_12px_rgba(198,165,107,0.15)]
              "
            >
              {abbreviate(group)}
            </div>

            <div className="flex flex-col leading-tight">
              <span className="text-[10px] uppercase tracking-[0.22em] text-[#c6a56b]">
                NARR
              </span>
              <span className="text-[11px] text-[#777b84]">
                {group}
              </span>
            </div>
          </div>

          {/* Slogan */}
          <div className="flex-1 text-right">
            <p className="text-[11px] text-[#e5d3ad] font-medium leading-snug">
              {slogan || "…"}
            </p>
          </div>

          {/* Menu button */}
          {showMenu && (
            <button
              type="button"
              onClick={() => setIsMenuOpen(true)}
              className="
                ml-1 h-8 w-8 rounded-full
                border border-[#6f5630]/40
                bg-[#15171b]
                text-[#8d9199]
                hover:text-[#d4b06a]
                hover:border-[#c6a56b]/70
                transition-colors
                flex items-center justify-center
              "
            >
              <Menu size={16} />
            </button>
          )}
        </div>
      </header>

      {/* {isMenuOpen && <YourMenu onClose={() => setIsMenuOpen(false)} />} */}
    </>
  );
}
