import React, { useState } from 'react';
import { Stack, Text, Icon } from '@fluentui/react';

import AiFeaturesModal from './ExtraComponents/Modals/AiFeaturesModal';
import SelectedFeatureText from './ExtraComponents/SelectedFeature/SelectedFeatureText';
import SelectedFeatureScreenshot from './ExtraComponents/SelectedFeature/SelectedFeatureScreenshot';

const CreateWithImagination: React.FC = () => {
  const [selectedFeature, setSelectedFeature] = useState('text');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleFeatureClick = (feature: string) => {
    setSelectedFeature(feature);
  };

  return (
    <>
      <style>
        {`
          /* -------------------------------------------
             MAIN PAGE CONTAINER
          ------------------------------------------- */
          .create-with-imagination-page {
            background-color: #f5f5f5;
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
          }

          .create-with-imagination-container {
            background-color: #ffffff;
            padding: 60px;
            border-radius: 16px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
            max-width: 900px;
            width: 900px;
            margin: 40px auto;
            
          }

          /* -------------------------------------------
             HEADERS
          ------------------------------------------- */
          .header-text {
            color: #5c2d91;
            font-weight: 700;
            text-align: center;
          }
          .subheader-text {
            color: #666666;
            text-align: center;
            max-width: 600px;
          }

          /* -------------------------------------------
             SUGGESTED FEATURES
          ------------------------------------------- */
          .suggested-features {
            margin-top: 30px;
          }
          .feature-item {
            cursor: pointer;
            text-align: center;
            width: 200px;
            padding: 15px;
            border-radius: 8px;
            transition: background-color 0.2s, transform 0.2s;
          }
          .feature-item:hover {
            background-color: #f0f0f0;
            transform: translateY(-2px);
          }

          .selected-feature {
            background-color: #e8e0ff;
          }
          .selected-feature:hover {
            background-color: #e8e0ff;
          }

          /* Feature item icons */
          .feature-icon {
            font-size: 40px;
            color: #5c2d91;
            margin-bottom: 10px;
          }

          /* -------------------------------------------
             FEATURE CONTENT
          ------------------------------------------- */
          .feature-content {
            margin-top: 20px;
            width: 100%;
            max-width: 700px;
            text-align: left;
          }

          /* -------------------------------------------
             BUTTONS
          ------------------------------------------- */
          .button-container {
            margin-top: 20px;
          }
          .generate-button {
            background-color: #5c2d91;
            color: #ffffff;
            border-radius: 8px;
            padding: 10px 20px;
            font-weight: 600;
            transition: background-color 0.2s ease;
            border: none;
          }
          .generate-button:hover {
            background-color: #4b1f7d;
          }
          .generate-button-container {
            width: 100%;
            max-width: 500px;
            display: flex;
            justify-content: flex-end;
            margin-top: 10px;
          }
        `}
      </style>

      {/* Main page container */}
      <div className="create-with-imagination-page">
        <div className="create-with-imagination-container">
          <Stack tokens={{ childrenGap: 20 }} horizontalAlign="center">
            <Text variant="xxLarge" className="header-text">
              Hey! How can I help?
            </Text>

            <Text variant="mediumPlus" className="subheader-text">
              Ask Blueprint AI anything, or try our suggested features.
            </Text>

            {/* SUGGESTED FEATURES */}
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
            </Stack>

            {/* FEATURE PANELS */}
            {selectedFeature === 'text' && (
              <SelectedFeatureText openModal={openModal} />
            )}
            {selectedFeature === 'screenshot' && <SelectedFeatureScreenshot />}
          </Stack>
        </div>

        {/* AI Features Modal */}
        <AiFeaturesModal isOpen={isModalOpen} onClose={closeModal} />
      </div>
    </>
  );
};

export default CreateWithImagination;
