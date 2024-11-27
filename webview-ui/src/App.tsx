import React from 'react';
import Home from './pages/Home/Home';

import { initializeIcons } from '@fluentui/react';
initializeIcons();

const App: React.FC = () => {
  return <Home />;
};

export default App;
