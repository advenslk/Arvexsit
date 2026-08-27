import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

const cmsReady = (window as Window & { ArveXCMSReady?: Promise<unknown> }).ArveXCMSReady;

const renderApp = () => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
};

if (cmsReady && typeof cmsReady.then === 'function') {
  cmsReady.then(renderApp).catch(renderApp);
} else {
  renderApp();
}
