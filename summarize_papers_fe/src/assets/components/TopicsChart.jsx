import React from "react";

const TopicsChart = ({ data = [] }) => {
  // 1. Định nghĩa bảng màu cố định cho các tạp chí
  const colors = ["#1111d4", "#4f46e5", "#8b5cf6", "#e2e8f0"];

  // 2. Giới hạn hiển thị: 3 topic đầu + Others
  let displayData = [...data];

  if (data.length > 3) {
    const top3 = data.slice(0, 3);

    const othersValue = data
      .slice(3)
      .reduce((sum, item) => sum + item.value, 0);

    displayData = [
      ...top3,
      {
        label: "Others",
        value: othersValue,
      },
    ];
  }

  // 3. Tính tổng số lượng bài báo
  const totalArticles = displayData.reduce((acc, curr) => acc + curr.value, 0);

  // 4. Xử lý dữ liệu hiển thị
  const processedTopics = displayData.map((item, index) => ({
    label: item.label,
    value: item.value,
    percentage:
      totalArticles > 0 ? Math.round((item.value / totalArticles) * 100) : 0,
    color: colors[index % colors.length],
  }));

  // Biến hỗ trợ tính offset
  let cumulativePercentage = 0;

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 overflow-hidden">
      <h3 className="text-lg font-bold mb-8 text-slate-900 italic uppercase">
        Top Research Journals
      </h3>

      <div className="flex flex-col xl:flex-row items-center xl:items-start justify-between gap-8 min-w-0">
        {/* Donut Chart */}
        <div className="relative w-44 h-44 shrink-0">
          <svg
            className="w-full h-full transform -rotate-90"
            viewBox="0 0 36 36"
          >
            {/* Background Circle */}
            <circle
              cx="18"
              cy="18"
              r="16"
              fill="transparent"
              stroke="#f1f5f9"
              strokeWidth="4"
            />

            {/* Data Circles */}
            {processedTopics.map((t, i) => {
              const strokeDasharray = `${t.percentage}, 100`;
              const strokeDashoffset = -cumulativePercentage;

              cumulativePercentage += t.percentage;

              return (
                <circle
                  key={i}
                  cx="18"
                  cy="18"
                  r="16"
                  fill="transparent"
                  stroke={t.color}
                  strokeWidth="4"
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  className="transition-all duration-500"
                />
              );
            })}
          </svg>

          {/* Center Total */}
          <div className="absolute inset-0 flex items-center justify-center flex-col">
            <span className="text-3xl font-black text-slate-900">
              {totalArticles}
            </span>

            <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">
              Total
            </span>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-col gap-4 w-full min-w-0">
          {processedTopics.length > 0 ? (
            processedTopics.map((t) => (
              <div
                key={t.label}
                className="flex items-start justify-between gap-4 group cursor-default min-w-0"
              >
                <div className="flex items-start gap-3 min-w-0 flex-1">
                  <div
                    className="w-3 h-3 rounded-full mt-1 shrink-0"
                    style={{ backgroundColor: t.color }}
                  />

                  <span
                    className="text-sm font-bold text-slate-600 group-hover:text-slate-900 transition-colors truncate"
                    title={t.label}
                  >
                    {t.label}
                  </span>
                </div>

                <span className="text-sm font-black text-slate-900 shrink-0">
                  {t.percentage}%
                </span>
              </div>
            ))
          ) : (
            <p className="text-sm text-slate-400 italic">No data available</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default TopicsChart;
