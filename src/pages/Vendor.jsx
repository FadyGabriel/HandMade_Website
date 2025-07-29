import React, { useEffect, useState } from "react";
import PageLayout from "../Components/PageLayout/PageLayout";
import { collection, getDocs, updateDoc, doc, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import Sidebar from "../Components/Sidebar/Sidebar";
import { useNavigate } from "react-router-dom";
import { LayoutDashboard, Package, Users, Building, MessageSquare, AlertCircle, Star } from "lucide-react";
import { Menu, LogOut } from "lucide-react";
import { FaShoppingCart } from "react-icons/fa";
export default function VendorPage() {
  const [vendors, setVendors] = useState([]);
  const [filteredVendors, setFilteredVendors] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const snapshot = await getDocs(collection(db, "Vendors"));
        const vendorList = snapshot.docs
          .map((doc) => ({
            id: doc.id,
            ...doc.data(),
            createdAt: doc.data().createdAt.slice(0, 10) || null,
            status: doc.data().status || "Pending",
          }))
          .filter((user) => user.role === "vendor");

        setVendors(vendorList);
        setFilteredVendors(vendorList);
      } catch (err) {
        console.error("Error fetching vendors:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchVendors();
  }, []);

  useEffect(() => {
    let result = vendors;

    if (statusFilter !== "All") {
      result = result.filter((vendor) => vendor.status === statusFilter);
    }

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (vendor) =>
          vendor.displayName?.toLowerCase().includes(term) ||
          vendor.email?.toLowerCase().includes(term)
      );
    }

    setFilteredVendors(result);
  }, [searchTerm, vendors, statusFilter]);

  const getInitials = (name) =>
    name
      ?.split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();

  const handleStatusUpdate = async (vendorId, newStatus) => {
  try {
    const vendorRef = doc(db, "Vendors", vendorId);
    await updateDoc(vendorRef, { status: newStatus });

    const updatedVendors = vendors.map((v) =>
      v.id === vendorId ? { ...v, status: newStatus } : v
    );
    setVendors(updatedVendors);

    if (selectedVendor?.id === vendorId) {
      setSelectedVendor({ ...selectedVendor, status: newStatus });
    }

    // ✅ Send notification
    const notificationMessage =
      newStatus === "Approved"
        ? "Your vendor account has been approved."
        : newStatus === "Rejected"
        ? "Your vendor account has been rejected."
        : "Your vendor account status is pending.";

    await addDoc(collection(db, "Notifications"), {
      userId: vendorId,
      message: notificationMessage,
      createdAt: serverTimestamp(),
       // you can use this to track read/unread later
    });
  } catch (error) {
    console.error("Status update failed:", error);
  }
};

  const statusBadge = (status) => {
    const base = "px-3 py-1 text-xs font-semibold rounded-full";
    if (status === "Approved") return <span className={`${base} bg-green-100 text-green-700`}>Approved</span>;
    if (status === "Rejected") return <span className={`${base} bg-red-100 text-red-700`}>Rejected</span>;
    return <span className={`${base} bg-yellow-100 text-yellow-700`}>Pending</span>;
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
        <PageLayout title="Vendors">
      <div className="p-6 space-y-6">
        {/* Top Controls */}
        <div className="flex flex-wrap gap-4 justify-between items-center">
          <h2 className="text-2xl font-bold text-[#A78074]">All Vendors</h2>
          <div className="flex gap-4 flex-wrap">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border rounded-md px-3 py-2 text-sm focus:ring-[#A78074]"
            >
              <option value="All">All</option>
              <option value="Approved">Approved</option>
              <option value="Pending">Pending</option>
              <option value="Rejected">Rejected</option>
            </select>
            <input
              type="text"
              placeholder="Search name or email"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border px-4 py-2 rounded-md w-64 focus:ring-[#A78074]"
            />
          </div>
        </div>

        {/* Vendor Cards */}
        {loading ? (
          <div className="text-center text-[#A78074] animate-pulse">Loading vendors...</div>
        ) : filteredVendors.length === 0 ? (
          <p className="text-center text-gray-500">No vendors found...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {filteredVendors.map((vendor) => (
              <div
                key={vendor.id}
                onClick={() => {
                  setSelectedVendor(vendor);
                  setModalOpen(true);
                }}
                className="cursor-pointer bg-white p-5 rounded-xl shadow hover:shadow-lg border hover:-translate-y-1 transition"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="bg-[#A78074] text-white w-12 h-12 rounded-full flex items-center justify-center font-bold shadow text-lg">
                    {getInitials(vendor.displayName || "NA")}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-[#A78074]">{vendor.displayName || "Unnamed"}</h3>
                    <p className="text-sm text-gray-600">{vendor.email}</p>
                  </div>
                </div>
                <p className="text-sm text-gray-500">Registered: {vendor.createdAt}</p>
                <div className="mt-2">{statusBadge(vendor.status)}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal for Vendor Details */}
      {modalOpen && selectedVendor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 relative animate-fadeIn">
            <button
              className="absolute top-3 right-4 text-gray-400 hover:text-[#A78074] text-2xl"
              onClick={() => setModalOpen(false)}
            >
              &times;
            </button>

            <div className="flex items-center gap-4 mb-4">
              <div className="bg-[#A78074] text-white w-14 h-14 rounded-full flex items-center justify-center text-xl font-semibold shadow">
                {getInitials(selectedVendor.displayName || "NA")}
              </div>
              <div>
                <h2 className="text-xl font-bold text-[#A78074]">Vendor Details</h2>
                <p className="text-sm text-gray-500">{selectedVendor.email}</p>
              </div>
            </div>

            <div className="space-y-2 text-sm text-gray-700">
              <div className="grid grid-cols-2 gap-2">
                <p><strong>Name:</strong> {selectedVendor.displayName || "—"}</p>
                <p><strong>Email:</strong> {selectedVendor.email || "—"}</p>
                <p><strong>Phone:</strong> {selectedVendor.phone || "—"}</p>
                <p><strong>National ID:</strong> {selectedVendor.nationID || "—"}</p>
                <p><strong>Status:</strong> {statusBadge(selectedVendor.status)}</p>
                <p><strong>Registered:</strong> {selectedVendor.createdAt || "—"}</p>
              </div>

              <div>
                <strong>Bio:</strong>
                <p className="mt-1 text-gray-600">{selectedVendor.bio || "—"}</p>
              </div>

              {/* Status Buttons */}
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => handleStatusUpdate(selectedVendor.id, "Approved")}
                  className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded-md text-sm"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleStatusUpdate(selectedVendor.id, "Rejected")}
                  className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-md text-sm"
                >
                  Reject
                </button>
                <button
                  onClick={() => handleStatusUpdate(selectedVendor.id, "Pending")}
                  className="px-3 py-1 bg-yellow-500 hover:bg-yellow-600 text-white rounded-md text-sm"
                >
                  Pending
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </PageLayout>
        </div>
    </div>
   </>
  );
}
