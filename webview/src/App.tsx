import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home/Home';
import CreateWithTextPage from './pages/CreateWithText/CreateWithText';
import EditingInterface from './pages/EditingInterface/EditingInterface';
import { initializeIcons } from '@fluentui/react';

const App: React.FC = () => {
  initializeIcons();
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create-with-text-page" element={<CreateWithTextPage />} />
        <Route path="/editing-interface" element={<EditingInterface />} />
      </Routes>
    </Router>
  );
};

export default App;
