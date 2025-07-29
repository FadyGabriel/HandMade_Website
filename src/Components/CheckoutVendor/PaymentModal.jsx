import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../../firebase";
import { addDoc, collection, serverTimestamp, getDocs, query, where, deleteDoc, doc } from "firebase/firestore";

const PaymentModal = ({ method, onClose, cartItems = [], total = 0 }) => {
  const navigate = useNavigate();


  const isCash = method.toLowerCase() === "cash" || method.toLowerCase() === "cach";


  const totalQuantity = cartItems.reduce(
    (sum, item) => sum + (item.quantity || 1),
    0
  );
  const deliveryFee = totalQuantity * 5;
  const grandTotal = total + deliveryFee;

 
  const [formData, setFormData] = useState({
    name: "",
    card: "",
    expiry: "",
    cvv: "",
  });

  const [errors, setErrors] = useState({});
  const [isValid, setIsValid] = useState(isCash); // Cash starts VALID

  /* ============ Validation ============ */
  const validate = () => {
    if (isCash) {
      setErrors({});
      setIsValid(true);
      return;
    }

    const errs = {};

    if (!formData.name.trim()) {
      errs.name = "Name is required";
    } else if (!/^[A-Za-z\s]+$/.test(formData.name.trim())) {
      errs.name = "Only letters and spaces allowed";
    }

    if (!/^\d{16}$/.test(formData.card.replace(/\s/g, ""))) {
      errs.card = "16-digit card number required";
    }

    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(formData.expiry)) {
      errs.expiry = "MM/YY format required";
    }

    if (!/^\d{3,4}$/.test(formData.cvv)) {
      errs.cvv = "CVV must be 3–4 digits";
    }

    setErrors(errs);
    setIsValid(Object.keys(errs).length === 0);
  };

  useEffect(validate, [formData, isCash]);

  /* ============ Handlers ============ */
  const handleChange = (e) => {
    const { name, value } = e.target;
    let val = value;

    if (name === "card") {
      val = val.replace(/\D/g, "").substring(0, 16);
      val = val.replace(/(.{4})/g, "$1 ").trim();
    }

    setFormData({ ...formData, [name]: val });
  };

  const deleteAllUserCartItems = async (userId) => {
    try {
      const cartQuery = query(collection(db, "Cart"), where("userId", "==", userId));
      const snapshot = await getDocs(cartQuery);
      const deletions = snapshot.docs.map((docSnap) =>
        deleteDoc(doc(db, "Cart", docSnap.id))
      );
      await Promise.all(deletions);
    } catch (err) {
      console.error("Failed to delete cart items:", err);
    }
  };

  const handleSubmit = async () => {
    if (!isValid) return;
  
    const user = auth.currentUser;
    if (!user) {
      alert("You must be logged in to place an order.");
      return;
    }
  
    try {
      // 1. Save Order
      await addDoc(collection(db, "Orders"), {
        userId: user.uid,
        email: user.email,
        customerName: isCash ? "Cash Customer" : formData.name,
        paymentMethod: isCash ? "Cash" : method,
        total: grandTotal,
        cartItems,
        createdAt: serverTimestamp(),
        status: "pending",
      });
  
      // 2. Delete all cart items
      await deleteAllUserCartItems(user.uid);
  
      // 3. Navigate to success page
      onClose();
      navigate("/paymentsuccessvendor");
  
    } catch (error) {
      console.error("Error saving order:", error);
      alert("Failed to place order. Try again.");
    }
  };
  

  const handleCancel = () => {
    onClose();
    navigate("/vendor/cart");
  };

  /* ============ JSX ============ */
  return (
    <div className="fixed inset-0 bg-[#A78074]/20 backdrop-blur-md flex items-center justify-center z-50">
      <div className="bg-[#F5F5F1] rounded-3xl shadow-2xl w-full max-w-md p-6 relative border border-[#A78074]/30">
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-[#A78074] hover:text-red-500 text-xl font-bold"
        >
          ×
        </button>

        <h2 className="text-2xl font-[Playfair_Display] text-[#A78074] mb-4 text-center">
          {isCash ? "Cash on Delivery" : `${method} Payment`}
        </h2>

        {/* Order Summary */}
        <div className="bg-white rounded-xl p-4 mb-4 shadow-sm">
          <p className="text-[#4b3832] font-semibold">Items: {totalQuantity}</p>
          <p className="text-[#4b3832]">Order: EGP {total.toFixed(2)}</p>
          <p className="text-[#4b3832]">
            Delivery: EGP {deliveryFee.toFixed(2)} ({totalQuantity} × 5 EGP)
          </p>
          <p className="font-bold text-[#A78074]">
            Total: EGP {grandTotal.toFixed(2)}
          </p>
        </div>

        {/* Card Form – hidden if Cash */}
        {!isCash && (
          <div className="space-y-4">
            <div>
              <input
                name="name"
                placeholder="Cardholder Name"
                value={formData.name}
                onChange={handleChange}
                onKeyDown={(e) => {
                  if (/\d/.test(e.key)) e.preventDefault();
                }}
                className={`w-full p-3 rounded-xl border ${
                  errors.name ? "border-red-400" : "border-[#e0dcd8]"
                } bg-[#f9f9f7] text-[#A78074]`}
              />
              {errors.name && (
                <p className="text-red-500 text-sm">{errors.name}</p>
              )}
            </div>

            <div>
              <input
                name="card"
                placeholder="Card Number"
                maxLength={19}
                value={formData.card}
                onChange={handleChange}
                className={`w-full p-3 rounded-xl border ${
                  errors.card ? "border-red-400" : "border-[#e0dcd8]"
                } bg-[#f9f9f7] text-[#A78074]`}
              />
              {errors.card && (
                <p className="text-red-500 text-sm">{errors.card}</p>
              )}
            </div>

            <div className="flex gap-4">
              <input
                name="expiry"
                placeholder="MM/YY"
                value={formData.expiry}
                onChange={handleChange}
                className={`w-1/2 p-3 rounded-xl border ${
                  errors.expiry ? "border-red-400" : "border-[#e0dcd8]"
                } bg-[#f9f9f7] text-[#A78074]`}
              />
              <input
                name="cvv"
                placeholder="CVV"
                maxLength={4}
                value={formData.cvv}
                onChange={handleChange}
                className={`w-1/2 p-3 rounded-xl border ${
                  errors.cvv ? "border-red-400" : "border-[#e0dcd8]"
                } bg-[#f9f9f7] text-[#A78074]`}
              />
            </div>
          </div>
        )}

        {/* Buttons */}
        <div className="flex flex-col gap-3 mt-6">
          <button
            onClick={handleSubmit}
            disabled={!isValid}
            className={`w-full py-3 rounded-xl font-semibold transition-all duration-300 ${
              isValid
                ? "bg-[#A78074] text-white hover:bg-white hover:text-[#A78074] border border-[#A78074]"
                : "bg-gray-300 cursor-not-allowed text-white"
            }`}
          >
            {isCash ? "Place Order" : "Confirm Payment"}
          </button>

          <button
            onClick={handleCancel}
            className="w-full py-3 rounded-xl font-semibold border border-red-400 text-red-500 hover:bg-red-100 transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
