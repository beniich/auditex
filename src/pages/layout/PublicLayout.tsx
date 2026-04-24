import React from 'react';
import { Outlet } from 'react-router-dom';
import { PublicNavbar } from './PublicNavbar';
import { PublicFooter } from './PublicFooter';

export const PublicLayout = () => {
  return (
    <div className="min-h-screen bg-[#0a0e1a] text-white flex flex-col font-sans selection:bg-emerald-500/30">
      <PublicNavbar />
      <main className="flex-grow pt-20">
        <Outlet />
      </main>
      <PublicFooter />
    </div>
  );
};
