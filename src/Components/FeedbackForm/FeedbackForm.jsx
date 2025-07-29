import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { addDoc, collection } from "firebase/firestore";
import { auth, db } from "../../firebase";
import toast, { Toaster } from "react-hot-toast";
import UserNavbar from "../UserNavbar/UserNavbar";

export default function FeedbackForm() {
    const { orderId, productId: combinedId } = useParams();
    const [userId, setUserId] = useState(null);
    const [message, setMessage] = useState("");
    const [rating, setRating] = useState(5); // Default rating
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const productId = combinedId?.split("_")[1];
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) setUserId(user.uid);
    });
    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!orderId || !userId || !productId) {
      console.warn("Missing orderId, productId, or userId");
      setError("Missing order, product, or user info.");
      return;
    }
  
    setLoading(true); // start loading
    try {
      await addDoc(collection(db, "Feedbacks"), {
        orderId,
        productId,
        userId,
        message,
        rating,
        createdAt: new Date(),
      });
  
      toast.success("Feedback submitted successfully!");
      setMessage("");
      setRating(5);
      setError("");
    } catch (err) {
      console.error("Error submitting feedback:", err);
      toast.error("Failed to submit feedback.");
    } finally {
      setLoading(false); // stop loading
    }
  };
  

  return (
    <>
    <UserNavbar />
    <div className="flex justify-center items-center h-[calc(100vh-300px)]">
        <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-10 p-4 bg-white rounded shadow">
        <Toaster position="top-right" />
        <h2 className="text-xl font-semibold mb-4 text-[#A78074]">Leave Feedback</h2>

        {/* Rating */}
        <label className="block mb-2 text-gray-700">Rating:</label>
        <select
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
            className="w-full p-2 border border-gray-300 rounded mb-4"
        >
            <option value={5}>⭐⭐⭐⭐⭐ - Excellent</option>
            <option value={4}>⭐⭐⭐⭐ - Good</option>
            <option value={3}>⭐⭐⭐ - Average</option>
            <option value={2}>⭐⭐ - Poor</option>
            <option value={1}>⭐ - Terrible</option>
        </select>

        {/* Message */}
        <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Write your feedback here..."
            required
            className="w-full p-2 border border-gray-300 rounded mb-4"
        />

        {error && <p className="text-red-600 mb-2">{error}</p>}

        <button
  type="submit"
  disabled={loading}
  className="bg-[#A78074] text-white px-4 py-2 rounded hover:bg-[#A78074]/80 flex items-center justify-center gap-2 disabled:opacity-70"
>
  {loading ? (
    <>
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
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
        />
      </svg>
      Submitting...
    </>
  ) : (
    "Submit Feedback"
  )}
</button>
        </form>
    </div>
    </>
  );
}
