import React from "react";
import { Eye, Download, MoreHorizontal } from "lucide-react";
import { useNavigate } from "react-router-dom";

// 1. Thêm prop 'id' vào đây
const TableRow = ({ id, title, status, category, date }) => {
  const navigate = useNavigate();

  const statusStyles = {
    Completed: "bg-emerald-50 text-emerald-600 border-emerald-100",
    Processing: "bg-blue-50 text-blue-600 border-blue-100",
    Failed: "bg-red-50 text-red-600 border-red-100",
  };

  return (
    <tr className="group hover:bg-slate-50/50 transition-colors h-[70px]">
      <td className="px-8 py-0">
        <p className="text-sm font-bold text-slate-900 group-hover:text-[#1111d4] transition-colors truncate max-w-xs">
          {title}
        </p>
      </td>
      <td className="px-8 py-0 text-center">
        <span
          className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase border ${statusStyles[status] || statusStyles.Completed}`}
        >
          {status}
        </span>
      </td>
      <td className="px-8 py-0 text-sm text-slate-500 font-medium">
        {category}
      </td>
      <td className="px-8 py-0 text-sm text-slate-400">{date}</td>

      <td className="px-8 py-0 text-right relative">
        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-all duration-200">
          <button
            // 2. Sửa lại: Nối ID vào đường dẫn (ví dụ: /analysis/123)
            onClick={() => navigate(`/analysis/${id}`)}
            className="p-2 text-slate-400 hover:text-[#1111d4] hover:bg-blue-50 rounded-lg transition-all cursor-pointer"
            title="View Summary"
          >
            <Eye size={16} strokeWidth={2.5} />
          </button>
          <button
            className="p-2 text-slate-400 hover:text-[#1111d4] hover:bg-blue-50 rounded-lg transition-all cursor-pointer"
            title="Download PDF"
          >
            <Download size={16} strokeWidth={2.5} />
          </button>
        </div>

        <div className="absolute right-10 top-1/2 -translate-y-1/2 group-hover:hidden text-slate-300 flex items-center justify-end">
          <MoreHorizontal size={20} />
        </div>
      </td>
    </tr>
  );
};

export default TableRow;
