import { useSandbox } from './hooks/useSandbox.js';
import { useAIChat } from './hooks/useAIChat.js';
import { LandingScreen } from './components/LandingScreen.jsx';
import { SandboxWorkspace } from './components/SandboxWorkspace.jsx';

function App() {
  const { sandboxId, previewUrl, agentBaseUrl, status, error, startSandbox } = useSandbox();
  const { messages, isStreaming, sendMessage, stopStreaming } = useAIChat(sandboxId);

  // Show workspace once sandbox is running
  if (status === 'running' && sandboxId) {
    return (
      <SandboxWorkspace
        sandboxId={sandboxId}
        previewUrl={previewUrl}
        agentBaseUrl={agentBaseUrl}
        messages={messages}
        isStreaming={isStreaming}
        onSendMessage={sendMessage}
        onStop={stopStreaming}
      />
    );
  }

  return (
    <LandingScreen
      onStart={startSandbox}
      status={status}
      error={error}
    />
  );
}

export default App;
