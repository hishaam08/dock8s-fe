"use client";

import React, { useState } from "react";
import {
  Github,
  Chrome,
  AlertTriangle,
  Terminal,
  Box,
  Layers,
  Container,
  Database,
  Server,
  Boxes,
} from "lucide-react";
import { useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { JetBrains_Mono } from "next/font/google";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

export default function SignInCard() {
  const [hoveredProvider, setHoveredProvider] = useState<string | null>(null);

  const params = useSearchParams();
  const error = params.get("error");

  const onProviderSignIn = (provider: "github" | "google") => {
    signIn(provider, { callbackUrl: "/playground" });
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 flex items-center justify-center p-4 relative overflow-hidden ${jetbrainsMono.className}`}>
      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px]"></div>

      {/* Floating container icons */}
      <div className="absolute top-20 right-20 opacity-20 animate-float">
        <Container className="w-16 h-16 text-blue-400" />
      </div>
      <div className="absolute bottom-32 left-32 opacity-20 animate-float-delayed">
        <Boxes className="w-20 h-20 text-purple-400" />
      </div>
      <div
        className="absolute top-1/3 left-16 opacity-15 animate-float"
        style={{ animationDelay: "1s" }}
      >
        <Database className="w-14 h-14 text-cyan-400" />
      </div>
      <div
        className="absolute bottom-40 right-32 opacity-15 animate-float-delayed"
        style={{ animationDelay: "2s" }}
      >
        <Server className="w-12 h-12 text-indigo-400" />
      </div>
      <div
        className="absolute top-1/2 right-12 opacity-10 animate-float"
        style={{ animationDelay: "3s" }}
      >
        <Box className="w-10 h-10 text-violet-400" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Logo/Brand */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center justify-center mb-4 relative group">
            {/* Docker-like whale with containers */}
            <div className="relative w-28 h-20">
              {/* Water waves */}
              <div className="absolute bottom-0 left-0 right-0 h-3 bg-gradient-to-r from-blue-400/30 to-cyan-400/30 rounded-full"></div>

              {/* Whale body - more realistic shape */}
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-24 h-14">
                {/* Main body curve */}
                <svg
                  viewBox="0 0 100 60"
                  className="w-full h-full drop-shadow-lg"
                >
                  {/* Whale body */}
                  <ellipse
                    cx="45"
                    cy="35"
                    rx="42"
                    ry="22"
                    fill="url(#whaleGradient)"
                    className="transform group-hover:scale-105 transition-transform duration-300"
                  />

                  {/* Tail */}
                  <path
                    d="M 85 35 Q 95 30, 98 25 Q 95 30, 98 35 Q 95 40, 98 45 Q 95 40, 85 35 Z"
                    fill="url(#whaleGradient)"
                  />

                  {/* Belly lighter shade */}
                  <ellipse
                    cx="40"
                    cy="42"
                    rx="30"
                    ry="12"
                    fill="#60a5fa"
                    opacity="0.3"
                  />

                  {/* Eye */}
                  <circle cx="25" cy="28" r="2.5" fill="white" />
                  <circle cx="25" cy="28" r="1.5" fill="#1e293b" />

                  {/* Smile */}
                  <path
                    d="M 20 35 Q 30 38, 40 35"
                    stroke="white"
                    strokeWidth="1.5"
                    fill="none"
                    strokeLinecap="round"
                  />

                  {/* Fin */}
                  <path
                    d="M 45 20 Q 42 12, 48 8 Q 47 15, 50 20 Z"
                    fill="url(#whaleGradient)"
                    opacity="0.8"
                  />

                  <defs>
                    <linearGradient
                      id="whaleGradient"
                      x1="0%"
                      y1="0%"
                      x2="0%"
                      y2="100%"
                    >
                      <stop offset="0%" stopColor="#3b82f6" />
                      <stop offset="100%" stopColor="#2563eb" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>

              {/* Container boxes on top of whale */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 flex gap-1.5">
                <div className="w-5 h-5 bg-cyan-400 rounded-sm shadow-lg border-2 border-cyan-300 transform group-hover:-translate-y-1 transition-transform duration-300 relative">
                  <div className="absolute inset-1 border border-cyan-200/50"></div>
                </div>
                <div className="w-5 h-5 bg-purple-400 rounded-sm shadow-lg border-2 border-purple-300 transform group-hover:-translate-y-1 transition-transform duration-300 delay-75 relative">
                  <div className="absolute inset-1 border border-purple-200/50"></div>
                </div>
                <div className="w-5 h-5 bg-indigo-400 rounded-sm shadow-lg border-2 border-indigo-300 transform group-hover:-translate-y-1 transition-transform duration-300 delay-150 relative">
                  <div className="absolute inset-1 border border-indigo-200/50"></div>
                </div>
              </div>
            </div>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">
            <span className="text-blue-400">D</span>ock<span className="text-blue-400">8</span>s
          </h1>
          <p className="text-slate-400 text-sm">
            Container Playground Platform
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-slate-900/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-800/50 p-8 animate-slide-up">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-white mb-2">Welcome back</h2>
            <p className="text-slate-400 text-sm">
              Sign in to access your playground environment
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-start gap-3 animate-shake">
              <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-red-400 font-medium">
                  Authentication failed
                </p>
                <p className="text-xs text-red-400/80 mt-1">
                  Please try again or contact support if the issue persists.
                </p>
              </div>
            </div>
          )}

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-800"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
            </div>
          </div>

          {/* Auth Buttons */}
          <div className="space-y-3">
            <button
              onClick={() => onProviderSignIn("google")}
              onMouseEnter={() => setHoveredProvider("google")}
              onMouseLeave={() => setHoveredProvider(null)}
              className="group relative w-full flex items-center justify-center gap-3 px-4 py-3.5 bg-white hover:bg-gray-50 text-gray-900 rounded-xl font-medium transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20 hover:-translate-y-0.5"
            >
              <Chrome
                className={`w-5 h-5 transition-transform duration-300 ${
                  hoveredProvider === "google" ? "scale-110" : ""
                }`}
              />
              <span>Continue with Google</span>
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/0 via-blue-500/5 to-blue-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>

            <button
              onClick={() => onProviderSignIn("github")}
              onMouseEnter={() => setHoveredProvider("github")}
              onMouseLeave={() => setHoveredProvider(null)}
              className="group relative w-full flex items-center justify-center gap-3 px-4 py-3.5 bg-slate-800 hover:bg-slate-750 text-white rounded-xl font-medium transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20 hover:-translate-y-0.5 border border-slate-700 hover:border-slate-600"
            >
              <Github
                className={`w-5 h-5 transition-transform duration-300 ${
                  hoveredProvider === "github" ? "scale-110" : ""
                }`}
              />
              <span>Continue with GitHub</span>
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500/0 via-purple-500/5 to-purple-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-6 text-center">
          <p className="text-slate-500 text-sm">
            Need help?{" "}
            <a
              href="mailto:mdhishaam0807@gmail.com"
              className="text-blue-400 hover:text-blue-300 transition-colors font-medium"
            >
              Contact
            </a>
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        @keyframes float-delayed {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-30px) rotate(5deg);
          }
        }

        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes shake {
          0%,
          100% {
            transform: translateX(0);
          }
          25% {
            transform: translateX(-5px);
          }
          75% {
            transform: translateX(5px);
          }
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        .animate-float-delayed {
          animation: float-delayed 8s ease-in-out infinite;
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }

        .animate-slide-up {
          animation: slide-up 0.6s ease-out 0.2s both;
        }

        .animate-shake {
          animation: shake 0.4s ease-in-out;
        }

        .delay-1000 {
          animation-delay: 1s;
        }
      `}</style>
    </div>
  );
}
