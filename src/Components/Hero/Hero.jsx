import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaHandsHelping, FaLeaf, FaTruck, FaGift } from 'react-icons/fa';
import heroImg from '../../assets/hero.jpg'; 
import aboutImage from '../../assets/about.jpg';
import Navbar from '../Navbar/Navbar';
import { useEffect, useState } from 'react';
import { collection, getDocs, query, where, limit } from 'firebase/firestore';
import { db } from '../../firebase';
import ScrollToTopButton from '../ScrollToTopButton/ScrollToTopButton';
import ContactUs from '../ContactUs/ContactUs';
const services = [
  {
    title: 'Handcrafted with Love',
    description:
      'Each product is uniquely handmade by passionate artisans using traditional techniques and ethical materials.',
    icon: <FaHandsHelping size={30} />,
  },
  {
    title: 'Eco-Friendly Materials',
    description:
      'We are committed to sustainability by using natural, biodegradable, and recyclable materials in our creations.',
    icon: <FaLeaf size={30} />,
  },
  {
    title: 'Fast & Safe Delivery',
    description:
      'We carefully pack and deliver your treasures to your doorstep with love, care, and speed.',
    icon: <FaTruck size={30} />,
  },
  {
    title: 'Gift Ready Packaging',
    description:
      'Every item comes beautifully wrapped and ready to gift, perfect for any occasion or loved one.',
    icon: <FaGift size={30} />,
  },
];




const Hero = () => {

  const [products, setProducts] = useState([]);

useEffect(() => {
  const fetchProducts = async () => {
    try {
      const q = query(
        collection(db, 'Products'),
        where('status', '==', 'approved'),
        limit(4)
      );
      const querySnapshot = await getDocs(q);
      const productList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setProducts(productList);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  fetchProducts();
}, []);
  return (
    <div>
    <Navbar />
    <section className=" py-16 px-4 md:px-10" id='hero'>
      <div className="max-w-7xl mx-auto flex flex-col-reverse md:flex-row items-center gap-10">
        {/* Text Section */}
        <motion.div
          className="md:w-1/2 text-center md:text-left"
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-[#A77F73] mb-4">
            Discover the Art of Handmade Treasures
          </h1>
          <p className="text-gray-700 text-lg md:text-xl mb-6">
            Every product tells a story. Explore unique, handcrafted pieces made with love and care by skilled artisans.
          </p>
            <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 300 }}
                >
                <Link
                    to="/login"
                    className=" w-[40%] text-center inline-block bg-[#A77F73] hover:bg-[#90675F] text-white px-6 py-3 rounded-b-xl text-lg transition"
                >
                    Shop Now
                </Link>
            </motion.div>
        </motion.div>

        {/* Animated Image Section */}
        <motion.div
          className="md:w-1/2"
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <motion.img
            src={heroImg}
            alt="Handmade Hero"
            className="w-full h-auto rounded-lg shadow-md"
            animate={{
              y: [0, -15, 0], // move up, then down
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              repeatType: 'loop',
              ease: 'easeInOut',
            }}
          />
        </motion.div>
      </div>
    </section>
    
    {/* About Us */}
    <section className="bg-[#F8F1EF] py-16 px-4 md:px-10">
    <h2 className='text-4xl md:text-5xl font-bold text-[#A77F73] mb-8 text-center'>About Us</h2>
    <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-10">
        {/* Image Section */}
        
        <motion.div
          className="md:w-1/2"
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <img
            src={aboutImage}
            alt="About Handmade"
            className="rounded-lg shadow-lg w-full h-auto object-cover"
          />
        </motion.div>

        {/* Text Section */}
        <motion.div
          className="md:w-1/2 text-center md:text-left"
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
        >
         
          <p className="text-gray-700 text-lg mb-4">
            At <span className="font-semibold text-[#A77F73]">Handmade Treasures</span>, we believe in the beauty of authenticity. Every piece in our store is crafted by skilled artisans who pour their passion and soul into each creation.
          </p>
          <p className="text-gray-600 text-base">
            From handwoven textiles to unique pottery, our mission is to celebrate craftsmanship, preserve traditions, and bring meaningful art into your everyday life. We work directly with local makers, ensuring fair trade, sustainability, and storytelling in every item.
          </p>
        </motion.div>
      </div>
    </section>
    
    {/* Services */}
     <section className="bg-white py-16 px-4 md:px-10">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.h2
          className="text-4xl md:text-5xl font-bold text-center text-[#A77F73] mb-12"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          Our Services
        </motion.h2>

        {/* Cards Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {services.map((service, index) => (
            <motion.div
              key={index}
              className="bg-[#F8F1EF] p-6 rounded-lg shadow-md text-center hover:shadow-xl transition duration-300"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              viewport={{ once: true }}
            >
              <div className="text-[#A77F73] mb-4 flex justify-center">{service.icon}</div>
              <h3 className="text-xl font-semibold text-[#A77F73] mb-2">{service.title}</h3>
              <p className="text-gray-700 text-sm">{service.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* Products */}
    <section className="bg-[#F8F1EF] py-16 px-4 md:px-10">
      <div className="max-w-7xl mx-auto">
        {/* Title */}
        <motion.h2
          className="text-4xl md:text-5xl font-bold text-center text-[#A77F73] mb-12"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          Our Handmade Products
        </motion.h2>

        {/* Grid */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              className="bg-white rounded-lg shadow-md hover:shadow-xl transition duration-300"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              viewport={{ once: true }}
            >
              <img
                src={product.imgURL}
                alt={product.title}
                className="w-full h-52 object-cover rounded-t-lg"
              />
              <div className="p-4 text-center">
                <h3 className="text-lg font-semibold text-[#A77F73]">{product.title}</h3>
                <p className="text-gray-600 mb-2">{product.price}$</p>
                <Link to="/login" className="bg-[#A77F73] hover:bg-[#90675F] text-white py-2 px-4 rounded-md text-sm transition">
                  View Details
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
        <div className='flex items-center justify-center'> 
        <Link to='/login' className="text-center w-[20%] mt-10 bg-[#A77F73] hover:bg-[#90675F] text-white py-2 px-4 rounded-md text-sm transition">View More</Link>

        </div>
        <ContactUs/>
      </div>
    </section>
    <ScrollToTopButton></ScrollToTopButton>
    </div>
  );
};

export default Hero;
 