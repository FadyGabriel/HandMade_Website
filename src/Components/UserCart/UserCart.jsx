import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
  getDoc,
  deleteDoc,
} from "firebase/firestore";
import { db, auth } from "../../firebase";
import toast from "react-hot-toast";
import UserNavbar from "../UserNavbar/UserNavbar";

export default function UserCart() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchCart = async () => {
    const user = auth.currentUser;
    if (!user) {
      toast.error("You must be logged in to view your cart.");
      setLoading(false);
      return;
    }

    try {
      const q = query(collection(db, "Cart"), where("userId", "==", user.uid));
      const snapshot = await getDocs(q);

      const cartItemsWithStock = await Promise.all(
        snapshot.docs.map(async (docSnap) => {
          const data = docSnap.data();
          const productRef = doc(db, "Products", data.productId);
          const productSnap = await getDoc(productRef);
          const productStock = productSnap.exists() ? productSnap.data().stock : 0;

          return {
            id: docSnap.id,
            ...data,
            stock: productStock,
          };
        })
      );

      setCartItems(cartItemsWithStock);
    } catch (err) {
      console.error("Error fetching cart:", err);
      toast.error("Failed to load cart");
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (itemId, currentQuantity, type, productId) => {
    const user = auth.currentUser;
    if (!user) return;

    const cartRef = doc(db, "Cart", itemId);
    const productRef = doc(db, "Products", productId);

    try {
      const productSnap = await getDoc(productRef);
      if (!productSnap.exists()) {
        toast.error("Product no longer exists.");
        return;
      }

      const productData = productSnap.data();
      const productStock = productData.stock || 0;

      let newQuantity = currentQuantity;
      let updatedProductStock = productStock;

      if (type === "increase") {
        if (productStock === 0) {
          toast.error("Out of stock");
          return;
        }
        newQuantity += 1;
        updatedProductStock -= 1;
      } else if (type === "decrease") {
        if (currentQuantity === 1) {
          toast.error("Minimum quantity is 1");
          return;
        }
        newQuantity -= 1;
        updatedProductStock += 1;
      }

      await updateDoc(cartRef, { quantity: newQuantity });
      await updateDoc(productRef, { stock: updatedProductStock });

      fetchCart();
    } catch (error) {
      console.error("Error updating quantity:", error);
      toast.error("Failed to update quantity");
    }
  };

  const deleteItem = async (itemId) => {
  try {
    const cartRef = doc(db, "Cart", itemId);
    const cartSnap = await getDoc(cartRef);

    if (!cartSnap.exists()) {
      toast.error("Cart item not found");
      return;
    }

    const cartData = cartSnap.data();
    const quantityInCart = cartData.quantity || 1;
    const productId = cartData.productId;

    const productRef = doc(db, "Products", productId);
    const productSnap = await getDoc(productRef);

    if (productSnap.exists()) {
      const productData = productSnap.data();
      const updatedStock = (productData.stock || 0) + quantityInCart;

      await updateDoc(productRef, { stock: updatedStock });
    }

    await deleteDoc(cartRef);
    toast.success("Item deleted and stock restored");
    fetchCart();
  } catch (err) {
    console.error("Failed to delete item:", err);
    toast.error("Failed to delete item");
  }
};

const deleteAll = async () => {
  try {
    const user = auth.currentUser;
    if (!user) {
      toast.error("You must be logged in");
      return;
    }

    const q = query(collection(db, "Cart"), where("userId", "==", user.uid));
    const snapshot = await getDocs(q);

    const updates = snapshot.docs.map(async (docSnap) => {
      const cartData = docSnap.data();
      const { productId, quantity } = cartData;

      const productRef = doc(db, "Products", productId);
      const productSnap = await getDoc(productRef);

      if (productSnap.exists()) {
        const currentStock = productSnap.data().stock ?? 0;
        await updateDoc(productRef, {
          stock: currentStock + quantity, // return stock
        });
      }

      await deleteDoc(doc(db, "Cart", docSnap.id)); // delete cart item
    });

    await Promise.all(updates);

    toast.success("All items deleted and stock restored");
    fetchCart(); // Refresh cart UI
  } catch (err) {
    console.error("Failed to delete all items:", err);
    toast.error("Failed to delete all items");
  }
};


  const totalPrice = cartItems.reduce(
    (total, item) => total + (item.price * (item.quantity || 1)),
    0
  );

  useEffect(() => {
    fetchCart();
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
        <h1 className="text-4xl font-[Playfair_Display] text-[#A78074] mb-8 text-center">
          Your Cart
        </h1>

        {cartItems.length === 0 ? (
          <p className="text-center text-gray-500">Your cart is empty.</p>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white rounded-lg shadow">
                <thead>
                  <tr className="bg-[#f5f5f1] text-[#A78074] text-left text-sm uppercase">
                    <th className="py-3 px-4">Image</th>
                    <th className="py-3 px-4">Title</th>
                    <th className="py-3 px-4">Price</th>
                    <th className="py-3 px-4">Stock</th>
                    <th className="py-3 px-4">Quantity</th>
                    <th className="py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {cartItems.map((item) => (
                    <tr key={item.id} className="border-b hover:bg-[#faf8f6]">
                      <td className="py-3 px-4">
                        <img
                          src={item.imgURL}
                          alt={item.title}
                          className="w-16 h-16 object-cover rounded"
                        />
                      </td>
                      <td className="py-3 px-4 text-[#4b3832] font-medium">{item.title}</td>
                      <td className="py-3 px-4">{item.price} EGP</td>
                      <td className="py-3 px-4">{item.stock}</td>
                      <td className="py-3 px-4 flex items-center gap-2">
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity || 1, "decrease", item.productId)
                          }
                          className="bg-[#A78074] text-white w-8 h-8 rounded hover:bg-[#8c6152] transition"
                        >
                          -
                        </button>
                        <span className="min-w-[24px] text-center">
                          {item.quantity || 1}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity || 1, "increase", item.productId)
                          }
                          className="bg-[#A78074] text-white w-8 h-8 rounded hover:bg-[#8c6152] transition"
                        >
                          +
                        </button>
                      </td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() => deleteItem(item.id)}
                          className="text-red-600 hover:underline"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-6 flex flex-wrap gap-4 justify-between items-center">
                <p className="text-lg font-semibold text-[#4b3832]">
                    Total: {totalPrice.toFixed(2)} EGP
                </p>

                <div className="flex gap-4">
                    <button
                    onClick={deleteAll}
                    className="bg-red-500 text-white px-6 py-2 rounded hover:bg-red-600"
                    >
                    Delete All
                    </button>

                  <button onClick={() => navigate("/checkout", {  state: { total: totalPrice,cartItems: cartItems,  },}) } className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700">
                   Checkout
                  </button>


                </div>
            </div>

          </>
        )}
      </div>
    </>
  );
}
