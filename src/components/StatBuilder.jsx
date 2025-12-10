import React from "react";
export default function StatBuilder({ title, value, icon, color, className }) {
  return (
    <div
      className={`flex flex-col items-center ${
        className ? ` ${className}` : ""
      }`}
    >
      <div className={`mb-4 text-4xl p-2 rounded-full ${color}`}>{icon}</div>
      <div className="text-2xl">{value}</div>
      <div className={`${color}`}>{title}</div>
    </div>
  );
}
