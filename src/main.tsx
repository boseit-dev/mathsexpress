import '@fontsource-variable/lexend/wght.css';
import '@/styles/tokens.css';
import '@/styles/global.css';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './app/App';
import { SetupRequiredPage } from './app/pages/SetupRequiredPage';
import { createAppRouter } from './app/router';
import { readSupabaseConfig } from './config/env';
import { createAppDependencies } from './data';

const rootElement = document.getElementById('root');
if (rootElement === null) {
  throw new Error('MathsExpress could not start: index.html has no #root element.');
}

const config = readSupabaseConfig();

createRoot(rootElement).render(
  <StrictMode>
    {config ? (
      <App
        router={createAppRouter(
          createAppDependencies(config, { appOrigin: window.location.origin }),
        )}
      />
    ) : (
      <SetupRequiredPage />
    )}
  </StrictMode>,
);
