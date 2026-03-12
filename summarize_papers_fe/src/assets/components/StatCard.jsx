import React from "react";
import { TrendingUp } from "lucide-react";

const StatCard = ({ icon, label, value, trend, isGreen = false }) => (
  <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
    <div className="flex justify-between items-start mb-4">
      <div className="bg-blue-50 p-2.5 rounded-xl text-[#1111d4]">{icon}</div>
      <span
        className={`text-[10px] font-black flex items-center gap-1 px-2 py-1 rounded-full ${
          isGreen
            ? "bg-emerald-50 text-emerald-600"
            : "bg-blue-50 text-[#1111d4]"
        }`}
      >
        <TrendingUp size={10} /> {trend}
      </span>
    </div>
    <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">
      {label}
    </p>
    <h3 className="text-2xl font-black mt-1 text-slate-900 font-display">
      {value}
    </h3>
  </div>
);

export default StatCard;
