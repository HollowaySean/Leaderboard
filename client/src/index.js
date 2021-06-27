import React from 'react';
import ReactDOM from 'react-dom';
import App from './App/App';
import env from "react-dotenv";

ReactDOM.render(
  <React.StrictMode>
    <App />
    <p>Using port: {env.PORT}</p>
  </React.StrictMode>,
  document.getElementById('root')
);
