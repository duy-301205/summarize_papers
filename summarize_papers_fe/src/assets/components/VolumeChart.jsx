import React from "react";

const VolumeChart = ({ data = [] }) => {
  // 1. Tạo danh sách 12 tháng của năm hiện tại (ví dụ: 2026-01 đến 2026-12)
  const currentYear = new Date().getFullYear();
  const fullYearData = Array.from({ length: 12 }, (_, i) => {
    const month = String(i + 1).padStart(2, '0');
    const label = `${currentYear}-${month}`;
    
    // Tìm xem trong data từ API có tháng này không
    const found = data.find(item => item.label === label);
    return {
      label: label,
      value: found ? found.value : 0 // Nếu không có thì để 0
    };
  });

  // 2. Tìm giá trị lớn nhất để tính tỉ lệ chiều cao (tối thiểu là 1 để tránh chia cho 0)
  const maxValue = Math.max(...fullYearData.map(item => item.value), 1);

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
                t === "30D" ? "bg-white text-[#1111d4] shadow-sm" : "text-slate-400 hover:text-slate-600"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="relative h-[250px] w-full flex items-end gap-1.5 px-2">
        {fullYearData.map((item, i) => {
          // Tính chiều cao: tháng có dữ liệu thì cao theo tỉ lệ, 
          // tháng bằng 0 thì cho cao 3% để vẫn thấy cái chân cột
          const heightPercent = item.value > 0 
            ? (item.value / maxValue) * 100 
            : 3;

          return (
            <div
              key={i}
              className={`flex-1 relative group transition-all cursor-pointer rounded-t-sm
                ${item.value > 0 
                  ? 'bg-[#1111d4]/20 border-t-2 border-[#1111d4] hover:bg-[#1111d4]/30' 
                  : 'bg-slate-100 hover:bg-slate-200'
                }`}
              style={{ height: `${heightPercent}%` }}
            >
              {/* Tooltip hiện nhãn tháng và số lượng bài */}
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] py-1.5 px-3 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20 shadow-xl pointer-events-none">
                Tháng {item.label.split('-')[1]}: {item.value} bài báo
              </div>
            </div>
          );
        })}
      </div>

      {/* Hiển thị mốc thời gian dưới chân biểu đồ */}
      <div className="flex justify-between mt-6 text-[10px] text-slate-400 font-black uppercase tracking-widest">
        <span>Jan</span>
        <span>Jun</span>
        <span>Dec</span>
      </div>
    </div>
  );
};

export default VolumeChart;