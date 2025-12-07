"use client";
import "@xterm/xterm/css/xterm.css";

import { useRef, useEffect, useState } from "react";
import { useTerminal } from "../hooks/useTerminal";
import { useDindSession } from "../hooks/useDindSession";
import { ConnectionStatus } from "./ConnectionStatus";
import { AlertCircle, Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { JetBrains_Mono } from "next/font/google";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

export default function XTerm() {
  const terminalRef = useRef<HTMLDivElement>(null);
  const [isRecreating, setIsRecreating] = useState(false); // NEW

  const {
    session,
    loading: sessionLoading,
    error: sessionError,
    showWarning,
    extendSession,
    terminateSession,
    remainingMinutes,
    getOrCreateSession,
  } = useDindSession({
    autoConnect: true,
    heartbeatInterval: 30,
    warningThreshold: 5,
  });

  const { isConnected, isConnecting, toggleConnection, disconnect } =
    useTerminal(terminalRef, {
      containerId: session?.containerId,
      autoConnect: !isRecreating,
      getOrCreateSession: getOrCreateSession,
    });

  // Disconnect terminal when session expires
  useEffect(() => {
    if (!session && isConnected && !isRecreating) {
      console.log("Session expired, disconnecting terminal...");
      disconnect();
    }
  }, [session, isConnected, disconnect, isRecreating]);

  return (
    <div className="flex flex-col h-dvh bg-linear-to-r from-[#4e5d72] to-[#2f3335] p-1.5 rounded-2xl shadow-[0_0_40px_rgba(59,130,246,0.4)]">
      <ConnectionStatus
        isConnected={isConnected}
        onToggleConnection={toggleConnection}
        isLoading={isConnecting || sessionLoading || isRecreating}
        containerId={session?.containerId}
        session={session}
        extendSession={extendSession}
        terminateSession={terminateSession}
        showWarning={showWarning}
        remainingMinutes={remainingMinutes}
      />

      {/* Terminal Container */}
      <div className="flex flex-col flex-1 bg-[#171819] rounded-xl p-5 overflow-hidden backdrop-blur-sm">
        {sessionLoading || isRecreating ? (
          <div className={`flex flex-col items-center justify-center h-full ${jetbrainsMono.className}`}>
            <Loader2 className="w-12 h-12 animate-spin text-blue-500 mb-4" />
            <p className="text-slate-400">
              {isRecreating
                ? "Recreating session..."
                : "Firing up your docker environment..."}
            </p>
            <p className="text-slate-500 text-sm mt-2">
              This may take a few seconds
            </p>
          </div>
        ) : !session ? (
          <div className={`flex flex-col items-center justify-center h-full text-slate-300/70  ${jetbrainsMono.className}`}>
            Session Expired
          </div>
        ) : (
          <div ref={terminalRef} className="flex-1 w-full h-full" />
        )}
      </div>

      {/* Footer with Session Info */}
      {session && !isRecreating && (
        <div className="mt-1.5 px-4 py-1 bg-slate-800/30 rounded-lg">
          <div className="flex justify-between items-center text-xs text-slate-400/80">
            <div className={`flex gap-4 ${jetbrainsMono.className}`}>
              <span className="hidden sm:inline">
                Session: {session.sessionId.slice(0, 8)}
              </span>

              <span className="hidden sm:inline">
                Container: {session.containerName}
              </span>
              <span
                className={
                  remainingMinutes <= 5 ? "text-orange-400 font-semibold" : ""
                }
              >
                {remainingMinutes} min remaining
              </span>
            </div>
            <div className={`${jetbrainsMono.className}`}>
              {isConnected ? (
                <span className="text-green-400">● Connected</span>
              ) : (
                <span className="text-gray-500">○ Disconnected</span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
