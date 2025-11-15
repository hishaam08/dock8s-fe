"use client";
import "@xterm/xterm/css/xterm.css";

import { useRef } from "react";
import { useTerminal } from "../hooks/useTerminal";
import { ConnectionStatus } from "./ConnectionStatus";

export default function XTerm() {
  const terminalRef = useRef<HTMLDivElement>(null);
  const { isConnected, isConnecting, toggleConnection } =
    useTerminal(terminalRef);

  return (
    <div className="flex flex-col h-dvh bg-linear-to-r from-slate-500 to-slate-300 p-1.5 rounded-2xl shadow-[0_0_40px_rgba(59,130,246,0.4)]">
      <ConnectionStatus
        isConnected={isConnected}
        onToggleConnection={toggleConnection}
        isLoading={isConnecting}
      />
      <div className="flex flex-col flex-1 bg-[#1e1e1e] rounded-xl p-5 overflow-hidden backdrop-blur-sm">
        <div ref={terminalRef} className="flex-1 w-full h-full" />
      </div>
    </div>
  );
}

// Better intro text
// Traefik integration
