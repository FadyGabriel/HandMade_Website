import { useEffect, useState } from "react";
import { auth, db } from "../../firebase";
import {
  collection,
  query,
  where,
  onSnapshot,
} from "firebase/firestore";
import UserNavbar from "../UserNavbar/UserNavbar";
import { motion } from "framer-motion";
import UserOrderCard from "../UserOrderCard/UserOrderCard";

export default function UserOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      if (user) {
        const q = query(
          collection(db, "Orders"),
          where("userId", "==", user.uid)
        );

        const unsubscribeFirestore = onSnapshot(q, (snapshot) => {
          const orderList = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setOrders(orderList);
          setLoading(false);
        });

        return () => unsubscribeFirestore();
      } else {
        setOrders([]);
        setLoading(false);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  return (
    <>
      <UserNavbar />

      <motion.div
        className="min-h-screen bg-[#F5F5F1] px-4 py-10"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-3xl font-[Playfair_Display] text-[#A78074] text-center mb-6">
          Your Orders
        </h1>

        {loading ? (
          <div className="flex justify-center items-center mt-20">
            <div className="w-12 h-12 border-4 border-[#A78074] border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : orders.length === 0 ? (
          <p className="text-center text-gray-500">No orders found.</p>
        ) : (
          <div className="max-w-3xl mx-auto space-y-4">
            {orders.map((order, index) => (
              <UserOrderCard key={order.id} order={order} index={index} />
            ))}
          </div>
        )}
      </motion.div>
    </>
  );
}
