export const terminalConfig = {
  containerId: process.env.CONTAINER_ID || "810e72fe5df2",
  baseUrl: process.env.BASE_URL || "http://localhost:5295",

  terminal: {
    fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
    fontSize: 14,
    lineHeight: 1.2,
    letterSpacing: 0.5,
    scrollback: 2000,
    allowProposedApi: true,
    convertEol: true,
    cursorBlink: true,
    cursorStyle: "bar" as const,
    cursorWidth: 2,
    cursorInactiveStyle: "underline" as const,
    disableStdin: false,
    drawBoldTextInBrightColors: true,
    rightClickSelectsWord: true,
    macOptionIsMeta: true,
    allowTransparency: true,
    rendererType: "canvas",
    theme: {
      background: "#1e1e1e",
      foreground: "#c9d1d9",
      lineHeight: 1.4,
      cursor: "#58a6ff",
      selectionBackground: "#264f78",
      black: "#010409",
      red: "#ff7b72",
      green: "#3fb950",
      yellow: "#d29922",
      blue: "#58a6ff",
      magenta: "#bc8cff",
      cyan: "#39c5cf",
      white: "#b1bac4",
      brightBlack: "#6e7681",
      brightRed: "#ffa198",
      brightGreen: "#56d364",
      brightYellow: "#e3b341",
      brightBlue: "#79c0ff",
      brightMagenta: "#d2a8ff",
      brightCyan: "#56d4dd",
      brightWhite: "#f0f6fc",
    },
    localEcho: false,
  },

  signalR: {
    hubUrl: (baseUrl: string) => `${baseUrl}/terminalhub`,
    reconnectDelay: 1000,
  },
};

export const ASCII_ART = `
$$$$$$$\\                      $$\\       $$$$$$\\            
$$  __$$\\                     $$ |     $$  __$$\\           
$$ |  $$ | $$$$$$\\   $$$$$$$\\ $$ |  $$\\$$ /  $$ | $$$$$$$\\ 
$$ |  $$ |$$  __$$\\ $$  _____|$$ | $$  $$$$$$  |$$  _____|
$$ |  $$ |$$ /  $$ |$$ /      $$$$$$  /$$  __$$< \\$$$$$$\\ 
$$ |  $$ |$$ |  $$ |$$ |      $$  _$$< $$ /  $$ | \\____$$\\
$$$$$$$  |\\$$$$$$  |\\$$$$$$$\\ $$ | \\$$\\\\$$$$$$  |$$$$$$$  |
\\_______/  \\______/  \\_______|\\__|  \\__|\\______/ \\_______/
`;
