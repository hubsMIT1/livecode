import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '@/components/Footer';

const Layout: React.FC = () => {
  return (
    <>
    <div className="flex flex-col justify-between min-h-[100vh]">

    <div id='MainContent'>
      <Header />
      <Outlet />
    </div>
        
      <Footer />
    </div>
    </>
  );
};

export default Layout;