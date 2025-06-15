import React from 'react';
import * as ReactDOMClient from 'react-dom/client';
import { Provider } from 'react-redux';
import App from './components/app/app';
import store from './services/store';

const container = document.getElementById('root') as HTMLElement;
const root = ReactDOMClient.createRoot(container!);

// Экспорт store для Cypress тестов
if ((window as any).Cypress) {
  (window as any).store = store;
}

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);
