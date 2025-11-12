interface ConnectionStatusProps {
  isConnected: boolean;
}

export function ConnectionStatus({ isConnected }: ConnectionStatusProps) {
  return (
    <div className="flex items-center justify-between mb-2 pl-2 mt-1">
      <div className="flex items-center gap-2 pl-2">
        <div
          className={`w-3 h-3 rounded-full ${
            isConnected ? "bg-green-500" : "bg-red-500"
          }`}
        />
        <span className="text-[#212121ee] text-md  font-medium font-sans">
          {isConnected ? "Connected to Docker Daemon" : "Connecting..."}
        </span>
      </div>
    </div>
  );
}
