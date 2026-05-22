// src/pages/Admin.jsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Users, Plus, Quote } from "lucide-react";

//import { loadGroupMembers } from "../constants/groupMembers.js";
import { SLOGAN_SETS } from "../constants/slogans.js";
import BottomNav from "../components/BottomNav";


export default function Admin() {
  const [name, setName] = useState("");
  const [soberDate, setSoberDate] = useState("");
  const [members, setMembers] = useState([]);

  const [slogans, setSlogans] = useState([]);
  const [newSlogan, setNewSlogan] = useState("");

  const nav = useNavigate();

  useEffect(() => {
    // check boss access
    const ok = window.localStorage.getItem("na_boss") === "1";
    if (!ok) nav("/boss");
  }, [nav]);

useEffect(() => {
  (async () => {
    try {
      const groupId = window.localStorage.getItem("na_groupId");
      if (!groupId) {
        console.warn("Admin: no na_groupId in localStorage");
        setMembers([]);
        return;
      }

      const res = await fetch("/.netlify/functions/get-group-members", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ groupId }),
      });

      const data = await res.json();
      if (!res.ok) {
        console.error("get-group-members failed:", data);
        setMembers([]);
        return;
      }

      setMembers(data.members || []);
    } catch (e) {
      console.error("Admin load members failed:", e);
      setMembers([]);
    }
  })();

  // slogans: por ahora mock
  const base = SLOGAN_SETS["3PM"] || [];
  setSlogans(base);
}, []);


  // Por ahora solo front: no guarda nada, no toca el JSON.
  function handleFakeSubmit(e) {
    e.preventDefault();
    console.log("Preview new member (not saved yet):", { name, soberDate });
  }

  // Mock para añadir slogan (solo front)
  function handleAddSlogan(e) {
    e.preventDefault();
    const text = newSlogan.trim();
    if (!text) return;

    const preview = {
      id: `preview-${Date.now()}`,
      groupKey: "3PM", // más adelante será dinámico por grupo
      text,
    };

    console.log("Preview new slogan (not saved yet):", preview);

    // lo agregamos sólo en memoria, al principio de la lista
    setSlogans((prev) => [preview, ...prev]);
    setNewSlogan("");
  }

  return (
    <div className="min-h-screen bg-[#0b0c0f] text-[#e5d3ad] flex justify-center">
      <main className="w-full max-w-md px-4 py-6 space-y-6">

        {/* Header */}
        <header className="flex items-center justify-between gap-3">
          <Link
            to="/"
            className="inline-flex items-center gap-1 text-[11px] text-[#6b7078] hover:text-[#c6a56b] transition-colors"
          >
            <ArrowLeft size={14} />
            <span>Back home</span>
          </Link>

          <p className="text-[11px] uppercase tracking-[0.20em] text-[#6f5630]">
            Captain&apos;s quarters
          </p>
        </header>

        {/* Title */}
        <section className="space-y-1">
          <h1 className="text-lg font-semibold flex items-center gap-2">
            <Users size={18} className="text-[#c6a56b]" />
            <span className="text-[#e5d3ad]">Group admin</span>
          </h1>
          <p className="text-[12px] text-[#6b7078]">
            Aquí vas a poder editar miembros, slogans y tablas cuando tengamos
            base de datos. Por ahora, solo visual y mock.
          </p>
        </section>

        {/* Current members */}
        <section className="space-y-2">
          <h2 className="text-[11px] font-semibold uppercase tracking-[0.20em] text-[#c6a56b]">
            Current crew
          </h2>

          <div className="relative bg-[#0f1012]/70 border border-[#6f5630]/25 rounded-xl p-3 space-y-2 max-h-64 overflow-y-auto">
            <div className="absolute top-0 left-0 right-0 h-px rounded-t-xl bg-gradient-to-r from-transparent via-[#c6a56b]/25 to-transparent" />
            {members.map((m, idx) => (
              <div
                key={`${m.name}-${idx}`}
                className="flex items-center justify-between text-[12px] border-b border-[#6f5630]/15 last:border-none pb-1.5 last:pb-0"
              >
                <span className="text-[#e5d3ad]">{m.display_name}</span>
                <span className="text-[11px] text-[#6b7078]">
                  {m.sober_date || "—"}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Add member */}
        <section className="space-y-2">
          <h2 className="text-[11px] font-semibold uppercase tracking-[0.20em] text-[#c6a56b]">
            Add crew member (preview only)
          </h2>

          <form
            onSubmit={handleFakeSubmit}
            className="relative bg-[#0f1012]/70 border border-[#6f5630]/25 rounded-xl p-4 space-y-3"
          >
            <div className="absolute top-0 left-0 right-0 h-px rounded-t-xl bg-gradient-to-r from-transparent via-[#c6a56b]/25 to-transparent" />

            <div className="flex flex-col gap-1">
              <label className="text-[11px] text-[#6b7078]">Name</label>
              <input
                type="text"
                className="bg-[#0b0c0f] border border-[#6f5630]/35 rounded-md px-2 py-1.5 text-[12px] text-[#e5d3ad] placeholder:text-[#4a4f58] outline-none focus:border-[#c6a56b]/70 transition-colors"
                placeholder="NA name / nickname"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[11px] text-[#6b7078]">
                Sober date (YYYY-MM-DD)
              </label>
              <input
                type="date"
                className="bg-[#0b0c0f] border border-[#6f5630]/35 rounded-md px-2 py-1.5 text-[12px] text-[#e5d3ad] outline-none focus:border-[#c6a56b]/70 transition-colors"
                value={soberDate}
                onChange={(e) => setSoberDate(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="inline-flex items-center gap-1 rounded-full border border-[#6f5630]/40 bg-[#15171b] px-3 py-1.5 text-[11px] text-[#8d9199] hover:border-[#c6a56b]/70 hover:text-[#e5d3ad] transition-colors"
            >
              <Plus size={14} />
              <span>Preview add member</span>
            </button>

            <p className="text-[10px] text-[#4a4f58] pt-1">
              No se guarda nada todavía. Más adelante esto va a hablar con la
              base de datos.
            </p>
          </form>
        </section>

        {/* Group slogans */}
        <section className="space-y-2">
          <h2 className="text-[11px] font-semibold uppercase tracking-[0.20em] text-[#c6a56b]">
            Group slogans (preview only)
          </h2>

          <div className="relative bg-[#0f1012]/70 border border-[#6f5630]/25 rounded-xl p-3 space-y-2 max-h-64 overflow-y-auto">
            <div className="absolute top-0 left-0 right-0 h-px rounded-t-xl bg-gradient-to-r from-transparent via-[#c6a56b]/25 to-transparent" />
            {slogans.length === 0 ? (
              <p className="text-[11px] text-[#4a4f58]">
                No slogans loaded yet. Más adelante vas a poder traer tus
                slogans desde la base de datos.
              </p>
            ) : (
              slogans.map((s) => (
                <div
                  key={s.id}
                  className="flex items-start gap-2 text-[11px] border-b border-[#6f5630]/15 last:border-none pb-2 last:pb-0"
                >
                  <Quote size={14} className="mt-[2px] shrink-0 text-[#c6a56b]" />
                  <p className="leading-snug text-[#8d9199]">{s.text}</p>
                </div>
              ))
            )}
          </div>

          <form
            onSubmit={handleAddSlogan}
            className="relative bg-[#0f1012]/70 border border-[#6f5630]/25 rounded-xl p-4 space-y-3"
          >
            <div className="absolute top-0 left-0 right-0 h-px rounded-t-xl bg-gradient-to-r from-transparent via-[#c6a56b]/25 to-transparent" />
            <div className="flex flex-col gap-1">
              <label className="text-[11px] text-[#6b7078]">
                New slogan (preview)
              </label>
              <textarea
                rows={2}
                className="bg-[#0b0c0f] border border-[#6f5630]/35 rounded-md px-2 py-1.5 text-[12px] text-[#e5d3ad] placeholder:text-[#4a4f58] outline-none focus:border-[#c6a56b]/70 resize-none transition-colors"
                placeholder="Write a new slogan for this crew..."
                value={newSlogan}
                onChange={(e) => setNewSlogan(e.target.value)}
              />
              <p className="text-[10px] text-[#4a4f58]">
                Más adelante esto se guardará por grupo en la base de datos.
                Ahora solo es mock en memoria y console.log.
              </p>
            </div>

            <button
              type="submit"
              className="inline-flex items-center gap-1 rounded-full border border-[#6f5630]/40 bg-[#15171b] px-3 py-1.5 text-[11px] text-[#8d9199] hover:border-[#c6a56b]/70 hover:text-[#e5d3ad] transition-colors"
            >
              <Plus size={14} />
              <span>Preview add slogan</span>
            </button>
          </form>
        </section>

        {/* Danger zone */}
        <section className="space-y-2 border-t border-[#7a3535]/30 pt-6">
          <h2 className="text-[11px] font-semibold uppercase tracking-[0.20em] text-[#7a3535]">
            Danger zone
          </h2>

          <button
            type="button"
            className="w-full text-[11px] border border-[#7a3535]/60 text-[#c97070] rounded-lg py-2 hover:bg-[#2a0f0f]/50 hover:border-[#c97070]/60 transition-colors"
            onClick={async () => {
              const yes = window.confirm(
                "This will delete YOUR profile, clean date, why, gratitudes and remove you from the group.\n\nIt does NOT delete other members.\n\nAre you absolutely sure?"
              );
              if (!yes) return;

              try {
                const memberId = window.localStorage.getItem("na_memberId");

                if (memberId) {
                  await fetch("/.netlify/functions/delete-member", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ memberId }),
                  });
                }

                window.localStorage.clear();
                window.location.href = "/login";
              } catch (err) {
                console.error("Full reset failed:", err);
                alert("Something went wrong deleting your profile.");
              }
            }}
          >
            Delete my profile
          </button>

          <p className="text-[10px] text-[#4a4f58]">
            This is irreversible. Yer data dies, yer story doesn&apos;t.
          </p>
        </section>

      </main>
      <BottomNav />
    </div>
  );
}
