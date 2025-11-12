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

  const terminal = useRef<Terminal | null>(null);
  const fitAddon = useRef<FitAddon | null>(null);
  const signalRService = useRef<SignalRService | null>(null);
  const inputHandler = useRef<InputHandler | null>(null);

  useEffect(() => {
    const initializeTerminal = async () => {
      if (
        typeof window === "undefined" ||
        !terminalRef.current ||
        terminal.current
      ) {
        return;
      }

      // Load terminal
      const { terminal: term, fitAddon: fit } = await loadTerminal(
        terminalRef.current
      );
      terminal.current = term;
      fitAddon.current = fit;

      setTimeout(() => fitAddon.current?.fit(), 100);

      setIsLoaded(true);

      // Initialize SignalR service
      signalRService.current = new SignalRService(term, setIsConnected);
      await signalRService.current.connect();

      // Setup input handler
      inputHandler.current = new InputHandler(term, signalRService.current);
      inputHandler.current.setup();

      // Disable mouse wheel scrolling
      if (terminalRef.current) {
        terminalRef.current.addEventListener(
          "wheel",
          (e) => e.preventDefault(),
          { passive: false }
        );
      }
    };

    initializeTerminal();

    const handleResize = () => {
      fitAddon.current?.fit();
      const { cols, rows } = terminal.current!;
      signalRService.current?.sendResize(cols, rows);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      signalRService.current?.stop();
      terminal.current?.dispose();
    };
  }, [terminalRef]);

  const disconnect = async () => {
    await signalRService.current?.stop();
    setIsConnected(false);
  };

  return { isConnected, isLoaded, disconnect };
}
