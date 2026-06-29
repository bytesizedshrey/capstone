const SHADOW = '6px 6px 0px #000';
const SHADOW_LG = '8px 8px 0px #000';
const SHADOW_SM = '3px 3px 0px #000';

function BrutalBtn({ onClick, disabled, loading, children, id, color = '#ffdd57', textColor = '#000' }) {
  return (
    <button
      id={id}
      onClick={onClick}
      disabled={disabled || loading}
      style={{
        backgroundColor: color,
        color: textColor,
        boxShadow: disabled || loading ? 'none' : SHADOW,
        transform: disabled || loading ? 'translate(6px, 6px)' : 'translate(0, 0)',
        transition: 'transform 80ms, box-shadow 80ms',
        border: '2px solid #000',
        width: '100%',
        padding: '18px 32px',
        fontFamily: "'Space Mono', monospace",
        fontWeight: 700,
        fontSize: '15px',
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        cursor: disabled || loading ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '10px',
      }}
      onMouseEnter={e => {
        if (!disabled && !loading) {
          e.currentTarget.style.transform = 'translate(6px, 6px)';
          e.currentTarget.style.boxShadow = 'none';
        }
      }}
      onMouseLeave={e => {
        if (!disabled && !loading) {
          e.currentTarget.style.transform = 'translate(0, 0)';
          e.currentTarget.style.boxShadow = SHADOW;
        }
      }}
    >
      {loading && (
        <span style={{
          width: 16, height: 16,
          border: '2px solid #000',
          borderTopColor: 'transparent',
          borderRadius: '50%',
          display: 'inline-block',
          animation: 'spin 0.7s linear infinite',
        }} />
      )}
      {children}
    </button>
  );
}

import { useState, useEffect } from 'react';
import { OnboardingModal } from './OnboardingModal.jsx';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
} from '@/components/ui/alert-dialog';

