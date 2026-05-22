// src/components/BottomNav.jsx
import React from "react";
import { NavLink } from "react-router-dom";
import { Home, Hammer, UsersRound, User } from "lucide-react";

export default function BottomNav() {
  const navItems = [
    { to: "/", label: "Home", icon: Home },
    { to: "/tools", label: "Tools", icon: Hammer },
    { to: "/group", label: "Group", icon: UsersRound },
    { to: "/me", label: "Me", icon: User },
  ];

  return (
    <nav
      className="
        fixed bottom-0 left-0 right-0 z-30
        bg-[#0b0c0f]/95
        border-t border-[#6f5630]/30
        backdrop-blur-lg
        shadow-[0_-8px_30px_rgba(0,0,0,0.45)]
      "
    >
      {/* subtle gold top glow */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#c6a56b]/40 to-transparent" />

      <div className="max-w-md mx-auto flex justify-between px-6 py-3">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end
            className={({ isActive }) =>
              `group relative flex flex-col items-center gap-1 transition-all duration-200 ${
                isActive
                  ? "text-[#d4b06a]"
                  : "text-[#6b7078] hover:text-[#c6a56b]"
              }`
            }
          >
            {({ isActive }) => (
              <>
                {/* active glow */}
                {isActive && (
                  <div
                    className="
                      absolute -top-2 w-7 h-[2px]
                      rounded-full
                      bg-[#d4b06a]
                      blur-sm
                      opacity-80
                    "
                  />
                )}

                <Icon
                  size={18}
                  className={
                    label === "Tools"
                      ? "transition-transform duration-150 group-hover:-translate-y-0.5 group-hover:-rotate-6"
                      : "transition-transform duration-150 group-hover:-translate-y-0.5"
                  }
                />

                <span className="text-[10px] font-medium tracking-wide">
                  {label}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}