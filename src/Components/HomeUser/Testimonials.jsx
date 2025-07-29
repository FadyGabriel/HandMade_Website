import { useEffect, useState } from 'react';
import { db } from '../../firebase';
import { collection, onSnapshot } from 'firebase/firestore';
import { motion } from 'framer-motion';

export default function Testimonials() {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'reviews'), (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setReviews(data);
    });

    return () => unsubscribe();
  }, []);

  return (
    <section className="py-16 px-4 max-w-4xl mx-auto">
      <h2 className="text-center text-2xl font-bold text-[#A78074] mb-8">What Our Customers Say</h2>
      
      {reviews.length === 0 ? (
        <p className="text-center text-gray-500">No reviews yet.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2">
          {reviews.map((review, i) => (
            <motion.div
              key={review.id}
              className="bg-white p-6 rounded-lg shadow-md"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: i * 0.2 }}
            >
              <p className="text-sm text-gray-600 mb-2">“{review.comment}”</p>
              <p className="font-semibold text-[#A78074]">- {review.name}</p>
            </motion.div>
          ))}
        </div>
      )}
    </section>
  );
}
