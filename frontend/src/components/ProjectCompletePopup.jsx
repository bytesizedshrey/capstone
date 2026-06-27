import React, { useEffect, useState, useRef } from 'react';

export function ProjectCompletePopup({ onClose, onOpenPreview, onOpenCode, onCreateAnother, projectName }) {
  const [isVisible, setIsVisible] = useState(false);
  const popupRef = useRef(null);
  const previouslyFocusedElement = useRef(null);

  useEffect(() => {
    previouslyFocusedElement.current = document.activeElement;
    const timer = setTimeout(() => {
      setIsVisible(true);
      if (popupRef.current) {
        // Focus the first button for accessibility
        const firstBtn = popupRef.current.querySelector('button');
        if (firstBtn) firstBtn.focus();
      }
    }, 10);
    return () => {
      clearTimeout(timer);
      if (previouslyFocusedElement.current) {
        previouslyFocusedElement.current.focus();
      }
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
      
      // Simple focus trap
      if (e.key === 'Tab' && popupRef.current) {
        const focusableElements = popupRef.current.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            lastElement.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === lastElement) {
            firstElement.focus();
            e.preventDefault();
          }
        }
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      onClick={handleBackdropClick}
      style={{
        position: 'fixed',
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        backdropFilter: 'blur(4px)',
        opacity: isVisible ? 1 : 0,
        transition: 'opacity 250ms ease-in-out',
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="popup-title"
    >
      <div 
        ref={popupRef}
        style={{
          backgroundColor: '#e8e0d4',
          border: '4px solid #000',
          boxShadow: 'var(--shadow-brutal, 8px 8px 0px 0px #000)',
          padding: '32px',
          width: '420px',
          maxWidth: '90%',
          transform: isVisible ? 'scale(1) translateY(0)' : 'scale(0.95) translateY(20px)',
          transition: 'transform 250ms cubic-bezier(0.175, 0.885, 0.32, 1.275)',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
          position: 'relative'
        }}
      >
        <button
          onClick={onClose}
          aria-label="Close"
          style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            background: 'transparent',
            border: '2px solid transparent',
            fontSize: '20px',
            fontWeight: 'bold',
            cursor: 'pointer',
            padding: '4px 8px',
            color: '#000',
            transition: 'border-color 150ms',
          }}
          onFocus={e => e.currentTarget.style.borderColor = '#000'}
          onBlur={e => e.currentTarget.style.borderColor = 'transparent'}
        >
          ✕
        </button>

        <div style={{ textAlign: 'center' }}>
          <div style={{ 
            fontSize: '48px', 
            marginBottom: '16px',
            filter: 'drop-shadow(2px 2px 0px #000)'
          }}>
            🏆
          </div>
          <h2 id="popup-title" style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: 800,
            fontSize: '24px',
            margin: 0,
            textTransform: 'uppercase',
            letterSpacing: '-0.02em',
            color: '#000',
          }}>
            System Ready
          </h2>
          <p style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: '14px',
            color: '#444',
            marginTop: '8px',
            fontWeight: 'bold'
          }}>
            {projectName ? `"${projectName}" successfully provisioned.` : 'Project generation successfully provisioned.'}
          </p>
        </div>

        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }}>
          <button
            onClick={onOpenPreview}
            style={{
              padding: '14px',
              fontFamily: "'Space Mono', monospace",
              fontWeight: 700,
              fontSize: '14px',
              textTransform: 'uppercase',
              backgroundColor: '#ffdd57',
              border: '2px solid #000',
              boxShadow: 'var(--shadow-brutal-sm, 4px 4px 0px 0px #000)',
              color: '#000',
              cursor: 'pointer',
              transition: 'transform 100ms, box-shadow 100ms, outline 100ms',
              outline: 'none'
            }}
            onFocus={e => {
              e.currentTarget.style.outline = '2px solid #4ecdc4';
              e.currentTarget.style.outlineOffset = '2px';
            }}
            onBlur={e => e.currentTarget.style.outline = 'none'}
            onMouseDown={e => {
              e.currentTarget.style.transform = 'translate(2px, 2px)';
              e.currentTarget.style.boxShadow = '2px 2px 0px 0px #000';
            }}
            onMouseUp={e => {
              e.currentTarget.style.transform = 'translate(0px, 0px)';
              e.currentTarget.style.boxShadow = 'var(--shadow-brutal-sm, 4px 4px 0px 0px #000)';
            }}
          >
            [1] Open Preview
          </button>
          
          <button
            onClick={onOpenCode}
            style={{
              padding: '14px',
              fontFamily: "'Space Mono', monospace",
              fontWeight: 700,
              fontSize: '14px',
              textTransform: 'uppercase',
              backgroundColor: '#4ecdc4',
              border: '2px solid #000',
              boxShadow: 'var(--shadow-brutal-sm, 4px 4px 0px 0px #000)',
              color: '#000',
              cursor: 'pointer',
              transition: 'transform 100ms, box-shadow 100ms, outline 100ms',
              outline: 'none'
            }}
            onFocus={e => {
              e.currentTarget.style.outline = '2px solid #ffdd57';
              e.currentTarget.style.outlineOffset = '2px';
            }}
            onBlur={e => e.currentTarget.style.outline = 'none'}
            onMouseDown={e => {
              e.currentTarget.style.transform = 'translate(2px, 2px)';
              e.currentTarget.style.boxShadow = '2px 2px 0px 0px #000';
            }}
            onMouseUp={e => {
              e.currentTarget.style.transform = 'translate(0px, 0px)';
              e.currentTarget.style.boxShadow = 'var(--shadow-brutal-sm, 4px 4px 0px 0px #000)';
            }}
          >
            [2] Open Code
          </button>

          <button
            onClick={onCreateAnother}
            style={{
              padding: '14px',
              fontFamily: "'Space Mono', monospace",
              fontWeight: 700,
              fontSize: '14px',
              textTransform: 'uppercase',
              backgroundColor: '#fff',
              border: '2px solid #000',
              boxShadow: 'var(--shadow-brutal-sm, 4px 4px 0px 0px #000)',
              color: '#000',
              cursor: 'pointer',
              marginTop: '8px',
              transition: 'transform 100ms, box-shadow 100ms, outline 100ms',
              outline: 'none'
            }}
            onFocus={e => {
              e.currentTarget.style.outline = '2px solid #000';
              e.currentTarget.style.outlineOffset = '2px';
            }}
            onBlur={e => e.currentTarget.style.outline = 'none'}
            onMouseDown={e => {
              e.currentTarget.style.transform = 'translate(2px, 2px)';
              e.currentTarget.style.boxShadow = '2px 2px 0px 0px #000';
            }}
            onMouseUp={e => {
              e.currentTarget.style.transform = 'translate(0px, 0px)';
              e.currentTarget.style.boxShadow = 'var(--shadow-brutal-sm, 4px 4px 0px 0px #000)';
            }}
          >
            [ESC] Create Another
          </button>
        </div>
      </div>
    </div>
  );
}
