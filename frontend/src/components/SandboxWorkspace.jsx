import { useState, useCallback } from 'react';
import { Navbar } from './Navbar.jsx';
import { ChatPanel } from './ChatPanel.jsx';
import { TerminalPanel } from './TerminalPanel.jsx';
import { PreviewPanel } from './PreviewPanel.jsx';
import { ResizableDivider } from './ResizableDivider.jsx';

const TABS = [
  { id: 'preview', label: 'Preview' },
  { id: 'terminal', label: 'Terminal' },
  { id: 'split', label: 'Split' },
];

export function SandboxWorkspace({
  sandboxId, previewUrl, agentBaseUrl,
  messages, isStreaming, onSendMessage, onStop,
}) {
  const [activeTab, setActiveTab] = useState('preview');
  const [chatWidthPx, setChatWidthPx] = useState(360);
  const [previewHeightPct, setPreviewHeightPct] = useState(60);

  const handleHorizontalResize = useCallback((delta) => {
    setChatWidthPx(prev => Math.max(280, Math.min(620, prev + delta)));
  }, []);

  const handleVerticalResize = useCallback((delta) => {
    setPreviewHeightPct(prev =>
      Math.max(20, Math.min(80, prev + (delta / window.innerHeight) * 100))
    );
  }, []);

  return (
    <div style={{
      display: 'flex', flexDirection: 'column',
      height: '100vh', backgroundColor: '#f5f1eb', overflow: 'hidden',
    }}>
      <Navbar sandboxId={sandboxId} />

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

        {/* Left: Chat */}
        <div style={{ width: chatWidthPx, flexShrink: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <ChatPanel
            messages={messages}
            isStreaming={isStreaming}
            onSendMessage={onSendMessage}
            onStop={onStop}
            sandboxId={sandboxId}
          />
        </div>

        <ResizableDivider onResize={handleHorizontalResize} orientation="vertical" />

        {/* Right */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

          {/* Tab bar */}
          <div style={{
            display: 'flex',
            backgroundColor: '#fff',
            borderBottom: '4px solid #000',
            flexShrink: 0,
          }}>
            {TABS.map(tab => (
              <button
                key={tab.id}
                id={`tab-${tab.id}`}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  padding: '14px 28px',
                  fontFamily: "'Space Mono', monospace",
                  fontWeight: 700, fontSize: '12px',
                  textTransform: 'uppercase', letterSpacing: '0.08em',
                  borderRight: '2px solid #000',
                  backgroundColor: activeTab === tab.id ? '#ffdd57' : '#fff',
                  color: activeTab === tab.id ? '#000' : '#999',
                  cursor: 'pointer',
                  transition: 'background-color 100ms, color 100ms',
                  border: 'none',
                  borderRight: '2px solid #000',
                }}
                onMouseEnter={e => {
                  if (activeTab !== tab.id) {
                    e.currentTarget.style.backgroundColor = '#f5f1eb';
                    e.currentTarget.style.color = '#000';
                  }
                }}
                onMouseLeave={e => {
                  if (activeTab !== tab.id) {
                    e.currentTarget.style.backgroundColor = '#fff';
                    e.currentTarget.style.color = '#999';
                  }
                }}
              >
                {tab.label}
              </button>
            ))}
            <div style={{ flex: 1, backgroundColor: '#fff' }} />
          </div>

          {/* Panel content */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

            {activeTab === 'preview' && (
              <div style={{ flex: 1, overflow: 'hidden' }}>
                <PreviewPanel previewUrl={previewUrl} />
              </div>
            )}

            {activeTab === 'terminal' && (
              <div style={{ flex: 1, overflow: 'hidden' }}>
                <TerminalPanel agentBaseUrl={agentBaseUrl} sandboxId={sandboxId} />
              </div>
            )}

            {activeTab === 'split' && (
              <>
                <div style={{ height: `${previewHeightPct}%`, overflow: 'hidden' }}>
                  <PreviewPanel previewUrl={previewUrl} />
                </div>
                <ResizableDivider onResize={handleVerticalResize} orientation="horizontal" />
                <div style={{ height: `${100 - previewHeightPct}%`, overflow: 'hidden' }}>
                  <TerminalPanel agentBaseUrl={agentBaseUrl} sandboxId={sandboxId} />
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
