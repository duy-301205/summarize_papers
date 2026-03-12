import React, { useState, useEffect, useRef } from "react";
import {
  Bell,
  CheckCircle2,
  MessageSquare,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { NOTIFICATIONS_DATA } from "../data/notificationData";

export default function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Render Icon bằng Lucide dựa trên type
  const renderIcon = (type) => {
    switch (type) {
      case "success":
        return <CheckCircle2 size={18} className="text-emerald-600" />;
      case "comment":
        return <MessageSquare size={18} className="text-blue-600" />;
      case "error":
        return <AlertCircle size={18} className="text-red-500" />;
      default:
        return <RefreshCw size={18} className="text-slate-500" />;
    }
  };

  const unreadCount = NOTIFICATIONS_DATA.filter((n) => n.unread).length;

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`p-2.5 rounded-xl transition-all relative group ${
          isOpen
            ? "bg-primary/10 text-primary"
            : "text-slate-500 hover:bg-slate-50"
        }`}
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute top-2.5 right-2.5 size-2 bg-red-500 border-2 border-white rounded-full"></span>
        )}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden z-[100] animate-in fade-in zoom-in duration-150 origin-top-right">
          {/* Header */}
          <div className="px-5 py-4 border-b border-slate-100 flex justify-between items-center bg-white">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Thông báo</h3>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">
                Bạn có {unreadCount} tin nhắn mới
              </span>
            </div>
            <button className="text-[11px] font-bold text-primary hover:underline">
              Đọc tất cả
            </button>
          </div>

          {/* Danh sách thông báo */}
          <div className="max-h-[380px] overflow-y-auto custom-scrollbar">
            {NOTIFICATIONS_DATA.map((noti) => (
              <div
                key={noti.id}
                className={`group relative p-4 flex gap-4 hover:bg-slate-50 cursor-pointer transition-colors border-b border-slate-50 last:border-0 ${
                  !noti.unread ? "opacity-60" : ""
                }`}
              >
                {noti.unread && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary"></div>
                )}

                <div
                  className={`size-10 rounded-full flex items-center justify-center shrink-0 
                  ${
                    noti.type === "success"
                      ? "bg-emerald-50"
                      : noti.type === "comment"
                        ? "bg-blue-50"
                        : noti.type === "error"
                          ? "bg-red-50"
                          : "bg-slate-100"
                  }`}
                >
                  {renderIcon(noti.type)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start gap-2">
                    <p className="text-[13px] font-bold text-slate-900 truncate">
                      {noti.title}
                    </p>
                    <span className="text-[10px] font-medium text-slate-400 whitespace-nowrap">
                      {noti.time}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-2 leading-relaxed">
                    {noti.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="p-2 bg-slate-50/50 border-t border-slate-100">
            <button className="w-full py-2 text-center text-[11px] font-bold text-slate-500 hover:text-primary transition-colors">
              Xem tất cả thông báo
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
