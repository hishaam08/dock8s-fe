import * as signalR from "@microsoft/signalr";
import type { Terminal } from "@xterm/xterm";
import { terminalConfig, ASCII_ART, MOBILE_ASCII_ART } from "../config";

export class SignalRService {
  private connection: signalR.HubConnection | null = null;
  private isReady = false;

  constructor(
    private terminal: Terminal,
    private onConnectionChange: (connected: boolean) => void
  ) {}

  async connect(): Promise<void> {
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
      this.attachToContainer();
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
      this.onConnectionChange(false);

      this.terminal.writeln("\r\n\x1b[33m[Session Ended]\x1b[0m\r\n");
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

      await this.attachToContainer();
      const { cols: termCols, rows } = this.terminal;
      this.sendResize(termCols, rows);

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
    try {
      await this.connection?.invoke("Attach", terminalConfig.containerId);
      console.log("Attached to container:", terminalConfig.containerId);
    } catch (err) {
      console.error("Attach failed:", err);
    }
  }

  async sendInput(input: string): Promise<void> {
    if (this.connection?.state === signalR.HubConnectionState.Connected) {
      try {
        await this.connection.invoke("SendInput", input);
        console.log("Command sent successfully");
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

  async stop(): Promise<void> {
    this.isReady = false;

    // Remove all event handlers
    if (this.connection) {
      this.connection.off("ReceiveOutput");
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
