import React from "react";
import { Beaker, Github, Linkedin, Twitter } from "lucide-react";

const Footer = () => (
  <footer className="bg-white border-t border-slate-200 py-16">
    <div className="max-w-7xl mx-auto px-6">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-12 mb-16">
        <div className="col-span-1 md:col-span-2">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-[#1111d4] p-2 rounded-lg text-white flex items-center justify-center shadow-lg shadow-blue-900/20">
              <Beaker size={20} strokeWidth={2.5} />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900 font-display">
              SciSum AI
            </span>
          </div>
          <p className="text-slate-500 max-w-xs leading-relaxed text-sm">
            Empowering the global scientific community through high-performance
            natural language processing and academic insights.
          </p>
        </div>

        <div>
          <h4 className="font-bold mb-6 text-slate-900">Product</h4>
          <ul className="flex flex-col gap-4 text-sm text-slate-500">
            <li>
              <a className="hover:text-[#1111d4] transition-colors" href="#">
                Summarizer
              </a>
            </li>
            <li>
              <a className="hover:text-[#1111d4] transition-colors" href="#">
                API Solutions
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold mb-6 text-slate-900">Company</h4>
          <ul className="flex flex-col gap-4 text-sm text-slate-500">
            <li>
              <a className="hover:text-[#1111d4] transition-colors" href="#">
                About Us
              </a>
            </li>
            <li>
              <a className="hover:text-[#1111d4] transition-colors" href="#">
                Contact
              </a>
            </li>
          </ul>
        </div>

        {/* THAY THẾ SOCIAL THÀNH LEGAL */}
        <div>
          <h4 className="font-bold mb-6 text-slate-900">Legal</h4>
          <ul className="flex flex-col gap-4 text-sm text-slate-500">
            <li>
              <a className="hover:text-[#1111d4] transition-colors" href="#">
                Privacy Policy
              </a>
            </li>
            <li>
              <a className="hover:text-[#1111d4] transition-colors" href="#">
                Terms of Service
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* DÒNG CUỐI: ĐÃ CHỈNH CÁC ICON VÀO GIỮA */}
      <div className="pt-8 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-6">
        {/* Copyright */}
        <p className="text-xs text-slate-400 font-medium order-2 md:order-1">
          © 2026 SciSum AI. All rights reserved.
        </p>

        {/* Social Icons ở giữa */}
        <div className="flex gap-6 items-center order-1 md:order-2">
          <a
            href="#"
            className="text-slate-400 hover:text-[#1111d4] transition-all hover:scale-110"
          >
            <Twitter size={18} />
          </a>
          <a
            href="#"
            className="text-slate-400 hover:text-[#1111d4] transition-all hover:scale-110"
          >
            <Linkedin size={18} />
          </a>
          <a
            href="#"
            className="text-slate-400 hover:text-[#1111d4] transition-all hover:scale-110"
          >
            <Github size={18} />
          </a>
        </div>

        {/* Name & University */}
        <p className="uppercase tracking-[0.15em] text-[10px] md:text-xs text-slate-400 font-bold order-3">
          Hoàng Mạnh Duy — VNU University of Science
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;
