// src/utils/getTimeUntilMeeting.js
const MEETING_HOUR = 18;
const MEETING_MINUTE = 30;

export function getTimeUntilMeeting() {
  const now = new Date();

  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Edmonton",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(now);

  const hour = Number(parts.find((p) => p.type === "hour").value) % 24;
  const minute = Number(parts.find((p) => p.type === "minute").value);

  const nowMinutes = hour * 60 + minute;
  const meetingMinutes = MEETING_HOUR * 60 + MEETING_MINUTE;

  let diff = meetingMinutes - nowMinutes;
  if (diff <= 0) diff += 24 * 60; // past today → next occurrence

  const h = Math.floor(diff / 60);
  const m = diff % 60;

  if (h === 0) return `in ${m}m`;
  if (m === 0) return `in ${h}h`;
  return `in ${h}h ${m}m`;
}
