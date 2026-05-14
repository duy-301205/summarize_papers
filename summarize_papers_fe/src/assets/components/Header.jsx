import React, { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import NotificationDropdown from "./NotificationDropdown";
import { getMe } from "../config/api";

const Header = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await getMe();
        setUser(res.data.data);
      } catch (error) {
        console.error("Lỗi lấy thông tin user:", error);
      }
    };

    fetchUser();
  }, []);

  return (
    <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0 sticky top-0 z-10 font-display">
      <div className="flex-1 max-w-xl">
        <div className="relative group">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#1111d4] transition-colors"
            size={18}
          />
          <input
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-[#1111d4]/20 focus:bg-white transition-all text-sm outline-none font-light"
            placeholder="Search research papers, summaries..."
          />
        </div>
      </div>

      <div className="flex items-center gap-6">
        <NotificationDropdown />
        <div className="h-8 w-px bg-slate-200"></div>

        <div
          onClick={() => navigate("/settings")}
          className="flex items-center gap-3 pl-2 cursor-pointer hover:opacity-80 transition-all group"
        >
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-slate-900 leading-none group-hover:text-[#1111d4] transition-colors">
              {user?.username || "User"}
            </p>

            <p className="text-[10px] font-bold text-[#1111d4] uppercase mt-1 tracking-tighter">
              {user?.institution || "Researcher"}
            </p>
          </div>

          <img
            className="size-10 rounded-full border-2 border-blue-100 shadow-sm object-cover group-hover:border-[#1111d4] transition-all"
            src={`https://ui-avatars.com/api/?name=${user?.username || "User"}`}
            alt="Avatar"
          />
        </div>
      </div>
    </header>
  );
};

export default Header;
