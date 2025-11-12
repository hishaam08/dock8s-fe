import type { Terminal } from "@xterm/xterm";
import type { FitAddon } from "@xterm/addon-fit";
import { terminalConfig } from "../config";

export async function loadTerminal(
  containerRef: HTMLDivElement
): Promise<{ terminal: Terminal; fitAddon: FitAddon }> {
  const { Terminal } = await import("@xterm/xterm");
  const { FitAddon } = await import("@xterm/addon-fit");

  const terminal = new Terminal(terminalConfig.terminal);
  const fitAddon = new FitAddon();

  terminal.loadAddon(fitAddon);
  terminal.open(containerRef);
  fitAddon.fit();

  return { terminal, fitAddon };
}