// Hook to manage the sandbox lifecycle
import { useState, useCallback } from 'react';

const SANDBOX_API = '/api/sandbox/start';

export function useSandbox() {
  const [sandboxId, setSandboxId] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [status, setStatus] = useState('idle'); // idle | starting | running | error
  const [error, setError] = useState(null);

  const startSandbox = useCallback(async () => {
    setStatus('starting');
    setError(null);
    try {
      const res = await fetch(SANDBOX_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      // Guard against HTML error pages (proxy unreachable, 502, etc.)
      const contentType = res.headers.get('content-type') || '';
      if (!contentType.includes('application/json')) {
        throw new Error(`Server returned an unexpected response (${res.status}). Is the backend running?`);
      }

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to start sandbox');

      setSandboxId(data.sandboxId);
      setPreviewUrl(data.previewUrl);
      setStatus('running');
    } catch (err) {
      setError(err.message);
      setStatus('error');
    }
  }, []);

  const resetSandbox = useCallback(() => {
    setSandboxId(null);
    setPreviewUrl(null);
    setStatus('idle');
    setError(null);
  }, []);

  const agentBaseUrl = sandboxId ? `http://${sandboxId}.agent.localhost` : null;

  return { sandboxId, previewUrl, agentBaseUrl, status, error, startSandbox, resetSandbox };
}

