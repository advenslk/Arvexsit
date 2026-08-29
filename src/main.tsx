import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// The application uses hash routing internally, while production URLs are clean paths.
// Convert a direct request such as /admin or /services/vps into the same internal route.
try {
  if (!window.location.hash && window.location.pathname !== '/') {
    window.history.replaceState({}, '', `/#${window.location.pathname}${window.location.search}`);
  }
} catch {}

const cmsReady = (window as Window & { ArveXCMSReady?: Promise<unknown> }).ArveXCMSReady;

const renderApp = () => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
};

if (cmsReady && typeof cmsReady.then === 'function') cmsReady.then(renderApp).catch(renderApp);
else renderApp();
