import { useEffect, useRef, useState } from "react";
import type { Terminal } from "@xterm/xterm";
import type { FitAddon } from "@xterm/addon-fit";
import { loadTerminal } from "../utils/terminalLoader";
import { SignalRService } from "../services/signalRService";
import { InputHandler } from "../services/inputHandler";

export function useTerminal(
  terminalRef: React.RefObject<HTMLDivElement | null>
) {
  const [isConnected, setIsConnected] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  const terminal = useRef<Terminal | null>(null);
  const fitAddon = useRef<FitAddon | null>(null);
  const signalRService = useRef<SignalRService | null>(null);
  const inputHandler = useRef<InputHandler | null>(null);
  const resizeHandler = useRef<(() => void) | null>(null);

  useEffect(() => {
    const initializeTerminal = async () => {
      if (
        typeof window === "undefined" ||
        !terminalRef.current ||
        terminal.current
      ) {
        return;
      }

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

      await connect();
    };

    initializeTerminal();

    return () => {
      disconnect();
      terminal.current?.dispose();
    };
    // eslint-disable-next-line
  }, [terminalRef]);

  const connect = async () => {
    if (!terminal.current || isConnected || isConnecting) return;

    setIsConnecting(true);

    try {
      signalRService.current = new SignalRService(
        terminal.current,
        setIsConnected
      );
      await signalRService.current.connect();

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
    } catch (error) {
      console.error("Connection failed:", error);
      setIsConnected(false);
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnect = async () => {
    if (!isConnected && !signalRService.current) return;

    try {
      if (resizeHandler.current) {
        window.removeEventListener("resize", resizeHandler.current);
        resizeHandler.current = null;
      }

      await signalRService.current?.stop();
      signalRService.current = null;
      inputHandler.current = null;

      setIsConnected(false);

      terminal.current?.clear();
      terminal.current?.writeln("\x1b[33mDisconnected from Docker Daemon\x1b[0m");
    } catch (error) {
      console.error("Disconnect error:", error);
    }
  };

  const toggleConnection = async () => {
    if (isConnecting) return;

    if (isConnected) {
      await disconnect();
    } else {
      await connect();
    }
  };

  return {
    isConnected,
    isLoaded,
    isConnecting,
    toggleConnection,
    disconnect,
  };
}