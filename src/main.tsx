import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Prevent the repository's legacy demo account from ever being restored.
// The authenticated server session is the only trusted source of user identity.
try { localStorage.setItem('arvex_saas_v3_user', 'null'); } catch {}

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
