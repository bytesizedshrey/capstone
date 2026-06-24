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

      {/* Sandbox pill */}
      {sandboxId && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: '8px',
          backgroundColor: '#f5f1eb',
          border: '2px solid #000',
          padding: '5px 14px',
          fontFamily: "'Space Mono', monospace",
          fontSize: '12px',
          fontWeight: 700,
          color: '#0a0a0a',
        }}>
          <span style={{
            width: 8, height: 8,
            backgroundColor: '#4ecdc4',
            border: '1.5px solid #000',
            borderRadius: '50%',
            display: 'inline-block',
            animation: 'pulse 2s infinite',
          }} />
          {sandboxId.slice(0, 8)}&hellip;
        </div>
      )}

      {/* Status */}
      <div style={{
        backgroundColor: '#4ecdc4',
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

      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }`}</style>
    </header>
  );
}
