"use client";

import * as React from "react";

export function PulseLogo() {
  return (
    <div className="flex items-center gap-3 px-4 py-4">
      {/* Logo Icon */}
      <div className="relative">
        <div className="bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 p-2.5 rounded-xl shadow-lg">
          <div className="relative">
            {/* Heartbeat SVG */}
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              className="text-white"
            >
              <path
                d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                fill="currentColor"
                className="drop-shadow-sm"
              />
              {/* Pulse lines */}
              <path
                d="M8 8h2v4h4v2H8V8z"
                fill="currentColor"
                opacity="0.8"
              />
            </svg>
            
            {/* Animated pulse effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400 rounded-xl animate-pulse opacity-20"></div>
          </div>
        </div>
      </div>

      {/* Logo Text */}
      <div className="flex flex-col">
        <h1 className="text-lg font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
          Pulse
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
          Assessment Platform
        </p>
      </div>
    </div>
  );
}
