export const terminalConfig = {
  containerId: process.env.CONTAINER_ID || "f15b0356a1ed",
  baseUrl: process.env.BASE_URL || "http://localhost:5295",

  terminal: {
    fontFamily: "'JetBrains Mono', '`Fira` Code', monospace",
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
      background: "#171819",
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

export const ASCII_ART = `Welcome to Dock8s - Your Cloud Container Environment!

Getting Started:
  • Use 'docker ps' to list running containers
  • Run 'docker pull <image>' to download images

Quick Tips:
  • All Docker commands work just like your local machine
  • Use the Globe icon (top-right) to expose container ports via subdomains
  • Your containers are isolated and secure in the cloud

Common Commands:
  • docker run -d -p 3000:3000 myapp    - Run a container with port mapping
  • docker logs <container-id>          - View container logs
  • docker exec -it <container-id> sh   - Access container shell (use 'bash' for best experience)
  • docker-compose up -d                - Start services from docker-compose.yml

Port Mapping:
  • Click the Globe icon to create public URLs for your container ports
  • Example: Expose port 3000 → get https://p3000.user.dock8s.in

Need help? Type 'docker --help'.
Happy containerizing! 🐳
`;

export const MOBILE_ASCII_ART = `Welcome to Dock8s! 🐳

Quick Start:
  • docker ps - list containers
  • docker pull <img> - download
  • Globe (↗) - expose ports

Commands:
  docker run -d -p 3000:3000 app
  docker logs <id>
  docker exec -it <id> sh

Port Mapping:
  Globe → public URLs
  Ex: 3000 → p3000.user.dock8s.in

Type 'docker --help'
`;