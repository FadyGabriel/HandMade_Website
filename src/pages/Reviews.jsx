import React, { useEffect, useState } from "react";
import PageLayout from "../Components/PageLayout/PageLayout";
import ReviewCard from "../Components/ReviewCard/ReviewCard";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import Sidebar from "../Components/Sidebar/Sidebar";
import {
  LayoutDashboard,
  Package,
  Users,
  Building,
  MessageSquare,
  AlertCircle,
  Star,
  Menu,
  LogOut,
} from "lucide-react";
import { FaShoppingCart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function Reviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const navItems = [
    { name: "Overview", path: "/admin/overview", icon: <LayoutDashboard size={20} /> },
    { name: "Products", path: "/admin/products", icon: <Package size={20} /> },
    { name: "Users", path: "/admin/users", icon: <Users size={20} /> },
    { name: "Vendor", path: "/admin/vendor", icon: <Building size={20} /> },
    { name: "Orders", path: "/admin/orders", icon: <FaShoppingCart size={20} /> },
    { name: "Feedback", path: "/admin/feedback", icon: <MessageSquare size={20} /> },
    { name: "Complaint", path: "/admin/complaint", icon: <AlertCircle size={20} /> },
    { name: "Reviews", path: "/admin/reviews", icon: <Star size={20} /> },
  ];

  const handleLogout = () => {
    // Add real auth sign-out logic here
    console.log("Logging out...");
    navigate("/login");
  };

 

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        // Fetch reviews
        const reviewSnapshot = await getDocs(collection(db, "reviews"));
        const reviewsData = reviewSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
  
        // Fetch users
        const userSnapshot = await getDocs(collection(db, "Users"));
        const userMap = {};
        userSnapshot.docs.forEach((doc) => {
          const userData = doc.data();
          userMap[doc.id] = userData.name || userData.displayName || "Unknown User";
        });
  
        // Merge user name into review
        const reviewsWithUserNames = reviewsData.map((review) => ({
          ...review,
          userName: userMap[review.userId] || "Anonymous",
        }));
  
        setReviews(reviewsWithUserNames);
      } catch (err) {
        console.error("Error fetching reviews or users:", err);
        setReviews([]);
      } finally {
        setLoading(false);
      }
    };
  
    fetchReviews();
  }, []);
  

  return (
    <div className="flex h-screen bg-[#F5F5F1] overflow-x-hidden">
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} navItems={navItems} />
      <div className="flex-1 flex flex-col overflow-auto">
        <header className="flex items-center justify-between px-4 py-3 shadow bg-white border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-[#A78074] hover:text-black"
            >
              <Menu size={24} />
            </button>
            <h1 className="text-xl font-bold text-[#A78074]">Reviews</h1>
          </div>
          <div className="flex items-center space-x-4">
            <button onClick={handleLogout} className="text-red-500 hover:text-red-700">
              <LogOut size={24} />
            </button>
          </div>
        </header>

        <PageLayout title="Reviews">
          <div className="bg-[#F5F5F1] min-h-screen px-6 py-10">
            <div className="max-w-6xl mx-auto space-y-8">
              <h2 className="text-2xl font-bold text-[#A78074] border-b pb-2">
                Customer Reviews
              </h2>

              {loading ? (
                <div className="flex justify-center py-20">
                  <div className="w-10 h-10 border-4 border-[#A78074] border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : reviews.length === 0 ? (
                <div className="text-center text-[#A78074] font-medium mt-10">
                  <p>No reviews found.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {reviews.map((r) => (
                    <ReviewCard
                    key={r.id}
                    product={r.productId || "Unknown Product"}
                    rating={r.rating || 0}
                    comment={r.comment || "No comment provided"}
                    user={r.userName}
                  />
                  ))}
                </div>
              )}
            </div>
          </div>
        </PageLayout>
      </div>
    </div>
  );
}
