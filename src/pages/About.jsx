// src/pages/About.jsx
import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Heart, ShieldCheck, Users } from "lucide-react";
import PublicHeader from "../components/PublicHeader.jsx";
import useHomeTheme from "../hooks/useHomeTheme.js";
import rangersLogo from "../assets/rangerslogo.png";
import pirateLogo from "../assets/shiplog.png";
import "./RangersHome.css";
import "./SeventhTradition.css";
import "./About.css";

export default function About() {
  const [theme, changeTheme] = useHomeTheme();
  const isRangers = theme === "rangers";
  return (
    <div className={`about-page tradition-page ${isRangers ? "rangers-home tradition-rangers" : "tradition-pirate"}`}>
      <PublicHeader theme={theme} onThemeChange={changeTheme} />
      <main className={`tradition-main ${isRangers ? "rangers-page-main" : ""}`}>
        <section className="tradition-hero" aria-labelledby="about-heading">
          <img src={isRangers ? rangersLogo : pirateLogo} alt="NARR" className={`tradition-logo ${isRangers ? "rangers-page-logo" : ""}`} />
          <p className="tradition-eyebrow">{isRangers ? "Different colors. One team." : "Different journeys. One crew."}</p>
          <h1 id="about-heading">About NARR</h1>
          <p className="tradition-intro">Whoever you are, however you got here — there's a place for you.</p>
        </section>
        <section className="tradition-panel" aria-labelledby="about-welcome">
          <div className="tradition-panel-heading">
            <span className="tradition-icon"><Users size={25} /></span>
            <div><p className="tradition-eyebrow">NA Recovery Rangers</p><h2 id="about-welcome">We keep showing up. Together.</h2></div>
          </div>
          <p className="tradition-copy">One meeting, one day, one next step. You don't need to have it all figured out to join us.</p>
          <div className="tradition-values">
            <div><Heart size={21} /><h3>A place to belong</h3><p>New here or coming back, there's room for you.</p></div>
            <div><ShieldCheck size={21} /><h3>Show up as you are</h3><p>No perfect words required. Start with being here.</p></div>
          </div>
          <div className="tradition-status">
            <div><h3>Our story is coming soon</h3><p>The story behind this group and this app is on its way here.</p></div>
          </div>
          <div className="about-links">
            <Link to="/">Find the next meeting <ArrowLeft size={15} className="rotate-180" /></Link>
            <Link to="/seventh-tradition">7th Tradition</Link>
          </div>
        </section>
        <Link className="tradition-back" to="/"><ArrowLeft size={16} />Back to Home</Link>
      </main>
    </div>
  );
}
