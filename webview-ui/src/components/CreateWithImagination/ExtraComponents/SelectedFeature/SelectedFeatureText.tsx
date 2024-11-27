import React from 'react';
import { Text, TextField, IconButton } from '@fluentui/react';
import './SelectedFeatureText.css';

interface SelectedFeatureTextProps {
  openModal: () => void;
}

const SelectedFeatureText: React.FC<SelectedFeatureTextProps> = ({
  openModal,
}) => {
  return (
    <>
      <div className="selected-feature-text-container">
        {/* Description Text */}
        <Text variant="mediumPlus" className="description-text" block>
          Enter a description of your website...
        </Text>

        {/* Input Box */}
        <div className="input-box-container">
          <TextField
            placeholder="Talk with Blueprint AI..."
            className="input-textbox"
            multiline
            rows={5}
          />
          <div className="input-box-icons">
            <div className="icon-button-group">
              <IconButton
                iconProps={{ iconName: 'Robot' }}
                onClick={openModal}
                className="icon-button ai-features-button"
                title="AI features"
              />

              <div className="separator-vertical" />

              <IconButton
                iconProps={{ iconName: 'Picture' }}
                onClick={() => {}}
                className="icon-button"
                title="Upload image"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SelectedFeatureText;
