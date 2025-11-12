import * as signalR from "@microsoft/signalr";
import type { Terminal } from "@xterm/xterm";
import { terminalConfig, ASCII_ART } from "../config";

export class SignalRService {
  private connection: signalR.HubConnection | null = null;
  private isReady = false;

  constructor(
    private terminal: Terminal,
    private onConnectionChange: (connected: boolean) => void
  ) {}

  async connect(): Promise<void> {
    this.connection = new signalR.HubConnectionBuilder()
      .withUrl(terminalConfig.signalR.hubUrl(terminalConfig.baseUrl), {
        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets,
        withCredentials: false,
      })
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
  }

  private async start(): Promise<void> {
    try {
      await this.connection?.start();
      console.log("SignalR Connected");
      this.onConnectionChange(true);

      this.terminal?.writeln("\x1b[36m" + ASCII_ART + "\x1b[0m\r\n");
      
      await this.attachToContainer();
      const { cols, rows } = this.terminal;
      this.sendResize(cols, rows);

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
    await this.connection?.stop();
  }
}
