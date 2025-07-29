import { useState, useEffect } from 'react';
import { db, auth } from '../../firebase';
import { addDoc, collection, serverTimestamp, onSnapshot } from 'firebase/firestore';
import { FaStar } from 'react-icons/fa';
import toast from 'react-hot-toast';

export default function UserReviews() {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState('');
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch reviews in real-time
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'reviews'), (snapshot) => {
      const fetched = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setReviews(fetched);
    });

    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (!user) return toast.error('You must be logged in');

    if (rating === 0 || comment.trim() === '') {
      return toast.error('Please add a rating and comment');
    }

    setLoading(true);
    try {
      await addDoc(collection(db, 'reviews'), {
        userId: user.uid,
        name: user.displayName || 'Anonymous',
        comment,
        rating,
        createdAt: serverTimestamp(),
      });

      setRating(0);
      setComment('');
      toast.success('Review submitted!');
    } catch (error) {
      toast.error('Failed to send review');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-md my-10">
      <h2 className="text-2xl font-bold text-center text-[#A78074] mb-4">Leave a Review</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex justify-center space-x-1">
          {[...Array(5)].map((_, i) => {
            const starValue = i + 1;
            return (
              <label key={starValue}>
                <input
                  type="radio"
                  name="rating"
                  value={starValue}
                  onClick={() => setRating(starValue)}
                  className="hidden"
                />
                <FaStar
                  size={30}
                  className={`cursor-pointer transition ${
                    starValue <= (hover || rating) ? 'text-yellow-400' : 'text-gray-300'
                  }`}
                  onMouseEnter={() => setHover(starValue)}
                  onMouseLeave={() => setHover(0)}
                />
              </label>
            );
          })}
        </div>

        <textarea
          rows={4}
          className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#A78074]"
          placeholder="Write your review..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        ></textarea>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 px-4 bg-[#A78074] text-white rounded hover:bg-[#8d675e] transition"
        >
          {loading ? 'Submitting...' : 'Submit Review'}
        </button>
      </form>

      {/* Display submitted reviews
      {reviews.length > 0 && (
        <div className="mt-10">
          <h3 className="text-xl font-semibold mb-4 text-[#A78074]">What others say</h3>
          <ul className="space-y-4">
            {reviews.map((r) => (
              <li key={r.id} className="bg-gray-50 p-4 rounded shadow">
                <div className="flex justify-between items-center mb-1">
                  <h4 className="font-semibold">{r.name}</h4>
                  <div className="flex text-yellow-400">
                    {[...Array(r.rating)].map((_, i) => (
                      <FaStar key={i} />
                    ))}
                  </div>
                </div>
                <p className="text-gray-700">{r.comment}</p>
              </li>
            ))}
          </ul>
        </div>
      )} */}
    </section>
  );
}
