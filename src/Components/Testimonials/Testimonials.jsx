import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase";
import { FaStar, FaRegStar } from "react-icons/fa";
import Navbar from "../Navbar/Navbar";

// SVG Components
const ArrowLeft = () => (
  <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#ab8677" strokeWidth="1.5">
    <path d="M15 4.5L8 12l7 7.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ArrowRight = () => (
  <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#ab8677" strokeWidth="1.5">
    <path d="M9 4.5L16 12l-7 7.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "reviews"), (snapshot) => {
      const reviewsData = snapshot.docs.map((doc) => doc.data());
      setTestimonials(reviewsData);
    });

    return () => unsubscribe(); // clean up
  }, []);

  const prev = () => setIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  const next = () => setIndex((prev) => (prev + 1) % testimonials.length);

  if (testimonials.length === 0) {
    return (
      <section className="py-16 text-center">
       <div className="flex justify-center mt-6">
    <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-b-4 border-[#A78074]"></div>
  </div>
      </section>
    );
  }

  const { id, comment, name, rating} = testimonials[index];

  return (
    <>
      <Navbar />
      <section className="relative max-w-6xl mx-auto py-16 px-4">

        <motion.h2
          className="text-5xl font-light mb-16 border-b border-[#E2DCD5] pb-4 text-[#A78074]"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Testimonials
        </motion.h2>

        <div className="min-h-[140px] px-4 text-center">
          <AnimatePresence mode="wait">
            <motion.p
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.3 }}
              className="text-3xl md:text-5xl text-gray-500 font-light leading-snug max-w-4xl mx-auto mb-10"
            >
              “{comment}”
            </motion.p>
          </AnimatePresence>
        </div>

        <motion.div
  key={id}
  initial={{ opacity: 0, y: 10 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 0.3, duration: 0.5 }}
  className="flex flex-col items-center justify-center gap-1"
>
  <p className="text-sm text-[#A78074]">
    <strong>{name}</strong>
  </p>
  <div className="flex justify-center gap-1 mt-1 text-[#ab8677]">
    {[...Array(5)].map((_, i) =>
      i < rating ? (
        <FaStar key={i} className="w-4 h-4" />
      ) : (
        <FaRegStar key={i} className="w-4 h-4" />
      )
    )}
  </div>
</motion.div>
        {/* Arrows */}
        <button
          onClick={prev}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 border border-[#ab8677] p-2 rounded-sm hover:bg-[#ab8677]/10"
          aria-label="Previous"
        >
          <ArrowLeft />
        </button>
        <button
          onClick={next}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 border border-[#ab8677] p-2 rounded-sm hover:bg-[#ab8677]/10"
          aria-label="Next"
        >
          <ArrowRight />
        </button>
      </section>
    </>
  );
};

export default Testimonials;
