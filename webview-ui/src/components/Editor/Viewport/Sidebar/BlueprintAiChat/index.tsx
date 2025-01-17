import React from 'react';
import styled from 'styled-components';

const ChatContainer = styled.div`
  width: 100%;
  height: 100%;
  background-color: #ffffff;
  padding: 16px;
  overflow: auto;
`;

const Title = styled.h2`
  margin: 0 0 10px;
  font-size: 16px;
  color: #333;
`;

export const BlueprintAiChat: React.FC = () => {
  return (
    <ChatContainer>
      <Title>Blueprint AI</Title>
      {/* Future chat UI can go here */}
    </ChatContainer>
  );
};
