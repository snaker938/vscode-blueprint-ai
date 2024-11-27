import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import App from './App';

import CreateWithImaginationPage from './pages/CreateWithImagination/CreateWithImaginationPage';

document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('root');
  if (!container) {
    console.error(
      'Root container not found. DOM content:',
      document.body.innerHTML
    );
    throw new Error('Root container missing in the DOM');
  }

  const root = createRoot(container);

  root.render(
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/create" element={<CreateWithImaginationPage />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
});
