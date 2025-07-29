import React, { useEffect, useState } from "react";
import { FaRegHeart, FaHeart, FaEye } from "react-icons/fa";
import {
  doc,
  setDoc,
  getDoc,
  deleteDoc,
  updateDoc,
  onSnapshot,
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db, auth } from "../../firebase";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function ProductCard({
  id,
  title,
  price,
  image,
  categoryName,
}) {
  const [isFavorited, setIsFavorited] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);
  const [stock, setStock] = useState(0);
  

  const navigate = useNavigate();

  // Fetch live stock
  useEffect(() => {
    const productRef = doc(db, "Products", id);
    const unsubscribe = onSnapshot(productRef, (snapshot) => {
      if (snapshot.exists()) {
        setStock(snapshot.data().stock ?? 0);
      }
    });
    return () => unsubscribe();
  }, [id]);

  // Fetch average rating
  const [averageRating, setAverageRating] = useState(0);
  useEffect(() => {
    const fetchAverageRating = async () => {
      try {
        const feedbackRef = collection(db, "Feedbacks");
        const q = query(feedbackRef, where("productId", "==", id));
        const snapshot = await getDocs(q);

        let total = 0;
        let count = 0;
        snapshot.forEach((doc) => {
          const data = doc.data();
          if (data.rating) {
            total += data.rating;
            count++;
          }
        });

        setAverageRating(count > 0 ? (total / count).toFixed(1) : 0);
      } catch (err) {
        console.error("Error fetching average rating:", err);
      }
    };
    fetchAverageRating();
  }, [id]);

  // Check if already favorited
  useEffect(() => {
    const checkFavorite = async () => {
      const user = auth.currentUser;
      if (!user) return;
      const favRef = doc(db, "favorite", `${user.uid}_${id}`);
      const favSnap = await getDoc(favRef);
      setIsFavorited(favSnap.exists());
    };
    checkFavorite();
  }, [id]);

  const handleFavoriteClick = async () => {
    const user = auth.currentUser;
    if (!user) return toast.error("You must be logged in to manage favorites");

    const favRef = doc(db, "favorite", `${user.uid}_${id}`);

    try {
      if (isFavorited) {
        await deleteDoc(favRef);
        toast.success("Removed from favorites");
      } else {
        await setDoc(favRef, {
          userId: user.uid,
          productId: id,
          title,
          imgURL: image,
          price,
        });
        toast.success("Added to favorites");
      }
      setIsFavorited(!isFavorited);
    } catch (err) {
      console.error("Favorite error:", err);
      toast.error("Error managing favorite");
    }
  };

  const handleAddToCart = async () => {
    const user = auth.currentUser;
    if (!user) return toast.error("You must be logged in to add to cart");

    setAddingToCart(true);

    const cartId = `${user.uid}_${id}`;
    const cartRef = doc(db, "Cart", cartId);
    const productRef = doc(db, "Products", id);

    try {
      const [cartSnap, productSnap] = await Promise.all([
        getDoc(cartRef),
        getDoc(productRef),
      ]);

      if (!productSnap.exists()) return toast.error("Product does not exist");

      const currentStock = productSnap.data().stock ?? 0;
      if (currentStock <= 0) return toast.error("Out of stock");

      if (cartSnap.exists()) {
        const currentQty = cartSnap.data().quantity;
        await Promise.all([
          updateDoc(cartRef, { quantity: currentQty + 1 }),
          updateDoc(productRef, { stock: currentStock - 1 }),
        ]);
        toast.success("Quantity updated in cart");
      } else {
        await Promise.all([
          setDoc(cartRef, {
            userId: user.uid,
            productId: id,
            title,
            price,
            imgURL: image,
            quantity: 1,
          }),
          updateDoc(productRef, { stock: currentStock - 1 }),
        ]);
        toast.success("Added to cart");
      }
    } catch (err) {
      console.error("Add to cart error:", err);
      toast.error("Error adding to cart");
    } finally {
      setAddingToCart(false);
    }
  };

  const handleViewDetails = () => {
    navigate(`/userproducts/${id}`);
  };

  return (
    <div className="bg-[#f5f5f1] w-90 mx-auto max-w-xs rounded-xl shadow-md p-4 transition hover:scale-102 duration-200 relative">
      {/* Image & Icons */}
      <div className="relative">
        <img
          src={image}
          alt={title}
          className="w-full h-56 object-cover rounded-xl"
        />
        {/* Favorite */}
        <button
          onClick={handleFavoriteClick}
          className="absolute top-2 right-2 p-2 bg-[#A78074] rounded-xl"
        >
          {isFavorited ? (
            <FaHeart className="text-white text-xl" />
          ) : (
            <FaRegHeart className="text-white text-xl" />
          )}
        </button>
        {/* View */}
        <div className="absolute top-2 left-2 group bg-[#A78074] p-1 rounded-xl">
          <button onClick={handleViewDetails}>
            <FaEye className="text-[#eee1dd] text-xl" />
          </button>
          <div className="absolute top-full left-1/2 -translate-x-1/2 bg-[#A78074] text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition duration-200 whitespace-nowrap z-10">
            View Details
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="mt-4">
        <h2 className="text-xl font-semibold text-[#A78074]">{title}</h2>

        {/* Rating & Stock */}
        <div className="flex justify-between items-center mt-2">
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <svg
                key={i}
                className={`w-5 h-5 ${
                  i < Math.round(averageRating)
                    ? "text-yellow-400"
                    : "text-gray-300"
                }`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.063 3.278a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.063 3.278c.3.921-.755 1.688-1.54 1.118L10 13.347l-2.8 2.034c-.785.57-1.84-.197-1.54-1.118l1.063-3.278a1 1 0 00-.364-1.118L3.56 8.705c-.783-.57-.38-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.063-3.278z" />
              </svg>
            ))}
            <span className="text-sm font-semibold text-[#A78074] ml-1 ">
              {averageRating || "0"} / 5
            </span>
          </div>
          
          <span className="text-[#a27466] font-bold">
            Available: {stock}
          </span>
        </div>

        <p className="text-sm text-gray-500 mt-2">Category: {categoryName}</p>

        {/* Price & Add to Cart */}
        <div className="flex justify-between items-center mt-4">
          <p className="text-lg font-bold text-[#A78074]">{price} EGP</p>
          <button
            onClick={handleAddToCart}
            disabled={addingToCart || stock === 0}
            className={`mt-1 px-6 py-2 rounded-lg border transition ${
              stock === 0
                ? "bg-gray-400 text-white cursor-not-allowed"
                : "bg-[#A78074] text-white border-[#A78074] hover:bg-white hover:text-[#A78074]"
            }`}
          >
            {stock === 0
              ? "Out of Stock"
              : addingToCart
              ? "Adding..."
              : "Add To Cart"}
          </button>
        </div>
      </div>
    </div>
  );
}
