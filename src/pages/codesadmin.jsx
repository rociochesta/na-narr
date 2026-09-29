import React from "react";
import Codes from "./codes.jsx";

// Always require a fresh password, even if /codes was unlocked this session.
export default function CodesAdmin() {
  return <Codes requirePasswordOnOpen />;
}
