import type { Terminal } from "@xterm/xterm";
import type { SignalRService } from "./signalRService";

export class InputHandler {
  constructor(
    private terminal: Terminal,
    private signalRService: SignalRService
  ) {}

  setup(): void {
    this.terminal.onData((data: string) => {
      if (!this.signalRService.isTerminalReady()) {
        console.log("Terminal not ready yet, ignoring input");
        return;
      }
      this.signalRService.sendInput(data);
    });
  }
}