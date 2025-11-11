"use client";
import "@xterm/xterm/css/xterm.css";

import { useEffect, useRef, useState } from "react";
import * as signalR from "@microsoft/signalr";

const CONTAINER_ID = process.env.CONTAINER_ID || "810e72fe5df2";
const BASE_URL = process.env.BASE_URL || "http://localhost:5295";
const ASCII_ART = `
$$$$$$$\\                      $$\\       $$$$$$\\            
$$  __$$\\                     $$ |     $$  __$$\\           
$$ |  $$ | $$$$$$\\   $$$$$$$\\ $$ |  $$\\$$ /  $$ | $$$$$$$\\ 
$$ |  $$ |$$  __$$\\ $$  _____|$$ | $$  $$$$$$  |$$  _____|
$$ |  $$ |$$ /  $$ |$$ /      $$$$$$  /$$  __$$< \\$$$$$$\\ 
$$ |  $$ |$$ |  $$ |$$ |      $$  _$$< $$ /  $$ | \\____$$\\
$$$$$$$  |\\$$$$$$  |\\$$$$$$$\\ $$ | \\$$\\\\$$$$$$  |$$$$$$$  |
\\_______/  \\______/  \\_______|\\__|  \\__|\\______/ \\_______/
`;

export default function XTerm() {
  const terminalRef = useRef<HTMLDivElement>(null);
  const term = useRef<any>(null);
  const fitAddon = useRef<any>(null);

  const inputBuffer = useRef<string>("");
  const cursorPosition = useRef<number>(0);
  const commandHistory = useRef<string[]>([]);
  const historyIndex = useRef<number>(-1);
  const connection = useRef<signalR.HubConnection | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Track if we're ready to accept input
  const isReady = useRef<boolean>(false);

  useEffect(() => {
    // Dynamically import xterm modules only on client side
    const loadTerminal = async () => {
      if (typeof window === 'undefined') return;

      const { Terminal } = await import("@xterm/xterm");
      const { FitAddon } = await import("@xterm/addon-fit");

      if (terminalRef.current && !term.current) {
        term.current = new Terminal({
          fontFamily: "monospace",
          fontSize: 14,
          scrollback: 1000,
          allowProposedApi: true,
          convertEol: true,
          cursorBlink: true,
          theme: { background: "#1e1e1e", foreground: "#ffffff" },
        });
        fitAddon.current = new FitAddon();
        term.current.loadAddon(fitAddon.current);
        term.current.open(terminalRef.current);
        fitAddon.current.fit();
        setIsLoaded(true);

        // Initialize SignalR connection
        connection.current = new signalR.HubConnectionBuilder()
          .withUrl(`${BASE_URL}/terminalhub`)
          .withAutomaticReconnect()
          .configureLogging(signalR.LogLevel.Information)
          .build();

        // Handle incoming output from backend
        connection.current.on("ReceiveOutput", (data: string) => {
          console.log(
            "Received data:",
            data.replace(/\n/g, "\\n").replace(/\r/g, "\\r")
          );

          // Write to terminal
          term.current?.write(data);

          // Mark as ready after receiving initial prompt
          if (!isReady.current && (data.includes("#") || data.includes("$"))) {
            isReady.current = true;
            console.log("Terminal is ready for input");
          }
        });

        // Start connection and attach to container
        connection.current
          .start()
          .then(() => {
            console.log("SignalR Connected");
            setIsConnected(true);
            term.current?.writeln("\x1b[36m" + ASCII_ART + "\x1b[0m\r\n");
            return connection.current?.invoke("Attach", CONTAINER_ID);
          })
          .then(() => {
            console.log("Attached to container:", CONTAINER_ID);
            // Wait a bit before considering terminal ready
            setTimeout(() => {
              isReady.current = true;
              console.log("Terminal ready for input");
            }, 1000);
          })
          .catch((err) => {
            console.error("Connection/Attach Error:", err);
            term.current?.writeln(
              `\r\n\x1b[31mConnection failed: ${err}\x1b[0m\r\n`
            );
            setIsConnected(false);
          });

        // Handle reconnection
        connection.current.onreconnected(() => {
          console.log("Reconnected to SignalR");
          setIsConnected(true);
          connection.current?.invoke("Attach", CONTAINER_ID).catch((err) => {
            console.error("Reattach failed:", err);
          });
        });

        connection.current.onreconnecting(() => {
          console.log("Reconnecting...");
          setIsConnected(false);
          isReady.current = false;
        });

        connection.current.onclose(() => {
          console.log("Connection closed");
          setIsConnected(false);
          isReady.current = false;
        });

        // Handle user input
        term.current.onData((data: string) => {
          // Don't process input until ready
          if (!isReady.current) {
            console.log("Terminal not ready yet, ignoring input");
            return;
          }

          const charCode = data.charCodeAt(0);

          // Handle Enter key
          if (charCode === 13) {
            term.current?.write("\r\n");
            if (
              connection.current?.state === signalR.HubConnectionState.Connected
            ) {
              const commandToSend = inputBuffer.current + "\n";
              console.log("Sending command:", commandToSend);

              // Add to history if not empty and not duplicate
              if (inputBuffer.current.trim().length > 0) {
                if (
                  commandHistory.current.length === 0 ||
                  commandHistory.current[commandHistory.current.length - 1] !==
                    inputBuffer.current
                ) {
                  commandHistory.current.push(inputBuffer.current);
                }
              }
              historyIndex.current = commandHistory.current.length;

              // Send command with newline
              connection.current
                .invoke("SendInput", commandToSend)
                .then(() => {
                  console.log("Command sent successfully");
                })
                .catch((err) => {
                  console.error("Error sending command:", err);
                  term.current?.writeln(`\r\n\x1b[31mError: ${err}\x1b[0m\r\n`);
                });
            }

            inputBuffer.current = "";
            cursorPosition.current = 0;
            historyIndex.current = commandHistory.current.length;
          }
          // Handle Backspace
          else if (charCode === 127) {
            if (cursorPosition.current > 0) {
              const pos = cursorPosition.current;
              inputBuffer.current =
                inputBuffer.current.slice(0, pos - 1) +
                inputBuffer.current.slice(pos);
              cursorPosition.current--;

              // Move cursor back, erase character, move back again
              term.current?.write("\b \b");
            }
          }
          // Handle Ctrl+C
          else if (charCode === 3) {
            term.current?.write("^C\r\n");
            inputBuffer.current = "";
            cursorPosition.current = 0;

            // Send Ctrl+C to container
            if (
              connection.current?.state === signalR.HubConnectionState.Connected
            ) {
              connection.current.invoke("SendInput", "\x03").catch((err) => {
                console.error("Error sending Ctrl+C:", err);
              });
            }
          }
          // Handle arrow keys and other escape sequences
          else if (charCode === 27) {
            if (data.length === 3 && data[1] === "[") {
              const arrowKey = data[2];

              // Left arrow
              if (arrowKey === "D") {
                if (cursorPosition.current > 0) {
                  cursorPosition.current--;
                  term.current?.write("\x1b[D");
                }
              }
              // Right arrow
              else if (arrowKey === "C") {
                if (cursorPosition.current < inputBuffer.current.length) {
                  cursorPosition.current++;
                  term.current?.write("\x1b[C");
                }
              }
              // Up arrow - previous command in history
              else if (arrowKey === "A") {
                if (
                  commandHistory.current.length > 0 &&
                  historyIndex.current > 0
                ) {
                  historyIndex.current--;

                  // Clear current input
                  const clearLength = inputBuffer.current.length;
                  for (let i = 0; i < clearLength; i++) {
                    term.current?.write("\b \b");
                  }

                  inputBuffer.current =
                    commandHistory.current[historyIndex.current];
                  cursorPosition.current = inputBuffer.current.length;
                  term.current?.write(inputBuffer.current);
                }
              }
              // Down arrow - next command in history
              else if (arrowKey === "B") {
                if (historyIndex.current < commandHistory.current.length - 1) {
                  historyIndex.current++;

                  // Clear current input
                  const clearLength = inputBuffer.current.length;
                  for (let i = 0; i < clearLength; i++) {
                    term.current?.write("\b \b");
                  }

                  inputBuffer.current =
                    commandHistory.current[historyIndex.current];
                  cursorPosition.current = inputBuffer.current.length;
                  term.current?.write(inputBuffer.current);
                } else if (
                  historyIndex.current ===
                  commandHistory.current.length - 1
                ) {
                  historyIndex.current = commandHistory.current.length;

                  // Clear current input
                  const clearLength = inputBuffer.current.length;
                  for (let i = 0; i < clearLength; i++) {
                    term.current?.write("\b \b");
                  }

                  inputBuffer.current = "";
                  cursorPosition.current = 0;
                }
              }
            }
          }
          // Handle regular character input
          else if (charCode >= 32 && charCode <= 126) {
            const pos = cursorPosition.current;
            inputBuffer.current =
              inputBuffer.current.slice(0, pos) +
              data +
              inputBuffer.current.slice(pos);
            cursorPosition.current++;
            term.current?.write(data);
          }
        });

        // Disable mouse wheel scrolling
        if (terminalRef.current) {
          terminalRef.current.addEventListener(
            "wheel",
            (e) => {
              e.preventDefault();
            },
            { passive: false }
          );
        }
      }
    };

    loadTerminal();

    const handleResize = () => fitAddon.current?.fit();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      connection.current?.stop();
      term.current?.dispose();
    };
  }, []);

  return (
    <div className="flex flex-col h-screen bg-[#6f79823f] p-3 rounded-2xl shadow-[0_0_40px_rgba(59,130,246,0.4)]">
      <div className="flex items-center gap-2 mb-2">
        <div
          className={`w-3 h-3 rounded-full ${
            isConnected ? "bg-green-500" : "bg-red-500"
          }`}
        />
        <span className="text-white text-sm">
          {isConnected ? "Connected to Docker" : "Connecting..."}
        </span>
      </div>
      <div className="flex flex-col flex-1 bg-[#1e1e1e] rounded-xl p-5 overflow-hidden backdrop-blur-sm">
        {!isLoaded && (
          <div className="flex items-center justify-center h-full text-white">
            Loading terminal...
          </div>
        )}
        <div ref={terminalRef} className="flex-1 w-full h-full" />
      </div>
    </div>
  );
}