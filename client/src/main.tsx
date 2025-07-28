// src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

import { router } from './routes/router';
import RouterProvider from './routes/RouterProvider';
import { AuthProvider } from './context/AuthContext';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>
);
