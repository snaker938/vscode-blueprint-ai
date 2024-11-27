import React from 'react';
import { Stack, Text, Icon, DefaultButton } from '@fluentui/react';
import { useNavigate } from 'react-router';
import './Home.css';

const Home: React.FC = () => {
  const navigate = useNavigate();

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
          <div className="card">
            <Icon iconName="Edit" className="card-icon" />
            <Text variant="large" className="card-title">
              Create with Imagination
            </Text>
            <Text variant="small" className="card-description">
              Generate a webpage by providing some references!
            </Text>
            <DefaultButton
              text="Start Creating"
              className="card-button"
              onClick={() => navigate('/create')}
            />
          </div>
        </div>
      </Stack>
    </div>
  );
};

export default Home;
