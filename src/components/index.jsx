import React from 'react';
import App from './App.jsx'
import { Provider } from 'mobx-react';

export default (stores) => (
  <Provider {...stores}>
    <App />
  </Provider>
)
