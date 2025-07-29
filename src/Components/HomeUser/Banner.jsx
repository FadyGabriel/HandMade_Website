import { motion } from 'framer-motion';

export default function Banner() {
  return (
    <motion.section
      className="bg-gradient-to-r from-[#A78074] to-[#f2e3df] py-16 sm:py-20 md:py-24 text-center text-white px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
        Welcome to Our Shop
      </h1>
      <p className="text-base sm:text-lg md:text-xl max-w-2xl mx-auto text-white/90">
        Discover exclusive collections and amazing deals just for you.
      </p>
    </motion.section>
  );
}
