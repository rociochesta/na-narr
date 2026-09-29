import React from "react";
import { Link } from "react-router-dom";
import { Video, Zap } from "lucide-react";
import PublicHeader from "../components/PublicHeader.jsx";
import logo from "../assets/rangerslogo.png";
import title from "../assets/titlerangers.png";
import helmets from "../assets/helmets.png";

export default function RangersHome({ timeUntilMeeting, hasProfile, zoomUrl, onThemeChange }) {
  return (
    <div className="rangers-home">
      <PublicHeader theme="rangers" onThemeChange={onThemeChange} />
      <main className="rangers-main rangers-page-main">
        <section className="rangers-hero" aria-labelledby="rangers-heading">
          <img className="rangers-logo rangers-page-logo" src={logo} alt="NARR" />
          <h1 id="rangers-heading"><img className="rangers-title" src={title} alt="NA Recovery Rangers" /></h1>
          <p>Whoever you are, however you got here — there's a place for you.</p>
          <img className="rangers-helmets" src={helmets} alt="Red, blue, yellow, green, and pink Ranger helmets" />
        </section>
        <section className="rangers-meeting" aria-labelledby="rangers-meeting-heading">
          <Zap className="rangers-bolt" aria-hidden="true" />
          <div className="rangers-meeting-info">
            <h2 id="rangers-meeting-heading">Next meeting</h2>
            <p className="rangers-countdown">{timeUntilMeeting}</p>
            <p className="rangers-group">NARR Homegroup • Daily</p>
          </div>
          <a className="rangers-join" href={zoomUrl} target="_blank" rel="noreferrer"><Video size={20} />Join Zoom</a>
          <p className="rangers-motto">We show up. We show up. That's the whole toolkit.</p>
        </section>
        <p className="rangers-footer">
          {hasProfile ? "Welcome back. " : "Already part of the crew? "}
          <Link to={hasProfile ? "/dashboard" : "/login"}>{hasProfile ? "Continue to my home" : "Log in"}</Link>
        </p>
      </main>
    </div>
  );
}
