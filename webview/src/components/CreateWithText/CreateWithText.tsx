import React from 'react';
import { TextField, Stack, Text } from '@fluentui/react';
import './CreateWithText.css';

const CreateWithText: React.FC = () => {
  return (
    <div className="create-with-text-container">
      <Stack tokens={{ childrenGap: 15 }} horizontalAlign="center">
        <Text variant="xxLarge" className="header-text">
          Hey! How can I help?
        </Text>
        <Text variant="mediumPlus" className="subheader-text">
          Ask Blueprint AI anything, or try our suggested features.
        </Text>
        <TextField
          placeholder="Describe your webpage"
          className="input-textbox"
          multiline
          rows={5}
        />
      </Stack>
    </div>
  );
};

export default CreateWithText;
