// components/layouts/AdminLayout.jsx
import { Outlet } from 'react-router-dom';
import Sidebar from '../Sidebar/Sidebar';
import { Menu, LogOut } from "lucide-react";
import { useState } from "react";

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    console.log("Logging out...");
  };

  return (
    <div className="flex h-screen bg-[#F5F5F1]">
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
      <div className="flex-1 flex flex-col overflow-auto">
        <header className="flex items-center justify-between px-4 py-3 shadow bg-white border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <button
              className="md:hidden text-[#A78074]"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <Menu size={24} />
            </button>
            <div className="text-xl font-bold text-[#A78074]">Handmade Admin</div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 text-white bg-[#A78074] hover:bg-white hover:text-[#A78074] border border-[#A78074] px-4 py-1.5 rounded-lg transition"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </header>

        {/* Render child route here */}
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
