

const SHADOW_SM = '3px 3px 0px #000';

export function Navbar({ sandboxId }) {
  return (
    <header style={{
      height: '60px',
      backgroundColor: '#fff',
      borderBottom: '4px solid #000',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 28px',
      flexShrink: 0,
      fontFamily: "'Space Grotesk', sans-serif",
    }}>

      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{
          width: 32, height: 32,
          backgroundColor: '#ff6b6b',
          border: '2px solid #000',
          boxShadow: SHADOW_SM,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: "'Space Mono', monospace",
          fontWeight: 700, fontSize: '14px', color: '#fff',
          flexShrink: 0,
        }}>
          H
        </div>
        <span style={{ fontWeight: 700, fontSize: '17px', color: '#0a0a0a', letterSpacing: '-0.01em' }}>
          Hateable
        </span>
      </div>



      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {/* Search Bar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          backgroundColor: '#fff',
          border: '2px solid #000',
          boxShadow: SHADOW_SM,
          width: '240px',
        }}>
          <div style={{
            padding: '5px 10px',
            borderRight: '2px solid #000',
            display: 'flex', alignItems: 'center',
            backgroundColor: '#f5f1eb'
          }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </div>
          <input
            placeholder="Search projects..."
            style={{
              flex: 1,
              border: 'none',
              outline: 'none',
              padding: '5px 12px',
              fontFamily: "'Space Mono', monospace",
              fontSize: '11px',
              backgroundColor: 'transparent',
              color: '#000',
              fontWeight: 600,
            }}
          />
        </div>

        {/* Status */}
        <div style={{
          backgroundColor: '#a78bfa',
          border: '2px solid #000',
          boxShadow: SHADOW_SM,
          padding: '5px 16px',
          fontFamily: "'Space Mono', monospace",
          fontSize: '11px',
          fontWeight: 700,
          color: '#000',
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
        }}>
          Active
        </div>

        {/* Sign Out Button */}
        <button
          onClick={() => window.location.href = '/api/auth/logout'}
          style={{
            backgroundColor: '#ff6b6b',
            border: '2px solid #000',
            boxShadow: SHADOW_SM,
            padding: '5px 16px',
            fontFamily: "'Space Mono', monospace",
            fontSize: '11px',
            fontWeight: 700,
            color: '#000',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            cursor: 'pointer',
          }}
        >
          Sign out
        </button>
      </div>

      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }`}</style>
    </header>
  );
}
