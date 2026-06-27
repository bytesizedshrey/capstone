import React, { useState, useEffect, useRef } from 'react';
import MonacoEditor from '@monaco-editor/react';

export function Editor({ agentBaseUrl, selectedFile }) {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  
  // Track if content has changed from the server version
  const [isDirty, setIsDirty] = useState(false);
  const editorRef = useRef(null);

  const fetchContent = async (file) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${agentBaseUrl}/read-files?files=${file}`);
      if (!res.ok) throw new Error('Failed to read file');
      const data = await res.json();
      
      const fileData = data.files.find(f => f[file] !== undefined);
      if (fileData) {
        setContent(fileData[file]);
        setIsDirty(false);
      } else {
        setError("File not found in response.");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (agentBaseUrl && selectedFile) {
      fetchContent(selectedFile);
    } else {
      setContent('');
      setIsDirty(false);
    }
  }, [agentBaseUrl, selectedFile]);

  const handleSave = async () => {
    if (!selectedFile || !isDirty || !agentBaseUrl) return;
    
    setIsSaving(true);
    try {
      const res = await fetch(`${agentBaseUrl}/update-files`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          updates: [{ file: selectedFile, content }]
        })
      });
      
      if (!res.ok) throw new Error('Failed to save file');
      setIsDirty(false);
    } catch (err) {
      alert(`Error saving file: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;
    
    // Add Cmd/Ctrl+S shortcut
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
      // We need to use the current state, but this closure captures old state.
      // So we'll trigger a custom event or use a ref. A simple trick is to click a hidden button.
      document.getElementById('editor-save-button')?.click();
    });
  };

  if (!selectedFile) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', backgroundColor: '#1e1e1e', color: '#888' }}>
        Select a file from the explorer to view its contents.
      </div>
    );
  }

  const getLanguage = (fileName) => {
    if (!fileName) return 'javascript';
    if (fileName.endsWith('.jsx') || fileName.endsWith('.js')) return 'javascript';
    if (fileName.endsWith('.css')) return 'css';
    if (fileName.endsWith('.html')) return 'html';
    if (fileName.endsWith('.json')) return 'json';
    if (fileName.endsWith('.md')) return 'markdown';
    return 'plaintext';
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%', backgroundColor: '#1e1e1e' }}>
      <div style={{ 
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '10px 16px', backgroundColor: '#2d2d2d', borderBottom: '1px solid #1e1e1e',
        color: '#fff', fontFamily: "'Space Mono', monospace", fontSize: '12px'
      }}>
        <div>
          {selectedFile} {isDirty && <span style={{ color: '#ffdd57' }}>*</span>}
        </div>
        <button 
          id="editor-save-button"
          onClick={handleSave}
          disabled={!isDirty || isSaving}
          style={{
            padding: '4px 12px',
            backgroundColor: isDirty ? '#ffdd57' : '#444',
            color: isDirty ? '#000' : '#888',
            border: 'none',
            borderRadius: '4px',
            cursor: isDirty ? 'pointer' : 'default',
            fontFamily: "'Space Mono', monospace",
            fontSize: '12px',
            fontWeight: 'bold'
          }}
        >
          {isSaving ? 'SAVING...' : 'SAVE'}
        </button>
      </div>
      
      <div style={{ flex: 1, position: 'relative' }}>
        {loading && (
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(30,30,30,0.8)', color: '#fff', zIndex: 10 }}>
            Loading file...
          </div>
        )}
        {error && !loading && (
          <div style={{ padding: '20px', color: '#ff5555' }}>
            Error: {error}
          </div>
        )}
        <MonacoEditor
          height="100%"
          language={getLanguage(selectedFile)}
          theme="vs-dark"
          value={content}
          onChange={(val) => {
            setContent(val);
            setIsDirty(true);
          }}
          onMount={handleEditorDidMount}
          options={{
            minimap: { enabled: false },
            fontSize: 13,
            wordWrap: 'on',
            scrollBeyondLastLine: false,
            padding: { top: 16 }
          }}
        />
      </div>
    </div>
  );
}
