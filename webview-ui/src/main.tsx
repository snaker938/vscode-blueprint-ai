/* main.tsx (or index.tsx) */
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import App from './App';
import './global.css';

import EditingInterface from './pages/MainInterface/MainInterface';
import { BlueprintProvider } from './store/BlueprintContext';

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
    <BlueprintProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/editing" element={<EditingInterface />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </BlueprintProvider>
  );
});
