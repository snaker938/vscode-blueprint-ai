import React from 'react';
import { Link } from 'react-router-dom';
import { Stack, Text, Icon, DefaultButton } from '@fluentui/react';
import './Home.css';

const Home: React.FC = () => {
  return (
    <div className="home-container">
      <Stack
        verticalAlign="center"
        horizontalAlign="center"
        styles={{ root: { minHeight: '100vh', padding: '20px' } }}
      >
        <Text variant="superLarge" className="home-title">
          Welcome to Blueprint AI
        </Text>
        <Text variant="mediumPlus" className="home-subtitle">
          Design webpages with AI-driven tools
        </Text>
        <div className="cards-container">
          <Link to="/create-with-text-page" className="card-link">
            <div className="card">
              <Icon iconName="Edit" className="card-icon" />
              <Text variant="large" className="card-title">
                Create with Text
              </Text>
              <Text variant="small" className="card-description">
                Generate a webpage by providing a text description.
              </Text>
              <DefaultButton text="Start Creating" className="card-button" />
            </div>
          </Link>
        </div>
      </Stack>
    </div>
  );
};

export default Home;
