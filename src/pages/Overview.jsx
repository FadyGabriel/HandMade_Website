import React, { useEffect, useState } from "react";
import PageLayout from "../Components/PageLayout/PageLayout";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { db } from "../firebase";
import { FaShoppingCart, FaBoxOpen, FaUser, FaStar } from "react-icons/fa";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import { motion } from "framer-motion";
import "react-circular-progressbar/dist/styles.css";
import Sidebar from "../Components/Sidebar/Sidebar";
import { LayoutDashboard, Package, Users, Building, MessageSquare, AlertCircle, Star } from "lucide-react";
import { Menu, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
// Animation variant
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

// Reusable circle chart
const CircleChart = ({ label, value, color }) => (
  <motion.div
    variants={fadeIn}
    initial="hidden"
    animate="visible"
    transition={{ duration: 0.5 }}
    className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition duration-300 flex flex-col items-center space-y-2"
  >
    <div className="w-[90px] h-[90px]">
      <CircularProgressbar
        value={Math.min(value, 100)}
        maxValue={100}
        text={`${Math.min(value, 100)}%`}
        styles={buildStyles({
          textColor: color,
          pathColor: color,
          trailColor: "#eee",
        })}
      />
    </div>
    <p className="text-[#A78074] font-semibold text-sm">{label}</p>
  </motion.div>
);

// Stat card component
const StatCard = ({ label, value, icon }) => (
  <motion.div
    variants={fadeIn}
    initial="hidden"
    animate="visible"
    transition={{ duration: 0.4 }}
    className="bg-white p-5 rounded-xl shadow flex items-center justify-between hover:shadow-lg transition"
  >
    <div>
      <h3 className="text-sm text-gray-500">{label}</h3>
      <p className="text-2xl font-bold text-[#A78074]">{value}</p>
    </div>
    <div className="bg-[#A78074] text-white p-3 rounded-full text-lg">{icon}</div>
  </motion.div>
);

export default function Overview() {
  const [stats, setStats] = useState({
    users: 0,
    vendors: 0,
    customers: 0,
    products: 0,
    orders: 0,
    reviews: 0,
  });

  const [latestReviews, setLatestReviews] = useState([]);
  const [topCustomers, setTopCustomers] = useState([]);

  useEffect(() => {
    fetchStatsAndReviews();
    fetchCustomerOrders();
  }, []);

  const fetchStatsAndReviews = async () => {
    try {
      const [usersSnap, productsSnap, ordersSnap, reviewsSnap, latestReviewSnap] = await Promise.all([
        getDocs(collection(db, "Users")),
        getDocs(collection(db, "Products")),
        getDocs(collection(db, "Orders")),
        getDocs(collection(db, "Feedbacks")),
        getDocs(query(collection(db, "Feedbacks"), orderBy("createdAt", "desc"), limit(3)))
      ]);

      let vendorCount = 0;
      let customerCount = 0;
      usersSnap.forEach((doc) => {
        const user = doc.data();
        if (user.role === "vendor") vendorCount++;
        else if (user.role === "customer") customerCount++;
      });

      const latest = latestReviewSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      setStats({
        users: usersSnap.size,
        vendors: vendorCount,
        customers: customerCount,
        products: productsSnap.size,
        orders: ordersSnap.size,
        reviews: reviewsSnap.size,
      });

      setLatestReviews(latest);
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const fetchCustomerOrders = async () => {
    try {
      const usersSnap = await getDocs(collection(db, "Users"));
      const ordersSnap = await getDocs(collection(db, "Orders"));

      const customers = {};
      usersSnap.forEach((doc) => {
        const data = doc.data();
        if (data.role === "customer") {
          customers[doc.id] = {
            name: data.displayName || "No name",
            email: data.email || "",
            orders: [],
          };
        }
      });

      ordersSnap.forEach((doc) => {
        const order = doc.data();
        const userId = order.userId;
        if (customers[userId]) {
          customers[userId].orders.push({
            total: order.total || 0,
            createdAt: order.createdAt?.toDate?.() || new Date(0),
          });
        }
      });

      const rankedCustomers = Object.entries(customers)
        .map(([id, data]) => {
          const totalSpent = data.orders.reduce((sum, o) => sum + o.total, 0);
          const lastPurchase = data.orders.map((o) => o.createdAt).sort((a, b) => b - a)[0];

          return {
            id,
            name: data.displayName,
            email: data.email,
            orderCount: data.orders.length,
            totalSpent,
            lastPurchase: lastPurchase ? lastPurchase.toLocaleDateString() : "—",
          };
        })
        .filter((c) => c.orderCount > 0)
        .sort((a, b) => b.totalSpent - a.totalSpent)
        .slice(0, 5);

      setTopCustomers(rankedCustomers);
    } catch (err) {
      console.error("Error fetching customer orders", err);
    }
  };

  const [sidebarOpen, setSidebarOpen] = useState(false);
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
  const navigate = useNavigate();
  const handleLogout = () => {
    // Add your logout logic here
    navigate("/login");
    console.log("Logging out...");
  };
  return (
    <>
    <div className="flex h-screen bg-[#F5F5F1] ">
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} navItems={navItems} />
    <div className="flex-1 flex flex-col overflow-auto">
    <header className="flex items-center justify-between px-4 py-3 shadow bg-white border-b border-gray-200">
          <div className="flex items-center space-x-4">
            {/* Hamburger for mobile */}
            <button
              className="md:hidden text-[#A78074]"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <Menu size={24} />
            </button>

            {/* Logo */}
            <div className="text-xl font-bold text-[#A78074]">
              Handmade Admin
            </div>
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 text-white bg-[#A78074] hover:bg-white hover:text-[#A78074] border border-[#A78074] px-4 py-1.5 rounded-lg transition"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </header>
      <PageLayout title="Dashboard Overview">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard label="Total Orders" value={stats.orders} icon={<FaShoppingCart />} />
        <StatCard label="Products" value={stats.products} icon={<FaBoxOpen />} />
        <StatCard label="Users" value={stats.users} icon={<FaUser />} />
        <StatCard label="Reviews" value={stats.reviews} icon={<FaStar />} />
      </div>

      {/* Circular Progress */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-12">
        <CircleChart label="Orders" value={stats.orders} color="#4CAF50" />
        <CircleChart label="Customers" value={stats.customers} color="#2196F3" />
        <CircleChart label="Vendors" value={stats.vendors} color="#FF9800" />
      </div>

      {/* Latest Reviews */}
      <section className="bg-[#F5F5F1] p-6 rounded-2xl shadow mb-10">
        <h2 className="text-2xl font-semibold text-[#A78074] mb-6 border-b pb-2">Latest Reviews</h2>
        {latestReviews.length === 0 && (
          <p className="text-center text-[#A78074] italic">Loading reviews </p>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {latestReviews.map((review, i) => (
            <motion.div
              key={review.id || i}
              variants={fadeIn}
              initial="hidden"
              animate="visible"
              transition={{ delay: i * 0.1 }}
              className="bg-white p-4 rounded-xl shadow-sm border hover:shadow-md"
            >
              <h3 className="text-lg font-semibold text-[#A78074] mb-1">
                {review.productId || "Unnamed Product"}
              </h3>
              <p className="text-sm text-gray-500 mb-2">User ID: {review.userId || "Unknown"}</p>
              <div className="flex mb-3">
                {Array.from({ length: review.rating || 0 }).map((_, i) => (
                  <FaStar key={i} className="text-yellow-400 mr-1" />
                ))}
              </div>
              <p className="text-gray-700 text-sm italic">"{review.message || 'No comment'}"</p>
              <p className="text-xs text-gray-400 text-right mt-2">
                {review.createdAt?.toDate?.().toLocaleString() || ""}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Top Customers */}
      <motion.section
        variants={fadeIn}
        initial="hidden"
        animate="visible"
        transition={{ duration: 0.4 }}
        className="bg-[#F5F5F1] p-6 rounded-2xl shadow"
      >
        <h2 className="text-2xl font-semibold text-[#A78074] mb-6 border-b pb-2">Top Customers</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto rounded-xl overflow-hidden text-[#444]">
            <thead className="bg-[#A78074] text-white">
              <tr>
                <th className="p-3 text-left">Email</th>
                <th className="p-3 text-left">Orders</th>
                <th className="p-3 text-left">Total Spent</th>
                <th className="p-3 text-left">Last Purchase</th>
              </tr>
            </thead>
            <tbody>
              {topCustomers.map((cust, idx) => (
                <tr
                  key={cust.id}
                  className={`${idx % 2 === 0 ? "bg-white" : "bg-[#f9f9f7]"} hover:bg-[#ecebe7] transition`}
                >
                  <td className="p-3">{cust.email}</td>
                  <td className="p-3">{cust.orderCount}</td>
                  <td className="p-3">${cust.totalSpent.toFixed(2)}</td>
                  <td className="p-3">{cust.lastPurchase}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.section>
    </PageLayout>
    </div>
    </div>
    </>
  );
}
