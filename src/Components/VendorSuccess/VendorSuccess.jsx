import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const PaymentSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/vendorhome");
    }, 2000);

    return () => clearTimeout(timer); // Cleanup in case component unmounts early
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#A78074]">
      <div className="bg-white rounded-full p-10 shadow-lg">
        <div className="text-center">
          <div className="text-5xl text-green-600 mb-4">✓</div>
          <h2 className="text-2xl font-bold text-[#4b3832]">Payment Successful!</h2>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
