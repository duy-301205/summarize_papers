import React from "react";

const VolumeChart = ({ data = [] }) => {
  // 1. Tạo danh sách 12 tháng của năm hiện tại (ví dụ: 2026-01 đến 2026-12)
  const currentYear = new Date().getFullYear();

  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const fullYearData = Array.from({ length: 12 }, (_, i) => {
    const month = String(i + 1).padStart(2, "0");
    const label = `${currentYear}-${month}`;

    // Tìm xem trong data từ API có tháng này không
    const found = data.find((item) => item.label === label);

    return {
      label,
      month: monthNames[i],
      value: found ? found.value : 0,
    };
  });

  // 2. Tìm giá trị lớn nhất để tính tỉ lệ chiều cao
  const maxValue = Math.max(...fullYearData.map((item) => item.value), 1);

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-lg font-bold text-slate-900 italic uppercase">
            Summarization Volume
          </h3>

          <p className="text-sm text-slate-500 font-medium">
            Monthly processing volume for {currentYear}
          </p>
        </div>

        <div className="flex bg-slate-50 p-1 rounded-xl border border-slate-100">
          {["7D", "30D", "90D"].map((t) => (
            <button
              key={t}
              className={`text-[10px] font-bold px-4 py-2 rounded-lg transition-all ${
                t === "30D"
                  ? "bg-white text-[#1111d4] shadow-sm"
                  : "text-slate-400 hover:text-slate-600"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="relative h-[250px] w-full">
        {/* Grid nền */}
        <div className="absolute inset-0 flex flex-col justify-between">
          {[0, 1, 2, 3].map((line) => (
            <div key={line} className="border-t border-slate-100" />
          ))}
        </div>

        {/* Cột biểu đồ */}
        <div className="relative z-10 h-full flex items-end gap-3 px-1">
          {fullYearData.map((item, i) => {
            const heightPercent =
              item.value > 0 ? Math.max((item.value / maxValue) * 100, 12) : 0;

            return (
              <div
                key={i}
                className="flex-1 h-full flex flex-col justify-end items-center group"
              >
                <div className="relative w-full flex justify-center items-end h-full">
                  {/* Hiển thị số bài báo */}
                  <span className="absolute -top-6 text-[10px] font-black text-slate-700">
                    {item.value}
                  </span>

                  {/* Cột */}
                  <div
                    className={`w-full max-w-8 rounded-t-xl transition-all duration-300 cursor-pointer ${
                      item.value > 0
                        ? "bg-[#1111d4]/25 border-t-2 border-[#1111d4] hover:bg-[#1111d4]/40"
                        : "bg-slate-100/70"
                    }`}
                    style={{ height: `${heightPercent}%` }}
                  />
                </div>

                {/* Label tháng */}
                <span className="mt-3 text-[10px] text-slate-400 font-black uppercase">
                  {item.month}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default VolumeChart;
