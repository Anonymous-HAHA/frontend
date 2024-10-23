import React from 'react';
import FooterComponent from './Footer/FooterComponent';
import { Outlet } from 'react-router-dom';

function Home() {
  return (
    <div>
      <Outlet />
      <FooterComponent />
    </div>
  );
}

export default Home;