export function LandingScreen({ onStart, status, error, projects }) {
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const isStarting = status === 'starting';

  // Handle Toast notifications from auth redirects
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('login') === 'success') {
      setToastMessage('Happy Building! 🎉');
      // Clean up the URL
      window.history.replaceState({}, document.title, window.location.pathname);
    } else if (params.get('logout') === 'success') {
      setToastMessage('Signed out successfully 👋');
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  const dismissOnboarding = () => {
    localStorage.setItem('hateable_onboarding_dismissed', 'true');
    setShowOnboarding(false);
  };

  const handleStartOnboarding = (projectTitle) => {
    localStorage.setItem('hateable_onboarding_dismissed', 'true');
    // We don't close the modal yet because it will show the loading spinner inside the modal
    onStart(projectTitle);
  };
  useEffect(() => {
    if (projects && projects.length === 0) {
      // User is authenticated but has no projects
      const hasDismissed = localStorage.getItem('hateable_onboarding_dismissed');
      if (!hasDismissed) {
        setShowOnboarding(true);
      }
    }
  }, [projects]);



  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f5f1eb',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '48px 24px',
      fontFamily: "'Space Grotesk', sans-serif",
      position: 'relative',
      overflow: 'hidden',
    }}>

      {/* AlertDialog Popup */}
      <AlertDialog open={!!toastMessage} onOpenChange={(open) => !open && setToastMessage(null)}>
        <AlertDialogContent style={{
          backgroundColor: '#ffdd57',
          border: '3px solid #000',
          boxShadow: '10px 10px 0px #000',
          padding: '40px 48px',
          borderRadius: '0',
          gap: '16px'
        }}>
          <AlertDialogHeader>
            <AlertDialogTitle style={{ 
              fontFamily: "'Space Grotesk', sans-serif", 
              fontSize: '28px', 
              fontWeight: 800, 
              color: '#000', 
              textTransform: 'uppercase', 
              letterSpacing: '-0.02em',
              marginBottom: '12px'
            }}>
              Update Status
            </AlertDialogTitle>
            <AlertDialogDescription style={{ 
              fontFamily: "'Space Mono', monospace", 
              fontSize: '16px', 
              color: '#000', 
              fontWeight: 600,
              lineHeight: 1.6
            }}>
              {toastMessage}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '32px' }}>
            <AlertDialogAction 
              onClick={() => setToastMessage(null)}
              style={{
                backgroundColor: '#fff',
                border: '2px solid #000',
                boxShadow: '4px 4px 0px #000',
                color: '#000',
                fontFamily: "'Space Mono', monospace",
                fontWeight: 700,
                fontSize: '14px',
                padding: '12px 28px',
                textTransform: 'uppercase',
                borderRadius: '0',
                cursor: 'pointer',
                transition: 'transform 80ms, box-shadow 80ms'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translate(4px, 4px)';
                e.currentTarget.style.boxShadow = 'none';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translate(0, 0)';
                e.currentTarget.style.boxShadow = '4px 4px 0px #000';
              }}
            >
              GOT IT
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>

      <OnboardingModal 
        isOpen={showOnboarding}
        onClose={dismissOnboarding}
        onStart={handleStartOnboarding}
        isStarting={isStarting}
      />

      {/* Dot grid bg */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: 'radial-gradient(circle, #00000018 1.5px, transparent 1.5px)',
        backgroundSize: '32px 32px',
      }} />

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      {/* Outer content wrapper */}
      <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: '560px', display: 'flex', flexDirection: 'column', gap: '24px' }}>

        {/* Beta badge */}
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <span style={{
            backgroundColor: '#ffdd57',
            border: '2px solid #000',
            boxShadow: SHADOW_SM,
            padding: '6px 16px',
            fontFamily: "'Space Mono', monospace",
            fontWeight: 700,
            fontSize: '11px',
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: '#000',
          }}>
            loveable on a low budget
          </span>
        </div>

        {/* Main card */}
        <div style={{
          backgroundColor: '#fff',
          border: '2px solid #000',
          boxShadow: SHADOW_LG,
          padding: '56px 52px 48px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0',
        }}>

          {/* Logo row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '28px' }}>
            <div style={{
              width: 48, height: 48,
              backgroundColor: '#ff6b6b',
              border: '2px solid #000',
              boxShadow: SHADOW_SM,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: "'Space Mono', monospace",
              fontWeight: 700, fontSize: '20px', color: '#fff',
              flexShrink: 0,
            }}>
              H
            </div>
            <h1 style={{
              fontSize: '38px',
              fontWeight: 700,
              letterSpacing: '-0.02em',
              color: '#0a0a0a',
              margin: 0,
              lineHeight: 1,
            }}>
              Hateable
            </h1>
          </div>

          {/* Tagline */}
          <p style={{
            fontSize: '17px',
            color: '#444',
            lineHeight: 1.65,
            textAlign: 'center',
            marginBottom: '44px',
            fontWeight: 500,
            maxWidth: '360px',
          }}>
            spill the tea on what you wanna build.<br />
            we'll handle the coding, you handle the existential dread.
          </p>

          {/* CTA */}
          <div style={{ width: '100%' }}>
            {projects === null ? (
              // Unauthenticated state - redirect to login
              <BrutalBtn
                id="start-sandbox-btn"
                onClick={() => window.location.href = '/api/auth/google'}
                disabled={false}
              >
                Sign in to Start Building
              </BrutalBtn>
            ) : (
              <BrutalBtn
                id="start-sandbox-btn"
                onClick={() => onStart('New Project')}
                loading={isStarting}
                disabled={isStarting}
              >
                {isStarting ? 'Setting up your workspace...' : 'Start Building'}
              </BrutalBtn>
            )}
          </div>



          {/* Logout Button */}
          {projects !== null && (
            <div style={{ width: '100%', marginTop: '24px', display: 'flex', justifyContent: 'center' }}>
              <button
                onClick={() => window.location.href = '/api/auth/logout'}
                style={{
                  backgroundColor: 'transparent',
                  border: 'none',
                  color: '#666',
                  fontFamily: "'Space Mono', monospace",
                  fontSize: '13px',
                  textDecoration: 'underline',
                  cursor: 'pointer',
                  padding: '12px'
                }}
              >
                Sign out
              </button>
            </div>
          )}

          {/* Error */}
          {error && (
            <div style={{
              marginTop: '20px',
              backgroundColor: '#ff6b6b',
              border: '2px solid #000',
              padding: '16px 20px',
              width: '100%',
              fontFamily: "'Space Mono', monospace",
              fontSize: '13px',
              lineHeight: 1.6,
              color: '#000',
            }}>
              <strong>Something went wrong</strong><br />
              {error}
            </div>
          )}
        </div>

        {/* Footer */}
        <p style={{
          textAlign: 'center',
          fontFamily: "'Space Mono', monospace",
          fontSize: '12px',
          color: '#999',
          letterSpacing: '0.04em',
        }}>
          Free to try
        </p>

      </div>
    </div>
  );
}
