import { Power, Globe } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { PortMappingManager } from './PortMappingManager';
import { JetBrains_Mono } from 'next/font/google';

interface ConnectionStatusProps {
  isConnected: boolean;
  onToggleConnection: () => void;
  isLoading?: boolean;
  containerId?: string;
}

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
  display: 'swap',
});

export function ConnectionStatus({ 
  isConnected, 
  onToggleConnection,
  isLoading = false,
  containerId = 'dind-user-123'
}: ConnectionStatusProps) {
  return (
    <div className="flex items-center justify-between mb-1 pl-2 pr-4">
      <div className="flex items-center gap-2 pl-2">
        <div
          className={`w-3 h-3 rounded-full transition-colors ${
            isConnected ? "bg-green-500" : "bg-red-500"
          }`}
        />
        <span className="text-[#e9e3e3ee] text-sm font-semibold font-sans">
          {isLoading 
            ? "Connecting..." 
            : isConnected 
              ? "Connected to Docker Daemon" 
              : "Disconnected"}
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
              <Globe size={18} />
            </button>
          </DialogTrigger>
          <DialogContent className={`lg:max-w-[800px]! w-full max-h-[85dvh] overflow-y-auto scrollbar-hide font-jetbrains-mono ${jetbrainsMono.className}`}>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-green-600" />
                Port Mappings & Routes
              </DialogTitle>
              <DialogDescription>
                Manage dynamic subdomain routing to your container ports
              </DialogDescription>
            </DialogHeader>
            <PortMappingManager containerId={containerId} />
          </DialogContent>
        </Dialog>

        {/* Connection Toggle */}
        <button
          onClick={onToggleConnection}
          disabled={isLoading}
          className={`p-1 rounded-lg transition-all duration-200 ${
            isConnected
              ? "hover:bg-red-50 text-red-600 hover:text-red-700"
              : "hover:bg-green-50 text-green-600 hover:text-green-700"
          } disabled:opacity-50 disabled:cursor-not-allowed`}
          title={isConnected ? "Disconnect" : "Connect"}
        >
          <Power 
            size={18} 
            className={`transition-transform ${
              isLoading ? "animate-pulse" : ""
            }`}
          />
        </button>
      </div>
    </div>
  );
}