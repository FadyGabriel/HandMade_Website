import { useParams, Link } from "react-router-dom";
import { collection, doc, getDoc, query, where, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import { useEffect, useState } from "react";
import UserNavbar from "../UserNavbar/UserNavbar";
import {motion} from 'framer-motion'
export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [vendorName, setVendorName] = useState("Unknown Vendor");
  const [vendorId, setVendorId] = useState("");
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProductAndVendor = async () => {
      try {
        // Fetch product
        const productRef = doc(db, "Products", id);
        const productSnap = await getDoc(productRef);

        if (!productSnap.exists()) {
          console.error("Product not found");
          setLoading(false);
          return;
        }

        const productData = productSnap.data();
        setProduct(productData);

        // Fetch vendor
        if (productData.vendorId) {
          setVendorId(productData.vendorId);
          const vendorRef = doc(db, "Vendors", productData.vendorId);
          const vendorSnap = await getDoc(vendorRef);

          if (vendorSnap.exists()) {
            const vendorData = vendorSnap.data();
            const fullName = `${vendorData.firstName || ""} ${vendorData.lastName || ""}`.trim();
            setVendorName(fullName || "Unknown Vendor");
          }
        }

        // Fetch feedbacks for this product
        const feedbackRef = collection(db, "Feedbacks");
        const q = query(feedbackRef, where("productId", "==", id));
        const feedbackSnapshot = await getDocs(q);
        const feedbackList = feedbackSnapshot.docs.map(doc => doc.data());
        console.log(feedbackList);
        setFeedbacks(feedbackList);
      } catch (err) {
        console.error("Error loading product, vendor, or feedbacks:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProductAndVendor();
  }, [id]);

  if (loading)
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <div className="w-12 h-12 border-4 border-[#A78074] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );

  if (!product)
    return <div className="text-center py-10 text-red-500">Product not found</div>;

  return (
    <>
      <UserNavbar />
      <div className="max-w-4xl mx-auto py-10 px-6">
        <img
          src={product.image || product.imgURL || "https://via.placeholder.com/400x300"}
          alt={product.title}
          className="w-full h-80 object-cover rounded-lg shadow"
        />
        <h1 className="text-3xl font-bold mt-6 text-[#A78074]">{product.title}</h1>
        <p className="mt-2 text-lg text-[#4b3832] font-semibold">Price: {product.price} EGP</p>
        <p className="mt-2 text-gray-600">Stock: {product.stock ?? "N/A"}</p>
        <p className="mt-2 text-gray-700">
          Vendor:{" "}
          {vendorId ? (
            <Link
              to={`/vendors/${vendorId}`}
              className="text-[#A78074] underline hover:text-[#8c6152] transition"
            >
              {vendorName}
            </Link>
          ) : (
            "Unknown Vendor"
          )}
        </p>
        <p className="mt-4 text-base text-gray-700">
          Description: {product.description || "No description available."}
        </p>

        {/* Feedback Section */}
        <div className="max-w-4xl mx-auto pt-10">
          <h2 className="text-xl font-bold text-[#4b3832] mb-4">Customer Feedback</h2>
          {feedbacks.length === 0 ? (
            <p className="text-gray-500">No feedback yet for this product.</p>
          ) : (
            <ul className="space-y-4">
             {feedbacks.map((feedback, idx) => (
  <motion.div
    key={idx}
    className="bg-white shadow-md rounded-md p-6"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3, delay: idx * 0.1 }}
  >
    <p className="text-gray-600 mb-4">"{feedback.message}"</p>
    <div className="flex items-center justify-between">
     
      <span className="text-yellow-500">
        {"★".repeat(feedback.rating)}
        {"☆".repeat(5 - feedback.rating)}
      </span>
    </div>
  </motion.div>
))}

            </ul>
          )}
        </div>
      </div>
    </>
  );
}
