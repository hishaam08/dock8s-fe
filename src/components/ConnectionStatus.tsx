import { Power } from 'lucide-react';

interface ConnectionStatusProps {
  isConnected: boolean;
  onToggleConnection: () => void;
  isLoading?: boolean;
}

export function ConnectionStatus({ 
  isConnected, 
  onToggleConnection,
  isLoading = false 
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
  );
}