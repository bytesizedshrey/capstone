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

export function LandingScreen({ onStart, status, error }) {
  const isStarting = status === 'starting';

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
            Now in Beta
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
            Tell us what you want to build.<br />
            We handle all the hard parts for you.
          </p>

          {/* CTA */}
          <div style={{ width: '100%' }}>
            <BrutalBtn
              id="start-sandbox-btn"
              onClick={onStart}
              loading={isStarting}
              disabled={isStarting}
            >
              {isStarting ? 'Setting up your workspace...' : 'Start Building'}
            </BrutalBtn>
          </div>

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
          Free to try &nbsp;&middot;&nbsp; No account needed
        </p>

      </div>
    </div>
  );
}
