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

    displayData = [...top3, { label: "Others", value: othersValue }];
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

      <div className="relative mx-auto w-72 h-72">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
          {processedTopics.map((t, i) => {
            const strokeDasharray = `${t.percentage}, 100`;
            const strokeDashoffset = -cumulativePercentage;
            const start = cumulativePercentage;

            cumulativePercentage += t.percentage;

            const midPercentage = start + t.percentage / 2;
            const angle = (midPercentage / 100) * 360 - 90;
            const radius = 10.5;
            const x = 18 + radius * Math.cos((angle * Math.PI) / 180);
            const y = 18 + radius * Math.sin((angle * Math.PI) / 180);

            return (
              <g key={i}>
                <circle
                  cx="18"
                  cy="18"
                  r="16"
                  fill="transparent"
                  stroke={t.color}
                  strokeWidth="32"
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  className="transition-all duration-500 cursor-pointer"
                  onMouseEnter={() => setHoveredTopic(t)}
                  onMouseLeave={() => setHoveredTopic(null)}
                />

                {t.percentage >= 10 && (
                  <text
                    x={x}
                    y={y}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="rotate-90 fill-white text-[2.2px] font-black"
                    style={{ transformOrigin: `${x}px ${y}px` }}
                  >
                    <tspan x={x}>
                      {t.label.length > 10
                        ? `${t.label.slice(0, 10)}...`
                        : t.label}
                    </tspan>
                    <tspan x={x} dy="2.6">
                      {t.percentage}%
                    </tspan>
                  </text>
                )}
              </g>
            );
          })}
        </svg>

        {hoveredTopic && (
          <div className="absolute -top-12 left-1/2 -translate-x-1/2 z-20 w-56 rounded-xl bg-slate-900 px-3 py-2 text-center shadow-xl">
            <p className="text-[11px] font-bold text-white leading-snug">
              {hoveredTopic.label}
            </p>
            <p className="mt-1 text-[10px] font-black text-slate-300 uppercase tracking-widest">
              {hoveredTopic.value} bài báo · {hoveredTopic.percentage}%
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TopicsChart;
