import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import Spinner from './components/Spinner';
import { BrowserRouter } from "react-router-dom";
import {UserProvider} from './user.context';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <BrowserRouter>
      <Suspense fallback={<Spinner />}>
        <UserProvider>
          <App />
          </UserProvider>
      </Suspense>
    </BrowserRouter>)
