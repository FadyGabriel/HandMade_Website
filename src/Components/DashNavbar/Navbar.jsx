import React from "react";
import { FaBars } from "react-icons/fa";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";

export default function Navbar({ setSidebarOpen }) {
  const handleLogout = async () => {
    try {
      await signOut(auth);
      // Redirect or show confirmation
      window.location.href = "/";
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-[#F5F5F1] shadow-md">
      {/* Mobile menu toggle */}
      <button
        className="text-[#A78074] md:hidden text-2xl"
        onClick={() => setSidebarOpen((prev) => !prev)}
      >
        <FaBars />
      </button>

      {/* Title or Logo */}
      <h1 className="text-xl font-semibold text-[#A78074]">Admin Panel</h1>

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="bg-[#A78074] text-white px-4 py-2 rounded hover:bg-white hover:text-[#A78074] border border-[#A78074] transition"
      >
        Logout
      </button>
    </nav>
  );
}
