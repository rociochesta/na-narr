// src/components/ProfileMenu.jsx
import React, { useEffect } from "react";
import {
  X,
  LogOut,
  Settings,
  Info,
  User,
  CalendarClock,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function ProfileMenu({ userProfile, onClose }) {
  const navigate = useNavigate();

  // cerrar con ESC
  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const displayName = userProfile?.display_name || "Friend";
  const cleanDate = userProfile?.sober_date || null; // si lo tienes guardado ahí

  const goToSoberDate = () => {
    onClose?.();
    navigate("/sober-date");
  };

  return (
    <div
      className="fixed inset-0 z-40 bg-black/50"
      onClick={onClose}
    >
      {/* Panel anclado al header, arriba a la derecha */}
      <div
        className="
          absolute right-4 top-[3.25rem] w-64
          rounded-2xl
          border border-[#6f5630]/40
          bg-[#0d0e11]/97
          shadow-[0_8px_40px_rgba(0,0,0,0.6)]
          backdrop-blur-xl
          p-3
        "
        onClick={(e) => e.stopPropagation()}
      >
        {/* subtle gold top glow */}
        <div className="absolute top-0 left-0 right-0 h-px rounded-t-2xl bg-gradient-to-r from-transparent via-[#c6a56b]/35 to-transparent" />

        {/* Header del menú */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-[#17120d] border border-[#c6a56b]/60 flex items-center justify-center shadow-[0_0_10px_rgba(198,165,107,0.12)]">
              <User size={16} className="text-[#d4b06a]" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] uppercase tracking-[0.20em] text-[#6f5630]">
                Aboard as
              </span>
              <span className="text-sm font-medium text-[#e5d3ad] truncate max-w-[9rem]">
                {displayName}
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-[#1a1610] text-[#6b7078] hover:text-[#c6a56b] transition-colors"
            aria-label="Close profile menu"
          >
            <X size={14} />
          </button>
        </div>

        {cleanDate && (
          <div className="flex items-center gap-2 mb-3 text-[11px] text-[#6b7078]">
            <CalendarClock size={13} className="text-[#c6a56b]" />
            <span>Clean date: {cleanDate}</span>
          </div>
        )}

        <hr className="border-[#6f5630]/25 mb-2" />

        {/* Opciones */}
        <nav className="flex flex-col gap-0.5 text-sm">
          <button
            type="button"
            onClick={() => console.log("TODO: ir a perfil")}
            className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-[#17120d] text-left text-[#8d9199] hover:text-[#e5d3ad] transition-colors"
          >
            <User size={14} className="text-[#6f5630]" />
            <span>My profile</span>
          </button>

          <button
            type="button"
            onClick={goToSoberDate}
            className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-[#17120d] text-left text-[#8d9199] hover:text-[#e5d3ad] transition-colors"
          >
            <CalendarClock size={14} className="text-[#6f5630]" />
            <span>Change clean date</span>
          </button>

          {/* TODO: multi-group */}
          <button
            type="button"
            onClick={() => console.log("TODO: seleccionar grupo")}
            className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-[#17120d] text-left text-[#8d9199] hover:text-[#e5d3ad] transition-colors"
          >
            <Info size={14} className="text-[#6f5630]" />
            <span>My group (3PM)</span>
          </button>

          <button
            type="button"
            onClick={() => console.log("TODO: abrir settings")}
            className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-[#17120d] text-left text-[#8d9199] hover:text-[#e5d3ad] transition-colors"
          >
            <Settings size={14} className="text-[#6f5630]" />
            <span>Settings</span>
          </button>

          <button
            type="button"
            onClick={() => console.log("TODO: about this app")}
            className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-[#17120d] text-left text-[#8d9199] hover:text-[#e5d3ad] transition-colors"
          >
            <Info size={14} className="text-[#6f5630]" />
            <span>About 3PMers</span>
          </button>
        </nav>

        <hr className="border-[#6f5630]/25 my-2" />

        <button
          type="button"
          onClick={() => console.log("TODO: log out")}
          className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-[#2a0f0f]/50 text-left text-xs text-[#7a3535] hover:text-[#c97070] transition-colors"
        >
          <LogOut size={13} />
          <span>Log out</span>
        </button>
      </div>
    </div>
  );
}
