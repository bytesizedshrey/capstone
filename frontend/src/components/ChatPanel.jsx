import { useState, useRef, useEffect } from 'react';

const SHADOW_SM = '2px 2px 0px #000';

function BrutalButtonSmall({ onClick, disabled, id, color = '#ffdd57', textColor = '#000', children }) {
  return (
    <button
      id={id}
      onClick={onClick}
      disabled={disabled}
      style={{
        backgroundColor: color,
        color: textColor,
        border: '2px solid #000',
        boxShadow: disabled ? 'none' : SHADOW_SM,
        transform: disabled ? 'translate(2px,2px)' : 'translate(0,0)',
        padding: '8px 18px',
        fontFamily: "'Space Mono', monospace",
        fontWeight: 700,
        fontSize: '12px',
        textTransform: 'uppercase',
        letterSpacing: '0.06em',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.45 : 1,
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

function MessageBubble({ message }) {
  const isUser = message.role === 'user';
  const isError = message.error;

  return (
    <div style={{
      display: 'flex',
      gap: '12px',
      flexDirection: isUser ? 'row-reverse' : 'row',
      alignItems: 'flex-start',
      minWidth: 0,
    }}>
      {/* Avatar */}
      <div style={{
        width: 36, height: 36, flexShrink: 0,
        backgroundColor: isUser ? '#a78bfa' : isError ? '#ff6b6b' : '#ffdd57',
        border: '2px solid #000',
        boxShadow: SHADOW_SM,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: "'Space Mono', monospace",
        fontWeight: 700, fontSize: '11px',
        color: isUser ? '#fff' : '#000',
        marginTop: '2px',
      }}>
        {isUser ? 'You' : 'AI'}
      </div>

      {/* Bubble */}
      <div style={{
        maxWidth: '78%',
        minWidth: 0,
        backgroundColor: isUser ? '#a78bfa' : isError ? '#ffeeee' : '#fff',
        border: '2px solid #000',
        boxShadow: SHADOW_SM,
        padding: '14px 18px',
        fontSize: '14px',
        lineHeight: 1.65,
        fontWeight: 500,
        color: isUser ? '#fff' : '#0a0a0a',
        fontFamily: "'Space Grotesk', sans-serif",
        wordBreak: 'break-word',
        overflowWrap: 'break-word',
      }}>
        {message.content || (
          <span style={{ display: 'flex', gap: '5px', alignItems: 'center', padding: '4px 0' }}>
            {[0, 150, 300].map(d => (
              <span key={d} style={{
                width: 7, height: 7, borderRadius: '50%',
                backgroundColor: '#ccc',
                display: 'inline-block',
                animation: `bounce 1s ${d}ms infinite`,
              }} />
            ))}
          </span>
        )}
        {message.streaming && message.content && (
          <span style={{
            display: 'inline-block', width: 2, height: 14,
            backgroundColor: isUser ? '#fff' : '#000',
            marginLeft: 3, verticalAlign: 'middle',
            animation: 'blink 1s step-end infinite',
          }} />
        )}
      </div>
    </div>
  );
}

const SUGGESTION_PROMPTS = [
  'A landing page for my coffee shop',
  'A personal portfolio site',
  'A simple dashboard with analytics cards',
];

export function ChatPanel({ messages, isStreaming, onSendMessage, onStop, sandboxId }) {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim() || isStreaming) return;
    onSendMessage(input.trim());
    setInput('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', height: '100%',
      backgroundColor: '#f5f1eb',
      borderRight: '4px solid #000',
    }}>

      {/* Panel header */}
      <div style={{
        backgroundColor: '#ff6b6b',
        borderBottom: '4px solid #000',
        padding: '14px 24px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexShrink: 0,
      }}>
        <span style={{
          fontFamily: "'Space Mono', monospace",
          fontWeight: 700, fontSize: '13px',
          color: '#fff', textTransform: 'uppercase', letterSpacing: '0.1em',
        }}>
          Chat
        </span>
        <div style={{ display: 'flex', gap: '6px' }}>
          {['#ffffff50', '#ffffff50', '#ffffff'].map((bg, i) => (
            <span key={i} style={{
              width: 10, height: 10, borderRadius: '50%',
              backgroundColor: bg, border: '1px solid #ffffff80',
              display: 'inline-block',
            }} />
          ))}
        </div>
      </div>

      {/* Messages area */}
      <div style={{
        flex: 1, overflowY: 'auto', overflowX: 'hidden',
        padding: '28px 22px',
        display: 'flex', flexDirection: 'column', gap: '20px',
      }}>
        {messages.length === 0 && (
          <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            justifyContent: 'center', height: '100%', gap: '24px',
            textAlign: 'center',
          }}>
            <div style={{
              width: 64, height: 64,
              backgroundColor: '#ffdd57',
              border: '2px solid #000',
              boxShadow: '4px 4px 0px #000',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: "'Space Mono', monospace",
              fontWeight: 700, fontSize: '24px', color: '#000',
            }}>
              H
            </div>

            <div>
              <p style={{ fontWeight: 700, fontSize: '16px', color: '#0a0a0a', marginBottom: '8px' }}>
                What do you want to build?
              </p>
              <p style={{
                fontSize: '14px', color: '#777', lineHeight: 1.7,
                maxWidth: '240px', margin: '0 auto',
                fontWeight: 500,
              }}>
                No coding needed. Just describe what you have in mind.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%' }}>
              {SUGGESTION_PROMPTS.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => onSendMessage(prompt)}
                  style={{
                    width: '100%', textAlign: 'left',
                    backgroundColor: '#fff',
                    border: '2px solid #000',
                    boxShadow: SHADOW_SM,
                    padding: '14px 18px',
                    fontSize: '13px',
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontWeight: 600, color: '#0a0a0a',
                    cursor: 'pointer',
                    transition: 'transform 80ms, box-shadow 80ms',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = 'translate(2px,2px)';
                    e.currentTarget.style.boxShadow = 'none';
                    e.currentTarget.style.backgroundColor = '#ffdd57';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = 'translate(0,0)';
                    e.currentTarget.style.boxShadow = SHADOW_SM;
                    e.currentTarget.style.backgroundColor = '#fff';
                  }}
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input footer */}
      <div style={{
        borderTop: '4px solid #000',
        padding: '20px 22px',
        backgroundColor: '#fff',
        flexShrink: 0,
        display: 'flex', flexDirection: 'column', gap: '12px',
      }}>
        <textarea
          id="chat-input"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Describe what you want to build..."
          disabled={isStreaming}
          rows={3}
          style={{
            width: '100%',
            backgroundColor: '#f5f1eb',
            border: '2px solid #000',
            padding: '14px 16px',
            fontSize: '14px',
            fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: 500,
            lineHeight: 1.6,
            resize: 'none',
            outline: 'none',
            color: '#0a0a0a',
            boxSizing: 'border-box',
            boxShadow: 'inset 2px 2px 0px #00000012',
          }}
        />

        <div style={{ display: 'flex', gap: '10px' }}>
          {isStreaming ? (
            <BrutalButtonSmall id="stop-ai-btn" onClick={onStop} color="#ff6b6b" textColor="#fff">
              Stop
            </BrutalButtonSmall>
          ) : (
            <BrutalButtonSmall
              id="send-chat-btn"
              onClick={handleSubmit}
              disabled={!input.trim() || !sandboxId}
            >
              Send
            </BrutalButtonSmall>
          )}
        </div>

        <p style={{
          fontFamily: "'Space Mono', monospace",
          fontSize: '11px', color: '#bbb',
          textAlign: 'center', letterSpacing: '0.02em',
        }}>
          Enter to send &nbsp;&middot;&nbsp; Shift + Enter for new line
        </p>
      </div>

      <style>{`
        @keyframes bounce {
          0%, 80%, 100% { transform: scale(0); }
          40% { transform: scale(1); }
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </div>
  );
}
