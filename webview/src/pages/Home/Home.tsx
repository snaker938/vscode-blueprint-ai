import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css'; // Optional: styles for the Home page

const Home: React.FC = () => {
  return (
    <div className="home-container">
      <h1>Welcome to Blueprint AI</h1>
      <p>Create AI-powered UI layouts easily.</p>
      {/* <Link to="/editor">
        <button className="start-button">Start Designing</button>
      </Link> */}
    </div>
  );
};

export default Home;
