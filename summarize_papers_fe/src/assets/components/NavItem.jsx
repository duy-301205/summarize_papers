import React from "react";
import { NavLink } from "react-router-dom";

const NavItem = ({ icon, label, to = "#", onClick }) => (
  <NavLink
    to={to}
    onClick={onClick}
    className={({ isActive }) => `
      flex items-center gap-3 px-4 py-3 rounded-xl transition-all group
      ${
        isActive
          ? "bg-[#1111d4] text-white shadow-md shadow-blue-900/10"
          : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
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
