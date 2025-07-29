import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db, auth } from "../../firebase";
import {
  doc,
  getDoc,
  collection,
  addDoc,
  query,
  where,
  getDocs,
  updateDoc,
  setDoc,
} from "firebase/firestore";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import toast from "react-hot-toast";

export default function CardDetails({ onCategoryFetched, onProductIdFetched }) {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [vendorName, setVendorName] = useState("");
  const [isFavorite, setIsFavorite] = useState(false);

  const user = auth.currentUser;

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
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const docRef = doc(db, "Products", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const productData = { id: docSnap.id, ...docSnap.data() };
          setProduct(productData);
          onCategoryFetched(productData.categoryName);
          onProductIdFetched(productData.id);

          // Fetch vendor
          if (productData.vendorId) {
            const vendorRef = doc(db, "Vendors", productData.vendorId);
            const vendorSnap = await getDoc(vendorRef);
            if (vendorSnap.exists()) {
              setVendorName(vendorSnap.data().displayName);
            }
          }

          // Check favorite
          if (user) {
            const favQuery = query(
              collection(db, "Favorites"),
              where("userId", "==", user.uid),
              where("productId", "==", docSnap.id)
            );
            const favSnap = await getDocs(favQuery);
            setIsFavorite(!favSnap.empty);
          }
        } else {
          console.log("No such product!");
        }
      } catch (error) {
        console.error("Error fetching product or vendor:", error);
      }
    };

    fetchProduct();
  }, [id, onCategoryFetched, onProductIdFetched]);

  const handleAddToCart = async () => {
    if (!user) return toast.error("Please log in to add to cart");

    try {
      const cartQuery = query(
        collection(db, "Cart"),
        where("userId", "==", user.uid),
        where("productId", "==", product.id)
      );
      const cartSnap = await getDocs(cartQuery);

      if (!cartSnap.empty) {
        // Item already in cart, increase quantity
        const cartItem = cartSnap.docs[0];
        const cartData = cartItem.data();

        if (cartData.quantity >= product.stock) {
          return toast.error("No more stock available");
        }

        await updateDoc(cartItem.ref, {
          quantity: cartData.quantity + 1,
        });
      } else {
        await addDoc(collection(db, "Cart"), {
          userId: user.uid,
          productId: product.id,
          quantity: 1,
        });
      }

      toast.success("Added to Cart");
    } catch (err) {
      console.error("Failed to add to cart:", err);
      toast.error("Failed to add to cart");
    }
  };

  const handleFavoriteClick = async () => {
    if (!user) return toast.error("Please log in to favorite");

    try {
      const favQuery = query(
        collection(db, "Favorites"),
        where("userId", "==", user.uid),
        where("productId", "==", product.id)
      );
      const favSnap = await getDocs(favQuery);

      if (favSnap.empty) {
        await addDoc(collection(db, "Favorites"), {
          userId: user.uid,
          productId: product.id,
        });
        setIsFavorite(true);
        toast.success("Added to Favorites");
      } else {
        toast("Already in Favorites");
      }
    } catch (err) {
      console.error("Favorite failed:", err);
      toast.error("Favorite failed");
    }
  };

  if (!product) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="w-12 h-12 border-4 border-[#A78074] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="bg-white text-[#A78074]">
      <div className="relative w-full px-6 sm:px-12 lg:px-10 py-10">
        <div className="relative flex flex-col sm:flex-row items-center sm:items-start gap-10 shadow-lg bg-[#f5f5f1] p-6 rounded-3xl">
          <button
            className="absolute top-4 right-4 p-2 rounded-full"
            onClick={handleFavoriteClick}
          >
            {isFavorite ? (
              <FaHeart className="text-red-500 text-2xl sm:text-3xl" />
            ) : (
              <FaRegHeart className="text-[#A78074] text-2xl sm:text-3xl" />
            )}
          </button>

          <div className="w-full sm:w-[300px] lg:w-[400px] aspect-[4/5] overflow-hidden rounded-2xl shadow-2xl">
            <img
              src={product.imgURL}
              alt={product.title}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-6">{product.title}</h1>
            <div className="text-lg font-medium mb-6">{product.description}</div>
            <div className="text-2xl font-bold mt-6">{Math.floor(product.price)} EGP</div>
            <div className="flex items-center gap-1 mt-6">
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
            <span className="text-sm font-semibold text-[#A78074] ml-1 mr-2 ">
              {averageRating || "0"} / 5
            </span>
          </div>
            <div className="text-xl font-semibold mt-6 mb-6">
              <span className="font-semibold">Available:</span>{" "}
              <span className="font-bold">{product.stock}</span>
            </div>
            <div className="text-xl font-medium mt-6 mb-7">
              <span className="font-semibold">Vendor:</span>{" "}
              {vendorName || "Loading..."}
            </div>

            {product.stock > 0 ? (
              <button
                onClick={handleAddToCart}
                className="bg-[#A78074] text-white mt-1 px-8 py-3 rounded-lg border border-[#A78074] hover:bg-white hover:text-[#A78074] transition text-lg"
              >
                Add To Cart
              </button>
            ) : (
              <p className="text-red-500 font-semibold">Out of Stock</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
