import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// import { ThemeProvider } from './context/ThemeContext.jsx';
// import './i18n/config.js'; // your i18next setup file
// import { I18nextProvider } from 'react-i18next';
// import i18next from './i18n/config.js';


createRoot(document.getElementById('root')).render(
      // <I18nextProvider i18n={i18next}>
    // <ThemeProvider>
    <App />
  
  // </I18nextProvider>
)
