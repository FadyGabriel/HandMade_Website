import React, { useEffect, useState } from "react";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
} from "firebase/firestore";
import { auth, db } from "../../firebase";
import toast from "react-hot-toast";
import { FaTrash } from "react-icons/fa";
import UserNavbar from "../UserNavbar/UserNavbar";

export default function UserFavorite() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFavorites = async () => {
    const user = auth.currentUser;
    if (!user) {
      toast.error("You must be logged in to see favorites.");
      setLoading(false);
      return;
    }

    try {
      const q = query(collection(db, "favorite"), where("userId", "==", user.uid));
      const snapshot = await getDocs(q);
      const favData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setFavorites(favData);
    } catch (err) {
      console.error("Failed to fetch favorites", err);
      toast.error("Could not load favorites");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (favId) => {
    try {
      await deleteDoc(doc(db, "favorite", favId));
      setFavorites((prev) => prev.filter((item) => item.id !== favId));
      toast.success("Removed from favorites");
    } catch (error) {
      console.error("Failed to delete favorite:", error);
      toast.error("Failed to remove favorite");
    }
  };

  const handleAddToCart = async (product) => {
    const user = auth.currentUser;
    if (!user) {
      toast.error("You must be logged in to add to cart.");
      return;
    }

    const productRef = doc(db, "Products", product.productId);
    const cartQuery = query(
      collection(db, "Cart"),
      where("userId", "==", user.uid),
      where("productId", "==", product.productId)
    );

    try {
      const productSnap = await getDoc(productRef);

      if (!productSnap.exists()) {
        toast.error("Product no longer exists.");
        return;
      }

      const productData = productSnap.data();
      if (productData.stock === 0) {
        toast.error("Out of stock");
        return;
      }

      const cartSnapshot = await getDocs(cartQuery);

      if (cartSnapshot.empty) {
        await setDoc(doc(collection(db, "Cart")), {
          userId: user.uid,
          productId: product.productId,
          title: product.title,
          price: product.price,
          imgURL: product.image || product.imgURL,
          quantity: 1,
        });

        await updateDoc(productRef, { stock: productData.stock - 1 });
        toast.success("Added to cart");
      } else {
        const cartDoc = cartSnapshot.docs[0];
        const cartData = cartDoc.data();
        const newQuantity = cartData.quantity + 1;

        await updateDoc(cartDoc.ref, { quantity: newQuantity });
        await updateDoc(productRef, { stock: productData.stock - 1 });

        toast.success("Quantity updated in cart");
      }
    } catch (err) {
      console.error("Add to cart failed:", err);
      toast.error("Failed to add to cart");
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-[#A78074] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <>
      <UserNavbar />
      <div className="max-w-6xl mx-auto px-4 py-10">
        <h1 className="text-4xl font-[Playfair_Display] text-center text-[#A78074] mb-12">
          Your Favorites
        </h1>

        {favorites.length === 0 ? (
          <p className="text-center text-gray-500">You have no favorite products yet.</p>
        ) : (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8">
            {favorites.map((fav) => (
              <div
                key={fav.id}
                className="bg-white border border-[#f0eae7] rounded-2xl shadow-lg overflow-hidden transition-transform hover:scale-[1.02] relative flex flex-col"
              >
                <button
                  onClick={() => handleDelete(fav.id)}
                  className="absolute top-3 right-3 p-2 bg-white border border-red-100 rounded-full hover:bg-red-100 text-red-500 transition z-10"
                  title="Remove from favorites"
                >
                  <FaTrash />
                </button>

                <img
                  src={fav.image || fav.imgURL}
                  alt={fav.title || "Product Image"}
                  className="w-full h-56 object-cover"
                />

                <div className="p-5 flex-grow flex flex-col justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-[#A78074] mb-1">
                      {fav.title || "Untitled Product"}
                    </h2>
                    <p className="text-lg font-bold text-[#4b3832]">
                      {fav.price ? `${fav.price} EGP` : "Price not available"}
                    </p>
                  </div>

                  <button
                    onClick={() => handleAddToCart(fav)}
                    className="mt-4 bg-[#A78074] text-white px-4 py-2 rounded hover:bg-white hover:text-[#A78074] border border-[#A78074] transition"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
