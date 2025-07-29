import { motion } from "framer-motion";
import logo from "../../assets/logo.png"; // Replace with your logo path

export default function SplashScreen() {
  return (
    <motion.div
      className="flex items-center justify-center h-screen bg-white"
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 1 } }}
    >
      <motion.img
        src={logo}
        alt="HandMade"
        className="w-64 h-64"
        initial={{ scale: 0 }}
        animate={{ scale: 1.2 }}
        transition={{
          type: "spring",
          stiffness: 260,
          damping: 20,
          duration: 1.2,
        }}
      />
    </motion.div>
  );
}
