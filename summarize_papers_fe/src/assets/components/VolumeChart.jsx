import React from "react";

const VolumeChart = () => {
  // Giả lập dữ liệu các cột
  const data = [40, 55, 45, 70, 65, 80, 75, 90, 85, 60, 70, 95, 88, 72];

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-lg font-bold text-slate-900">
            Summarization Volume
          </h3>
          <p className="text-sm text-slate-500 font-medium">
            Daily processing volume for current month
          </p>
        </div>
        <div className="flex bg-slate-50 p-1 rounded-xl border border-slate-100">
          {["7D", "30D", "90D"].map((t) => (
            <button
              key={t}
              className={`text-[10px] font-bold px-4 py-2 rounded-lg transition-all ${t === "30D" ? "bg-white text-[#1111d4] shadow-sm" : "text-slate-400 hover:text-slate-600"}`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="relative h-[250px] w-full flex items-end gap-2 px-2">
        {data.map((height, i) => (
          <div
            key={i}
            className="flex-1 bg-[#1111d4]/10 border-t-2 border-[#1111d4] relative group transition-all hover:bg-[#1111d4]/20 cursor-pointer"
            style={{ height: `${height}%` }}
          >
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] py-1.5 px-3 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20 shadow-xl">
              {Math.floor(height * 1.5)} Papers
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-between mt-6 text-[10px] text-slate-400 font-black uppercase tracking-widest">
        <span>Oct 01</span>
        <span>Oct 15</span>
        <span>Oct 31</span>
      </div>
    </div>
  );
};

export default VolumeChart;
