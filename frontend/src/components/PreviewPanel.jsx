import { useState } from 'react';

const SHADOW_SM = '2px 2px 0px #00000060';

function PanelBtn({ id, onClick, disabled, color = '#ffdd57', textColor = '#000', children }) {
  return (
    <button
      id={id}
      onClick={onClick}
      disabled={disabled}
      style={{
        backgroundColor: color, color: textColor,
        border: '2px solid #000',
        boxShadow: disabled ? 'none' : SHADOW_SM,
        transform: disabled ? 'translate(2px,2px)' : 'translate(0,0)',
        padding: '7px 16px',
        fontFamily: "'Space Mono', monospace",
        fontWeight: 700, fontSize: '12px',
        textTransform: 'uppercase', letterSpacing: '0.06em',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.4 : 1,
        transition: 'transform 80ms, box-shadow 80ms',
        flexShrink: 0,
      }}
      onMouseEnter={e => {
        if (!disabled) {
          e.currentTarget.style.transform = 'translate(2px,2px)';
          e.currentTarget.style.boxShadow = 'none';
        }
      }}
      onMouseLeave={e => {
        if (!disabled) {
          e.currentTarget.style.transform = 'translate(0,0)';
          e.currentTarget.style.boxShadow = SHADOW_SM;
        }
      }}
    >
      {children}
    </button>
  );
}

export function PreviewPanel({ previewUrl }) {
  const [iframeKey, setIframeKey] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setIframeKey(k => k + 1);
    setTimeout(() => setIsRefreshing(false), 800);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: '#f5f1eb' }}>

      {/* Header */}
      <div style={{
        backgroundColor: '#ffdd57',
        borderBottom: '4px solid #000',
        padding: '14px 24px',
        display: 'flex', alignItems: 'center', gap: '16px',
        flexShrink: 0,
      }}>
        <span style={{
          fontFamily: "'Space Mono', monospace",
          fontWeight: 700, fontSize: '13px',
          color: '#000', textTransform: 'uppercase', letterSpacing: '0.1em',
          flexShrink: 0,
        }}>
          Preview
        </span>

        {/* URL bar */}
        <div style={{
          flex: 1,
          backgroundColor: '#fff',
          border: '2px solid #000',
          padding: '7px 14px',
          fontFamily: "'Space Mono', monospace",
          fontSize: '12px', color: '#888',
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>
          {previewUrl || 'No preview available'}
        </div>

        <div style={{ display: 'flex', gap: '10px', flexShrink: 0 }}>
          <PanelBtn id="refresh-preview-btn" onClick={handleRefresh}>
            {isRefreshing ? 'Refreshing...' : 'Refresh'}
          </PanelBtn>
          <PanelBtn
            id="open-preview-btn"
            onClick={() => window.open(previewUrl, '_blank')}
            disabled={!previewUrl}
            color="#fff"
          >
            Open
          </PanelBtn>
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, position: 'relative', backgroundColor: '#fff' }}>
        {isRefreshing && (
          <div style={{
            position: 'absolute', inset: 0, zIndex: 10,
            backgroundColor: 'rgba(255,255,255,0.85)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <div style={{
              backgroundColor: '#ffdd57',
              border: '2px solid #000',
              boxShadow: '3px 3px 0px #000',
              padding: '12px 28px',
              fontFamily: "'Space Mono', monospace",
              fontWeight: 700, fontSize: '13px',
            }}>
              Refreshing...
            </div>
          </div>
        )}

        {previewUrl ? (
          <iframe
            key={iframeKey}
            src={previewUrl}
            id="preview-iframe"
            title="App Preview"
            style={{ width: '100%', height: '100%', border: 'none', display: 'block' }}
            sandbox="allow-scripts allow-same-origin allow-forms allow-modals allow-popups"
          />
        ) : (
          <div style={{
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            height: '100%', gap: '20px', padding: '48px',
            textAlign: 'center',
          }}>
            <div style={{
              width: 64, height: 64,
              backgroundColor: '#a78bfa',
              border: '2px solid #000',
              boxShadow: '4px 4px 0px #000',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: "'Space Mono', monospace",
              fontWeight: 700, fontSize: '24px', color: '#fff',
            }}>
              P
            </div>
            <div>
              <p style={{ fontWeight: 700, fontSize: '16px', color: '#0a0a0a', marginBottom: '8px', fontFamily: "'Space Grotesk', sans-serif" }}>
                Nothing here yet
              </p>
              <p style={{ fontSize: '14px', color: '#777', lineHeight: 1.7, maxWidth: '260px', fontFamily: "'Space Grotesk', sans-serif", fontWeight: 500 }}>
                Once your workspace is running, your app will appear here live.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
