import React from "react";

export default function PageLayout({ title, children }) {
  return (
    <div className="bg-[#F5F5F1] p-6 rounded shadow">
      <h1 className="text-2xl font-semibold text-[#A78074] ">{title}</h1>
      {children}
    </div>
  );
}
