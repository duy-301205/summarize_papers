import React from "react";
import {
  Sparkles,
  FileUp,
  PlayCircle,
  BarChart3,
  CheckCircle2,
} from "lucide-react";
import { Link } from "react-router-dom"; // Thêm dòng này Duy nhé

const Hero = () => (
  <section className="max-w-7xl mx-auto px-6 pt-20 pb-24 text-center md:text-left font-display">
    <div className="grid md:grid-cols-2 gap-16 items-center">
      <div className="flex flex-col gap-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1111d4]/10 text-[#1111d4] text-xs font-bold w-fit mx-auto md:mx-0 border border-[#1111d4]/20">
          <Sparkles size={14} />
          <span>POWERED BY TRANSFORMER MODELS</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.1] text-slate-900">
          AI-Powered Scientific{" "}
          <span className="text-[#1111d4]">Summarization</span>
        </h1>

        <p className="text-lg md:text-xl text-slate-600 max-w-xl leading-relaxed">
          Unlock high-fidelity insights from academic papers. Advanced NLP
          models providing seamless bilingual support for VNU-HUS research
          workflows.
        </p>

        <div className="flex flex-wrap gap-4 justify-center md:justify-start">
          {/* Nút chính dẫn sang trang Auth */}
          <Link to="/auth">
            <button className="bg-[#1111d4] text-white font-bold px-8 py-4 rounded-xl flex items-center gap-2 hover:shadow-xl hover:shadow-blue-900/30 transition-all active:scale-95 cursor-pointer">
              <FileUp size={20} /> Upload Paper
            </button>
          </Link>

          <button className="bg-slate-200 text-slate-900 font-bold px-8 py-4 rounded-xl flex items-center gap-2 hover:bg-slate-300 transition-colors cursor-pointer">
            <PlayCircle size={20} /> Try Demo
          </button>

          <button className="w-full sm:w-auto border border-slate-200 text-slate-600 font-bold px-8 py-4 rounded-xl flex items-center justify-center gap-2 hover:border-[#1111d4] hover:text-[#1111d4] transition-all cursor-pointer">
            <BarChart3 size={20} /> View Analytics
          </button>
        </div>
      </div>

      {/* Visual Side */}
      <div className="relative">
        <div className="absolute -inset-4 bg-[#1111d4]/5 rounded-3xl blur-2xl"></div>
        <div className="relative bg-white border border-slate-200 p-4 rounded-3xl shadow-2xl">
          <div
            className="aspect-video rounded-2xl overflow-hidden bg-slate-100 bg-cover bg-center shadow-inner"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&q=80&w=1000')",
            }}
          ></div>
          <div className="mt-6 p-4 flex flex-col gap-4">
            <div className="h-2 w-24 bg-[#1111d4]/20 rounded-full animate-pulse"></div>
            <div className="h-4 w-full bg-slate-100 rounded-full"></div>
            <div className="h-4 w-5/6 bg-slate-100 rounded-full"></div>
          </div>
        </div>

        {/* Floating Accuracy Badge */}
        <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-4 animate-bounce">
          <div className="bg-green-100 p-2 rounded-full text-green-600">
            <CheckCircle2 size={24} />
          </div>
          <div className="text-left">
            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">
              Accuracy Score
            </p>
            <p className="text-xl font-bold text-slate-900">98.4%</p>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default Hero;
