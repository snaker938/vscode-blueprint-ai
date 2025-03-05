// AiSidebar/AiSidebar.tsx
import React, { useState } from 'react';
import './AiSidebar.css';
import { AiSidebarProps } from './types';

export const AiSidebar: React.FC<AiSidebarProps> = ({
  selectedElementName,
  onConvertScreenshot,
  onGenerateDesign,
  onSubmitChat,
}) => {
  const [userInput, setUserInput] = useState('');

  const handleSubmit = () => {
    if (onSubmitChat) {
      onSubmitChat(userInput);
      setUserInput('');
    }
  };

  return (
    <div className="ai-sidebar">
      <div className="ai-sidebar-header">
        <h2>Hey! How can I help?</h2>
        <p>Ask Blueprint AI anything, or try our suggested features.</p>
      </div>

      <div className="ai-sidebar-buttons">
        <button
          className="ai-sidebar-button"
          onClick={onConvertScreenshot}
          title="Convert screenshot to design"
        >
          Convert screenshot to design
        </button>
        <button
          className="ai-sidebar-button"
          onClick={onGenerateDesign}
          title="Generate design from text"
        >
          Generate design from text
        </button>
        {/* We omit the 'convert sketch to design' button per your request */}
      </div>

      {/* Wireframe placeholders to match your screenshot */}
      <div className="ai-sidebar-wireframe-large">
        <div className="ai-sidebar-wireframe-x" />
      </div>
      <div className="ai-sidebar-wireframe-medium">
        <div className="ai-sidebar-wireframe-x" />
      </div>

      <div className="ai-sidebar-input-section">
        <textarea
          className="ai-sidebar-textarea"
          placeholder="Describe your desired features..."
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
        />
        {selectedElementName && (
          <div className="ai-sidebar-reference">
            Referencing {selectedElementName}
          </div>
        )}
      </div>

      <div className="ai-sidebar-footer">
        <button className="ai-sidebar-chat-button" onClick={handleSubmit}>
          Chat with Blueprint AI...
        </button>
      </div>
    </div>
  );
};
