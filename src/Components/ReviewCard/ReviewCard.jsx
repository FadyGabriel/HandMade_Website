import React from "react";

export default function ReviewCard({ product, rating, comment, user }) {
  return (
    <div className="bg-white border border-[#E0E0DC] rounded-xl shadow p-5 hover:shadow-md transition duration-300 space-y-3">
      <h3 className="text-[#A78074] font-semibold text-base">{product}</h3>

      <div className="flex items-center gap-1 text-yellow-400">
        {Array.from({ length: 5 }).map((_, i) => (
          <span key={i} className={`text-lg ${i < rating ? "" : "text-gray-300"}`}>
            ★
          </span>
        ))}
        <span className="ml-2 text-xs text-gray-500">({rating}/5)</span>
      </div>

      <p className="text-gray-700 text-sm italic">"{comment}"</p>

      <p className="text-xs text-right text-gray-500">– {user}</p>
    </div>
  );
}
