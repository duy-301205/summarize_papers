import React from "react";
import { Link } from "react-router-dom";

const NavItem = ({ icon, label, to = "#", active = false }) => (
  <Link
    to={to}
    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all group ${
      active
        ? "bg-[#1111d4] text-white shadow-md shadow-blue-900/10"
        : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
    }`}
  >
    <span
      className={`${active ? "text-white" : "group-hover:text-[#1111d4]"} transition-colors`}
    >
      {icon}
    </span>
    <span className="text-sm font-bold tracking-tight font-display">
      {label}
    </span>
  </Link>
);

export default NavItem;
