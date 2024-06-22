import React from 'react';
import ReactDOM from 'react-dom/client';
import Appbar from './Components/Appbar';
import Display from './Components/Display';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Appbar />
    <Display/>
  </React.StrictMode>
);
