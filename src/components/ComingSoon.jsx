// src/components/ComingSoon.jsx
import React from "react";
import { Link } from "react-router-dom";
import PublicHeader from "./PublicHeader.jsx";

export default function ComingSoon({ title, description }) {
  return (
    <div className="min-h-screen bg-[#0b0c0f] text-[#e5d3ad] flex flex-col">
      <PublicHeader />

      <main className="flex-1">
        <div className="max-w-md mx-auto px-4 py-10 space-y-4 text-center">
          <h1 className="text-2xl font-semibold tracking-tight text-[#e5d3ad]">
            {title}
          </h1>
          <p className="text-sm text-[#8d9199]">{description}</p>
          <p className="text-xs uppercase tracking-[0.2em] text-[#6f5630] pt-4">
            Coming soon
          </p>
          <Link
            to="/"
            className="inline-flex mt-4 text-xs font-medium text-[#c6a56b] hover:text-[#d4b06a] underline underline-offset-4 transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </main>
    </div>
  );
}
