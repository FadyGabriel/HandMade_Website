import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import logo from '../../assets/logo.png';

const customColor = '#A77F73';

const links = [
  { name: 'Home', to: '/' },
  { name: 'About', to: '/about' },
  { name: 'Service', to: '/services' },
  { name: 'Latest Product', to: '/products' },
  { name: 'Testimonials', to: '/testimonials' },
  {name: 'Our Team', to:'/team'}
];

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  return (
    <motion.nav
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="bg-white shadow-md px-4 py-3 md:px-8"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Left - Logo */}
        <div className="flex items-center space-x-2">
          <NavLink to="/">
            <img src={logo} alt="Hand Made Logo" className="w-16 h-16" />
          </NavLink>
        </div>

        {/* Center - Navigation Links */}
        <ul className="hidden md:flex space-x-6 text-gray-700 font-medium relative">
          {links.map(({ name, to }) => (
            <li key={name} className="relative pb-1">
              <NavLink
                to={to}
                className={({ isActive }) =>
                  isActive
                    ? 'text-[#A77F73] font-semibold'
                    : 'text-gray-700 hover:text-[#A77F73]'
                }
              >
                {name}
              </NavLink>

              {/* Animate underline under active link */}
              {location.pathname === to && (
                <motion.div
                  layoutId="nav-underline"
                  className="absolute left-0 -bottom-0.5 h-[2px] w-full bg-[#A77F73]"
                  transition={{ duration: 0.3 }}
                />
              )}
            </li>
          ))}
        </ul>

        {/* Right - Auth Links */}
        <div className="hidden md:flex items-center space-x-4">
          <NavLink
            to="/login"
            className={({ isActive }) =>
              isActive
                ? 'text-[#A77F73] font-semibold'
                : 'text-gray-700 hover:text-[#A77F73]'
            }
          >
            Login
          </NavLink>
          <NavLink
            to="/register"
            className="text-white px-4 py-1.5 rounded-md"
            style={{ backgroundColor: customColor }}
            onMouseEnter={(e) => (e.target.style.backgroundColor = '#90675F')}
            onMouseLeave={(e) => (e.target.style.backgroundColor = customColor)}
          >
            Register
          </NavLink>
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-gray-700"
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu - no underline for simplicity */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -10, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden mt-3 space-y-2 text-center"
          >
            {links.map(({ name, to }) => (
              <NavLink
                key={name}
                to={to}
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  isActive
                    ? 'text-[#A77F73] font-semibold block'
                    : 'text-gray-700 hover:text-[#A77F73] block'
                }
              >
                {name}
              </NavLink>
            ))}
            <NavLink
              to="/login"
              className={({ isActive }) =>
                isActive
                  ? 'text-[#A77F73] font-semibold block'
                  : 'text-gray-700 hover:text-[#A77F73] block'
              }
              onClick={() => setMenuOpen(false)}
            >
              Login
            </NavLink>
            <NavLink
              to="/register"
              className="text-white px-4 py-1.5 rounded-md inline-block"
              style={{ backgroundColor: customColor }}
              onMouseEnter={(e) => (e.target.style.backgroundColor = '#90675F')}
              onMouseLeave={(e) => (e.target.style.backgroundColor = customColor)}
              onClick={() => setMenuOpen(false)}
            >
              Register
            </NavLink>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
