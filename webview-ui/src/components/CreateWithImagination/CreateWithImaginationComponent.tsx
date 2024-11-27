import React, { useState } from 'react';
import { Stack, Text, Icon } from '@fluentui/react';

import AiFeaturesModal from './ExtraComponents/Modals/AiFeaturesModal';
import SelectedFeatureText from './ExtraComponents/SelectedFeature/SelectedFeatureText';
import SelectedFeatureScreenshot from './ExtraComponents/SelectedFeature/SelectedFeatureScreenshot';

import './CreateWithImaginationComponent.css';
// import SelectedFeatureSketch from './ExtraComponents/SelectedFeature/SelectedFeatureSketch';

const CreateWithImagination: React.FC = () => {
  const [selectedFeature, setSelectedFeature] = useState('text');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleFeatureClick = (feature: string) => {
    setSelectedFeature(feature);
  };

  return (
    <div className="create-with-imagination-container">
      <Stack tokens={{ childrenGap: 20 }} horizontalAlign="center">
        <Text variant="xxLarge" className="header-text">
          Hey! How can I help?
        </Text>
        <Text variant="mediumPlus" className="subheader-text">
          Ask Blueprint AI anything, or try our suggested features.
        </Text>

        {/* Suggested Features */}
        <Stack
          horizontal
          tokens={{ childrenGap: 20 }}
          className="suggested-features"
        >
          <Stack
            horizontalAlign="center"
            className={`feature-item ${
              selectedFeature === 'screenshot' ? 'selected-feature' : ''
            }`}
            onClick={() => handleFeatureClick('screenshot')}
          >
            <Icon iconName="Camera" className="feature-icon" />
            <Text>Convert a screenshot to a design</Text>
          </Stack>
          <Stack
            horizontalAlign="center"
            className={`feature-item ${
              selectedFeature === 'text' ? 'selected-feature' : ''
            }`}
            onClick={() => handleFeatureClick('text')}
          >
            <Icon iconName="TextField" className="feature-icon" />
            <Text>Generate a design from text</Text>
          </Stack>
          <Stack
            horizontalAlign="center"
            className={`feature-item ${
              selectedFeature === 'sketch' ? 'selected-feature' : ''
            }`}
            onClick={() => handleFeatureClick('sketch')}
          >
            <Icon iconName="Design" className="feature-icon" />
            <Text>Convert a sketch to a design</Text>
          </Stack>
        </Stack>

        <div style={{ marginTop: '40px' }}></div>

        {selectedFeature === 'text' && (
          <SelectedFeatureText openModal={openModal} />
        )}

        {selectedFeature === 'screenshot' && <SelectedFeatureScreenshot />}

        {/* {selectedFeature === 'sketch' && <SelectedFeatureSketch />} */}
      </Stack>
      <AiFeaturesModal isOpen={isModalOpen} onClose={closeModal} />
    </div>
  );
};

export default CreateWithImagination;
