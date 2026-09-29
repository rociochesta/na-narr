import React from "react";
import { Ship, Zap } from "lucide-react";
import useHomeTheme from "../hooks/useHomeTheme.js";
import "../pages/RangersHome.css";

export default function ThemeSwitch() {
  const [theme, changeTheme] = useHomeTheme();
  return (
    <div className="home-theme-switch" role="group" aria-label="Appearance">
      <button type="button" aria-pressed={theme === "pirate"} onClick={() => changeTheme("pirate")}><Ship size={16} /><span>Pirate</span></button>
      <button type="button" aria-pressed={theme === "rangers"} onClick={() => changeTheme("rangers")}><Zap size={16} /><span>Rangers</span></button>
    </div>
  );
}
