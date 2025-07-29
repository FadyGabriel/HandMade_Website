// Checkout.jsx
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import PaymentModal from "./PaymentModal";
import AddressForm from "./AddressForm";
import VendorNavbar from "../VendorNavbar/VendorNavbar";


const LS_KEY = "checkoutAddress";

const getSavedAddress = () => {
  try {
    const data = localStorage.getItem(LS_KEY);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
};

const saveAddress = (address) => {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(address));
  } catch {
    console.warn("Unable to access localStorage");
  }
};

const clearAddress = () => localStorage.removeItem(LS_KEY);
/* ================================= */

const Checkout = () => {
  const location = useLocation();

  // ❶ استرجاع العنوان (إن وُجد) من localStorage
  const [address, setAddress] = useState(() => getSavedAddress());
  const addressSaved = Boolean(address);

  const [method, setMethod]   = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [total, setTotal]     = useState(0);
  const [cartItems, setCartItems] = useState([]);

  // ❷ استلام بيانات الطلب من الصفحة السابقة
  useEffect(() => {
    setTotal(location.state?.total || 0);
    setCartItems(location.state?.cartItems || []);
  }, [location]);

  // ❸ كلما تغيّر العنوان، خزِّنه في localStorage
  useEffect(() => {
    if (address) saveAddress(address);
  }, [address]);

  // ❹ عند Edit امسح التخزين
  const handleEdit = () => {
    clearAddress();
    setAddress(null);
  };

  const handlePayNow = () => {
    if (!method) {
      alert("Please select a payment method first.");
      return;
    }
    setShowModal(true);
  };

  const totalQuantity = cartItems.reduce(
    (sum, item) => sum + (item.quantity || 1),
    0
  );
  const deliveryFee = totalQuantity * 5;
  const grandTotal  = total + deliveryFee;

  return (
    <>
      <VendorNavbar></VendorNavbar>
    <div className="min-h-screen flex items-center justify-center bg-[#F5F5F1] px-4 py-10">
      <div className="bg-white shadow-xl rounded-3xl max-w-lg w-full p-8 space-y-6 border border-[#A78074]/20">
        <h2 className="text-3xl font-[Playfair_Display] text-[#A78074] text-center">
          Checkout
        </h2>

        {/* خطوة عنوان الشحن */}
        {!addressSaved ? (
          <AddressForm onSave={setAddress} />
        ) : (
          <div className="bg-[#faf8f6] p-5 rounded-xl border border-[#A78074]/20">
            <h3 className="text-lg font-semibold text-[#A78074] mb-1">
              Shipping Address
            </h3>
            <p className="text-[#4b3832] leading-relaxed">
              {address.fullName} <br />
              {address.phone} <br />
              {address.address}, {address.area}, {address.city}
              {address.floor && `, Floor ${address.floor}`}
            </p>
            <button
              onClick={handleEdit}
              className="mt-2 text-sm text-[#A78074] underline"
            >
              Edit
            </button>
          </div>
        )}

        {/* ملخص الطلب */}
        <div className="bg-[#faf8f6] p-5 rounded-xl border border-[#A78074]/20">
          <h3 className="text-lg font-semibold text-[#A78074] mb-1">
            Item Summary
          </h3>
          <div className="flex justify-between text-[#4b3832]">
            <span>Order Total</span>
            <span>{total.toFixed(2)} EGP</span>
          </div>
          <div className="flex justify-between text-[#4b3832]">
            <span>Delivery ({totalQuantity} × 5)</span>
            <span>{deliveryFee.toFixed(2)} EGP</span>
          </div>
          <div className="flex justify-between font-bold text-[#A78074] mt-2 border-t pt-2 border-[#e0dcd8]">
            <span>Summary</span>
            <span>{grandTotal.toFixed(2)} EGP</span>
          </div>
        </div>

        {/* طرق الدفع (تظهر فقط بعد حفظ العنوان) */}
        {addressSaved && (
          <>
            <div>
              <p className="font-medium text-[#A78074] mb-2 text-center">
                Choose Payment Method
              </p>
              <div className="flex gap-3 justify-center flex-wrap">
                {["Paypal", "Cash", "Visa"].map((option) => (
                  <button
                    key={option}
                    onClick={() => setMethod(option)}
                    className={`px-4 py-2 rounded-xl border transition font-medium ${
                      method === option
                        ? "bg-[#A78074] text-white border-[#A78074]"
                        : "bg-white text-[#A78074] border-[#A78074] hover:bg-[#F5F5F1]"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handlePayNow}
              className={`w-full py-3 rounded-xl font-semibold transition-all duration-300 ${
                method
                  ? "bg-[#A78074] text-white hover:bg-white hover:text-[#A78074] border border-[#A78074]"
                  : "bg-gray-300 cursor-not-allowed text-white"
              }`}
              disabled={!method}
            >
              Pay Now
            </button>
          </>
        )}
      </div>

      {showModal && (
        <PaymentModal
          method={method}
          onClose={() => setShowModal(false)}
          cartItems={cartItems}
          total={total}
          address={address}
        />
      )}
    </div>
    </>
  );
};

export default Checkout;
