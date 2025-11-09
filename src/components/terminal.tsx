"use client";

import { useEffect, useRef } from "react";
import { Terminal } from "xterm";
import "xterm/css/xterm.css";
import { FitAddon } from "xterm-addon-fit";

const PROMPT = "root@WD16822024833noidaspeedvpsyCi3umjdMk:~# ";
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
  const term = useRef<Terminal | null>(null);
  const fitAddon = useRef<FitAddon | null>(null);

  const inputBuffer = useRef<string>("");
  const cursorPosition = useRef<number>(0);
  const commandHistory = useRef<string[]>([]);
  const historyIndex = useRef<number>(-1);

  const runCommand = (command: string) => {
    term.current?.writeln("");

    // Add to history if not empty and not duplicate of last command
    if (command.trim().length > 0) {
      if (commandHistory.current.length === 0 || 
          commandHistory.current[commandHistory.current.length - 1] !== command) {
        commandHistory.current.push(command);
      }
    }
    historyIndex.current = commandHistory.current.length;

    if (command.trim().toLowerCase() === "clear") {
      term.current?.clear();
    } else if (command.trim().length > 0) {
      term.current?.writeln(`You typed: ${command}`);
      term.current?.writeln(`Command not found: ${command.split(" ")[0]}`);
    }
    term.current?.write(PROMPT);
  };

  useEffect(() => {
    if (terminalRef.current && !term.current) {
      term.current = new Terminal({
        fontFamily: "monospace",
        fontSize: 14,
        scrollback: 0,
        allowProposedApi: true,
        convertEol: true,
        cursorBlink: true,
        theme: { background: "#1e1e1e", foreground: "#ffffff" },
      });
      fitAddon.current = new FitAddon();
      term.current.loadAddon(fitAddon.current);
      term.current.open(terminalRef.current);
      
      term.current.writeln(ASCII_ART);
      term.current.write(PROMPT);

      fitAddon.current.fit();

      term.current.onData((data) => {
        const charCode = data.charCodeAt(0);

        // Handle Enter key
        if (charCode === 13) {
          runCommand(inputBuffer.current);
          inputBuffer.current = "";
          cursorPosition.current = 0;
        } 
        // Handle Backspace
        else if (charCode === 127) {
          if (cursorPosition.current > 0) {
            const pos = cursorPosition.current;
            inputBuffer.current = 
              inputBuffer.current.slice(0, pos - 1) + 
              inputBuffer.current.slice(pos);
            cursorPosition.current--;
            
            // Redraw the line
            term.current?.write('\r' + PROMPT + inputBuffer.current + ' ');
            term.current?.write('\r' + PROMPT);
            for (let i = 0; i < cursorPosition.current; i++) {
              term.current?.write('\x1b[C'); // Move cursor right
            }
          }
        }
        // Handle arrow keys and other escape sequences
        else if (charCode === 27) {
          // Escape sequence detected
          if (data.length === 3 && data[1] === '[') {
            const arrowKey = data[2];
            
            // Left arrow
            if (arrowKey === 'D') {
              if (cursorPosition.current > 0) {
                cursorPosition.current--;
                term.current?.write('\x1b[D');
              }
            }
            // Right arrow
            else if (arrowKey === 'C') {
              if (cursorPosition.current < inputBuffer.current.length) {
                cursorPosition.current++;
                term.current?.write('\x1b[C');
              }
            }
            // Up arrow - previous command in history
            else if (arrowKey === 'A') {
              if (commandHistory.current.length > 0 && historyIndex.current > 0) {
                historyIndex.current--;
                inputBuffer.current = commandHistory.current[historyIndex.current];
                cursorPosition.current = inputBuffer.current.length;
                
                // Clear current line and redraw
                term.current?.write('\r\x1b[K' + PROMPT + inputBuffer.current);
              }
            }
            // Down arrow - next command in history
            else if (arrowKey === 'B') {
              if (historyIndex.current < commandHistory.current.length - 1) {
                historyIndex.current++;
                inputBuffer.current = commandHistory.current[historyIndex.current];
                cursorPosition.current = inputBuffer.current.length;
                
                // Clear current line and redraw
                term.current?.write('\r\x1b[K' + PROMPT + inputBuffer.current);
              } else if (historyIndex.current === commandHistory.current.length - 1) {
                // At the end of history, clear the line
                historyIndex.current = commandHistory.current.length;
                inputBuffer.current = "";
                cursorPosition.current = 0;
                
                term.current?.write('\r\x1b[K' + PROMPT);
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
          
          // Redraw from cursor position
          term.current?.write('\r' + PROMPT + inputBuffer.current);
          term.current?.write('\r' + PROMPT);
          for (let i = 0; i < cursorPosition.current; i++) {
            term.current?.write('\x1b[C');
          }
        }
      });

      // Disable mouse wheel scrolling
      if (terminalRef.current) {
        terminalRef.current.addEventListener('wheel', (e) => {
          e.preventDefault();
        }, { passive: false });
      }
    }

    const handleResize = () => fitAddon.current?.fit();
    window.addEventListener("resize", handleResize);
    
    return () => {
      window.removeEventListener("resize", handleResize);
      term.current?.dispose();
    };
  }, []);

  return (
    <div className="flex flex-col flex-1 bg-[#1e1e1e] rounded-xl p-5 overflow-hidden">
      <div ref={terminalRef} className="flex-1 w-full h-full" />
    </div>
  );
}