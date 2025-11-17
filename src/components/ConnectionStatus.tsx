import { Power, Globe, ArrowLeft } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PortMappingManager } from "./PortMappingManager";
import { JetBrains_Mono } from "next/font/google";
import { UserButton } from "./auth/UserButton";
import { useRouter } from "next/navigation";

interface ConnectionStatusProps {
  isConnected: boolean;
  onToggleConnection: () => void;
  isLoading?: boolean;
  containerId?: string;
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
  containerId = "dind-user-123",
}: ConnectionStatusProps) {
  const router = useRouter();
  return (
    <div className="flex items-center justify-between mb-1 pl-2 pr-4">
      <div className="flex items-center gap-2 pl-2">
        <button
          onClick={() => router.push("/")}
          className="p-1 rounded-lg transition-all hover:bg-slate-100 text-slate-800"
          title="Go to Home"
        >
          <ArrowLeft
            size={18}
            className=""
          />
        </button>
        <div className="h-4 w-px bg-gray-400/50 mx-2" />
        <div
          className={`w-3 h-3 rounded-full transition-colors ${
            isConnected
              ? "bg-green-500 shadow-[0_0_6px_2px_rgba(34,197,94,0.8)]"
              : "bg-red-500 shadow-[0_0_6px_2px_rgba(239,68,68,0.7)]"
          }`}
        />
        <span className="hidden sm:inline text-[#e9e3e3ee] text-sm font-semibold font-sans">
          {isLoading ? (
            "Connecting..."
          ) : isConnected ? (
            <>Connected to Docker Daemon</>
          ) : (
            "Disconnected"
          )}
        </span>
      </div>

      <div className="flex items-center gap-2">
        <Dialog>
          <DialogTrigger asChild>
            <button
              disabled={!isConnected || isLoading}
              className={`p-1 rounded-lg transition-all duration-200 ${
                isConnected
                  ? "hover:bg-blue-50 text-blue-600 hover:text-blue-700"
                  : "text-gray-400"
              } disabled:opacity-50 disabled:cursor-not-allowed`}
              title="Port Mappings"
            >
              <Globe
                size={18}
                className={`${
                  isConnected
                    ? "text-blue-500 drop-shadow-[0_0_6px_rgba(59,130,246,0.7)"
                    : "text-gray-400 drop-shadow-[0_0_6px_rgba(119, 124, 130, 0.7)"
                }]`}
              />
            </button>
          </DialogTrigger>
          <DialogContent
            className={`lg:max-w-[800px] w-full max-h-[85dvh] overflow-y-auto scrollbar-hide font-jetbrains-mono ${jetbrainsMono.className} bg-[#c8cfd2]`}
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
            <PortMappingManager containerId={containerId} />
          </DialogContent>
        </Dialog>

        <button
          onClick={onToggleConnection}
          disabled={isLoading}
          className={`p-1 rounded-lg transition-all duration-200  ${
            isConnected
              ? "hover:bg-red-50 text-red-600 hover:text-red-700"
              : "hover:bg-green-50 text-green-600 hover:text-green-700"
          } disabled:opacity-50 disabled:cursor-not-allowed`}
          title={isConnected ? "Disconnect" : "Connect"}
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
  );
}
