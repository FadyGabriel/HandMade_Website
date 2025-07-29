import React from "react";
import { FaFacebookF, FaInstagram, FaYoutube } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-[#A78074] text-[#F5F5F1] text-sm gap-20">
      {/* Top Footer Grid */}
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-20">
        {/* Logo and Description */}
        <div className="col-span-1 md:col-span-2 space-y-3 text-justify leading-relaxed min-w-[160px] max-w-sm">
          <h2 className="text-2xl font-serif italic text-white">Handmade</h2>
          <p className="text-sm">
            Special thanks to Midsummerstar and Oyoylivingdesign for generously
            providing us with their stunning product imagery. Kindly visit their
            website to make real purchases of their products.
          </p>
        </div>

        {/* Presets */}
        

        {/* Collections */}
        <div className="col-span-1 min-w-[160px] text-left">
          <h3 className="uppercase font-semibold mb-2 text-white">Collections</h3>
          <ul className="space-y-1">
            {["Sale", "Vases", "Bowls & Cups", "Plates", "Jewelry", "Clothing", "Accessories"].map((item) => (
              <li
                key={item}
                className="hover:text-[#F5F5F1] hover:underline cursor-pointer transition break-words"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Sale */}
        <div className="col-span-1 min-w-[160px] text-left">
          <h3 className="uppercase font-semibold mb-2 text-white">Sale</h3>
          <ul className="space-y-1">
            {["Scandinavian Savoy Vase", "Ceramic Candle-Holder", "Indian Plate"].map((item) => (
              <li
                key={item}
                className="hover:text-[#F5F5F1] hover:underline cursor-pointer transition break-words"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      
      <div className="border-t border-[#F5F5F1]/30 py-4 px-6 text-[#F5F5F1] text-sm bg-[#A78074]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row text-sm justify-between items-center space-y-3 md:space-y-0">
          <div className="text-center md:text-left leading-snug">
            &copy; {new Date().getFullYear()}{" "}
            <span className="underline hover:text-[#F5F5F1]">Handmade Team</span>
            <br />
            <span className="text-xs">Powered by React</span>
          </div>

          <div className="flex space-x-4">
            {["Home", "About", "Services","Contact"].map((link) => (
              <Link
                key={link}
                to="/"
                className="hover:text-[#F5F5F1] hover:underline transition"
              >
                {link}
              </Link>
            ))}
          </div>

          <div className="flex space-x-4 text-lg">
            <Link to="/" aria-label="Facebook" className="hover:text-[#F5F5F1]/80 transition">
              <FaFacebookF />
            </Link>
            <Link to="/" aria-label="Instagram" className="hover:text-[#F5F5F1]/80 transition">
              <FaInstagram />
            </Link>
            <a href="#" aria-label="YouTube" className="hover:text-[#F5F5F1]/80 transition">
              <FaYoutube />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
