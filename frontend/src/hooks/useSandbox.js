// Hook to manage the sandbox lifecycle
import { useState, useCallback, useEffect } from 'react';

export function useSandbox() {
  const [sandboxId, setSandboxId] = useState(null);
  const [projectId, setProjectId] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [status, setStatus] = useState('idle'); // idle | starting | running | error
  const [error, setError] = useState(null);
  const [projects, setProjects] = useState(null);

  // Load existing projects using GET /api/sandbox/projects
  const loadProjects = useCallback(async () => {
    try {
      const res = await fetch('/api/sandbox/projects', {
        method: 'GET',
        credentials: 'include'
      });
      if (res.ok) {
        const data = await res.json();
        setProjects(data.projects || []);
      }
    } catch (err) {
      console.error('Failed to load projects:', err);
    }
  }, []);

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  const startSandbox = useCallback(async (title = 'New Project') => {
    setStatus('starting');
    setError(null);
    try {
      // 1. Create the project via POST /api/sandbox/project
      const projectRes = await fetch('/api/sandbox/project', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ title }),
      });

      const projectContentType = projectRes.headers.get('content-type') || '';
      if (!projectContentType.includes('application/json')) {
        throw new Error(`Server returned an unexpected response (${projectRes.status}). Is the backend running?`);
      }

      const projectData = await projectRes.json();
      if (!projectRes.ok) throw new Error(projectData.error || 'Failed to create project');
      
      // Extract projectId exactly as returned by the backend
      const newProjectId = projectData.project?._id;
      if (!newProjectId) throw new Error('Backend did not return a valid project ID');
      setProjectId(newProjectId);

      // 2. Start the Sandbox via POST /api/sandbox/start
      const sandboxRes = await fetch('/api/sandbox/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ projectId: newProjectId }),
      });

      const sandboxData = await sandboxRes.json();
      if (!sandboxRes.ok) throw new Error(sandboxData.error || 'Failed to start sandbox');

      setSandboxId(sandboxData.sandboxId);
      setPreviewUrl(sandboxData.previewUrl);
      setStatus('running');
      
      // Reload projects list after creating a new one
      loadProjects();
    } catch (err) {
      setError(err.message);
      setStatus('error');
    }
  }, [loadProjects]);

  const resetSandbox = useCallback(() => {
    setSandboxId(null);
    setProjectId(null);
    setPreviewUrl(null);
    setStatus('idle');
    setError(null);
  }, []);

  const agentBaseUrl = sandboxId ? `http://${sandboxId}.agent.localhost` : null;

  return { 
    sandboxId, 
    projectId, 
    previewUrl, 
    agentBaseUrl, 
    status, 
    error, 
    projects,
    startSandbox, 
    resetSandbox,
    loadProjects
  };
}
