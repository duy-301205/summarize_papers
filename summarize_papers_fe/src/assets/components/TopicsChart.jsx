import React, { useState } from "react";

const TopicsChart = ({ data = [] }) => {
  const [hoveredTopic, setHoveredTopic] = useState(null);

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

      <div className="flex flex-col 2xl:flex-row items-center gap-8">
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
                  className="transition-all duration-500 cursor-pointer"
                  onMouseEnter={() => setHoveredTopic(t)}
                  onMouseLeave={() => setHoveredTopic(null)}
                />
              );
            })}
          </svg>

          {hoveredTopic && (
            <div className="absolute -top-14 left-1/2 -translate-x-1/2 z-20 w-56 rounded-xl bg-slate-900 px-3 py-2 text-center shadow-xl">
              <p className="text-[11px] font-bold text-white leading-snug">
                {hoveredTopic.label}
              </p>
              <p className="mt-1 text-[10px] font-black text-slate-300 uppercase tracking-widest">
                {hoveredTopic.value} bài báo · {hoveredTopic.percentage}%
              </p>
            </div>
          )}

          <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
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
                className="flex items-start gap-3 rounded-2xl px-4 py-3 hover:bg-slate-50 transition-colors"
                title={t.label}
              >
                <div
                  className="w-3 h-3 rounded-full shrink-0 mt-1"
                  style={{ backgroundColor: t.color }}
                />

                <div className="min-w-0 flex-1">
                  <p
                    className="text-sm font-bold text-slate-700 leading-snug overflow-hidden"
                    style={{
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                    }}
                  >
                    {t.label}
                  </p>
                  <p className="mt-1 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    {t.value} bài báo
                  </p>
                </div>
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
