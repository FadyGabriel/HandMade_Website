import React from "react";
import { NavLink } from "react-router-dom";

export default function Sidebar({ navItems, open, setOpen }) {
  return (
    <div
      className={`
        fixed md:static z-50 md:z-auto top-0 left-0 h-full bg-[#F5F5F1] text-[#A78074] shadow-md w-64 p-5
        transition-transform transform md:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }
      `}
    >
      {/* Mobile Header */}
      <div className="flex justify-between items-center mb-6 md:hidden">
        <h2 className="text-2xl font-bold">Dashboard</h2>
        <button onClick={() => setOpen(false)} className="text-lg font-bold">×</button>
      </div>

      {/*  Header */}
      <h2 className="text-2xl font-bold mb-6 hidden md:block">Dashboard</h2>

      {/* Page Links */}
      <nav className="space-y-2">
        {navItems.map(({ name, path, icon }) => (
          <NavLink
            key={name}
            to={path}
            onClick={() => setOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-md transition-colors font-medium ${
                isActive
                  ? "bg-[#A78074] text-white"
                  : "hover:bg-white hover:text-[#A78074]"
              }`
            }
          >
            {icon}
            {name}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
