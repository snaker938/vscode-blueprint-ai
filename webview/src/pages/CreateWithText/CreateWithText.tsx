import React from 'react';
import CreateWithText from '../../components/CreateWithText/CreateWithText';
import { Link } from 'react-router-dom';
import { PrimaryButton } from '@fluentui/react';
import './CreateWithText.css';

const CreateWithTextPage: React.FC = () => {
  return (
    <div className="create-with-text-page">
      <CreateWithText />
      <div className="button-container">
        <Link to="/editing-interface">
          <PrimaryButton text="Generate Webpage" className="generate-button" />
        </Link>
      </div>
    </div>
  );
};

export default CreateWithTextPage;
