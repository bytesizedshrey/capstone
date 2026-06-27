import React, { useState, useEffect } from 'react';

export function FileExplorer({ agentBaseUrl, onSelectFile, selectedFile }) {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchFiles = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${agentBaseUrl}/list-files`);
      if (!res.ok) throw new Error('Failed to fetch files');
      const data = await res.json();
      setFiles(data.files || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (agentBaseUrl) {
      fetchFiles();
    }
  }, [agentBaseUrl]);

  // Transform flat file list into a simple nested structure
  const fileTree = {};
  files.forEach(file => {
    const parts = file.split('/');
    let current = fileTree;
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      if (!current[part]) {
        current[part] = i === parts.length - 1 ? file : {};
      }
      current = current[part];
    }
  });

  const renderTree = (node, depth = 0) => {
    return Object.keys(node).sort((a,b) => {
      // Directories first
      const aIsDir = typeof node[a] === 'object';
      const bIsDir = typeof node[b] === 'object';
      if (aIsDir && !bIsDir) return -1;
      if (!aIsDir && bIsDir) return 1;
      return a.localeCompare(b);
    }).map(key => {
      const isDir = typeof node[key] === 'object';
      const fullPath = isDir ? null : node[key];
      const isSelected = selectedFile === fullPath;

      return (
        <div key={key}>
          <div 
            onClick={() => {
              if (!isDir) onSelectFile(fullPath);
            }}
            style={{
              paddingLeft: `${depth * 12 + 12}px`,
              paddingTop: '6px',
              paddingBottom: '6px',
              cursor: isDir ? 'default' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              backgroundColor: isSelected ? '#ffdd57' : 'transparent',
              color: isSelected ? '#000' : '#ddd',
              fontFamily: "'Space Mono', monospace",
              fontSize: '12px',
            }}
            onMouseEnter={e => {
              if (!isSelected && !isDir) e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)';
            }}
            onMouseLeave={e => {
              if (!isSelected && !isDir) e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <span style={{ marginRight: '6px', color: isDir ? '#888' : 'inherit' }}>
              {isDir ? '📁' : '📄'}
            </span>
            {key}
          </div>
          {isDir && renderTree(node[key], depth + 1)}
        </div>
      );
    });
  };

  return (
    <div style={{
      width: '100%', height: '100%', 
      backgroundColor: '#1e1e1e', color: '#fff',
      display: 'flex', flexDirection: 'column',
      borderRight: '1px solid #333'
    }}>
      <div style={{
        padding: '12px', borderBottom: '1px solid #333',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center'
      }}>
        <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '12px', fontWeight: 'bold' }}>EXPLORER</span>
        <button 
          onClick={fetchFiles}
          style={{
            background: 'none', border: 'none', color: '#888', cursor: 'pointer',
            fontSize: '14px'
          }}
          title="Refresh"
        >
          ↻
        </button>
      </div>
      
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {loading && <div style={{ padding: '12px', color: '#888', fontSize: '12px' }}>Loading...</div>}
        {error && <div style={{ padding: '12px', color: '#ff5555', fontSize: '12px' }}>{error}</div>}
        {!loading && !error && renderTree(fileTree)}
      </div>
    </div>
  );
}
