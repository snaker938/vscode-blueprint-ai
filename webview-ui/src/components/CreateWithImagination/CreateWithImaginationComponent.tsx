import React, { useState } from 'react';
import { Stack, Text } from '@fluentui/react';

import AiFeaturesModal from './ExtraComponents/Modals/AiFeaturesModal';
import SelectedFeatureText from './ExtraComponents/SelectedFeature/SelectedFeatureText';

const CreateWithImagination: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <>
      <style>
        {`
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
        `}
      </style>

      <div className="create-with-imagination-page">
        <div className="create-with-imagination-container">
          <Stack tokens={{ childrenGap: 20 }} horizontalAlign="center">
            <Text variant="xxLarge" className="header-text">
              Hey! How can I help?
            </Text>
            <Text variant="mediumPlus" className="subheader-text">
              Ask Blueprint AI anything!
            </Text>

            {/* Display only the "text" feature by default */}
            <SelectedFeatureText openModal={openModal} />
          </Stack>
        </div>

        <AiFeaturesModal isOpen={isModalOpen} onClose={closeModal} />
      </div>
    </>
  );
};

export default CreateWithImagination;
