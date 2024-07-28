import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import router from './router';
import './index.css'
import './global.css'
import { ThemeProvider } from './components/ThemeProvider';
import 'react-toastify/dist/ReactToastify.css';
import { RecoilRoot } from 'recoil';

ReactDOM.createRoot(document.getElementById('root')!).render(

  <React.StrictMode>
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
    <RecoilRoot>
      <RouterProvider router={router} />
    </RecoilRoot>
    </ThemeProvider>
  </React.StrictMode>
  
);