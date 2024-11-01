import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home/Home';
import EditingInterface from './pages/EditingInterface/EditingInterface';
import { initializeIcons } from '@fluentui/react';

const App: React.FC = () => {
  console.log('Loading Home');
  initializeIcons();
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/editor" element={<EditingInterface />} />
      </Routes>
    </Router>
  );
};

export default App;
