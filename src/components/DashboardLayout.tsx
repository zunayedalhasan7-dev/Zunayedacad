import React from 'react';
import { Outlet } from 'react-router-dom';
import DashboardSidebar from './DashboardSidebar';

export default function DashboardLayout() {
  return (
    <div className="bg-slate-50 min-h-screen text-slate-900 pt-16 relative overflow-hidden">
      {/* Background glow base */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[10%] w-[40%] h-[40%] bg-primary-50 opacity-[0.03] blur-[150px] rounded-full"></div>
        <div className="absolute bottom-[10%] left-[-10%] w-[30%] h-[50%] bg-primary-50 opacity-[0.03] blur-[150px] rounded-full"></div>
      </div>
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row min-h-[calc(100vh-64px)] relative">
        <DashboardSidebar />
        <main className="flex-grow p-4 md:p-6 lg:p-10 transition-all duration-300">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
