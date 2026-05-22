// src/pages/Login.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header3PM from "../components/Header3PM.jsx";
import BottomNav from "../components/BottomNav";

export default function Login() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [group] = useState("3PM"); // must match groups.code in DB
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
function handleGuest() {
  const guestProfile = {
    name: "Guest",
    groupCode: null,
    role: "guest",
    createdAt: new Date().toISOString(),
  };

  window.localStorage.setItem("na_userProfile", JSON.stringify(guestProfile));
  window.localStorage.setItem("na_memberId", "guest");
  window.localStorage.setItem("na_memberName", "Guest");
  window.localStorage.setItem("na_groupId", "guest");
  window.localStorage.setItem("na_groupCode", "guest");

  navigate("/");
}

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    const trimmedName = name.trim();
    if (!trimmedName) {
      setError("Name is required.");
      return;
    }

    try {
      setSubmitting(true);

      // 1) Save local profile immediately (offline-friendly fallback)
      const profile = {
        name: trimmedName,
        groupCode: group || null,
        createdAt: new Date().toISOString(),
      };
      window.localStorage.setItem("na_userProfile", JSON.stringify(profile));
      window.localStorage.setItem("na_memberName", trimmedName);

      // 2) Send to Netlify Forms (fire-and-forget)
      fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          "form-name": "login",
          name: trimmedName,
        }).toString(),
      }).catch(() => {/* ignore */});

      // 3) Try to register with DB — but don't block on failure
      try {
        const res = await fetch("/.netlify/functions/members-self-register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: trimmedName, groupCode: group }),
        });

        if (res.ok) {
          const data = await res.json();
          if (data?.member?.id) {
            window.localStorage.setItem("na_memberId", data.member.id);
            window.localStorage.setItem(
              "na_memberName",
              data.member.display_name || trimmedName
            );
          }
          if (data?.group?.id) {
            window.localStorage.setItem("na_groupId", data.group.id);
            window.localStorage.setItem("na_groupCode", data.group.code || group);
          }
        } else {
          console.warn("members-self-register failed — continuing offline");
        }
      } catch (apiErr) {
        console.warn("members-self-register unreachable — continuing offline", apiErr);
      }

      // 4) Go Home regardless
      navigate("/");
    } catch (err) {
      console.error("Login submit error:", err);
      setError("Something went wrong. Try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#0b0c0f] text-[#e5d3ad] flex flex-col">
      <Header3PM />

      <main className="flex-1">
        <div className="max-w-md mx-auto px-4 py-6 space-y-6">

          <section className="space-y-2">
            <h2 className="text-2xl font-semibold tracking-tight text-[#e5d3ad]">
              Before we start...
            </h2>
            <p className="text-sm text-[#8d9199]">
              This app is for NA. Tell us who you are and which group you're
              using it with.
            </p>
          </section>

          <section className="relative">
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-[#c6a56b]/20 via-[#6f5630]/10 to-[#c6a56b]/10 blur-xl opacity-60 pointer-events-none" />

            <div className="relative bg-[#0f1012]/90 border border-[#6f5630]/30 rounded-3xl px-5 py-5 space-y-4 shadow-lg shadow-black/40">
              <div className="absolute top-0 left-0 right-0 h-px rounded-t-3xl bg-gradient-to-r from-transparent via-[#c6a56b]/30 to-transparent" />

              <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.20em] text-[#6b7078]">
                <span>Profile</span>
                <span className="text-[#4a4f58]">v0.2</span>
              </div>

              <form
                name="login"
                onSubmit={handleSubmit}
                data-netlify="true"
                className="space-y-4"
              >
                <input type="hidden" name="form-name" value="login" />

                {/* Name (required) */}
                <div className="space-y-1">
                  <label
                    htmlFor="name"
                    className="text-xs font-medium uppercase tracking-[0.18em] text-[#c6a56b]"
                  >
                    Name <span className="text-[#c97070]">*</span>
                  </label>
                  <input
                    id="name"
                    type="text"
                    autoComplete="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-lg bg-[#0b0c0f] border border-[#6f5630]/35 px-3 py-2 text-sm text-[#e5d3ad] placeholder:text-[#4a4f58] focus:outline-none focus:ring-1 focus:ring-[#c6a56b]/40 focus:border-[#c6a56b]/70 transition-colors"
                    placeholder="First name, nickname, whatever you use in meetings"
                  />
                  <p className="text-[11px] text-[#4a4f58]">
                    This is the name we'll use inside the app.
                  </p>
                </div>

                {/* Group — faded, coming later */}
                <div className="space-y-1 opacity-30 pointer-events-none select-none">
                  <label
                    htmlFor="group"
                    className="text-xs font-medium uppercase tracking-[0.18em] text-[#c6a56b]"
                  >
                    Group
                  </label>
                  <select
                    id="group"
                    value={group}
                    tabIndex={-1}
                    className="w-full rounded-lg bg-[#0b0c0f] border border-[#6f5630]/35 px-3 py-2 text-sm text-[#e5d3ad]"
                  >
                    <option value="3PM">NARR</option>
                    <option value="NIGHTSHIFT">Night Shift</option>
                    <option value="DEBUG">Debug / Sandbox</option>
                  </select>
                  <p className="text-[11px] text-[#4a4f58]">Coming soon</p>
                </div>

                {/* Password / PIN — faded, coming later */}
                <div className="space-y-1 opacity-30 pointer-events-none select-none">
                  <label
                    htmlFor="password"
                    className="text-xs font-medium uppercase tracking-[0.18em] text-[#c6a56b]"
                  >
                    Password / PIN
                  </label>
                  <input
                    id="password"
                    type="password"
                    tabIndex={-1}
                    className="w-full rounded-lg bg-[#0b0c0f] border border-[#6f5630]/35 px-3 py-2 text-sm text-[#e5d3ad] placeholder:text-[#4a4f58]"
                    placeholder="Coming soon"
                  />
                  <p className="text-[11px] text-[#4a4f58]">Coming soon</p>
                </div>

                {error && (
                  <p className="text-[11px] text-[#c97070] pt-1">{error}</p>
                )}

                <div className="pt-2 space-y-3">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full inline-flex items-center justify-center rounded-full border border-[#c6a56b]/70 bg-[#c6a56b]/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#e5d3ad] hover:bg-[#c6a56b]/18 hover:border-[#c6a56b] disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-[0_0_16px_rgba(198,165,107,0.12)]"
                  >
                    {submitting ? "Saving..." : "Board the ship"}
                  </button>

                  <button
                    type="button"
                    onClick={handleGuest}
                    className="w-full inline-flex items-center justify-center rounded-full border border-[#6f5630]/30 bg-[#15171b] px-4 py-2 text-[10px] uppercase tracking-[0.16em] text-[#8d9199] hover:border-[#6f5630]/60 hover:text-[#e5d3ad] transition-colors"
                  >
                    Enter as guest
                  </button>

                  <p className="text-[10px] text-[#4a4f58] text-center">
                    No signup, no email. Just a simple profile for your recovery tools.
                  </p>
                </div>
              </form>
            </div>
          </section>

          <div className="flex justify-end">
            <Link
              to="/"
              className="text-[10px] text-[#4a4f58] hover:text-[#c6a56b] underline underline-offset-2 transition-colors"
            >
              Skip for now
            </Link>
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
