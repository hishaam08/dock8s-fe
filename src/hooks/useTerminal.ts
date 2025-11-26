import { useEffect, useRef, useState } from "react";
import type { Terminal } from "@xterm/xterm";
import type { FitAddon } from "@xterm/addon-fit";
import { loadTerminal } from "../utils/terminalLoader";
import { SignalRService } from "../services/signalRService";
import { InputHandler } from "../services/inputHandler";

interface UseTerminalOptions {
  containerId?: string | null;
  autoConnect?: boolean;
  getOrCreateSession?: () => Promise<any>;
}

export function useTerminal(
  terminalRef: React.RefObject<HTMLDivElement | null>,
  options: UseTerminalOptions = {}
) {
  const { containerId, autoConnect = false, getOrCreateSession } = options;

  const [isConnected, setIsConnected] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  const terminal = useRef<Terminal | null>(null);
  const fitAddon = useRef<FitAddon | null>(null);
  const signalRService = useRef<SignalRService | null>(null);
  const inputHandler = useRef<InputHandler | null>(null);
  const resizeHandler = useRef<(() => void) | null>(null);
  const lastContainerId = useRef<string | null>(null);

  useEffect(() => {
    // If session becomes null while connected, disconnect
    if (!containerId && isConnected) {
      console.log("📦 Container ID lost, disconnecting...");
      disconnect();
    }
  }, [containerId, isConnected]);

  // Initialize terminal (once, on mount)
  useEffect(() => {
    const initializeTerminal = async () => {
      console.log("Inside terminal", containerId);
      if (
        typeof window === "undefined" ||
        !terminalRef.current ||
        terminal.current
      ) {
        return;
      }

      console.log("Inside terminal", containerId);

      const { terminal: term, fitAddon: fit } = await loadTerminal(
        terminalRef.current
      );
      terminal.current = term;
      fitAddon.current = fit;

      setTimeout(() => fitAddon.current?.fit(), 100);

      setIsLoaded(true);

      if (terminalRef.current) {
        terminalRef.current.addEventListener(
          "wheel",
          (e) => e.preventDefault(),
          { passive: false }
        );
      }
    };

    initializeTerminal();

    return () => {
      disconnect();
      if (terminal.current) {
        terminal.current.dispose();
        terminal.current = null;
      }
      fitAddon.current = null;
      setIsLoaded(false);
    };
    // eslint-disable-next-line
  }, [terminalRef.current]);

  // Auto-connect when containerId becomes available
  useEffect(() => {
    if (
      autoConnect &&
      containerId &&
      containerId !== lastContainerId.current &&
      isLoaded &&
      !isConnecting &&
      !isConnected
    ) {
      console.log("📦 Container ID available, connecting to:", containerId);
      connect(containerId);
    }
    // eslint-disable-next-line
  }, [containerId, autoConnect, isLoaded, isConnecting, isConnected]);

  const connect = async (targetContainerId?: string) => {
    const containerToConnect = targetContainerId || containerId;

    if (!terminal.current) {
      // console.error("❌ Cannot connect: Terminal not initialized");
      return;
    }

    if (!containerToConnect) {
      console.error("❌ Cannot connect: No container ID provided");
      return;
    }

    if (isConnected || isConnecting) {
      console.log("⚠️  Already connected or connecting");
      return;
    }

    // If switching to a different container, disconnect first
    if (
      signalRService.current &&
      lastContainerId.current &&
      lastContainerId.current !== containerToConnect
    ) {
      console.log(
        "🔄 Switching containers from:",
        lastContainerId.current,
        "to:",
        containerToConnect
      );
      await disconnect();
    }

    setIsConnecting(true);
    lastContainerId.current = containerToConnect;

    try {
      signalRService.current = new SignalRService(
        terminal.current,
        setIsConnected
      );

      // Connect SignalR with the specific container ID
      await signalRService.current.connect(containerToConnect);

      inputHandler.current = new InputHandler(
        terminal.current,
        signalRService.current
      );
      inputHandler.current.setup();

      // Setup resize handler
      resizeHandler.current = () => {
        fitAddon.current?.fit();
        if (terminal.current) {
          const { cols, rows } = terminal.current;
          signalRService.current?.sendResize(cols, rows);
        }
      };
      window.addEventListener("resize", resizeHandler.current);

      console.log("✅ Connected to container:", containerToConnect);
    } catch (error) {
      console.error("❌ Connection failed:", error);
      setIsConnected(false);
      lastContainerId.current = null;

      // Show error in terminal
      if (terminal.current) {
        terminal.current.writeln(
          `\r\n\x1b[31mConnection failed: ${error}\x1b[0m\r\n`
        );
      }
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnect = async () => {
    if (!isConnected && !signalRService.current) return;

    console.log("🔌 Disconnecting from container...");

    try {
      if (resizeHandler.current) {
        window.removeEventListener("resize", resizeHandler.current);
        resizeHandler.current = null;
      }

      await signalRService.current?.stop();
      signalRService.current = null;
      inputHandler.current = null;
      lastContainerId.current = null;

      setIsConnected(false);

      if (terminal.current) {
        terminal.current.clear();
        terminal.current.writeln(
          "\x1b[33mDisconnected from Docker Container\x1b[0m"
        );
      }

      console.log("✅ Disconnected successfully");
    } catch (error) {
      console.error("❌ Disconnect error:", error);
    }
  };

  const toggleConnection = async () => {
    if (isConnecting) {
      console.log("⚠️  Connection in progress, please wait...");
      return;
    }

    // 1️⃣ If session is already connected → disconnect
    if (isConnected) {
      await disconnect();
      return;
    }

    // 2️⃣ If containerId is missing → create a new session
    let finalContainerId = containerId;

    if (!finalContainerId) {
      console.log("🆕 No session available. Creating new session...");

      if (!getOrCreateSession) {
        console.error("❌ getOrCreateSession not provided");
        return;
      }

      const session = await getOrCreateSession();
      if (!session) {
        console.error("❌ Failed to create session.");
        terminal.current?.writeln(
          "\r\n\x1b[31mFailed to create session. Please try again.\x1b[0m\r\n"
        );
        return;
      }

      finalContainerId = session.containerId;
    }

    // 3️⃣ Now connect to the created/retrieved container
    const safeContainerId = finalContainerId!;
    console.log("🔗 Connecting to container:", finalContainerId);
    await connect(safeContainerId);
  };

  return {
    isConnected,
    isLoaded,
    isConnecting,
    connect,
    disconnect,
    toggleConnection,
    currentContainerId: lastContainerId.current,
  };
}
