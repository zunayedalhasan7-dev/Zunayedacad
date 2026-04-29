import React from 'react';
import { Outlet } from 'react-router-dom';
import DashboardSidebar from './DashboardSidebar';

export default function DashboardLayout() {
  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row min-h-screen">
        <DashboardSidebar />
        <main className="flex-grow p-4 md:p-6 lg:p-10 transition-all duration-300">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
