import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";
import VendorNavbar from "../VendorNavbar/VendorNavbar";
import { motion } from "framer-motion";

export default function UserOrderDetails() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) {
        console.error("No orderId found in route params");
        navigate("/orders");
        return;
      }

      try {
        const docRef = doc(db, "Orders", orderId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setOrder({ id: docSnap.id, ...docSnap.data() });
        } else {
          console.warn("Order not found");
        }
      } catch (error) {
        console.error("Failed to fetch order:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId, navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-[#A78074] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center mt-20 text-red-600 text-lg font-semibold">
        Order not found.
      </div>
    );
  }

  return (
    <>
      <VendorNavbar />
      <motion.div
        className="max-w-4xl mx-auto mt-10 px-4"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-2xl font-bold text-[#A78074] mb-4">Order Details</h2>
        <div className="bg-white shadow-md p-6 rounded-lg">
          <p className="mb-2">
            <strong>Order ID:</strong> {order.id}
          </p>
          <p className="mb-2">
            <strong>Total Amount:</strong> {order.total} EGP
          </p>
          <p className="mb-4">
            <strong>Ordered At:</strong>{" "}
            {order.createdAt?.toDate().toLocaleString()}
          </p>

          <h3 className="text-xl font-semibold mb-2">Items:</h3>
          {order.cartItems?.map((item, index) => (
            <motion.div
              key={index}
              className="border-b py-3 flex items-center gap-4"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <img
                src={item.imgURL}
                alt={item.title}
                className="w-16 h-16 object-cover rounded"
              />
              <div>
                <p className="font-medium">{item.title}</p>
                <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                <p className="text-sm text-gray-600">Price: {item.price} EGP</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </>
  );
}
