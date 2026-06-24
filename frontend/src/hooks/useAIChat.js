// Hook to handle SSE streaming from the AI orchestration API
import { useState, useCallback, useRef } from 'react';

const AI_API = '/api/ai/invoke';

export function useAIChat(sandboxId) {
  const [messages, setMessages] = useState([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const abortControllerRef = useRef(null);

  const sendMessage = useCallback(async (userMessage) => {
    if (!sandboxId || !userMessage.trim()) return;

    // Add user message
    const userMsg = { role: 'user', content: userMessage, id: Date.now() };
    setMessages(prev => [...prev, userMsg]);

    // Add placeholder AI message
    const aiMsgId = Date.now() + 1;
    setMessages(prev => [...prev, { role: 'ai', content: '', id: aiMsgId, streaming: true }]);
    setIsStreaming(true);

    abortControllerRef.current = new AbortController();

    try {
      const res = await fetch(AI_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage, projectId: sandboxId }),
        signal: abortControllerRef.current.signal,
      });

      if (!res.ok) throw new Error('AI request failed');

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let accumulated = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        accumulated += chunk;

        setMessages(prev =>
          prev.map(m =>
            m.id === aiMsgId ? { ...m, content: accumulated } : m
          )
        );
      }

      // Mark done
      setMessages(prev =>
        prev.map(m =>
          m.id === aiMsgId ? { ...m, streaming: false } : m
        )
      );
    } catch (err) {
      if (err.name !== 'AbortError') {
        setMessages(prev =>
          prev.map(m =>
            m.id === aiMsgId
              ? { ...m, content: `Error: ${err.message}`, streaming: false, error: true }
              : m
          )
        );
      }
    } finally {
      setIsStreaming(false);
    }
  }, [sandboxId]);

  const stopStreaming = useCallback(() => {
    abortControllerRef.current?.abort();
    setIsStreaming(false);
  }, []);

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  return { messages, isStreaming, sendMessage, stopStreaming, clearMessages };
}
