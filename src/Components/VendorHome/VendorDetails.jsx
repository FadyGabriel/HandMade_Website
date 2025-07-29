import { useParams, Link } from "react-router-dom";
import { collection, doc, getDoc, query, where, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import { useEffect, useState } from "react";

import VendorNavbar from "../VendorNavbar/VendorNavbar";

export default function VendorDetails() {
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
      <VendorNavbar />
      <div className="max-w-4xl mx-auto py-10 px-6">
        <img
          src={product.image || product.imgURL || "https://via.placeholder.com/400x300"}
          alt={product.title}
          className="w-full h-80 object-cover rounded-lg shadow"
        />
        <h1 className="text-3xl font-bold mt-6 text-[#A78074]">{product.title}</h1>
        {/* <p className="mt-2 text-lg text-[#4b3832] font-semibold">Price: {product.price} EGP</p> */}
        <div className="mt-2">
              <span className="text-lg text-gray-500">Price: </span>
              <span className="line-through text-gray-500">{product.price}$</span>
              <span className="text-[#A78074] font-bold text-lg ml-2">
                ${Math.round(product.price - (product.price * product.discount) / 100)}
              </span>
        </div>
        <p className="mt-2 text-gray-600">Stock: {product.stock ?? "N/A"}</p>
        <p className="mt-2 text-gray-700">
          Vendor:{" "}
          {vendorId ? (
            <Link
              to={`/vendor/${vendorId}`}
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
              {feedbacks.map((fb, index) => (
                <li key={index} className="bg-gray-100 p-4 rounded shadow">
                  <p className="text-gray-800">{fb.message}</p>
                  <p className="text-sm text-gray-500 mt-2">Rating: {fb.rating ?? "N/A"}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </>
  );
}
