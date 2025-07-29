import React, { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import PageLayout from "../Components/PageLayout/PageLayout";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import Sidebar from "../Components/Sidebar/Sidebar";
import { LayoutDashboard, Package, Users, Building, MessageSquare, AlertCircle, Star } from "lucide-react";
import { Menu, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { FaShoppingCart } from "react-icons/fa";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [paymentFilter, setPaymentFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isTableOpen, setIsTableOpen] = useState(true);
  const [statusFilter, setStatusFilter] = useState("All");

  const itemsPerPage = 5;

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const snapshot = await getDocs(collection(db, "Orders"));
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setOrders(data);
        setFilteredOrders(data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  useEffect(() => {
    let filtered = orders;

    if (paymentFilter !== "All") {
      filtered = filtered.filter(
        (order) => order.paymentMethod === paymentFilter
      );
    }
    if (statusFilter !== "All") {
      filtered = filtered.filter(
        (order) => order.status === statusFilter
      );
    }

    if (searchTerm.trim() !== "") {
      filtered = filtered.filter((order) => {
        const term = searchTerm.toLowerCase();
        return (
          order.customerName?.toLowerCase().includes(term) ||
          order.email?.toLowerCase().includes(term) ||
          order.paymentMethod?.toLowerCase().includes(term)
        );
      });
    }

    setFilteredOrders(filtered);
    setCurrentPage(1);
  }, [paymentFilter, searchTerm, orders, statusFilter]);

  const parseDate = (date) =>
    new Date(date?.toDate ? date.toDate() : date);

  const isToday = (date) => {
    const d = parseDate(date);
    const now = new Date();
    return d.toDateString() === now.toDateString();
  };

  const isYesterday = (date) => {
    const d = parseDate(date);
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return d.toDateString() === yesterday.toDateString();
  };

  const todayOrders = orders.filter((order) =>
    isToday(order.createdAt)
  );
  const yesterdayOrders = orders.filter((order) =>
    isYesterday(order.createdAt)
  );

  const todayRevenue = todayOrders.reduce(
    (sum, o) => sum + (o.total || 0),
    0
  );
  const yesterdayRevenue = yesterdayOrders.reduce(
    (sum, o) => sum + (o.total || 0),
    0
  );

  const generateHourlyRevenue = (orders, label) => {
    const hours = Array.from({ length: 24 }, (_, i) => ({
      hour: `${i}:00`,
      [label]: 0,
    }));

    orders.forEach((order) => {
      const date = parseDate(order.createdAt);
      const hour = date.getHours();
      hours[hour][label] += order.total || 0;
    });

    return hours;
  };

  const todayHourly = generateHourlyRevenue(todayOrders, "Today");
  const yesterdayHourly = generateHourlyRevenue(
    yesterdayOrders,
    "Yesterday"
  );
  const chartData = todayHourly.map((item, i) => ({
    hour: item.hour,
    Today: item.Today,
    Yesterday: yesterdayHourly[i]?.Yesterday || 0,
  }));

  const totalCustomers = new Set(
    orders.map((o) => o.customerName)
  ).size;
  const totalRevenue = orders.reduce(
    (sum, o) => sum + (o.total || 0),
    0
  );

  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

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
<div className="flex h-screen bg-[#F5F5F1]">
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
    <PageLayout title="Orders">
      <div className="p-6 space-y-6">

        {/* Revenue Chart */}
        <div className="bg-white p-6 rounded-2xl shadow border">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-3xl font-bold text-[#A78074]">
                ${todayRevenue.toFixed(2)}
              </h2>
              <p className="text-sm text-gray-500">
                Yesterday: ${yesterdayRevenue.toFixed(2)}
              </p>
            </div>
          </div>
          <div className="mt-6 w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorToday" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#A78074" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#A78074" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorYesterday" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ccc" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#ccc" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="hour" stroke="#A78074" />
                <YAxis stroke="#A78074" />
                <CartesianGrid strokeDasharray="3 3" />
                <Tooltip />
                <Area type="monotone" dataKey="Today" stroke="#A78074" fill="url(#colorToday)" />
                <Area type="monotone" dataKey="Yesterday" stroke="#999" fill="url(#colorYesterday)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { label: "Customers", value: totalCustomers },
            { label: "Orders", value: orders.length },
            { label: "Revenue", value: `$${totalRevenue.toFixed(2)}` },
          ].map((card) => (
            <div key={card.label} className="bg-white p-4 rounded-2xl shadow border">
              <p className="text-gray-500">{card.label}</p>
              <h2 className="text-2xl font-bold text-[#A78074]">{card.value}</h2>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap justify-between gap-4">
          <div className="flex gap-2 items-center">
            <h2
              className="text-xl font-semibold text-[#A78074] cursor-pointer"
              onClick={() => setIsTableOpen(!isTableOpen)}
            >
              Orders Table {isTableOpen ? "▲" : "▼"}
            </h2>
            <select
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
              className="border border-[#A78074] text-[#A78074] px-3 py-2 rounded-md shadow-sm"
            >
              {["All", "Paypal", "Cash", "Visa"].map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
             <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-[#A78074] text-[#A78074] px-3 py-2 rounded-md shadow-sm"
            >
              {["All", "Pending", "On the way", "Completed"].map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
          </div>
          <input
            type="text"
            placeholder="Search by name, email, or payment method..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border border-[#A78074] px-3 py-2 rounded-md shadow-sm w-full max-w-sm"
          />
        </div>

        {/* Table */}
        {isTableOpen && (
          <div className="overflow-x-auto rounded-xl shadow border">
            {loading ? (
              <p className="p-4 text-gray-500">Loading...</p>
            ) : paginatedOrders.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                No matching orders found.
              </div>
            ) : (
              <table className="min-w-full bg-white text-sm text-left">
                <thead className="bg-[#A78074] text-white">
                  <tr>
                    {["Order ID", "Products", "Quantity", "Total", "Payment", "Customer", "Email", "Date", "Status"].map((header) => (
                      <th key={header} className="px-4 py-3">{header}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="text-[#A78074]">
                  {paginatedOrders.map((order) => (
                    <tr key={order.id} className="border-b hover:bg-[#fefdfc] transition">
                      <td className="px-4 py-2">{order.id}</td>
                      <td className="px-4 py-2">{order.cartItems?.map((item) => item.title).join(", ")}</td>
                      <td className="px-4 py-2">{order.cartItems?.reduce((sum, item) => sum + (item.quantity || 0), 0)}</td>
                      <td className="px-4 py-2 font-semibold">${order.total?.toFixed(2) || "0.00"}</td>
                      <td className="px-4 py-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          order.paymentMethod === "Paypal" ? "bg-blue-100 text-blue-700" :
                          order.paymentMethod === "Cash" ? "bg-green-100 text-green-700" :
                          order.paymentMethod === "Visa" ? "bg-purple-100 text-purple-700" :
                          "bg-gray-100 text-gray-700"
                        }`}>
                          {order.paymentMethod}
                        </span>
                      </td>
                      <td className="px-4 py-2">{order.customerName || "—"}</td>
                      <td className="px-4 py-2">{order.email}</td>
                      <td className="px-4 py-2">{parseDate(order.createdAt).toLocaleString()}</td>
                      <td className="px-4 py-2">
                        <select
                          value={order.status || "Pending"}
                          onChange={async (e) => {
                            const newStatus = e.target.value;
                            const orderRef = doc(db, "Orders", order.id);
                            await updateDoc(orderRef, { status: newStatus });
                            setOrders((prev) =>
                              prev.map((o) =>
                                o.id === order.id ? { ...o, status: newStatus } : o
                              )
                            );
                          }}
                          className={`text-xs font-semibold px-3 py-1 rounded-md border ${
                            order.status === "Completed"
                              ? "bg-green-100 text-green-700"
                              : order.status === "On the way"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          <option value="Pending">Pending</option>
                          <option value="On the way">On the way</option>
                          <option value="Completed">Completed</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {/* Pagination */}
            <div className="flex justify-between items-center p-4">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded bg-[#A78074] text-white disabled:opacity-50"
              >
                Previous
              </button>
              <span className="text-[#A78074]">Page {currentPage}</span>
              <button
                onClick={() =>
                  setCurrentPage((prev) =>
                    prev * itemsPerPage < filteredOrders.length ? prev + 1 : prev
                  )
                }
                disabled={currentPage * itemsPerPage >= filteredOrders.length}
                className="px-4 py-2 rounded bg-[#A78074] text-white disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </PageLayout>
    </div>
    </div>
    </> 
  );
}