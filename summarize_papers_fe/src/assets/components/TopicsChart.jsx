import React from "react";

const TopicsChart = () => {
  const topics = [
    { label: "Computer Science", value: 45, color: "#1111d4" },
    { label: "Medicine", value: 25, color: "#4f46e5" },
    { label: "Physics", value: 15, color: "#8b5cf6" },
    { label: "Other", value: 15, color: "#e2e8f0" },
  ];

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8">
      <h3 className="text-lg font-bold mb-8 text-slate-900">
        Top Research Topics
      </h3>
      <div className="flex flex-col sm:flex-row items-center justify-between gap-10">
        <div className="relative w-44 h-44 shrink-0">
          <svg
            className="w-full h-full transform -rotate-90"
            viewBox="0 0 36 36"
          >
            <circle
              cx="18"
              cy="18"
              r="16"
              fill="transparent"
              stroke="#f1f5f9"
              strokeWidth="4"
            />
            <circle
              cx="18"
              cy="18"
              r="16"
              fill="transparent"
              stroke="#1111d4"
              strokeWidth="4"
              strokeDasharray="45, 100"
            />
            <circle
              cx="18"
              cy="18"
              r="16"
              fill="transparent"
              stroke="#4f46e5"
              strokeWidth="4"
              strokeDasharray="25, 100"
              strokeDashoffset="-45"
            />
            <circle
              cx="18"
              cy="18"
              r="16"
              fill="transparent"
              stroke="#8b5cf6"
              strokeWidth="4"
              strokeDasharray="15, 100"
              strokeDashoffset="-70"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center flex-col">
            <span className="text-3xl font-black text-slate-900">12.8k</span>
            <span className="text-[10px] text-slate-400 font-black uppercase">
              Total
            </span>
          </div>
        </div>
        <div className="flex flex-col gap-4 w-full">
          {topics.map((t) => (
            <div
              key={t.label}
              className="flex items-center justify-between group cursor-default"
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: t.color }}
                />
                <span className="text-sm font-bold text-slate-600 group-hover:text-slate-900 transition-colors">
                  {t.label}
                </span>
              </div>
              <span className="text-sm font-black text-slate-900">
                {t.value}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TopicsChart;
