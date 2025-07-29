import React from 'react';
import { motion } from 'framer-motion';
import {
  FaShippingFast,
  FaHandHoldingHeart,
  FaLeaf,
  FaTools,
  FaStar,
  FaHeadset,
} from 'react-icons/fa';
import Navbar from '../Navbar/Navbar';

const services = [
  {
    title: 'Eco-Friendly Materials',
    description:
      'We source only sustainable, ethical, and biodegradable materials to protect the planet and empower artisans.',
    icon: <FaLeaf size={32} />,
  },
  {
    title: 'Handcrafted with Love',
    description:
      'Every product is carefully handmade with attention to detail, tradition, and passion.',
    icon: <FaHandHoldingHeart size={32} />,
  },
  {
    title: 'Worldwide Delivery',
    description:
      'Delivering unique handmade treasures to your doorstep, no matter where you live.',
    icon: <FaShippingFast size={32} />,
  },
  {
    title: 'Custom Orders',
    description:
      'Get personalized products tailored to your preferences and special moments.',
    icon: <FaTools size={32} />,
  },
  {
    title: 'Premium Quality',
    description:
      'We ensure that every handmade item meets high quality standards and passes thorough inspections.',
    icon: <FaStar size={32} />,
  },
  {
    title: '24/7 Customer Support',
    description:
      'Our support team is always ready to help you with inquiries, tracking, and special requests.',
    icon: <FaHeadset size={32} />,
  },
];

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.3,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

export default function Services() {
  return (
    <>
    <Navbar></Navbar>
    <section className="bg-[#F8F1EF] py-20 px-6 font-garamond text-[#A78074]">
      <div className="max-w-7xl mx-auto">
        <motion.h2
          className="text-5xl font-light mb-16 border-b border-[#E2DCD5] pb-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Services
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          viewport={{ once: true }}
          className="text-lg text-start max-w-2xl  mb-12 text-gray-700"
        >
          At Handmade Studio, we believe in quality, sustainability, and soulful craftsmanship. Here's how we bring our values to life.
        </motion.p>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10"
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          {services.map((service, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition duration-300 border-t-4 border-[#A77F73] text-left"
            >
              <div className="text-[#A77F73] mb-4">{service.icon}</div>
              <h3 className="text-2xl font-semibold mb-3">{service.title}</h3>
              <p className="text-gray-600 text-[17px] leading-relaxed">{service.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
    </>
  );
}
