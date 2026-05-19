import './index.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

window.addEventListener('unhandledrejection', (event) => {
  const reason = event.reason;
  const message = typeof reason === 'string' ? reason : reason?.message;

  if (typeof message === 'string' && message.includes('Could not establish connection. Receiving end does not exist')) {
    console.warn('Suppressed non-app unhandled rejection:', reason);
    event.preventDefault();
  }
});

window.addEventListener('error', (event) => {
  if (typeof event.message === 'string' && event.message.includes('Could not establish connection. Receiving end does not exist')) {
    console.warn('Suppressed non-app script error:', event.message);
    event.preventDefault();
  }
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
