import { useEffect, useRef, useCallback } from 'react';
import { Terminal } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit';
import { WebLinksAddon } from '@xterm/addon-web-links';
import { io } from 'socket.io-client';
import '@xterm/xterm/css/xterm.css';

const SHADOW_SM = '2px 2px 0px #00000060';

function PanelBtn({ id, onClick, color = '#ffdd57', textColor = '#000', children }) {
  return (
    <button
      id={id}
      onClick={onClick}
      style={{
        backgroundColor: color, color: textColor,
        border: '2px solid #000',
        boxShadow: SHADOW_SM,
        padding: '7px 16px',
        fontFamily: "'Space Mono', monospace",
        fontWeight: 700, fontSize: '12px',
        textTransform: 'uppercase', letterSpacing: '0.06em',
        cursor: 'pointer',
        transition: 'transform 80ms, box-shadow 80ms',
        flexShrink: 0,
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translate(2px,2px)';
        e.currentTarget.style.boxShadow = 'none';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'translate(0,0)';
        e.currentTarget.style.boxShadow = SHADOW_SM;
      }}
    >
      {children}
    </button>
  );
}

export function TerminalPanel({ agentBaseUrl, sandboxId }) {
  const containerRef = useRef(null);
  const terminalRef = useRef(null);
  const fitAddonRef = useRef(null);
  const socketRef = useRef(null);
  const isInitialized = useRef(false);

  const initTerminal = useCallback(() => {
    if (!containerRef.current || !agentBaseUrl || isInitialized.current) return;
    isInitialized.current = true;

    const term = new Terminal({
      cursorBlink: true,
      cursorStyle: 'block',
      fontSize: 13,
      lineHeight: 1.5,
      fontFamily: '"Space Mono", "Courier New", monospace',
      theme: {
        background: '#0d0d0d',
        foreground: '#f0ebe3',
        cursor: '#ffdd57',
        cursorAccent: '#0d0d0d',
        selectionBackground: '#ffdd5740',
        black: '#0d0d0d', red: '#ff6b6b',
        green: '#4ecdc4', yellow: '#ffdd57',
        blue: '#a78bfa', magenta: '#ff6b6b',
        cyan: '#4ecdc4', white: '#f0ebe3',
        brightBlack: '#555', brightRed: '#ff8787',
        brightGreen: '#70d9d3', brightYellow: '#ffe680',
        brightBlue: '#c4b5fd', brightMagenta: '#ff8787',
        brightCyan: '#70d9d3', brightWhite: '#fff',
      },
      scrollback: 5000,
      padding: 12,
    });

    const fitAddon = new FitAddon();
    const webLinksAddon = new WebLinksAddon();

    term.loadAddon(fitAddon);
    term.loadAddon(webLinksAddon);
    term.open(containerRef.current);
    fitAddon.fit();

    terminalRef.current = term;
    fitAddonRef.current = fitAddon;

    term.writeln('\x1b[33m  Hateable — Sandbox Terminal\x1b[0m');
    term.writeln('\x1b[90m  ID: ' + sandboxId + '\x1b[0m');
    term.writeln('');
    term.writeln('\x1b[90m  Connecting to agent...\x1b[0m');
    term.writeln('');

    const socket = io(agentBaseUrl, {
      transports: ['websocket', 'polling'],
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    });
    socketRef.current = socket;

    socket.on('connect', () => {
      term.writeln('\x1b[32m  Connected successfully\x1b[0m');
      term.writeln('');
    });

    socket.on('terminal-output', data => term.write(data));

    socket.on('disconnect', reason => {
      term.writeln(`\r\n\x1b[31m  Disconnected: ${reason}\x1b[0m`);
    });

    socket.on('connect_error', err => {
      term.writeln(`\r\n\x1b[31m  Connection failed: ${err.message}\x1b[0m`);
    });

    term.onData(data => {
      if (socket.connected) socket.emit('terminal-input', data);
    });

    const resizeObs = new ResizeObserver(() => fitAddon.fit());
    resizeObs.observe(containerRef.current);

    return () => resizeObs.disconnect();
  }, [agentBaseUrl, sandboxId]);

  useEffect(() => {
    const cleanup = initTerminal();
    return () => {
      cleanup?.();
      terminalRef.current?.dispose();
      socketRef.current?.disconnect();
      isInitialized.current = false;
    };
  }, [initTerminal]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: '#0d0d0d' }}>

      {/* Header */}
      <div style={{
        backgroundColor: '#a78bfa',
        borderBottom: '4px solid #000',
        padding: '14px 24px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexShrink: 0,
      }}>
        <span style={{
          fontFamily: "'Space Mono', monospace",
          fontWeight: 700, fontSize: '13px',
          color: '#000', textTransform: 'uppercase', letterSpacing: '0.1em',
        }}>
          Terminal
        </span>
        <div style={{ display: 'flex', gap: '10px' }}>
          <PanelBtn
            id="clear-terminal-btn"
            onClick={() => terminalRef.current?.clear()}
            color="#0d0d0d"
            textColor="#fff"
          >
            Clear
          </PanelBtn>
          <PanelBtn
            id="reconnect-terminal-btn"
            onClick={() => {
              if (socketRef.current && !socketRef.current.connected) {
                socketRef.current.connect();
                terminalRef.current?.writeln('\r\n\x1b[33m  Reconnecting...\x1b[0m\r\n');
              }
            }}
          >
            Reconnect
          </PanelBtn>
        </div>
      </div>

      {/* XTerm */}
      <div
        ref={containerRef}
        id="terminal-container"
        style={{ flex: 1, overflow: 'hidden', backgroundColor: '#0d0d0d' }}
      />
    </div>
  );
}
