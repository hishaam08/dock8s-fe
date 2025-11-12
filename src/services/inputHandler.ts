import type { Terminal } from "@xterm/xterm";
import type { TerminalState } from "../types";
import type { SignalRService } from "./signalRService";

export class InputHandler {
  private state: TerminalState = {
    inputBuffer: "",
    cursorPosition: 0,
    commandHistory: [],
    historyIndex: -1,
    isReady: false,
  };

  private isInRawMode = false;
  private tabCompletionInProgress = false;

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

      // If in raw mode (vim/nano), send all input directly
      if (this.isInRawMode) {
        this.signalRService.sendInput(data);
        return;
      }

      const charCode = data.charCodeAt(0);

      if (charCode === 13) {
        this.handleEnter();
      } else if (charCode === 127) {
        this.handleBackspace();
      }
      //   else if (charCode === 9) {
      //     this.handleTab();
      //   }
      else if (charCode === 3) {
        this.handleCtrlC();
      } else if (charCode === 27) {
        // Send escape sequences directly to support vim/nano
        this.signalRService.sendInput(data);
        this.handleEscapeSequence(data);
      } else if (charCode >= 32 && charCode <= 126) {
        this.handleCharacter(data);
      } else {
        // Send any other control characters directly
        this.signalRService.sendInput(data);
      }
    });
  }

    // Method to handle tab completion response from server
//   public handleTabCompletionResponse(completionText: string): void {
//     if (this.tabCompletionInProgress) {
//       // The server sends back the completed text
//       // Update the display accordingly
//       this.tabCompletionInProgress = false;
//     }
//   }

  private handleEnter(): void {
    this.terminal.write("\r\n");

    const commandToSend = this.state.inputBuffer + "\n";
    console.log("Sending command:", commandToSend);

    // Detect if entering raw mode (vim, nano, etc.)
    const trimmedCommand = this.state.inputBuffer.trim().toLowerCase();
    if (
      trimmedCommand === "vim" ||
      trimmedCommand.startsWith("vim ") ||
      trimmedCommand === "vi" ||
      trimmedCommand.startsWith("vi ") ||
      trimmedCommand === "nano" ||
      trimmedCommand.startsWith("nano ") ||
      trimmedCommand === "less" ||
      trimmedCommand.startsWith("less ") ||
      trimmedCommand === "more" ||
      trimmedCommand.startsWith("more ") ||
      trimmedCommand === "top" ||
      trimmedCommand === "htop"
    ) {
      this.isInRawMode = true;
      console.log("Entering raw mode for:", trimmedCommand);
    }

    if (this.state.inputBuffer.trim().length > 0) {
      if (
        this.state.commandHistory.length === 0 ||
        this.state.commandHistory[this.state.commandHistory.length - 1] !==
          this.state.inputBuffer
      ) {
        this.state.commandHistory.push(this.state.inputBuffer);
      }
    }

    this.signalRService.sendInput(commandToSend);

    this.state.inputBuffer = "";
    this.state.cursorPosition = 0;
    this.state.historyIndex = this.state.commandHistory.length;
  }

  private handleBackspace(): void {
    if (this.state.cursorPosition > 0) {
      const pos = this.state.cursorPosition;
      this.state.inputBuffer =
        this.state.inputBuffer.slice(0, pos - 1) +
        this.state.inputBuffer.slice(pos);
      this.state.cursorPosition--;
      this.terminal.write("\b \b");
    }
  }

  private handleCtrlC(): void {
    this.terminal.write("^C\r\n");
    this.state.inputBuffer = "";
    this.state.cursorPosition = 0;

    // Exit raw mode on Ctrl+C
    if (this.isInRawMode) {
      this.isInRawMode = false;
      console.log("Exiting raw mode");
    }

    this.signalRService.sendInput("\x03");
  }

  private handleTab(): void {
    // Send tab for autocompletion to the server
    // The server will handle the completion and send back the result
    this.tabCompletionInProgress = true;
    this.signalRService.sendInput("\t");
  }

  private handleEscapeSequence(data: string): void {
    // In raw mode, don't handle locally
    if (this.isInRawMode) {
      return;
    }

    if (data.length === 3 && data[1] === "[") {
      const arrowKey = data[2];

      switch (arrowKey) {
        case "D": // Left arrow
          if (this.state.cursorPosition > 0) {
            this.state.cursorPosition--;
            this.terminal.write("\x1b[D");
          }
          break;

        case "C": // Right arrow
          if (this.state.cursorPosition < this.state.inputBuffer.length) {
            this.state.cursorPosition++;
            this.terminal.write("\x1b[C");
          }
          break;

        case "A": // Up arrow
          this.navigateHistory(-1);
          break;

        case "B": // Down arrow
          this.navigateHistory(1);
          break;
      }
    }
  }

  private navigateHistory(direction: number): void {
    const newIndex = this.state.historyIndex + direction;

    if (direction < 0) {
      // Up arrow
      if (this.state.commandHistory.length > 0 && this.state.historyIndex > 0) {
        this.clearCurrentInput();
        this.state.historyIndex = newIndex;
        this.state.inputBuffer = this.state.commandHistory[newIndex];
        this.state.cursorPosition = this.state.inputBuffer.length;
        this.terminal.write(this.state.inputBuffer);
      }
    } else {
      // Down arrow
      if (newIndex < this.state.commandHistory.length) {
        this.clearCurrentInput();
        this.state.historyIndex = newIndex;
        this.state.inputBuffer = this.state.commandHistory[newIndex];
        this.state.cursorPosition = this.state.inputBuffer.length;
        this.terminal.write(this.state.inputBuffer);
      } else if (
        this.state.historyIndex ===
        this.state.commandHistory.length - 1
      ) {
        this.clearCurrentInput();
        this.state.historyIndex = this.state.commandHistory.length;
        this.state.inputBuffer = "";
        this.state.cursorPosition = 0;
      }
    }
  }

  private clearCurrentInput(): void {
    const clearLength = this.state.inputBuffer.length;
    for (let i = 0; i < clearLength; i++) {
      this.terminal.write("\b \b");
    }
  }

  private handleCharacter(data: string): void {
    const pos = this.state.cursorPosition;
    this.state.inputBuffer =
      this.state.inputBuffer.slice(0, pos) +
      data +
      this.state.inputBuffer.slice(pos);
    this.state.cursorPosition++;
    this.terminal.write(data);
  }
}
