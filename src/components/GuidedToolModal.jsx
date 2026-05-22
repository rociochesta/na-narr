// src/components/GuidedToolModal.jsx
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

export default function GuidedToolModal({ open, onClose, tool }) {
  if (!open || !tool) return null;

  const randomPunch =
    Array.isArray(tool.punchlines) && tool.punchlines.length > 0
      ? tool.punchlines[Math.floor(Math.random() * tool.punchlines.length)]
      : null;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-40 flex items-center justify-center bg-black/75 px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="
              relative w-full max-w-md
              rounded-2xl
              border border-[#6f5630]/35
              bg-[#0b0c0f]/95
              shadow-[0_18px_60px_rgba(0,0,0,0.65)]
              px-4 py-4 space-y-3
              backdrop-blur-xl
            "
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 10, opacity: 0 }}
            transition={{ duration: 0.18 }}
          >
            {/* subtle gold top glow */}
            <div className="absolute top-0 left-5 right-5 h-px bg-gradient-to-r from-transparent via-[#c6a56b]/50 to-transparent" />

            {/* Close button */}
            <button
              type="button"
              onClick={onClose}
              className="absolute right-3 top-3 text-[#7b8088] hover:text-[#d4b06a] transition-colors"
            >
              <X size={16} />
            </button>

            {/* Header */}
            <div className="space-y-1 pr-6">
              <p className="text-[11px] uppercase tracking-[0.16em] text-[#8b7650]">
                Today&apos;s tool — guided
              </p>
              <h2 className="text-sm font-semibold text-[#f4ead7] leading-snug">
                {tool.title}
              </h2>
            </div>

            {/* HOW */}
            {Array.isArray(tool.how) && tool.how.length > 0 && (
              <div className="space-y-1">
                <p className="text-[11px] text-[#a79262]">How to do it:</p>
                <ul className="list-disc list-inside space-y-1 text-[12px] text-[#e8dcc4]">
                  {tool.how.map((step, idx) => (
                    <li key={idx}>{step}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* WHY */}
            {tool.why && (
              <div className="space-y-1">
                <p className="text-[11px] text-[#a79262]">Why this helps:</p>
                <p className="text-[12px] text-[#e8dcc4] leading-snug">
                  {tool.why}
                </p>
              </div>
            )}

            {/* PUNCHLINE */}
            {randomPunch && (
              <p className="text-[12px] text-[#d4b06a] italic border-t border-[#6f5630]/30 pt-2">
                “{randomPunch}”
              </p>
            )}

            {/* Footer */}
            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={onClose}
                className="
                  text-[11px]
                  px-3 py-1.5
                  rounded-full
                  border border-[#6f5630]/50
                  text-[#f4ead7]
                  hover:bg-[#1a1410]
                  hover:border-[#c6a56b]/70
                  hover:text-[#d4b06a]
                  transition-colors
                "
              >
                Aye, I got it
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}