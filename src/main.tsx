import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
// The project's Tailwind / global styles are in `src/index.css`.
// Import that instead of the missing `./styles/globals.css` so the UI
// receives the Tailwind + theme styles at runtime.
import './index.css'

// Ensure proper error handling for the entire app
const root = document.getElementById('root');

if (!root) {
  throw new Error('Root element not found');
}

try {
  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
} catch (error) {
  console.error('Failed to mount application:', error);
  
  // Fallback error display
  root.innerHTML = `
    <div style="
      min-height: 100vh; 
      display: flex; 
      align-items: center; 
      justify-content: center; 
      font-family: system-ui, sans-serif;
      background: #f9fafb;
      padding: 20px;
    ">
      <div style="
        max-width: 500px; 
        text-align: center; 
        padding: 2rem; 
        background: white; 
        border-radius: 8px; 
        box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
      ">
        <h1 style="color: #dc2626; margin-bottom: 1rem;">PC Builder - Loading Error</h1>
        <p style="color: #6b7280; margin-bottom: 1.5rem;">
          The application failed to load. This might be due to a build configuration issue.
        </p>
        <button 
          onclick="window.location.reload()" 
          style="
            background: #030213; 
            color: white; 
            padding: 0.5rem 1rem; 
            border: none; 
            border-radius: 4px; 
            cursor: pointer;
          "
        >
          Reload Page
        </button>
        <p style="font-size: 0.875rem; color: #9ca3af; margin-top: 1rem;">
          The app works in demo mode without any setup required.
        </p>
      </div>
    </div>
  `;
}