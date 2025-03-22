import React from 'react';
import CreateWithImaginationPage from './pages/CreateWithImagination/CreateWithImaginationPage';

import { initializeIcons } from '@fluentui/react';

initializeIcons();

const App: React.FC = () => {
  return <CreateWithImaginationPage />;
};

export default App;
