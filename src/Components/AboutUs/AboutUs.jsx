import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "../Navbar/Navbar";

export default function AboutPage() {
  return (
    <>
    <Navbar />
    <div className="font-garamond text-[#A78074] bg-white">
      {/* About Section */}
      <section className="max-w-6xl mx-auto py-16 px-4">
        <motion.h2
          className="text-5xl font-light mb-16 border-b border-[#E2DCD5] pb-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          About
        </motion.h2>

        <div className="md:flex md:items-start md:gap-12">
          {/* Image */}
          <motion.img
            src="https://handmade-demo-decor.myshopify.com/cdn/shop/files/Mask_group_6a109fc2-6802-464d-8a25-091da04c2897_535x.jpg?v=1663646303"
            alt="Team"
            className="w-full md:w-[380px] h-auto rounded-lg object-cover mb-10 md:mb-0"
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          />

          {/* Text */}
          <motion.div
            className="md:flex-1 space-y-6 text-[17px] leading-relaxed font-light"
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h3 className="text-4xl font-normal">Hi, We’re Handmade Studio</h3>
            <p>
              Foreseeing the trends and the desires of the man of the future, we initiated our journey
              a few years back with the sole ambition of setting new standards in quality and reliability — 
              by forging products that feel personal.
            </p>

            <div className="border-t border-[#E2DCD5] pt-6 space-y-4">
              <p>
                We’re culture-driven, and we’re obsessed with values that everyday people like you find positive.
                Studying your needs deeply, we strive to engineer products that you can feel proud of —
                to make them your companions for everyday days and hours.
              </p>

              <p>
                If there’s one thing we’ll never lose our guards on, it’s the safety and sustainability
                of our planet. This is the reason every piece made by us is 100% ethically sourced and
                responsibly produced — satisfying the planet and its people.
              </p>
            </div>

            {/* Founders */}
            <motion.div
              className="pt-6"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center space-x-2">
                <img
                  src="https://randomuser.me/api/portraits/women/45.jpg"
                  alt="Member"
                  className="w-10 h-10 rounded-full"
                />
                <img
                  src="https://randomuser.me/api/portraits/men/32.jpg"
                  alt="Member"
                  className="w-10 h-10 rounded-full"
                />
                <img
                  src="https://randomuser.me/api/portraits/women/65.jpg"
                  alt="Member"
                  className="w-10 h-10 rounded-full"
                />
              </div>
              <p className="text-sm pt-2 font-medium">
                Clara Williams, Joyce Harper, Tanya Caldwell<br />
                <span className="text-[#A78074] font-normal">The Founders of Handmade Studio</span>
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
    </>
  );
}
