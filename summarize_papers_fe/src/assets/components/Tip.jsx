import React from "react";

const Tip = ({ icon, text }) => (
  <div className="flex items-start gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:border-[#1111d4]/30 transition-all hover:shadow-md group">
    <div className="text-[#1111d4] shrink-0 bg-blue-50 p-2 rounded-xl group-hover:scale-110 transition-transform">
      {icon}
    </div>
    <p className="text-[11px] font-bold text-slate-500 leading-relaxed tracking-tight uppercase font-display">
      {text}
    </p>
  </div>
);

export default Tip;
