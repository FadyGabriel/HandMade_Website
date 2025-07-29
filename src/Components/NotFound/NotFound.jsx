import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#A77F73] p-6">
      <motion.h1
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="text-[8rem] font-extrabold text-white drop-shadow-lg"
      >
        404
      </motion.h1>

      <motion.p
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-2xl md:text-3xl font-semibold text-white text-center"
      >
        Oops! Page not found
      </motion.p>

      <motion.p
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-center mt-2 text-white max-w-md"
      >
        The page you're looking for doesn't exist or has been moved.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="mt-6"
      >
        <Link
          to="/"
          className="px-6 py-3 bg-white text-[#A77F73] rounded-full shadow hover:bg-purple-700 transition"
        >
          Go Home
        </Link>
      </motion.div>

      
    </div>
  );
}
