import type { Terminal } from "@xterm/xterm";
import type * as signalR from "@microsoft/signalr";

export interface TerminalState {
  inputBuffer: string;
  cursorPosition: number;
  commandHistory: string[];
  historyIndex: number;
  isReady: boolean;
}

export interface TerminalRefs {
  terminal: Terminal | null;
  connection: signalR.HubConnection | null;
}

export interface ConnectionStatus {
  isConnected: boolean;
  isLoaded: boolean;
}