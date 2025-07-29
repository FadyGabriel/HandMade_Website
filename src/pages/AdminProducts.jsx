import React, { useEffect, useState } from "react";
import {
  collection,
  getDoc,
  doc,
  updateDoc,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../firebase";
import Sidebar from "../Components/Sidebar/Sidebar";
import { LayoutDashboard, Package, Users, Building, MessageSquare, AlertCircle, Star } from "lucide-react";
import { Menu, LogOut } from "lucide-react";
import { FaShoppingCart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [status, setStatus] = useState(null);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("status");
  const [filterStatus, setFilterStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 5;

  const fetchProductsWithVendors = async (snapshot) => {
    try {
      const productList = [];
      for (const productDoc of snapshot.docs) {
        const productData = productDoc.data();
        const vendorId = productData.vendorId;
        let displayName = "Unknown Vendor";
        if (vendorId) {
          const vendorDocRef = doc(db, "Vendors", vendorId);
          const vendorSnap = await getDoc(vendorDocRef);
          if (vendorSnap.exists()) {
            displayName = vendorSnap.data().displayName || "Unnamed Vendor";
          }
        }
        productList.push({
          id: productDoc.id,
          ...productData,
          vendorName: displayName,
        });
      }
      setProducts(productList);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "Products"), (snapshot) => {
      fetchProductsWithVendors(snapshot);
    });
    return () => unsubscribe();
  }, []);

  const updateProductStatus = async (productId, newStatus) => {
    setStatus(productId);
    try {
      const productRef = doc(db, "Products", productId);
      await updateDoc(productRef, { status: newStatus });
    } catch (error) {
      console.error("Error updating product status:", error);
    } finally {
      setStatus(null);
    }
  };

  const filtered = products
    .filter((product) => {
      const term = search.toLowerCase();
      const matchesSearch =
        (product.title && product.title.toLowerCase().includes(term)) ||
        (product.vendorName && product.vendorName.toLowerCase().includes(term)) ||
        (String(product.price).includes(term)) ||
        (product.status && product.status.toLowerCase().includes(term)) ||
        (String(product.category_id).includes(term));
      const matchesStatus =
        filterStatus === "all" || product.status === filterStatus;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      if (sortBy === "price_asc") return a.price - b.price;
      if (sortBy === "price_desc") return b.price - a.price;
      if (sortBy === "status") return (a.status || "").localeCompare(b.status || "");
      return 0;
    });

  const totalPages = Math.ceil(filtered.length / productsPerPage);
  const paginated = filtered.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );

  const getStatusCount = (type) => {
    return type === "all"
      ? products.length
      : products.filter((p) => p.status === type).length;
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

        <div className="bg-[#F5F5F1] min-h-screen py-10 px-4 md:px-8 mb-30">
      <h1 className="text-3xl font-bold text-[#A78074] mb-6 text-center md:text-left">
        Admin Product Panel
      </h1>

      {/* Status Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {["all", "approved", "rejected", "pending"].map((type) => {
          const color =
            type === "approved"
              ? "text-green-700 bg-green-100"
              : type === "rejected"
              ? "text-red-600 bg-red-100"
              : type === "pending"
              ? "text-yellow-700 bg-yellow-100"
              : "text-[#A78074] bg-white";
          return (
            <div
              key={type}
              className={`rounded-lg p-4 shadow text-center cursor-pointer border border-[#A78074] hover:scale-105 transition ${color}`}
              onClick={() => setFilterStatus(type)}
            >
              <p className="text-sm font-semibold capitalize">{type}</p>
              <p className="text-2xl font-bold">{getStatusCount(type)}</p>
            </div>
          );
        })}
      </div>

      {/* Search + Filter + Sort */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
        <input
          type="text"
          placeholder="Search by name, vendor, price..."
          className="px-4 py-2 rounded-md border border-[#A78074] focus:outline-none focus:ring-2 focus:ring-[#A78074] text-sm w-full md:w-96"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
        />
        <div className="flex gap-4 flex-wrap">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-1 rounded border border-[#A78074] text-sm"
          >
            <option value="status">Sort by Status</option>
            <option value="price_asc">Price: Low → High</option>
            <option value="price_desc">Price: High → Low</option>
          </select>
          <div className="text-sm text-[#A78074] mt-1">
            Page {currentPage} of {totalPages || 1}
          </div>
        </div>
      </div>

      {/* Product Table */}
      <div className="overflow-auto rounded-lg border border-gray-200 shadow bg-white">
        <table className="min-w-full divide-y divide-gray-200 text-sm text-left">
          <thead className="bg-[#A78074] text-white sticky top-0 z-10">
            <tr>
              <th className="px-6 py-3">Image</th>
              <th className="px-6 py-3">Title</th>
              <th className="px-6 py-3">Vendor</th>
              <th className="px-6 py-3">Category</th>
              <th className="px-6 py-3">Price</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {paginated.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center py-10 text-[#A78074]">
                  Loading products .
                </td>
              </tr>
            ) : (
              paginated.map((product) => (
                <tr key={product.id} className="hover:bg-[#FEFAF5] transition">
                  <td className="px-6 py-4">
                    <img
                      src={product.imgURL || "https://via.placeholder.com/50"}
                      alt={product.title}
                      className="w-16 h-16 object-cover rounded shadow-sm hover:scale-105 transition-transform border"
                    />
                  </td>
                  <td className="px-6 py-4 font-medium text-[#A78074]">{product.title}</td>
                  <td className="px-6 py-4">{product.vendorName}</td>
                  <td className="px-6 py-4">{product.category_id}</td>
                  <td className="px-6 py-4">${product.price}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${
                        product.status === "approved"
                          ? "bg-green-100 text-green-700"
                          : product.status === "rejected"
                          ? "bg-red-100 text-red-600"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {product.status || "pending"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2 flex-wrap">
                      <button
                        disabled={status === product.id || product.status === "approved"}
                        onClick={() => updateProductStatus(product.id, "approved")}
                        className={`px-3 py-1 text-xs rounded-md font-semibold transition ${
                          product.status === "approved"
                            ? "bg-green-400 text-white cursor-not-allowed"
                            : "bg-[#A78074] text-white hover:bg-white hover:text-[#A78074] border border-[#A78074]"
                        }`}
                      >
                        {status === product.id ? "⏳" : "Approve"}
                      </button>
                      <button
                        disabled={status === product.id || product.status === "rejected"}
                        onClick={() => updateProductStatus(product.id, "rejected")}
                        className={`px-3 py-1 text-xs rounded-md font-semibold transition ${
                          product.status === "rejected"
                            ? "bg-red-400 text-white cursor-not-allowed"
                            : "bg-[#A78074] text-white hover:bg-white hover:text-[#A78074] border border-[#A78074]"
                        }`}
                      >
                        {status === product.id ? "⏳" : "Reject"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-6  flex-wrap">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            className="px-4 py-2 bg-[#A78074] text-white rounded hover:bg-white hover:text-[#A78074] border border-[#A78074] disabled:opacity-50"
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            className="px-4 py-2 bg-[#A78074] text-white rounded hover:bg-white hover:text-[#A78074] border border-[#A78074] disabled:opacity-50"
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}
    </div>
    </div>
    </div>
    
    </>
  );
}
