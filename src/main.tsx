import React from 'react';
import ReactDOM from 'react-dom/client';
import 'animal-island-ui/style';
import './styles.css';
import { App } from './App';
import { ExpansionReview } from './ExpansionReview';

const isExpansionReview = new URLSearchParams(window.location.search).get('review') === 'expansion';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>{isExpansionReview ? <ExpansionReview /> : <App />}</React.StrictMode>,
);

if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js', { updateViaCache: 'none' }).catch(() => {});
  });
}
