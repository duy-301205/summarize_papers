import React, { useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const TopicsChart = ({ data = [] }) => {
  const [hoveredTopic, setHoveredTopic] = useState(null);

  const colors = ["#1111d4", "#4f46e5", "#8b5cf6", "#e2e8f0"];

  // Giới hạn hiển thị: top 3 + Others
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

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 overflow-hidden">
      <h3 className="text-lg font-bold mb-8 text-center text-slate-900 italic uppercase">
        Top Research Journals
      </h3>

      <div className="relative w-full h-[320px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={processedTopics}
              dataKey="value"
              nameKey="label"
              cx="50%"
              cy="50%"
              outerRadius={120}
              innerRadius={0}
              paddingAngle={1}
              labelLine={false}
              label={({ label, percentage }) =>
                percentage >= 8
                  ? `${label.length > 12 ? `${label.slice(0, 12)}...` : label}\n${percentage}%`
                  : ""
              }
              onMouseEnter={(_, index) =>
                setHoveredTopic(processedTopics[index])
              }
              onMouseLeave={() => setHoveredTopic(null)}
            >
              {processedTopics.map((entry, index) => (
                <Cell key={index} fill={entry.color} />
              ))}
            </Pie>

            <Tooltip
              content={({ active }) => {
                if (!active || !hoveredTopic) return null;

                return (
                  <div className="rounded-xl bg-slate-900 px-4 py-3 shadow-xl border border-slate-700">
                    <p className="text-xs font-bold text-white leading-snug">
                      {hoveredTopic.label}
                    </p>

                    <p className="mt-1 text-[10px] font-black text-slate-300 uppercase tracking-widest">
                      {hoveredTopic.value} bài báo · {hoveredTopic.percentage}%
                    </p>
                  </div>
                );
              }}
            />
          </PieChart>
        </ResponsiveContainer>

        {/* Tổng bài báo ở giữa */}
        <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
          <span className="text-4xl font-black text-slate-900">
            {totalArticles}
          </span>

          <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">
            Total
          </span>
        </div>
      </div>
    </div>
  );
};

export default TopicsChart;
