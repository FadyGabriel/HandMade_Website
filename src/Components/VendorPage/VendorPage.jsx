import { useParams, useNavigate, Link } from "react-router-dom";
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import { useEffect, useState } from "react";
import {
  FaEnvelope,
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaComments,
  FaWhatsapp,
  FaIdCard,
} from "react-icons/fa";
import VendorNavbar from "../VendorNavbar/VendorNavbar";
import { startChat } from "../../utils/firebaseChat";
import { motion } from "framer-motion";

export default function VendorPage() {
  const { vendorId } = useParams();
  const [vendor, setVendor] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const handleChatClick = async () => {
    const chatId = await startChat(vendorId);
    navigate(`/chat/${chatId}`);
  };

  useEffect(() => {
    const fetchVendor = async () => {
      try {
        console.log("Fetching vendor:", vendorId); // ✅ Add this
        const vendorRef = doc(db, "Vendors", vendorId);
        const vendorSnap = await getDoc(vendorRef);
        console.log("Vendor snapshot:", vendorSnap); // ✅ Add this
        if (vendorSnap.exists()) {
          setVendor(vendorSnap.data());
        } else {
          console.error("Vendor not found for ID:", vendorId);
        }
      } catch (err) {
        console.error("Failed to fetch vendor:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchVendor();
  }, [vendorId]);

  

  if (loading) return <div className="text-center py-10 text-[#A78074]">Loading vendor profile...</div>;
  if (!vendor) return <div className="text-center py-10 text-red-500">Vendor not found</div>;

  const normalizedPhone = vendor.phone?.replace(/[^\d]/g, "") || "";

  return (
    <>
      <VendorNavbar />

      {/* Hero Banner */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative bg-[#F5F5F1] py-16 px-6"
      >
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-10">
          <motion.img
            src={vendor.avatar || `https://ui-avatars.com/api/?name=${vendor.firstName}+${vendor.lastName}&background=A78074&color=fff`}
            alt="Vendor Avatar"
            className="w-40 h-40 rounded-full border-4 border-[#A78074] shadow-lg object-cover"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
          />

          <div className="text-center md:text-left">
            <h1 className="text-4xl font-bold text-[#A78074]">{vendor.firstName} {vendor.lastName}</h1>
            <p className="mt-2 text-gray-600">{vendor.bio || "No bio available."}</p>

            <div className="mt-4 space-y-2 text-gray-700 text-sm">
              <p className="flex items-center gap-2">
                <FaEnvelope className="text-[#A78074]" /> {vendor.email || "No email"}
              </p>
              <p className="flex items-center gap-2">
                <FaPhoneAlt className="text-[#A78074]" />
                {vendor.phone ? (
                  <a href={`https://wa.me/${normalizedPhone}`} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-[#25D366] hover:underline">
                    {vendor.phone} <FaWhatsapp />
                  </a>
                ) : "No phone"}
              </p>
              <p className="flex items-center gap-2">
                <FaMapMarkerAlt className="text-[#A78074]" /> {vendor.address || "No address"}
              </p>
              <p className="flex items-center gap-2">
                <FaIdCard className="text-[#A78074]" /> National ID: {vendor.nationID || "N/A"}
              </p>
            </div>

            <button
              onClick={handleChatClick}
              className="mt-6 inline-flex items-center gap-2 bg-[#A78074] hover:bg-[#8c6152] text-white px-6 py-2 rounded-full transition"
            >
              <FaComments /> Chat with Vendor
            </button>
          </div>
        </div>
      </motion.div>
    </>
  );
}
