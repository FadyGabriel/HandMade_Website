import { useState } from "react";
import { db, auth } from "../../firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

export default function UserComplaints() {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!subject.trim() || !message.trim()) {
      toast.error("Please fill in all fields");
      return;
    }
  
    const user = auth.currentUser;
    if (!user) {
      toast.error("You must be logged in to submit a complaint");
      return;
    }
  
    setLoading(true);
  
    try {
      await addDoc(collection(db, "Complaints"), {
        userId: user.uid,
        email: user.email,
        subject,
        message,
        createdAt: Timestamp.now(),
      });
  
      setSubject("");
      setMessage("");
      toast.success("Complaint submitted successfully, we will send notification to you soon");
    } catch (error) {
      console.error("Error submitting complaint:", error);
      toast.error("Failed to submit complaint");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen flex justify-center items-center bg-[#f5f5f1] px-4 py-20">
      <motion.div
        className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-10"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-3xl font-bold text-[#A78074] mb-6 text-center">
          Submit a Complaint
        </h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block mb-1 font-medium text-[#A78074]">Subject</label>
            <input
              type="text"
              className="w-full px-4 py-3 border border-[#A78074] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A78074]"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Enter complaint subject"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium text-[#A78074]">Message</label>
            <textarea
              rows={5}
              className="w-full px-4 py-3 border border-[#A78074] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A78074]"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Describe your issue in detail..."
            />
          </div>

          <button
  type="submit"
  className="w-full flex justify-center items-center gap-2 bg-[#A78074] text-white py-3 rounded-lg hover:bg-[#946a60] transition duration-300 disabled:opacity-70"
  disabled={loading}
>
  {loading && (
    <svg
      className="animate-spin h-5 w-5 text-white"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      ></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
      ></path>
    </svg>
  )}
  {loading ? "Sending..." : "Send Complaint"}
</button>
        </form>
      </motion.div>
    </section>
  );
}
