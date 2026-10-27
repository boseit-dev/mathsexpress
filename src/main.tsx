import '@fontsource-variable/lexend/wght.css';
import '@/styles/tokens.css';
import '@/styles/global.css';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './app/App';

const rootElement = document.getElementById('root');
if (rootElement === null) {
  throw new Error('MathsExpress could not start: index.html has no #root element.');
}

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
