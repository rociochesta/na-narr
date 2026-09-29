import { useSyncExternalStore } from "react";

const listeners = new Set();
let theme = "pirate";
try { theme = localStorage.getItem("na_homeTheme") === "rangers" ? "rangers" : "pirate"; } catch { /* Storage is optional. */ }
const notify = () => listeners.forEach((listener) => listener());
const subscribe = (listener) => { listeners.add(listener); return () => listeners.delete(listener); };
const getSnapshot = () => theme;

function changeTheme(value) {
  if (value !== "pirate" && value !== "rangers") return;
  theme = value;
  try { localStorage.setItem("na_homeTheme", value); } catch { /* Keep the choice for this visit. */ }
  notify();
}

window.addEventListener("storage", (event) => {
  if (event.key !== "na_homeTheme" && event.key !== null) return;
  theme = event.newValue === "rangers" ? "rangers" : "pirate";
  notify();
});

export default function useHomeTheme() {
  return [useSyncExternalStore(subscribe, getSnapshot), changeTheme];
}
