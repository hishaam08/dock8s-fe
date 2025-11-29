import { Power, Globe, ArrowLeft, Clock, RefreshCw, AlertCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { PortMappingManager } from "./PortMappingManager";
import { JetBrains_Mono } from "next/font/google";
import { UserButton } from "./auth/UserButton";
import { useRouter } from "next/navigation";

interface ContainerSession {
  sessionId: string;
  containerId: string;
  containerName: string;
  expiresAt: string;
  remainingMinutes: number;
  status: string;
}

interface ConnectionStatusProps {
  isConnected: boolean;
  onToggleConnection: () => void;
  isLoading?: boolean;
  containerId?: string;
  session?: ContainerSession | null;
  extendSession?: (minutes: number) => Promise<boolean>;
  terminateSession?: () => Promise<boolean>;
  showWarning?: boolean;
  remainingMinutes?: number;
}

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

export function ConnectionStatus({
  isConnected,
  onToggleConnection,
  isLoading = false,
  session,
  extendSession,
  terminateSession,
  showWarning = false,
  remainingMinutes = 0,
}: ConnectionStatusProps) {
  const router = useRouter();

  const formatTime = (minutes: number) => {
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hrs > 0 ? `${hrs}h ${mins}m` : `${mins}m`;
  };

  const handleExtend = async () => {
    if (extendSession) {
      await extendSession(30);
    }
  };

  const handleTerminate = async () => {
    if (terminateSession) {
      await terminateSession();
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between mb-1 pl-2 pr-4">
        <div className="flex items-center gap-2 pl-2">
          <button
            onClick={() => router.push("/")}
            className="p-1 rounded-lg transition-all hover:bg-slate-700/50 text-slate-800"
            title="Go to Home"
          >
            <ArrowLeft size={18} className="text-slate-400" />
          </button>
          <div className="h-4 w-px bg-gray-400/50 mx-2" />
          <div
            className={`w-3 h-3 rounded-full transition-colors ${
              session && isConnected
                ? "bg-green-500 shadow-[0_0_6px_2px_rgba(34,197,94,0.8)]"
                : "bg-red-500 shadow-[0_0_6px_2px_rgba(239,68,68,0.7)]"
            }`}
          />
          
          <span className="hidden sm:inline text-[#e9e3e3ee] text-sm font-semibold font-sans">
            {isLoading ? (
              "Connecting..."
            ) : session && isConnected ? (
              <>
              <div className="flex items-center gap-2">
                <span>Connected to Docker</span>
                <div className="h-4 w-px bg-gray-400/50 mx-2" />
                {remainingMinutes > 0 && (
                  <span className="text-xs text-slate-300/70 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {formatTime(remainingMinutes)}
                  </span>
                )}
              </div>
              </>
            ) : (
              "Disconnected"
            )}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Extend Session Button */}
          {/* {session && extendSession && (
            <button
              onClick={handleExtend}
              disabled={isLoading}
              className="p-1 rounded-lg transition-all duration-200 hover:bg-slate-800/70 text-blue-600 hover:text-blue-700 disabled:opacity-50"
              title="Extend Session"
            >
              <RefreshCw
                size={18}
                className="text-blue-500 drop-shadow-[0_0_6px_rgba(59,130,246,0.7)]"
              />
            </button>
          )} */}

          {/* Port Mappings */}
          <Dialog>
            <DialogTrigger asChild>
              <button
                disabled={!session || !isConnected || isLoading}
                className={`p-1 rounded-lg transition-all duration-200 ${
                  session && isConnected
                    ? "hover:bg-slate-800/70 text-blue-600 hover:text-blue-700"
                    : "text-gray-400"
                } disabled:opacity-50 disabled:cursor-not-allowed`}
                title="Port Mappings"
              >
                <Globe
                  size={18}
                  className={`${
                    session && isConnected
                      ? "text-blue-500 drop-shadow-[0_0_6px_rgba(59,130,246,0.7)"
                      : "text-gray-400 drop-shadow-[0_0_6px_rgba(119, 124, 130, 0.7)"
                  }]`}
                />
              </button>
            </DialogTrigger>
            <DialogContent
              className={`lg:max-w-[800px] w-full max-h-[85dvh] overflow-y-auto scrollbar-hide font-jetbrains-mono ${jetbrainsMono.className} bg-[#34393b] text-[#e8e6e3] border-[#34393b]`}
            >
              <DialogHeader className="pr-8">
                <DialogTitle className="flex items-center gap-2 text-left">
                  <Globe className="w-5 h-5 text-green-600 shrink-0" />
                  <span className="wrap-break-word">Port Mappings & Routes</span>
                </DialogTitle>
                <DialogDescription className="text-left">
                  Manage dynamic subdomain routing to your container ports
                </DialogDescription>
              </DialogHeader>
              {session && (
                <PortMappingManager containerId={session.containerId} />
              )}
            </DialogContent>
          </Dialog>

          {/* Power Button */}
          <button
            onClick={session && terminateSession ? handleTerminate : onToggleConnection}
            disabled={isLoading}
            className={`p-1 rounded-lg transition-all duration-200  ${
              isConnected
                ? "hover:bg-red-800/30 text-red-600 hover:text-red-700"
                : "hover:bg-green-50 text-green-600 hover:text-green-700"
            } disabled:opacity-50 disabled:cursor-not-allowed`}
            title={isConnected ? "Terminate current session" : "Create a new session"}
          >
            <Power
              size={18}
              className={`transition-transform drop-shadow-sm ${
                isLoading ? "animate-pulse" : ""
              }`}
            />
          </button>
          <UserButton />
        </div>
      </div>
    </div>
  );
}