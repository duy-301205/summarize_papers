import React from "react";
import { Beaker, LogIn } from "lucide-react";
import { Link } from "react-router-dom";

const Navbar = () => (
  <header className="sticky top-0 z-50 w-full border-b border-slate-200/50 bg-[#f6f6f8]/80 backdrop-blur-md">
    <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
      <Link
        to="/"
        className="flex items-center gap-3 hover:opacity-80 transition-opacity"
      >
        <div className="bg-[#1111d4] p-2 rounded-lg text-white flex items-center justify-center shadow-lg shadow-blue-900/20">
          <Beaker size={24} strokeWidth={2.5} />
        </div>
        <span className="text-xl font-bold tracking-tight text-slate-900 font-display">
          SciSum AI
        </span>
      </Link>

      <nav className="hidden md:flex items-center gap-10">
        {["Technology", "Pricing", "Research", "API"].map((item) => (
          <a
            key={item}
            className="text-sm font-medium text-slate-600 hover:text-[#1111d4] transition-colors"
            href="#"
          >
            {item}
          </a>
        ))}
      </nav>

      <div className="flex items-center gap-4">
        <Link to="/auth">
          <button className="hidden sm:flex items-center gap-2 text-sm font-bold px-4 py-2 text-[#1111d4] hover:bg-blue-50 rounded-lg transition-colors">
            <LogIn size={18} /> Login
          </button>
        </Link>
        <Link to="/auth">
          <button className="bg-[#1111d4] text-white text-sm font-bold px-6 py-2.5 rounded-lg hover:opacity-90 transition-opacity cursor-pointer">
            Get Started
          </button>
        </Link>
      </div>
    </div>
  </header>
);

export default Navbar;
