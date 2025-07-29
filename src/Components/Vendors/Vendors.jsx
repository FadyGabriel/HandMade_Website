import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import UserNavbar from "../UserNavbar/UserNavbar";
import { useNavigate } from "react-router-dom";

export default function Vendors() {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const snapshot = await getDocs(collection(db, "Vendors"));
        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setVendors(data);
      } catch (error) {
        console.error("Failed to fetch vendors:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVendors();
  }, []);

  return (
    <>
      <UserNavbar />
      <div className="min-h-screen bg-[#F5F5F1] px-4 py-10">
        <h1 className="text-3xl font-[Playfair_Display] text-[#A78074] text-center mb-8">
          Our Vendors
        </h1>

        {loading ? (
          <div className="flex justify-center items-center">
            <div className="w-12 h-12 border-4 border-[#A78074] border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : vendors.length === 0 ? (
          <p className="text-center text-gray-500">No vendors found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {vendors.map(vendor => (
              <div
                key={vendor.id}
                className="bg-white p-6 rounded-xl shadow cursor-pointer hover:shadow-lg transition"
                onClick={() => navigate(`/vendors/${vendor.id}`)}
              >
                <h2 className="text-xl font-semibold text-[#A78074]">{vendor.displayName}</h2>
                <p className="text-sm text-gray-600 mt-1">{vendor.email}</p>
                {vendor.phone && <p className="text-sm text-gray-600">📞 {vendor.phone}</p>}
                {vendor.location && <p className="text-sm text-gray-600">📍 {vendor.location}</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
