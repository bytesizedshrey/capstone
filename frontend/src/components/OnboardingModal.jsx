import { useState, useEffect, useRef } from 'react';

const SHADOW = '6px 6px 0px #000';
const SHADOW_SM = '3px 3px 0px #000';

export function OnboardingModal({ isOpen, onClose, onStart, isStarting }) {
  const [title, setTitle] = useState('');
  const inputRef = useRef(null);
  
  useEffect(() => {
    if (isOpen && inputRef.current) {
      // Small delay to allow CSS transitions to start before focusing
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);
  
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'Enter' && title.trim() && !isStarting) {
        onStart(title);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, onStart, title, isStarting]);

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      fontFamily: "'Space Grotesk', sans-serif",
    }}>
      {/* Backdrop overlay */}
      <div 
        onClick={onClose}
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.4)',
          backdropFilter: 'blur(4px)',
          animation: 'fadeIn 200ms ease-out',
        }} 
      />
      
      {/* Modal Card */}
      <div style={{
        position: 'relative',
        width: '100%',
        maxWidth: '480px',
        backgroundColor: '#fff',
        border: '2px solid #000',
        boxShadow: SHADOW,
        padding: '48px 40px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        animation: 'slideUp 300ms cubic-bezier(0.16, 1, 0.3, 1)',
      }}>
        <style>{`
          @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
          @keyframes slideUp { 
            from { opacity: 0; transform: translateY(20px); } 
            to { opacity: 1; transform: translateY(0); } 
          }
        `}</style>
        
        {/* Decorative elements */}
        <div style={{
          width: 48, height: 48,
          backgroundColor: '#ffdd57',
          border: '2px solid #000',
          boxShadow: SHADOW_SM,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: "'Space Mono', monospace",
          fontWeight: 700, fontSize: '24px', color: '#000',
          marginBottom: '24px',
          borderRadius: '50%',
        }}>
          👋
        </div>

        <h2 style={{
          fontSize: '28px',
          fontWeight: 700,
          letterSpacing: '-0.02em',
          color: '#0a0a0a',
          margin: '0 0 12px 0',
          textAlign: 'center',
          lineHeight: 1.1,
        }}>
          Welcome aboard!
        </h2>
        
        <p style={{
          fontSize: '16px',
          color: '#555',
          lineHeight: 1.6,
          textAlign: 'center',
          marginBottom: '32px',
          fontWeight: 500,
        }}>
          You're all set up. Let's create your first project and jump into your new workspace.
        </p>

        <div style={{ width: '100%', marginBottom: '24px' }}>
          <label style={{
            display: 'block',
            fontFamily: "'Space Mono', monospace",
            fontSize: '12px',
            textTransform: 'uppercase',
            fontWeight: 700,
            marginBottom: '8px',
          }}>
            Project Title
          </label>
          <input 
            ref={inputRef}
            type="text" 
            placeholder="e.g. My Awesome App"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={isStarting}
            style={{
              width: '100%',
              padding: '16px 20px',
              fontFamily: "'Space Mono', monospace",
              fontSize: '15px',
              border: '2px solid #000',
              boxShadow: SHADOW_SM,
              outline: 'none',
              boxSizing: 'border-box',
              backgroundColor: isStarting ? '#f5f5f5' : '#fff'
            }}
          />
        </div>

        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <button
            onClick={() => onStart(title || 'New Project')}
            disabled={isStarting}
            style={{
              backgroundColor: '#ff6b6b',
              color: '#fff',
              boxShadow: isStarting ? 'none' : SHADOW,
              transform: isStarting ? 'translate(6px, 6px)' : 'translate(0, 0)',
              transition: 'transform 80ms, box-shadow 80ms',
              border: '2px solid #000',
              width: '100%',
              padding: '16px 32px',
              fontFamily: "'Space Mono', monospace",
              fontWeight: 700,
              fontSize: '15px',
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              cursor: isStarting ? 'not-allowed' : 'pointer',
              opacity: isStarting ? 0.7 : 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
            }}
            onMouseEnter={e => {
              if (!isStarting) {
                e.currentTarget.style.transform = 'translate(6px, 6px)';
                e.currentTarget.style.boxShadow = 'none';
              }
            }}
            onMouseLeave={e => {
              if (!isStarting) {
                e.currentTarget.style.transform = 'translate(0, 0)';
                e.currentTarget.style.boxShadow = SHADOW;
              }
            }}
          >
            {isStarting && (
              <span style={{
                width: 16, height: 16,
                border: '2px solid #fff',
                borderTopColor: 'transparent',
                borderRadius: '50%',
                display: 'inline-block',
                animation: 'spin 0.7s linear infinite',
              }} />
            )}
            {isStarting ? 'Building...' : 'Start Building'}
          </button>
          
          <button
            onClick={onClose}
            disabled={isStarting}
            style={{
              backgroundColor: 'transparent',
              border: 'none',
              color: '#666',
              fontFamily: "'Space Mono', monospace",
              fontSize: '13px',
              textDecoration: 'underline',
              cursor: 'pointer',
              padding: '12px',
              marginTop: '8px'
            }}
          >
            Maybe Later
          </button>
        </div>

      </div>
    </div>
  );
}
