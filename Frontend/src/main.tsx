import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { NFTProvider } from './contracts/DeVahanContext.tsx';
import { LanguageProvider } from './context/LanguageContext';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LanguageProvider>
      <NFTProvider>
        <App />
      </NFTProvider>
    </LanguageProvider>
  </StrictMode>
);
