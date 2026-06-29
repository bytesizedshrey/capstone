import { useState, useCallback, useEffect } from 'react';
import { Navbar } from './Navbar.jsx';
import { ChatPanel } from './ChatPanel.jsx';
import { TerminalPanel } from './TerminalPanel.jsx';
import { PreviewPanel } from './PreviewPanel.jsx';
import { CodePanel } from './CodePanel.jsx';
import { ResizableDivider } from './ResizableDivider.jsx';

import { ProjectCompletePopup } from './ProjectCompletePopup.jsx';

const TABS = [
  { id: 'preview', label: 'Preview' },
  { id: 'code', label: 'Code' },
  { id: 'terminal', label: 'Terminal' },
  { id: 'split', label: 'Split' },
];

const SHADOW_LG = '8px 8px 0px #000';

export function SandboxWorkspace({
  sandboxId, previewUrl, agentBaseUrl,
  messages, isStreaming, onSendMessage, onStop, onReset
}) {
  const [activeTab, setActiveTab] = useState('preview');
  const [chatWidthPx, setChatWidthPx] = useState(360);
  const [previewHeightPct, setPreviewHeightPct] = useState(60);

  const [provisioningStatus, setProvisioningStatus] = useState('starting'); // 'starting' | 'ready' | 'error'

  useEffect(() => {
    let mounted = true;
    const checkHealth = async () => {
      let attempts = 0;
      const maxAttempts = 30; // 60 seconds total
      const retryDelayMs = 2000;
      
      while (attempts < maxAttempts && mounted) {
        try {
          const [previewRes, agentRes] = await Promise.all([
            fetch(previewUrl, { method: 'HEAD' }).catch(() => null),
            fetch(`${agentBaseUrl}/list-files`, { method: 'HEAD' }).catch(() => null)
          ]);
          if (previewRes?.ok && agentRes?.ok) {
            if (mounted) setProvisioningStatus('ready');
            return;
          }
        } catch (e) {
          // Ignore network errors during retries
        }
        attempts++;
        await new Promise(resolve => setTimeout(resolve, retryDelayMs));
      }
      if (mounted) setProvisioningStatus('error');
    };
    checkHealth();
    return () => { mounted = false; };
  }, [previewUrl, agentBaseUrl]);

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

          {/* Panel content or Provisioning Loader */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative', backgroundColor: '#f5f1eb' }}>
            
            {provisioningStatus === 'starting' && (
              <div style={{ position: 'absolute', inset: 0, zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff', flexDirection: 'column', gap: '24px' }}>
                <div style={{ 
                  width: '64px', height: '64px', 
                  border: '4px solid #000', 
                  borderTopColor: '#ffdd57', 
                  borderRadius: '50%', 
                  animation: 'spin 1s linear infinite' 
                }} />
                <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '24px', fontWeight: 800, textTransform: 'uppercase', color: '#000' }}>Provisioning Sandbox...</h2>
                <p style={{ fontFamily: "'Space Mono', monospace", fontSize: '14px', color: '#666', textAlign: 'center', maxWidth: '300px' }}>
                  Creating secure isolation, booting preview server, and attaching file systems. This usually takes about 15 seconds.
                </p>
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
              </div>
            )}

            {provisioningStatus === 'error' && (
              <div style={{ position: 'absolute', inset: 0, zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff' }}>
                <div style={{
                  backgroundColor: '#ff6b6b',
                  border: '3px solid #000',
                  boxShadow: SHADOW_LG,
                  padding: '40px 48px',
                  maxWidth: '480px',
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px'
                }}>
                  <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '28px', fontWeight: 800, textTransform: 'uppercase', color: '#000', margin: 0 }}>Provisioning Failed</h2>
                  <p style={{ fontFamily: "'Space Mono', monospace", fontSize: '15px', color: '#000', fontWeight: 600, lineHeight: 1.6, margin: 0 }}>
                    We were unable to establish a connection to your secure sandbox environment.
                  </p>
                  <button 
                    onClick={() => { if (onReset) onReset(); else window.location.reload(); }}
                    style={{
                      backgroundColor: '#fff', border: '2px solid #000', boxShadow: '4px 4px 0px #000',
                      padding: '12px 24px', fontFamily: "'Space Mono', monospace", fontSize: '14px',
                      fontWeight: 700, textTransform: 'uppercase', cursor: 'pointer', marginTop: '16px',
                      alignSelf: 'center'
                    }}
                  >
                    Go Back
                  </button>
                </div>
              </div>
            )}

            {provisioningStatus === 'ready' && (
              <>
                {activeTab === 'preview' && (
                  <div style={{ flex: 1, overflow: 'hidden' }}>
                    <PreviewPanel previewUrl={previewUrl} />
                  </div>
                )}

                {activeTab === 'code' && (
                  <div style={{ flex: 1, overflow: 'hidden' }}>
                    <CodePanel agentBaseUrl={agentBaseUrl} />
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
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
