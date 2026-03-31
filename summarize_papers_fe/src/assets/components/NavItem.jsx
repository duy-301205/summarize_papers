import React from "react";
import { NavLink } from "react-router-dom"; // Thay đổi Link thành NavLink

const NavItem = ({ icon, label, to = "#" }) => (
  <NavLink
    to={to}
    // Sử dụng hàm trong className để kiểm tra trạng thái isActive
    className={({ isActive }) => `
      flex items-center gap-3 px-4 py-3 rounded-xl transition-all group
      ${
        isActive
          ? "bg-[#1111d4] text-white shadow-md shadow-blue-900/10" // Khi được chọn
          : "text-slate-500 hover:bg-slate-50 hover:text-slate-900" // Khi bình thường
      }
    `}
  >
    {({ isActive }) => (
      <>
        <span
          className={`${
            isActive ? "text-white" : "group-hover:text-[#1111d4]"
          } transition-colors`}
        >
          {icon}
        </span>
        <span className="text-sm font-bold tracking-tight font-display">
          {label}
        </span>
      </>
    )}
  </NavLink>
);

export default NavItem;
