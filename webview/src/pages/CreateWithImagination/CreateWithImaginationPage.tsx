import React from 'react';
import CreateWithImagination from '../../components/CreateWithImagination/CreateWithImaginationComponent';
import { Link } from 'react-router-dom';
import { PrimaryButton } from '@fluentui/react';
import './CreateWithImaginationPage.css';

const CreateWithImaginationPage: React.FC = () => {
  return (
    <div className="create-with-imagination-page">
      <CreateWithImagination />
      <div className="generate-button-container">
        <PrimaryButton className="generate-button" text="Generate Webpage" />
      </div>
    </div>
  );
};

export default CreateWithImaginationPage;
