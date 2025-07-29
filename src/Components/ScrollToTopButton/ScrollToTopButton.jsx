import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUp } from "lucide-react";

export default function ScrollToTopButton() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      setIsVisible(window.scrollY > 300);
    };
    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    document.getElementById("hero")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <button
          onClick={scrollToTop}
          className="cursor-pointer fixed w-14 h-14 flex items-center justify-center sm:right-6 sm:bottom-10 bottom-24 right-4  z-50 bg-[#A77F73] hover:bg-[#90675F] text-white p-3 rounded-full shadow-lg focus:outline-none"
        >
          <ArrowUp className="w-6 h-6" />
        </button>
      )}
    </AnimatePresence>
  );
}
