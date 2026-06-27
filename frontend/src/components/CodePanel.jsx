import React, { useState, useCallback } from 'react';
import { FileExplorer } from './FileExplorer.jsx';
import { Editor } from './Editor.jsx';
import { ResizableDivider } from './ResizableDivider.jsx';

export function CodePanel({ agentBaseUrl }) {
  const [explorerWidthPx, setExplorerWidthPx] = useState(250);
  const [selectedFile, setSelectedFile] = useState(null);

  const handleHorizontalResize = useCallback((delta) => {
    setExplorerWidthPx(prev => Math.max(150, Math.min(500, prev + delta)));
  }, []);

  return (
    <div style={{ display: 'flex', width: '100%', height: '100%', backgroundColor: '#1e1e1e' }}>
      <div style={{ width: explorerWidthPx, flexShrink: 0 }}>
        <FileExplorer 
          agentBaseUrl={agentBaseUrl} 
          selectedFile={selectedFile}
          onSelectFile={setSelectedFile}
        />
      </div>
      <ResizableDivider onResize={handleHorizontalResize} orientation="vertical" />
      <div style={{ flex: 1, overflow: 'hidden' }}>
        <Editor 
          agentBaseUrl={agentBaseUrl}
          selectedFile={selectedFile}
        />
      </div>
    </div>
  );
}
