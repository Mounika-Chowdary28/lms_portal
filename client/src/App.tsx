// src/App.tsx
import React from 'react';
import { Outlet } from '@tanstack/react-router';

const App = () => {
  return (
    <div>
      <h1>Welcome to LMS</h1>
      <hr />
      {/* This is where all the page components (Login, Register, etc.) will show */}
      <Outlet />
    </div>
  );
};

export default App;
