import React from 'react';
import ReactDOM from 'react-dom';
import App from './App/App';

ReactDOM.render(
  <React.StrictMode>
    <App 
      API_ROUTE='http://192.168.3.202:8081'/>
  </React.StrictMode>,
  document.getElementById('root')
);
