// src/components/PublicHeader.jsx
import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { Menu, X, Home, Coins, ShieldCheck, Info } from "lucide-react";
import naIcon from "../assets/naicon.png";

const NAV_ITEMS = [
  { to: "/", label: "Home", icon: Home, end: true },
  { to: "/seventh-tradition", label: "7th Tradition", icon: Coins },
  { to: "/meeting-verification", label: "Meeting Verification", icon: ShieldCheck },
  { to: "/about", label: "About", icon: Info },
];

export default function PublicHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const linkClass = ({ isActive }) =>
    `flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors ${
      isActive
        ? "text-[#f4d48a] bg-[#c6a56b]/10"
        : "text-[#9b9da3] hover:text-[#e5d3ad] hover:bg-[#c6a56b]/5"
    }`;

  return (
    <header
      className="
        sticky top-0 z-30
        border-b border-[#6f5630]/35
        bg-[#090807]/95
        backdrop-blur-xl
        shadow-[0_8px_30px_rgba(0,0,0,0.55)]
      "
    >
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#c6a56b]/45 to-transparent" />

      <div className="max-w-3xl mx-auto px-4 py-2.5 flex items-center gap-3">
        <div
          className="
            h-9 w-11 shrink-0 rounded-full
            border border-[#c6a56b]/75
            bg-gradient-to-br from-[#211609] via-[#0e0d0b] to-[#050505]
            flex items-center justify-center
            overflow-hidden
            shadow-[0_0_16px_rgba(198,165,107,0.25),inset_0_0_10px_rgba(255,205,105,0.08)]
          "
        >
          <img src={naIcon} alt="NARR" className="h-full w-full object-cover" />
        </div>

        <p className="text-[15px] leading-none font-semibold tracking-[0.28em] text-[#f4d48a]">
          NARR
        </p>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1 ml-auto">
          {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
            <NavLink key={to} to={to} end={end} className={linkClass}>
              <Icon size={14} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Mobile toggle */}
        <button
          type="button"
          onClick={() => setIsMenuOpen((p) => !p)}
          className="
            md:hidden ml-auto
            h-9 w-9 shrink-0 rounded-full
            border border-[#6f5630]/55
            bg-[#121214]
            text-[#9b9da3]
            hover:text-[#f4d48a]
            hover:border-[#c6a56b]/80
            transition-colors
            flex items-center justify-center
          "
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={isMenuOpen}
        >
          {isMenuOpen ? <X size={16} /> : <Menu size={16} />}
        </button>
      </div>

      {/* Mobile dropdown */}
      {isMenuOpen && (
        <nav className="md:hidden border-t border-[#6f5630]/25 bg-[#090807]/98 px-4 py-2 space-y-0.5">
          {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={() => setIsMenuOpen(false)}
              className={linkClass}
            >
              <Icon size={14} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>
      )}
    </header>
  );
}
