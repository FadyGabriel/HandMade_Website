import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';
import { motion } from 'framer-motion';

export default function SpecialOffers() {
  const [offers, setOffers] = useState([]);

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'Products'));
        const offerProducts = querySnapshot.docs
          .map(doc => ({ id: doc.id, ...doc.data() }))
          console.log(offerProducts);
        setOffers(offerProducts.slice(0, 3));
      } catch (error) {
        console.error('Error fetching offers:', error);
      }
    };

    fetchOffers();
  }, []);

  return (
    <section className="py-14 px-6 bg-[#A78074] text-white text-center mt-10">
      <motion.h2
        className="text-4xl font-bold mb-4"
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        🎉 Special Offers
      </motion.h2>
      <p className="mb-10 text-lg">Don’t miss out on our limited-time discounts!</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {offers.map((product, index) => (
          <motion.div
            key={product.id}
            className="bg-white rounded-2xl text-gray-800 p-4 shadow-lg"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.2, duration: 0.5 }}
          >
            <img
              src={product.imgURL}
              alt={product.title}
              className="w-full h-48 object-cover rounded-xl mb-4"
            />
            <h3 className="text-xl font-semibold">{product.title}</h3>
            <div className="mt-2">
              <span className="line-through text-gray-500">${product.price}</span>
              <span className="text-[#A78074] font-bold text-lg ml-2">
                ${Math.round(product.price - (product.price * product.discount) / 100)}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
