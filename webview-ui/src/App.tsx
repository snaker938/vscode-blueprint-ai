import React from 'react';
import Home from './pages/Home/Home';

import { initializeIcons } from '@fluentui/react';

const App: React.FC = () => {
  initializeIcons();
  return <Home />;
};

export default App;
