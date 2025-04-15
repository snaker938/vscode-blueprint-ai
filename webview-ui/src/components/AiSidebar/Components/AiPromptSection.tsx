import React from 'react';

interface AiPromptSectionProps {
  userInput: string;
  setUserInput: (value: string) => void;
}

export const AiPromptSection: React.FC<AiPromptSectionProps> = ({
  userInput,
  setUserInput,
}) => {
  return (
    <div
      style={{
        padding: '16px',
        borderBottom: '1px solid #eee',
      }}
    >
      <h4
        style={{
          margin: 0,
          fontSize: '1rem',
          fontWeight: 600,
          color: '#444',
        }}
      >
        AI Prompt
      </h4>
      <p style={{ margin: '6px 0', color: '#555', fontSize: '0.85rem' }}>
        Briefly describe the changes or designs you want to generate.
      </p>
      <textarea
        placeholder="Describe your desired features..."
        value={userInput}
        onChange={(e) => setUserInput(e.target.value)}
        rows={4}
        style={{
          width: '100%',
          padding: '10px',
          boxSizing: 'border-box',
          resize: 'none',
          fontSize: '0.95rem',
          fontFamily: 'inherit',
          color: '#333',
          backgroundColor: '#fff',
          border: '1px solid #ccc',
          borderRadius: '6px',
          outline: 'none',
          transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
        }}
      />
    </div>
  );
};
