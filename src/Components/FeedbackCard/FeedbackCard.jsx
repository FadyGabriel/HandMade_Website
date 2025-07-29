import React from "react";

export default function FeedbackCard({ user, message, status }) {
  return (
    <div className="bg-white p-4 rounded shadow space-y-2">
      <div className="text-[#A78074] font-semibold">User: {user}</div>
      <div className="text-gray-700">{message}</div>
      <div className="text-sm text-gray-500">
        Status: <span className="font-medium">{status}</span>
      </div>
    </div>
  );
}
