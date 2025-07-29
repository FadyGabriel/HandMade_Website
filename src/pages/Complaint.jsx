import React, { useEffect, useState } from "react";
import PageLayout from "../Components/PageLayout/PageLayout";
import {
  collection,
  getDocs,
  deleteDoc,
  updateDoc,
  doc,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase";
import {
  MdPendingActions,
  MdCheckCircle,
  MdDelete,
  MdEdit,
} from "react-icons/md";
import Sidebar from "../Components/Sidebar/Sidebar";
import { LayoutDashboard, Package, Users, Building, MessageSquare, AlertCircle, Star } from "lucide-react";
import { Menu, LogOut } from "lucide-react";
import { FaShoppingCart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function Complaint() {
  const [complaints, setComplaints] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("newest");
  const [loading, setLoading] = useState(true);
  const [editOpen, setEditOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [toastMsg, setToastMsg] = useState("");

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const snapshot = await getDocs(collection(db, "Complaints"));
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          timestamp: doc.data().timestamp || Date.now(),
        }));
        setComplaints(data);
        setFiltered(data);
      } catch (err) {
        console.error("Error fetching complaints:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchComplaints();
  }, []);

  useEffect(() => {
    let result = [...complaints];

    if (statusFilter !== "all") {
      result = result.filter((c) => c.status === statusFilter);
    }

    if (searchTerm.trim() !== "") {
      result = result.filter(
        (c) =>
          c.userId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          c.message?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    result.sort((a, b) =>
      sortOrder === "newest" ? b.timestamp - a.timestamp : a.timestamp - b.timestamp
    );

    setFiltered(result);
  }, [searchTerm, complaints, statusFilter, sortOrder]);

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "Complaints", id));
      const updated = complaints.filter((c) => c.id !== id);
      setComplaints(updated);
      showToast("Complaint deleted.");
    } catch (err) {
      console.error("Error deleting complaint:", err);
    }
  };

  const handleEditOpen = (data) => {
    setEditData(data);
    setEditOpen(true);
  };

  const handleSaveEdit = async (updated) => {
    try {
      await updateDoc(doc(db, "Complaints", updated.id), {
        userId: updated.userId,
        subject: updated.subject,
        message: updated.message,
        status: updated.status,
      });
      const updatedList = complaints.map((c) =>
        c.id === updated.id ? { ...c, ...updated } : c
      );
      setComplaints(updatedList);
      showToast("Complaint updated.");

      if (updated.status === "resolved") {
        await addDoc(collection(db, "Notifications"), {
          userId: updated.userId,
          subject: updated.subject,
          message: `Your complaint has been resolved.`,
          createdAt: serverTimestamp(),
        });
      }
    } catch (err) {
      console.error("Failed to update complaint:", err);
    }
  };


  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 3000);
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
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-[#A78074] hover:text-black"
            >
              <Menu size={24} />
            </button>
            <h1 className="text-xl font-bold text-[#A78074]">Complaints</h1>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={handleLogout}
              className="text-red-500 hover:text-red-700"
            >
              <LogOut size={24} />
            </button>
          </div>
        </header>
        <PageLayout title="Complaints">
      <div className="bg-[#F5F5F1] min-h-screen px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-6">
          <h2 className="text-2xl font-bold text-[#A78074] border-b pb-2">
            User Complaints
          </h2>

          {/* Filters */}
          <div className="flex flex-wrap gap-4 justify-between items-center">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by User ID or Message..."
              className="flex-1 min-w-[220px] px-4 py-2 border border-[#DAD7CD] rounded-lg shadow-sm bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#A78074]"
            />

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 rounded-md border bg-white text-sm text-[#A78074] border-[#A78074]"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="resolved">Resolved</option>
            </select>

            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="px-3 py-2 rounded-md border bg-white text-sm text-[#A78074] border-[#A78074]"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>

          {/* Complaints List */}
          {loading ? (
            <p className="text-center text-gray-500 animate-pulse">
              Loading complaints...
            </p>
          ) : filtered.length === 0 ? (
            <div className="text-center mt-20">
              <p className="text-[#A78074] text-lg font-medium">
                No complaints found.
              </p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2">
              {filtered.map((complaint) => (
                <div
                  key={complaint.id}
                  className="bg-white rounded-2xl p-6 shadow-md border border-[#E0E0DC] relative transition hover:shadow-lg"
                >
                  <div className="absolute top-3 right-3 flex gap-2">
                    <button
                      onClick={() => handleEditOpen(complaint)}
                      className="text-[#A78074] hover:text-black"
                    >
                      <MdEdit size={20} />
                    </button>
                    <button
                      onClick={() => handleDelete(complaint.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <MdDelete size={20} />
                    </button>
                  </div>

                  <div className="flex justify-between items-center mb-4">
                    <span className="text-[#A78074] font-semibold text-base">
                      Complaint ID: {complaint.id}
                    </span>
                    <span
                      className={`flex items-center gap-1 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wide ${
                        complaint.status === "resolved"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {complaint.status === "resolved" ? (
                        <>
                          <MdCheckCircle className="text-lg" /> Resolved
                        </>
                      ) : (
                        <>
                          <MdPendingActions className="text-lg" /> Pending
                        </>
                      )}
                    </span>
                  </div>

                  <div className="text-sm text-gray-700 space-y-2 leading-relaxed">
                    <p>
                      <span className="font-medium text-gray-600">User ID:</span>{" "}
                      <span className="text-[#A78074]">{complaint.userId}</span>
                    </p>
                    <p>
                      <span className="font-medium text-gray-600">Email:</span>{" "}
                      {complaint.email || "—"}
                    </p>
                    <p>
                      <span className="font-medium text-gray-600">Subject:</span>{" "}
                      {complaint.subject || "—"}
                    </p>
                    <p>
                      <span className="font-medium text-gray-600">Message:</span>{" "}
                      {complaint.message}
                    </p>
                    <p>
                      <span className="font-medium text-gray-600">Created At:</span>{" "}
                      {new Date(complaint.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Toast */}
        {toastMsg && (
          <div className="fixed bottom-4 right-4 bg-[#A78074] text-white text-sm px-4 py-2 rounded shadow-md transition animate-bounce-in">
            {toastMsg}
          </div>
        )}

        {/* Edit Modal */}
        <EditComplaintModal
          isOpen={editOpen}
          onClose={() => setEditOpen(false)}
          data={editData}
          onSave={handleSaveEdit}
        />
      </div>
    </PageLayout>
    </div>
    </div>
    </>
  );
}

// === Edit Modal ===
const EditComplaintModal = ({ isOpen, onClose, data, onSave }) => {
  const [formData, setFormData] = useState(data);

  useEffect(() => {
    setFormData(data);
  }, [data]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = () => {
    onSave(formData);
    onClose();
  };

  if (!isOpen || !formData) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg space-y-4 border border-[#E0E0DC]">
        <h3 className="text-lg font-semibold text-[#A78074]">Edit Complaint</h3>

        <div className="space-y-3 text-sm">
          <div>
            <label className="block font-medium text-gray-700">User ID</label>
            <input
              type="text"
              name="user_id"
              value={formData.user_id}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded-md text-sm"
            />
          </div>

          <div>
            <label className="block font-medium text-gray-700">Message</label>
            <textarea
              name="message"
              rows={3}
              value={formData.message}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded-md text-sm"
            />
          </div>

          <div>
            <label className="block font-medium text-gray-700">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded-md text-sm"
            >
              <option value="pending">Pending</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded-md text-sm text-[#A78074] border-[#A78074] hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-[#A78074] text-white text-sm rounded-md hover:bg-white hover:text-[#A78074] border border-[#A78074] transition"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};
