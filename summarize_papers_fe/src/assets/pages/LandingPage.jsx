import React from "react";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Footer from "../components/Footer";
import { Languages, BrainCircuit, BarChart3, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const LandingPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#f6f6f8] text-slate-900 antialiased overflow-x-hidden soft-gradient-bg font-display">
      <Navbar />
      <main className="flex-grow">
        <Hero />

        {/* Features Grid */}
        <section className="bg-white py-24 border-y border-slate-200">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-16">
              <div className="max-w-2xl">
                <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">
                  Smarter Research through AI
                </h2>
                <p className="text-slate-600 text-lg">
                  Our platform leverages state-of-the-art architectures to
                  provide unmatched accuracy in academic document analysis.
                </p>
              </div>
              {/* CHỈNH SỬA: Dùng Link thay vì thẻ a để không bị reload trang */}
              <Link
                className="group text-[#1111d4] font-bold flex items-center gap-2 hover:underline transition-all"
                to="/auth"
              >
                Explore All Features
                <ArrowRight
                  size={20}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <FeatureCard
                Icon={Languages}
                title="Bilingual Support"
                desc="Seamlessly summarize papers in both English and Vietnamese with high accuracy."
              />
              <FeatureCard
                Icon={BrainCircuit}
                title="Transformer Core"
                desc="Built on cutting-edge Transformer models for deep contextual understanding."
              />
              <FeatureCard
                Icon={BarChart3}
                title="Instant Analytics"
                desc="Extract citation networks and emerging research trends in seconds."
              />
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-24 max-w-7xl mx-auto px-6">
          <div className="bg-[#1111d4] rounded-[2rem] p-12 md:p-20 text-white relative overflow-hidden shadow-2xl">
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>

            <div className="relative z-10 grid md:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                  Ready to revolutionize your research?
                </h2>
                <p className="bg-white/10 p-6 rounded-2xl text-white/90 text-lg mb-10 border border-white/20 backdrop-blur-sm">
                  Join over 2,500 researchers and students at VNU-HUS already
                  using SciSum AI to accelerate their learning.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  {/* CHỈNH SỬA: Bọc nút Start Free Trial bằng Link */}
                  <Link to="/auth">
                    <button className="bg-white text-[#1111d4] font-bold px-10 py-4 rounded-xl hover:bg-slate-100 transition-all active:scale-95 shadow-lg cursor-pointer">
                      Start Free Trial
                    </button>
                  </Link>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-x-8 gap-y-12">
                <StatItem val="5M+" lab="Articles" />
                <StatItem val="15k" lab="Users" />
                <StatItem val="2s" lab="Time" />
                <StatItem val="99%" lab="Satisfaction" />
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

// Helper Components
const FeatureCard = ({ Icon, title, desc }) => (
  <div className="group p-8 rounded-2xl bg-[#f6f6f8] border border-slate-200 hover:border-[#1111d4]/50 transition-all shadow-sm hover:shadow-xl">
    <div className="w-14 h-14 bg-[#1111d4]/10 rounded-xl flex items-center justify-center text-[#1111d4] mb-6 group-hover:scale-110 transition-transform">
      <Icon size={30} />
    </div>
    <h3 className="text-xl font-bold mb-3 font-display text-slate-900">
      {title}
    </h3>
    <p className="text-slate-600 leading-relaxed text-sm">{desc}</p>
  </div>
);

const StatItem = ({ val, lab }) => (
  <div className="flex flex-col">
    <span className="text-4xl md:text-5xl font-bold mb-2 font-display">
      {val}
    </span>
    <span className="text-white/70 font-medium text-sm uppercase tracking-widest">
      {lab}
    </span>
  </div>
);

export default LandingPage;
