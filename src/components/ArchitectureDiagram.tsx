"use client";

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function ArchitectureDiagram() {
  const [currentDiagram, setCurrentDiagram] = useState(0);

  const diagrams = [
    {
      title: "1. SignalR Terminal Communication Flow",
      component: <SignalRDiagram />
    },
    {
      title: "2. DinD Container Creation & Session Management",
      component: <SessionManagementDiagram />
    },
    {
      title: "3. Networking & SSL Architecture",
      component: <NetworkingDiagram />
    }
  ];

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4 md:p-8">
      <div className="text-center mb-6 md:mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Docker Playground Architecture</h1>
        <p className="text-slate-400 text-sm md:text-base">Interactive architectural diagrams</p>
      </div>

      <div className="bg-white rounded-2xl shadow-2xl p-4 md:p-8 mb-6 overflow-auto max-h-[70vh]">
        <h2 className="text-xl md:text-2xl font-bold text-slate-800 mb-4 md:mb-6 text-center">
          {diagrams[currentDiagram].title}
        </h2>
        <div className="w-full h-full">
          {diagrams[currentDiagram].component}
        </div>
      </div>

      <div className="flex items-center justify-center gap-4">
        <button
          onClick={() => setCurrentDiagram((prev) => (prev - 1 + diagrams.length) % diagrams.length)}
          className="p-2 md:p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition-colors"
        >
          <ChevronLeft size={20} className="md:w-6 md:h-6" />
        </button>
        
        <div className="flex gap-2">
          {diagrams.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentDiagram(idx)}
              className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-colors ${
                idx === currentDiagram ? 'bg-blue-600' : 'bg-slate-400'
              }`}
            />
          ))}
        </div>

        <button
          onClick={() => setCurrentDiagram((prev) => (prev + 1) % diagrams.length)}
          className="p-2 md:p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition-colors"
        >
          <ChevronRight size={20} className="md:w-6 md:h-6" />
        </button>
      </div>
    </div>
  );
};

const SignalRDiagram = () => {
  return (
    <svg viewBox="0 0 1200 800" className="w-full h-auto">
      <defs>
        <marker id="arrowhead" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
          <polygon points="0 0, 10 3, 0 6" fill="#334155" />
        </marker>
        <filter id="shadow">
          <feDropShadow dx="2" dy="2" stdDeviation="2" floodOpacity="0.3"/>
        </filter>
      </defs>

      <g transform="translate(50, 100)">
        <rect x="0" y="0" width="280" height="500" rx="10" fill="#f1f5f9" stroke="#334155" strokeWidth="3" filter="url(#shadow)" />
        <rect x="0" y="0" width="280" height="50" rx="10" fill="#3b82f6" />
        <text x="140" y="32" textAnchor="middle" fill="white" fontSize="20" fontWeight="bold">Frontend</text>
        
        <rect x="20" y="70" width="240" height="100" rx="8" fill="#dbeafe" stroke="#3b82f6" strokeWidth="2" strokeDasharray="5,5" />
        <text x="140" y="95" textAnchor="middle" fill="#1e40af" fontSize="16" fontWeight="bold">XTerm.js</text>
        <text x="140" y="115" textAnchor="middle" fill="#475569" fontSize="12">Terminal Emulator</text>
        <text x="140" y="135" textAnchor="middle" fill="#64748b" fontSize="11">User Input</text>
        <text x="140" y="150" textAnchor="middle" fill="#64748b" fontSize="11">Output Display</text>
        
        <rect x="20" y="190" width="240" height="80" rx="8" fill="#fef3c7" stroke="#f59e0b" strokeWidth="2" strokeDasharray="5,5" />
        <text x="140" y="215" textAnchor="middle" fill="#92400e" fontSize="16" fontWeight="bold">useTerminal Hook</text>
        <text x="140" y="235" textAnchor="middle" fill="#475569" fontSize="11">Connection Manager</text>
        <text x="140" y="250" textAnchor="middle" fill="#64748b" fontSize="11">Terminal Lifecycle</text>
        
        <rect x="20" y="290" width="240" height="90" rx="8" fill="#ddd6fe" stroke="#8b5cf6" strokeWidth="2" strokeDasharray="5,5" />
        <text x="140" y="315" textAnchor="middle" fill="#5b21b6" fontSize="16" fontWeight="bold">SignalRService</text>
        <text x="140" y="335" textAnchor="middle" fill="#475569" fontSize="11">WebSocket Client</text>
        <text x="140" y="350" textAnchor="middle" fill="#64748b" fontSize="11">sendInput()</text>
        <text x="140" y="365" textAnchor="middle" fill="#64748b" fontSize="11">onReceiveOutput()</text>
        
        <rect x="20" y="400" width="240" height="70" rx="8" fill="#fecaca" stroke="#ef4444" strokeWidth="2" strokeDasharray="5,5" />
        <text x="140" y="425" textAnchor="middle" fill="#7f1d1d" fontSize="16" fontWeight="bold">InputHandler</text>
        <text x="140" y="445" textAnchor="middle" fill="#475569" fontSize="11">Keyboard Events</text>
        <text x="140" y="460" textAnchor="middle" fill="#64748b" fontSize="11">Special Keys</text>
      </g>

      <g transform="translate(460, 250)">
        <rect x="0" y="0" width="280" height="300" rx="10" fill="#f1f5f9" stroke="#334155" strokeWidth="3" filter="url(#shadow)" />
        <rect x="0" y="0" width="280" height="50" rx="10" fill="#8b5cf6" />
        <text x="140" y="32" textAnchor="middle" fill="white" fontSize="20" fontWeight="bold">SignalR Hub</text>
        
        <rect x="20" y="70" width="240" height="200" rx="8" fill="#ddd6fe" stroke="#8b5cf6" strokeWidth="2" />
        <text x="140" y="95" textAnchor="middle" fill="#5b21b6" fontSize="16" fontWeight="bold">TerminalHub</text>
        
        <text x="30" y="125" fill="#475569" fontSize="13" fontWeight="bold">Methods:</text>
        <text x="40" y="145" fill="#64748b" fontSize="12">• Attach(containerId)</text>
        <text x="40" y="165" fill="#64748b" fontSize="12">• SendInput(data)</text>
        <text x="40" y="185" fill="#64748b" fontSize="12">• ResizeTerminal()</text>
        <text x="40" y="205" fill="#64748b" fontSize="12">• Ping() / Terminate()</text>
        
        <text x="30" y="230" fill="#475569" fontSize="13" fontWeight="bold">State:</text>
        <text x="40" y="250" fill="#64748b" fontSize="12">• _streams</text>
      </g>

      <g transform="translate(870, 100)">
        <rect x="0" y="0" width="280" height="500" rx="10" fill="#f1f5f9" stroke="#334155" strokeWidth="3" filter="url(#shadow)" />
        <rect x="0" y="0" width="280" height="50" rx="10" fill="#10b981" />
        <text x="140" y="32" textAnchor="middle" fill="white" fontSize="20" fontWeight="bold">Docker Engine</text>
        
        <rect x="20" y="70" width="240" height="100" rx="8" fill="#d1fae5" stroke="#10b981" strokeWidth="2" strokeDasharray="5,5" />
        <text x="140" y="95" textAnchor="middle" fill="#065f46" fontSize="16" fontWeight="bold">Docker Client</text>
        <text x="140" y="115" textAnchor="middle" fill="#475569" fontSize="11">tcp://localhost:2375</text>
        <text x="140" y="135" fill="#64748b" fontSize="11">ExecCreate()</text>
        <text x="140" y="150" fill="#64748b" fontSize="11">StartAndAttach()</text>
        
        <rect x="20" y="190" width="240" height="120" rx="8" fill="#fef3c7" stroke="#f59e0b" strokeWidth="2" strokeDasharray="5,5" />
        <text x="140" y="215" textAnchor="middle" fill="#92400e" fontSize="16" fontWeight="bold">Exec Instance</text>
        <text x="140" y="235" textAnchor="middle" fill="#475569" fontSize="11">Shell: /bin/sh</text>
        <text x="140" y="255" textAnchor="middle" fill="#64748b" fontSize="11">TERM=xterm-256color</text>
        <text x="140" y="275" textAnchor="middle" fill="#64748b" fontSize="11">TTY: true</text>
        <text x="140" y="290" textAnchor="middle" fill="#64748b" fontSize="11">Attach Stdin/out/err</text>
        
        <rect x="20" y="330" width="240" height="80" rx="8" fill="#dbeafe" stroke="#3b82f6" strokeWidth="2" strokeDasharray="5,5" />
        <text x="140" y="355" textAnchor="middle" fill="#1e40af" fontSize="16" fontWeight="bold">MultiplexedStream</text>
        <text x="140" y="375" textAnchor="middle" fill="#475569" fontSize="11">Bidirectional I/O</text>
        <text x="140" y="390" textAnchor="middle" fill="#64748b" fontSize="11">Buffer: 4096 bytes</text>
        
        <rect x="20" y="430" width="240" height="50" rx="8" fill="#dcfce7" stroke="#22c55e" strokeWidth="2" />
        <text x="140" y="460" textAnchor="middle" fill="#14532d" fontSize="16" fontWeight="bold">DinD Container</text>
      </g>

      <path d="M 190 170 L 190 190" stroke="#3b82f6" strokeWidth="3" fill="none" markerEnd="url(#arrowhead)" />
      <text x="200" y="185" fill="#3b82f6" fontSize="12" fontWeight="bold">onData()</text>
      
      <path d="M 190 270 L 190 290" stroke="#8b5cf6" strokeWidth="3" fill="none" markerEnd="url(#arrowhead)" />
      <text x="200" y="285" fill="#8b5cf6" fontSize="12" fontWeight="bold">capture</text>
      
      <path d="M 190 380 Q 240 400, 460 400" stroke="#8b5cf6" strokeWidth="3" fill="none" markerEnd="url(#arrowhead)" />
      <text x="320" y="390" fill="#8b5cf6" fontSize="12" fontWeight="bold">SendInput()</text>
      
      <path d="M 740 400 Q 800 400, 870 340" stroke="#10b981" strokeWidth="3" fill="none" markerEnd="url(#arrowhead)" />
      <text x="780" y="365" fill="#10b981" fontSize="12" fontWeight="bold">WriteAsync()</text>
      
      <path d="M 1010 310 L 1010 330" stroke="#f59e0b" strokeWidth="3" fill="none" markerEnd="url(#arrowhead)" />
      <text x="1020" y="325" fill="#f59e0b" fontSize="12" fontWeight="bold">stdin</text>

      <path d="M 1010 410 L 1010 430" stroke="#22c55e" strokeWidth="3" fill="none" markerEnd="url(#arrowhead)" />
      <text x="1020" y="425" fill="#22c55e" fontSize="12" fontWeight="bold">stdout</text>
      
      <path d="M 870 240 Q 800 240, 740 300" stroke="#3b82f6" strokeWidth="3" fill="none" markerEnd="url(#arrowhead)" />
      <text x="780" y="260" fill="#3b82f6" fontSize="12" fontWeight="bold">ReadOutput()</text>
      
      <path d="M 460 300 Q 380 250, 330 200" stroke="#3b82f6" strokeWidth="3" fill="none" markerEnd="url(#arrowhead)" />
      <text x="380" y="245" fill="#3b82f6" fontSize="12" fontWeight="bold">ReceiveOutput</text>
      
      <path d="M 330 120 L 260 120" stroke="#3b82f6" strokeWidth="3" fill="none" markerEnd="url(#arrowhead)" />
      <text x="285" y="110" fill="#3b82f6" fontSize="12" fontWeight="bold">write()</text>

      <text x="600" y="700" textAnchor="middle" fill="#64748b" fontSize="16" fontWeight="bold">
        Real-time bidirectional communication via WebSocket
      </text>
    </svg>
  );
};

const SessionManagementDiagram = () => {
  return (
    <svg viewBox="0 0 1200 1000" className="w-full h-auto">
      <defs>
        <marker id="arrow2" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
          <polygon points="0 0, 10 3, 0 6" fill="#334155" />
        </marker>
        <filter id="shadow2">
          <feDropShadow dx="2" dy="2" stdDeviation="2" floodOpacity="0.3"/>
        </filter>
      </defs>

      <g transform="translate(50, 50)">
        <rect x="0" y="0" width="250" height="180" rx="10" fill="#f1f5f9" stroke="#334155" strokeWidth="3" filter="url(#shadow2)" />
        <rect x="0" y="0" width="250" height="45" rx="10" fill="#3b82f6" />
        <text x="125" y="30" textAnchor="middle" fill="white" fontSize="18" fontWeight="bold">Client</text>
        
        <rect x="15" y="60" width="220" height="105" rx="8" fill="#dbeafe" stroke="#3b82f6" strokeWidth="2" />
        <text x="125" y="82" textAnchor="middle" fill="#1e40af" fontSize="15" fontWeight="bold">useDindSession</text>
        <text x="25" y="105" fill="#475569" fontSize="11" fontWeight="bold">POST /session</text>
        <text x="30" y="122" fill="#64748b" fontSize="10">→ JWT Token</text>
        <text x="30" y="137" fill="#64748b" fontSize="10">→ TTL: 30 min</text>
        <text x="30" y="152" fill="#64748b" fontSize="10">→ Get/Create</text>
      </g>

      <g transform="translate(400, 50)">
        <rect x="0" y="0" width="250" height="180" rx="10" fill="#f1f5f9" stroke="#334155" strokeWidth="3" filter="url(#shadow2)" />
        <rect x="0" y="0" width="250" height="45" rx="10" fill="#8b5cf6" />
        <text x="125" y="30" textAnchor="middle" fill="white" fontSize="18" fontWeight="bold">API Controller</text>
        
        <rect x="15" y="60" width="220" height="105" rx="8" fill="#ddd6fe" stroke="#8b5cf6" strokeWidth="2" />
        <text x="125" y="82" textAnchor="middle" fill="#5b21b6" fontSize="15" fontWeight="bold">ContainerCtrl</text>
        <text x="25" y="105" fill="#475569" fontSize="11" fontWeight="bold">Validate JWT</text>
        <text x="30" y="122" fill="#64748b" fontSize="10">→ Extract userId</text>
        <text x="30" y="137" fill="#64748b" fontSize="10">→ Check session</text>
        <text x="30" y="152" fill="#64748b" fontSize="10">→ Call Manager</text>
      </g>

      <g transform="translate(750, 50)">
        <rect x="0" y="0" width="250" height="180" rx="10" fill="#f1f5f9" stroke="#334155" strokeWidth="3" filter="url(#shadow2)" />
        <rect x="0" y="0" width="250" height="45" rx="10" fill="#10b981" />
        <text x="125" y="30" textAnchor="middle" fill="white" fontSize="18" fontWeight="bold">Manager</text>
        
        <rect x="15" y="60" width="220" height="105" rx="8" fill="#d1fae5" stroke="#10b981" strokeWidth="2" />
        <text x="125" y="82" textAnchor="middle" fill="#065f46" fontSize="14" fontWeight="bold">DindContainerMgr</text>
        <text x="25" y="105" fill="#475569" fontSize="11" fontWeight="bold">Session Logic</text>
        <text x="30" y="122" fill="#64748b" fontSize="10">→ Check DB</text>
        <text x="30" y="137" fill="#64748b" fontSize="10">→ Verify container</text>
        <text x="30" y="152" fill="#64748b" fontSize="10">→ Create if needed</text>
      </g>

      <g transform="translate(150, 300)">
        <rect x="0" y="0" width="250" height="160" rx="10" fill="#f1f5f9" stroke="#334155" strokeWidth="3" filter="url(#shadow2)" />
        <rect x="0" y="0" width="250" height="45" rx="10" fill="#f59e0b" />
        <text x="125" y="30" textAnchor="middle" fill="white" fontSize="18" fontWeight="bold">PostgreSQL</text>
        
        <rect x="15" y="60" width="220" height="85" rx="8" fill="#fef3c7" stroke="#f59e0b" strokeWidth="2" />
        <text x="125" y="80" textAnchor="middle" fill="#92400e" fontSize="14" fontWeight="bold">ContainerSession</text>
        <text x="25" y="105" fill="#64748b" fontSize="10">userId, containerId</text>
        <text x="25" y="120" fill="#64748b" fontSize="10">createdAt, expiresAt</text>
        <text x="25" y="135" fill="#64748b" fontSize="10">status: active/expired</text>
      </g>

      <g transform="translate(500, 300)">
        <rect x="0" y="0" width="280" height="280" rx="10" fill="#f1f5f9" stroke="#334155" strokeWidth="3" filter="url(#shadow2)" />
        <rect x="0" y="0" width="280" height="45" rx="10" fill="#0ea5e9" />
        <text x="140" y="30" textAnchor="middle" fill="white" fontSize="18" fontWeight="bold">Docker Engine</text>
        
        <rect x="15" y="60" width="250" height="205" rx="8" fill="#e0f2fe" stroke="#0ea5e9" strokeWidth="2" />
        <text x="140" y="80" textAnchor="middle" fill="#075985" fontSize="14" fontWeight="bold">Container Creation</text>
        
        <text x="25" y="105" fill="#475569" fontSize="12" fontWeight="bold">CreateContainer:</text>
        <text x="30" y="125" fill="#64748b" fontSize="10">• Image: docker:dind</text>
        <text x="30" y="140" fill="#64748b" fontSize="10">• Name: dind-userId</text>
        <text x="30" y="155" fill="#64748b" fontSize="10">• Privileged: true</text>
        <text x="30" y="170" fill="#64748b" fontSize="10">• CPU: 1, RAM: 2GB</text>
        <text x="30" y="185" fill="#64748b" fontSize="10">• Network: traefik</text>
        
        <text x="25" y="210" fill="#475569" fontSize="12" fontWeight="bold">Start + Wait:</text>
        <text x="30" y="230" fill="#64748b" fontSize="10">→ StartContainer()</text>
        <text x="30" y="245" fill="#64748b" fontSize="10">→ Check dockerd ready</text>
      </g>

      <g transform="translate(850, 350)">
        <rect x="0" y="0" width="200" height="180" rx="10" fill="#f1f5f9" stroke="#334155" strokeWidth="3" filter="url(#shadow2)" />
        <rect x="0" y="0" width="200" height="45" rx="10" fill="#22c55e" />
        <text x="100" y="30" textAnchor="middle" fill="white" fontSize="16" fontWeight="bold">DinD Container</text>
        
        <rect x="12" y="58" width="176" height="110" rx="8" fill="#dcfce7" stroke="#22c55e" strokeWidth="2" />
        <text x="100" y="78" textAnchor="middle" fill="#14532d" fontSize="13" fontWeight="bold">Isolated Env</text>
        <text x="20" y="100" fill="#475569" fontSize="10">✓ Docker daemon</text>
        <text x="20" y="115" fill="#475569" fontSize="10">✓ Run containers</text>
        <text x="20" y="130" fill="#475569" fontSize="10">✓ Fully isolated</text>
        <text x="20" y="145" fill="#475569" fontSize="10">✓ Auto-cleanup</text>
        <text x="20" y="160" fill="#475569" fontSize="10">✓ TTL: 30 min</text>
      </g>

      <g transform="translate(50, 640)">
        <rect x="0" y="0" width="350" height="240" rx="10" fill="#f1f5f9" stroke="#334155" strokeWidth="3" filter="url(#shadow2)" />
        <rect x="0" y="0" width="350" height="45" rx="10" fill="#ef4444" />
        <text x="175" y="30" textAnchor="middle" fill="white" fontSize="18" fontWeight="bold">Cleanup Timer</text>
        
        <rect x="15" y="60" width="320" height="165" rx="8" fill="#fecaca" stroke="#ef4444" strokeWidth="2" />
        <text x="175" y="80" textAnchor="middle" fill="#7f1d1d" fontSize="14" fontWeight="bold">CleanupExpiredContainers()</text>
        <text x="175" y="98" textAnchor="middle" fill="#475569" fontSize="11">Runs every 10 seconds</text>
        
        <text x="25" y="123" fill="#475569" fontSize="12" fontWeight="bold">Checks:</text>
        <text x="30" y="143" fill="#64748b" fontSize="10">1. Expired (expiresAt &lt; now)</text>
        <text x="30" y="158" fill="#64748b" fontSize="10">2. Idle (&gt; 15 min inactive)</text>
        
        <text x="25" y="183" fill="#475569" fontSize="12" fontWeight="bold">Actions:</text>
        <text x="30" y="203" fill="#64748b" fontSize="10">→ Delete routes → Stop → Remove</text>
      </g>

      <g transform="translate(500, 640)">
        <rect x="0" y="0" width="250" height="120" rx="10" fill="#f1f5f9" stroke="#334155" strokeWidth="3" filter="url(#shadow2)" />
        <rect x="0" y="0" width="250" height="45" rx="10" fill="#06b6d4" />
        <text x="125" y="30" textAnchor="middle" fill="white" fontSize="18" fontWeight="bold">Keep-Alive</text>
        
        <rect x="15" y="58" width="220" height="50" rx="8" fill="#cffafe" stroke="#06b6d4" strokeWidth="2" />
        <text x="125" y="78" textAnchor="middle" fill="#164e63" fontSize="13" fontWeight="bold">Heartbeat (30s)</text>
        <text x="125" y="95" textAnchor="middle" fill="#475569" fontSize="10">Update lastActivityAt</text>
      </g>

      <path d="M 300 140 L 400 140" stroke="#3b82f6" strokeWidth="3" fill="none" markerEnd="url(#arrow2)" />
      <text x="340" y="130" fill="#3b82f6" fontSize="11" fontWeight="bold">1</text>
      
      <path d="M 650 140 L 750 140" stroke="#8b5cf6" strokeWidth="3" fill="none" markerEnd="url(#arrow2)" />
      <text x="690" y="130" fill="#8b5cf6" fontSize="11" fontWeight="bold">2</text>
      
      <path d="M 875 230 L 875 300" stroke="#10b981" strokeWidth="3" fill="none" markerEnd="url(#arrow2)" />
      <text x="885" y="270" fill="#10b981" fontSize="11" fontWeight="bold">3</text>
      
      <path d="M 780 430 L 850 430" stroke="#0ea5e9" strokeWidth="3" fill="none" markerEnd="url(#arrow2)" />
      <text x="805" y="420" fill="#0ea5e9" fontSize="11" fontWeight="bold">4</text>
      
      <path d="M 640 300 Q 640 270, 400 360" stroke="#f59e0b" strokeWidth="3" fill="none" markerEnd="url(#arrow2)" />
      <text x="480" y="310" fill="#f59e0b" fontSize="11" fontWeight="bold">Save</text>
      
      <path d="M 625 640 L 625 580" stroke="#06b6d4" strokeWidth="3" strokeDasharray="5,5" fill="none" markerEnd="url(#arrow2)" />
      <text x="635" y="610" fill="#06b6d4" fontSize="11" fontWeight="bold">♥</text>
      
      <path d="M 225 640 L 625 580" stroke="#ef4444" strokeWidth="3" strokeDasharray="5,5" fill="none" markerEnd="url(#arrow2)" />
      <text x="380" y="600" fill="#ef4444" fontSize="11" fontWeight="bold">Cleanup</text>
    </svg>
  );
};

const NetworkingDiagram = () => {
  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4 md:p-8">
      <div className="text-center mb-6">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Dynamic DNS & Traefik Networking</h1>
        <p className="text-slate-400 text-sm md:text-base">How your DinD environment gets exposed to the public</p>
      </div>

      <div className="bg-white rounded-2xl shadow-2xl p-4 md:p-8 overflow-auto">
        <svg viewBox="0 0 1400 1100" className="w-full h-auto">
          <defs>
            <marker id="arrow" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
              <polygon points="0 0, 10 3, 0 6" fill="#334155" />
            </marker>
            <marker id="arrowGreen" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
              <polygon points="0 0, 10 3, 0 6" fill="#10b981" />
            </marker>
            <marker id="arrowBlue" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
              <polygon points="0 0, 10 3, 0 6" fill="#3b82f6" />
            </marker>
            <marker id="arrowPurple" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
              <polygon points="0 0, 10 3, 0 6" fill="#8b5cf6" />
            </marker>
            <filter id="shadow">
              <feDropShadow dx="2" dy="2" stdDeviation="3" floodOpacity="0.3"/>
            </filter>
          </defs>

          {/* Internet User */}
          <g transform="translate(50, 50)">
            <rect x="0" y="0" width="280" height="160" rx="10" fill="#f1f5f9" stroke="#334155" strokeWidth="3" filter="url(#shadow)" />
            <rect x="0" y="0" width="280" height="50" rx="10" fill="#3b82f6" />
            <text x="140" y="32" textAnchor="middle" fill="white" fontSize="20" fontWeight="bold">Internet User</text>
            
            <rect x="20" y="70" width="240" height="75" rx="8" fill="#dbeafe" stroke="#3b82f6" strokeWidth="2" />
            <text x="140" y="95" textAnchor="middle" fill="#1e40af" fontSize="16" fontWeight="bold">Browser Request</text>
            <text x="140" y="115" textAnchor="middle" fill="#475569" fontSize="13">https://myapp.</text>
            <text x="140" y="132" textAnchor="middle" fill="#475569" fontSize="13">user123.dock8s.in</text>
          </g>

          {/* Traefik */}
          <g transform="translate(500, 50)">
            <rect x="0" y="0" width="400" height="450" rx="10" fill="#f1f5f9" stroke="#334155" strokeWidth="3" filter="url(#shadow)" />
            <rect x="0" y="0" width="400" height="50" rx="10" fill="#10b981" />
            <text x="200" y="32" textAnchor="middle" fill="white" fontSize="22" fontWeight="bold">Traefik Reverse Proxy</text>
            
            {/* Certificate Resolver */}
            <rect x="20" y="70" width="360" height="110" rx="8" fill="#d1fae5" stroke="#10b981" strokeWidth="2" strokeDasharray="5,5" />
            <text x="200" y="95" textAnchor="middle" fill="#065f46" fontSize="16" fontWeight="bold">SSL Certificate Manager</text>
            <text x="30" y="120" fill="#475569" fontSize="12" fontWeight="bold">Wildcard DNS-01 (Cloudflare)</text>
            <text x="40" y="140" fill="#64748b" fontSize="11">• Resolver: letsencrypt-dns</text>
            <text x="40" y="155" fill="#64748b" fontSize="11">• Domain: *.userId.dock8s.in</text>
            <text x="40" y="170" fill="#64748b" fontSize="11">• Auto SSL via Cloudflare API</text>
            
            {/* Dynamic Config Provider */}
            <rect x="20" y="200" width="360" height="100" rx="8" fill="#fef3c7" stroke="#f59e0b" strokeWidth="2" strokeDasharray="5,5" />
            <text x="200" y="225" textAnchor="middle" fill="#92400e" fontSize="16" fontWeight="bold">File Provider (Dynamic)</text>
            <text x="30" y="250" fill="#475569" fontSize="12" fontWeight="bold">Watch: /dynamic/*.yml</text>
            <text x="40" y="270" fill="#64748b" fontSize="11">• Auto-reload on file change</text>
            <text x="40" y="285" fill="#64748b" fontSize="11">• No restart needed</text>
            
            {/* Router Rules */}
            <rect x="20" y="320" width="360" height="115" rx="8" fill="#ddd6fe" stroke="#8b5cf6" strokeWidth="2" strokeDasharray="5,5" />
            <text x="200" y="345" textAnchor="middle" fill="#5b21b6" fontSize="16" fontWeight="bold">Dynamic Routers</text>
            <text x="30" y="370" fill="#475569" fontSize="12" fontWeight="bold">Route Matching:</text>
            <text x="40" y="390" fill="#64748b" fontSize="11">• Host(`myapp.user123.dock8s.in`)</text>
            <text x="40" y="405" fill="#64748b" fontSize="11">→ Service: dind-user123:3000</text>
            <text x="40" y="420" fill="#64748b" fontSize="11">→ Network: traefik-network</text>
          </g>

          {/* TraefikFileRouterService */}
          <g transform="translate(1000, 50)">
            <rect x="0" y="0" width="350" height="280" rx="10" fill="#f1f5f9" stroke="#334155" strokeWidth="3" filter="url(#shadow)" />
            <rect x="0" y="0" width="350" height="50" rx="10" fill="#8b5cf6" />
            <text x="175" y="32" textAnchor="middle" fill="white" fontSize="20" fontWeight="bold">Router Service</text>
            
            <rect x="20" y="70" width="310" height="190" rx="8" fill="#ddd6fe" stroke="#8b5cf6" strokeWidth="2" />
            <text x="175" y="95" textAnchor="middle" fill="#5b21b6" fontSize="16" fontWeight="bold">TraefikFileRouterService</text>
            
            <text x="30" y="120" fill="#475569" fontSize="13" fontWeight="bold">1. ExposePortAsync():</text>
            <text x="40" y="140" fill="#64748b" fontSize="11">• Input: port, subdomain, userId</text>
            <text x="40" y="155" fill="#64748b" fontSize="11">• Create routeId (e.g., myapp-user123)</text>
            <text x="40" y="170" fill="#64748b" fontSize="11">• Generate YAML config</text>
            
            <text x="30" y="195" fill="#475569" fontSize="13" fontWeight="bold">2. Generate Config File:</text>
            <text x="40" y="215" fill="#64748b" fontSize="11">• File: /dynamic/myapp-user123.yml</text>
            <text x="40" y="230" fill="#64748b" fontSize="11">• Router + Service + TLS rules</text>
            
            <text x="30" y="250" fill="#475569" fontSize="13" fontWeight="bold">3. Save to routes.json</text>
          </g>

          {/* Dynamic Config Files */}
          <g transform="translate(1000, 370)">
            <rect x="0" y="0" width="350" height="200" rx="10" fill="#f1f5f9" stroke="#334155" strokeWidth="3" filter="url(#shadow)" />
            <rect x="0" y="0" width="350" height="50" rx="10" fill="#f59e0b" />
            <text x="175" y="32" textAnchor="middle" fill="white" fontSize="20" fontWeight="bold">Config Files</text>
            
            <rect x="20" y="70" width="310" height="115" rx="8" fill="#fef3c7" stroke="#f59e0b" strokeWidth="2" />
            <text x="175" y="92" textAnchor="middle" fill="#92400e" fontSize="14" fontWeight="bold">/dynamic/myapp-user123.yml</text>
            <text x="30" y="115" fill="#64748b" fontSize="10" fontFamily="monospace">http:</text>
            <text x="40" y="130" fill="#64748b" fontSize="10" fontFamily="monospace">routers:</text>
            <text x="50" y="145" fill="#64748b" fontSize="10" fontFamily="monospace">r-myapp-user123:</text>
            <text x="60" y="160" fill="#64748b" fontSize="10" fontFamily="monospace">rule: "Host(`...`)"</text>
            <text x="60" y="175" fill="#64748b" fontSize="10" fontFamily="monospace">service: s-myapp-user123</text>
          </g>

          {/* Docker Network */}
          <g transform="translate(500, 550)">
            <rect x="0" y="0" width="400" height="180" rx="10" fill="#f1f5f9" stroke="#334155" strokeWidth="3" filter="url(#shadow)" />
            <rect x="0" y="0" width="400" height="50" rx="10" fill="#0ea5e9" />
            <text x="200" y="32" textAnchor="middle" fill="white" fontSize="20" fontWeight="bold">Docker Network</text>
            
            <rect x="20" y="70" width="360" height="95" rx="8" fill="#e0f2fe" stroke="#0ea5e9" strokeWidth="2" />
            <text x="200" y="95" textAnchor="middle" fill="#075985" fontSize="16" fontWeight="bold">traefik-network (bridge)</text>
            <text x="30" y="120" fill="#475569" fontSize="12" fontWeight="bold">Connected Containers:</text>
            <text x="40" y="140" fill="#64748b" fontSize="11">• Traefik proxy</text>
            <text x="40" y="155" fill="#64748b" fontSize="11">• All DinD containers (auto-joined)</text>
          </g>

          {/* DinD Containers */}
          <g transform="translate(50, 600)">
            <rect x="0" y="0" width="380" height="350" rx="10" fill="#f1f5f9" stroke="#334155" strokeWidth="3" filter="url(#shadow)" />
            <rect x="0" y="0" width="380" height="50" rx="10" fill="#22c55e" />
            <text x="190" y="32" textAnchor="middle" fill="white" fontSize="20" fontWeight="bold">DinD Containers</text>
            
            {/* Container 1 */}
            <rect x="20" y="70" width="340" height="120" rx="8" fill="#dcfce7" stroke="#22c55e" strokeWidth="2" strokeDasharray="5,5" />
            <text x="190" y="95" textAnchor="middle" fill="#14532d" fontSize="16" fontWeight="bold">dind-user123</text>
            <text x="30" y="120" fill="#475569" fontSize="12" fontWeight="bold">Running App on Port 3000:</text>
            <text x="40" y="140" fill="#64748b" fontSize="11">• Network: traefik-network</text>
            <text x="40" y="155" fill="#64748b" fontSize="11">• Internal hostname: dind-user123</text>
            <text x="40" y="170" fill="#64748b" fontSize="11">• Accessible at: dind-user123:3000</text>
            
            {/* Container 2 */}
            <rect x="20" y="210" width="340" height="120" rx="8" fill="#dcfce7" stroke="#22c55e" strokeWidth="2" strokeDasharray="5,5" />
            <text x="190" y="235" textAnchor="middle" fill="#14532d" fontSize="16" fontWeight="bold">dind-user456</text>
            <text x="30" y="260" fill="#475569" fontSize="12" fontWeight="bold">Running App on Port 8080:</text>
            <text x="40" y="280" fill="#64748b" fontSize="11">• Network: traefik-network</text>
            <text x="40" y="295" fill="#64748b" fontSize="11">• Internal hostname: dind-user456</text>
            <text x="40" y="310" fill="#64748b" fontSize="11">• Accessible at: dind-user456:8080</text>
          </g>

          {/* Flow Arrows */}
          
          {/* User to Traefik */}
          <path d="M 330 130 L 500 130" stroke="#3b82f6" strokeWidth="4" fill="none" markerEnd="url(#arrowBlue)" />
          <text x="400" y="120" fill="#3b82f6" fontSize="14" fontWeight="bold">1. HTTPS Request</text>
          
          {/* Traefik to Router Service */}
          <path d="M 900 150 L 1000 150" stroke="#8b5cf6" strokeWidth="4" fill="none" markerEnd="url(#arrowPurple)" />
          <text x="930" y="140" fill="#8b5cf6" fontSize="13" fontWeight="bold">Reads</text>
          
          {/* Router Service to Config */}
          <path d="M 1175 330 L 1175 370" stroke="#f59e0b" strokeWidth="4" fill="none" markerEnd="url(#arrow)" />
          <text x="1185" y="355" fill="#f59e0b" fontSize="13" fontWeight="bold">Writes</text>
          
          {/* Config to Traefik */}
          <path d="M 1000 450 L 900 280" stroke="#f59e0b" strokeWidth="4" strokeDasharray="8,4" fill="none" markerEnd="url(#arrow)" />
          <text x="930" y="360" fill="#f59e0b" fontSize="13" fontWeight="bold">Auto-reload</text>
          
          {/* Traefik to Network */}
          <path d="M 700 500 L 700 550" stroke="#10b981" strokeWidth="4" fill="none" markerEnd="url(#arrowGreen)" />
          <text x="710" y="530" fill="#10b981" fontSize="14" fontWeight="bold">2. Route</text>
          
          {/* Network to Container */}
          <path d="M 500 640 L 430 700" stroke="#10b981" strokeWidth="4" fill="none" markerEnd="url(#arrowGreen)" />
          <text x="445" y="665" fill="#10b981" fontSize="14" fontWeight="bold">3. Forward</text>
          
          {/* Response back */}
          <path d="M 240 600 Q 100 400, 190 210" stroke="#22c55e" strokeWidth="4" strokeDasharray="8,4" fill="none" markerEnd="url(#arrowGreen)" />
          <text x="100" y="420" fill="#22c55e" fontSize="14" fontWeight="bold">4. Response</text>

          {/* SSL Prewarm Arrow */}
          <path d="M 700 180 Q 850 100, 1000 200" stroke="#10b981" strokeWidth="3" strokeDasharray="5,5" fill="none" markerEnd="url(#arrowGreen)" />
          <text x="820" y="130" fill="#10b981" fontSize="12" fontWeight="bold">SSL Prewarm</text>

          {/* Info boxes */}
          <g transform="translate(50, 980)">
            <text x="0" y="0" fill="#334155" fontSize="18" fontWeight="bold">Key Features:</text>
            <text x="0" y="25" fill="#475569" fontSize="13">• <tspan fontWeight="bold">Dynamic DNS:</tspan> Each user gets *.userId.dock8s.in subdomain space</text>
            <text x="0" y="45" fill="#475569" fontSize="13">• <tspan fontWeight="bold">Wildcard SSL:</tspan> Single cert covers all user subdomains (DNS-01 challenge)</text>
            <text x="0" y="65" fill="#475569" fontSize="13">• <tspan fontWeight="bold">Zero Downtime:</tspan> Traefik auto-reloads config files without restart</text>
            <text x="0" y="85" fill="#475569" fontSize="13">• <tspan fontWeight="bold">Network Isolation:</tspan> All containers in traefik-network for internal routing</text>
          </g>

          {/* Example URL Flow */}
          <g transform="translate(700, 980)">
            <rect x="0" y="-20" width="450" height="120" rx="8" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="2" />
            <text x="10" y="0" fill="#334155" fontSize="16" fontWeight="bold">Example Flow:</text>
            <text x="10" y="25" fill="#3b82f6" fontSize="12" fontFamily="monospace">https://myapp.user123.dock8s.in</text>
            <text x="10" y="45" fill="#64748b" fontSize="11">→ Traefik matches Host() rule</text>
            <text x="10" y="63" fill="#64748b" fontSize="11">→ Routes to service: dind-user123:3000</text>
            <text x="10" y="81" fill="#64748b" fontSize="11">→ App inside container receives request</text>
          </g>
        </svg>
      </div>
    </div>
  );
};