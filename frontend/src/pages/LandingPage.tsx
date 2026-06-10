import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {ArrowRight, Bot, Search, BarChart3, Clock, Users, Building, ShieldCheck, Zap, User, CheckCircle2
} from 'lucide-react';

// import { getStats } from "@/api/dashboard";

const LandingPage = () => {


  const [stats, setStats] = useState({
    municipalities: 0,
    applications: 0,
    satisfaction: 0,
  });

  
  // useEffect(() => {
  //   const fetchStats = async () => {
  //     try {
  //       const data = await getStats();
  //       setStats(data);
  //     } catch (err) {
  //       console.error("Stats fetch error:", err);
  //     }
  //   };

  //   fetchStats();
  // }, []);

  return (
    <div className="min-h-screen flex flex-col">

      <section className="relative bg-[#021330] bg-gradient-to-br from-[#06183e] via-[#01255d] to-[#120a2f] pt-20 pb-32 overflow-hidden">

        <div className="absolute top-0 right-0 -mr-40 -mt-20 w-96 h-96 rounded-full bg-blue-600 opacity-20 blur-3xl"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

            {/* LEFT CONTENT */}
            <div className="text-left">

              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 text-gray-300 text-sm mb-8">
                <Zap size={14} className="text-[#EAB308]" />
                <span>AI-Powered Government Services</span>
              </div>

              <h1 className="text-5xl lg:text-[4rem] font-heading font-extrabold text-white leading-[1.1] mb-6 tracking-tight">
                AI-Powered Citizen Services for Smart Municipalities
              </h1>

              <p className="text-xl text-gray-300 mb-10 max-w-xl leading-relaxed">
                Access ward services, check required documents, track applications, and receive updates digitally.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-14">
                <Link
                  to="/services"
                  className="inline-flex items-center justify-center gap-2 bg-primary-red text-white px-8 py-3.5 rounded-xl font-semibold text-lg"
                >
                  Get Started <ArrowRight size={20} />
                </Link>

                <Link
                  to="/track"
                  className="inline-flex items-center justify-center gap-2 bg-white/5 border border-white/20 text-white px-8 py-3.5 rounded-xl font-semibold text-lg"
                >
                  Track Application
                </Link>
              </div>

              {/* âœ… DYNAMIC STATS */}
              <div className="flex gap-10 md:gap-16">
                <div>
                  <div className="text-4xl font-bold text-white mb-1">
                    {stats.municipalities}
                  </div>
                  <div className="text-sm text-gray-400">Municipalities</div>
                </div>

                <div>
                  <div className="text-4xl font-bold text-white mb-1">
                    {stats.applications}
                  </div>
                  <div className="text-sm text-gray-400">Applications</div>
                </div>

                <div>
                  <div className="text-4xl font-bold text-white mb-1">
                    {stats.satisfaction}%
                  </div>
                  <div className="text-sm text-gray-400">Satisfaction</div>
                </div>
              </div>

            </div>

            {/* RIGHT CONTENT (UNCHANGED) */}
            <div className="relative lg:ml-10">
              <div className="bg-[#1B2A4E]/80 backdrop-blur-md border border-white/10 rounded-2xl shadow-2xl overflow-hidden">

                <div className="bg-[#111A34]/50 border-b border-white/5 py-3 px-4 flex items-center gap-3">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  <div className="text-xs text-gray-400 font-medium ml-2">
                    Smart Palika Assistant
                  </div>
                </div>

                <div className="p-6 space-y-6 aspect-video max-h-[450px]">

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-gray-300">
                      <User size={20} />
                    </div>
                    <div className="bg-[#253966] text-gray-100 px-5 py-3 rounded-2xl rounded-tl-sm">
                      बसाइँसराइ गर्न के चाहिन्छ?
                    </div>
                  </div>

                  <div className="flex justify-end mr-6">
                    <div className="bg-white rounded-2xl p-5 w-72 shadow-lg relative">

                      <div className="absolute top-6 -right-5 w-10 h-10 bg-primary-red rounded-full flex items-center justify-center text-white">
                        <Zap size={18} />
                      </div>

                      <h4 className="text-[#003893] font-bold text-sm mb-4">
                        Required Documents:
                      </h4>

                      <ul className="space-y-3 mb-5">
                        <li className="flex items-center gap-2 text-sm text-gray-700">
                          <CheckCircle2 size={16} className="text-green-600" />
                          Citizenship Certificate
                        </li>
                        <li className="flex items-center gap-2 text-sm text-gray-700">
                          <CheckCircle2 size={16} className="text-green-600" />
                          Migration Form
                        </li>
                        <li className="flex items-center gap-2 text-sm text-gray-700">
                          <CheckCircle2 size={16} className="text-green-600" />
                          Tax Clearance
                        </li>
                      </ul>

                      <div className="border-t border-gray-100 pt-3 flex justify-between">
                        <span className="text-xs text-gray-500">Processing Time:</span>
                        <span className="text-xs font-bold text-[#003893]">2 Days</span>
                      </div>

                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-gray-300">
                      <User size={20} />
                    </div>
                    <div className="bg-[#253966] text-gray-100 px-5 py-3 rounded-2xl rounded-tl-sm">
                      Can I apply online?
                    </div>
                  </div>

                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
};

export default LandingPage;
