import * as signalR from "@microsoft/signalr";
import type { Terminal } from "@xterm/xterm";
import { terminalConfig, ASCII_ART, MOBILE_ASCII_ART } from "../config";

export class SignalRService {
  private connection: signalR.HubConnection | null = null;
  private isReady = false;
  private containerId: string | null = null;

  constructor(
    private terminal: Terminal,
    private onConnectionChange: (connected: boolean) => void
  ) {}

  async connect(containerId: string): Promise<void> {
    if (this.connection) {
      console.warn("Already connected, disconnecting first...");
      await this.stop();
    }

    this.containerId = containerId;
    ``;
    this.connection = new signalR.HubConnectionBuilder()
      .withUrl(terminalConfig.signalR.hubUrl(terminalConfig.baseUrl))
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Information)
      .build();

    this.setupHandlers();
    await this.start();
  }

  private setupHandlers(): void {
    if (!this.connection) return;

    this.connection.on("ReceiveOutput", (data: string) => {
      // Write raw data directly to terminal for proper vim/nano rendering
      this.terminal?.write(data);

      if (!this.isReady && (data.includes("#") || data.includes("$"))) {
        this.isReady = true;
        console.log("Terminal is ready for input");
      }
    });

    this.connection.onreconnected(() => {
      console.log("Reconnected to SignalR");
      this.onConnectionChange(true);
      if (this.containerId) {
        this.attachToContainer();
      }
    });

    this.connection.onreconnecting(() => {
      console.log("Reconnecting...");
      this.onConnectionChange(false);
      this.isReady = false;
    });

    this.connection.onclose(() => {
      console.log("Connection closed");
      this.onConnectionChange(false);
      this.isReady = false;
    });

    this.connection.on("StreamClosed", () => {
      console.log("Docker exec stream ended (EOF)");

      // Show message in terminal
      this.terminal.writeln(
        "\r\n\x1b[33m[Session Ended - Stream Closed]\x1b[0m\r\n"
      );

      // Automatically disconnect the SignalR connection
      this.stop()
        .then(() => {
          console.log("✅ Auto-disconnected after stream closure");
          this.onConnectionChange(false);
        })
        .catch((err) => {
          console.error("❌ Error during auto-disconnect:", err);
          this.onConnectionChange(false);
        });
    });
  }

  private async start(): Promise<void> {
    try {
      await this.connection?.start();
      console.log("SignalR Connected");
      this.onConnectionChange(true);

      // Get terminal dimensions
      const { cols } = this.terminal;
      const isMobile = cols < 80;

      // Choose appropriate intro text based on width
      const introText = isMobile ? MOBILE_ASCII_ART : ASCII_ART;

      this.terminal?.writeln("\x1b[38;2;180;180;180m" + introText + "\x1b[0m");

      // Attach to the user's specific container
      if (this.containerId) {
        await this.attachToContainer();
        const { cols: termCols, rows } = this.terminal;
        this.sendResize(termCols, rows);
      } else {
        throw new Error("No container ID provided");
      }

      setTimeout(() => {
        this.isReady = true;
        console.log("Terminal ready for input");
      }, terminalConfig.signalR.reconnectDelay);
    } catch (err) {
      console.error("Connection/Attach Error:", err);
      this.terminal?.writeln(
        `\r\n\x1b[31mConnection failed: ${err}\x1b[0m\r\n`
      );
      this.onConnectionChange(false);
    }
  }

  private async attachToContainer(): Promise<void> {
    if (!this.containerId) {
      throw new Error("Cannot attach: No container ID");
    }

    try {
      await this.connection?.invoke("Attach", this.containerId);
      console.log("Attached to container:", this.containerId);
    } catch (err) {
      console.error("Attach failed:", err);
      throw err;
    }
  }

  async sendInput(input: string): Promise<void> {
    if (this.connection?.state === signalR.HubConnectionState.Connected) {
      try {
        await this.connection.invoke("SendInput", input);
      } catch (err) {
        console.error("Error sending command:", err);
        this.terminal?.writeln(`\r\n\x1b[31mError: ${err}\x1b[0m\r\n`);
      }
    }
  }

  async sendResize(cols: number, rows: number): Promise<void> {
    if (!this.connection) return;
    try {
      await this.connection.invoke("ResizeTerminal", cols, rows);
    } catch (err) {
      console.error("Failed to send resize:", err);
    }
  }

  isTerminalReady(): boolean {
    return this.isReady;
  }

  getConnectionState(): signalR.HubConnectionState | null {
    return this.connection?.state ?? null;
  }

  getContainerId(): string | null {
    return this.containerId;
  }

  async stop(): Promise<void> {
    this.isReady = false;
    this.containerId = null;

    // Remove all event handlers
    if (this.connection) {
      this.connection.off("ReceiveOutput");
      this.connection.off("StreamClosed");
    }

    // Stop the connection
    try {
      await this.connection?.stop();
      console.log("SignalR connection stopped");
    } catch (err) {
      console.error("Error stopping connection:", err);
    } finally {
      this.connection = null;
    }
  }
}
