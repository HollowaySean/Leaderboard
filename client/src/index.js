import React from 'react';
import ReactDOM from 'react-dom';
import App from './App/App';

ReactDOM.render(
  <React.StrictMode>
    <App 
      API_ROUTE='http://localhost:8081/api'
    />
  </React.StrictMode>,
  document.getElementById('root')
);
