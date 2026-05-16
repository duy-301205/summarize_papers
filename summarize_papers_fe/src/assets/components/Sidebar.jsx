import React from "react";
import {
  Beaker,
  UploadCloud,
  FileText,
  BarChart3,
  Settings,
} from "lucide-react";
import NavItem from "./NavItem";

const Sidebar = ({ onNavigate }) => {
  return (
    <aside className="w-72 h-full bg-white border-r border-slate-200 flex flex-col shrink-0 font-display z-20">
      <div className="p-6 flex items-center gap-3">
        <div className="bg-[#1111d4] size-10 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-900/20">
          <Beaker size={24} strokeWidth={2.5} />
        </div>
        <div className="flex flex-col">
          <h1 className="text-slate-900 text-lg font-bold leading-tight tracking-tight uppercase">
            SciSum AI
          </h1>
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">
            Research Hub
          </p>
        </div>
      </div>

      <nav onClick={onNavigate} className="flex-1 px-4 py-4 space-y-1">
        <NavItem
          to="/upload"
          icon={<UploadCloud size={18} />}
          label="Upload Article"
          onClick={onNavigate}
        />
        <NavItem
          to="/summaries"
          icon={<FileText size={18} />}
          label="My Summaries"
          onClick={onNavigate}
        />
        <NavItem
          to="/dashboard"
          icon={<BarChart3 size={18} />}
          label="Analytics"
          onClick={onNavigate}
        />
        <NavItem
          to="/settings"
          icon={<Settings size={18} />}
          label="Settings Profile"
          onClick={onNavigate}
        />
      </nav>

      <div className="p-6 mt-auto border-t border-slate-100">
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
          <p className="text-[10px] font-bold text-slate-400 mb-2 uppercase tracking-wider">
            Storage Usage
          </p>
          <div className="w-full bg-slate-200 rounded-full h-1.5 mb-2">
            <div
              className="bg-[#1111d4] h-1.5 rounded-full"
              style={{ width: "65%" }}
            ></div>
          </div>
          <p className="text-[10px] font-bold text-slate-700 text-center uppercase tracking-tighter">
            12.4 GB / 20 GB
          </p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
