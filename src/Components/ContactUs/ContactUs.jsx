import { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../firebase";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
export default function ContactUs() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.phone || !form.message) {
      toast.error("Please fill in all fields.");
      return;
    }

    try {
      setLoading(true);
      await addDoc(collection(db, "ContactUs"), {
        ...form,
        createdAt: serverTimestamp(),
      });
      toast.success("Message sent successfully!");
      setForm({ name: "", email: "", phone: "", message: "" });
    } catch (error) {
      toast.error("Something went wrong!");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
   
    <div className="min-h-screen bg-[#F5F5F1]  flex items-center justify-center">
    
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-xl bg-white shadow-md rounded-2xl p-8 space-y-6"
      >
       <motion.h2
          className="text-4xl md:text-5xl font-bold text-center text-[#A77F73] mb-12"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          Contact Us
        </motion.h2>

        <div>
          <label className="block text-gray-600 mb-1">Name</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
        </div>

        <div>
          <label className="block text-gray-600 mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
        </div>

        <div>
          <label className="block text-gray-600 mb-1">Phone</label>
          <input
            type="tel"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
        </div>

        <div>
          <label className="block text-gray-600 mb-1">Message</label>
          <textarea
            name="message"
            value={form.message}
            onChange={handleChange}
            rows="4"
            className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
          ></textarea>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#A77F73] hover:bg-[#90675F] text-white py-2 rounded-md transition"
        >
          {loading ? "Sending..." : "Send Message"}
        </button>
      </form>
    </div>
    </>
  );
}
