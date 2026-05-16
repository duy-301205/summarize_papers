import React from "react";

const TopicsChart = ({ data = [] }) => {
  const colors = ["#1111d4", "#4f46e5", "#8b5cf6", "#e2e8f0"];

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

  const totalArticles = displayData.reduce((acc, curr) => acc + curr.value, 0);

  const processedTopics = displayData.map((item, index) => ({
    label: item.label,
    value: item.value,
    percentage:
      totalArticles > 0 ? Math.round((item.value / totalArticles) * 100) : 0,
    color: colors[index % colors.length],
  }));

  let cumulativePercentage = 0;

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 overflow-hidden">
      <h3 className="text-lg font-bold mb-8 text-slate-900 italic uppercase">
        Top Research Journals
      </h3>

      <div className="flex flex-col xl:flex-row items-center gap-10">
        <div className="relative w-48 h-48 shrink-0">
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

          <div className="absolute inset-0 flex items-center justify-center flex-col">
            <span className="text-4xl font-black text-slate-900">
              {totalArticles}
            </span>
            <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">
              Total
            </span>
          </div>
        </div>

        <div className="flex-1 w-full min-w-0 space-y-3">
          {processedTopics.length > 0 ? (
            processedTopics.map((t) => (
              <div
                key={t.label}
                className="flex items-center gap-4 rounded-2xl px-4 py-3 hover:bg-slate-50 transition-colors"
                title={t.label}
              >
                <div
                  className="w-3 h-3 rounded-full shrink-0"
                  style={{ backgroundColor: t.color }}
                />

                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-slate-700 truncate">
                    {t.label}
                  </p>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    {t.value} bài báo
                  </p>
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
