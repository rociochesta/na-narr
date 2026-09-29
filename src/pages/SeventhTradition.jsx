// src/pages/SeventhTradition.jsx
import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Coins, Heart, Users, Zap } from "lucide-react";
import PublicHeader from "../components/PublicHeader.jsx";
import useHomeTheme from "../hooks/useHomeTheme.js";
import rangersLogo from "../assets/rangerslogo.png";
import pirateLogo from "../assets/shiplog.png";
import "./RangersHome.css";
import "./SeventhTradition.css";

export default function SeventhTradition() {
  const [theme, changeTheme] = useHomeTheme();
  const isRangers = theme === "rangers";
  return (
    <div className={`tradition-page ${isRangers ? "rangers-home tradition-rangers" : "tradition-pirate"}`}>
      <PublicHeader theme={theme} onThemeChange={changeTheme} />
      <main className={`tradition-main ${isRangers ? "rangers-page-main" : ""}`}>
        <section className="tradition-hero" aria-labelledby="tradition-heading">
          <img src={isRangers ? rangersLogo : pirateLogo} alt="NARR" className={`tradition-logo ${isRangers ? "rangers-page-logo" : ""}`} />
          <p className="tradition-eyebrow">{isRangers ? "Powered by our people" : "Kept afloat by our crew"}</p>
          <h1 id="tradition-heading">7th Tradition</h1>
          <p className="tradition-intro">Every group ought to be fully self-supporting.</p>
        </section>

        <section className="tradition-panel" aria-labelledby="tradition-support">
          <div className="tradition-panel-heading">
            <span className="tradition-icon"><Coins size={25} /></span>
            <div><p className="tradition-eyebrow">Our group. Our responsibility.</p><h2 id="tradition-support">Together, we keep showing up.</h2></div>
          </div>
          <p className="tradition-copy">Contributions help keep NARR here for the next person who needs a meeting. Giving is voluntary. You are welcome whether or not you can contribute.</p>
          <div className="tradition-values">
            <div><Users size={21} /><h3>Supported by us</h3><p>Our members help sustain our group.</p></div>
            <div><Heart size={21} /><h3>Always voluntary</h3><p>Your presence matters. There is no pressure to give.</p></div>
          </div>
          <div className="tradition-status">
            <Zap size={20} aria-hidden="true" />
            <div><h3>Ways to contribute are coming soon</h3><p>Contribution details will be shared here when they are ready.</p></div>
          </div>
        </section>
        <Link className="tradition-back" to="/"><ArrowLeft size={16} />Back to Home</Link>
      </main>
    </div>
  );
}
