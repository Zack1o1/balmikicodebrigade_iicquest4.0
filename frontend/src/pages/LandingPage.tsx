import {
  ArrowRight,
  MessageSquare,
  FileSearch,
  LayoutDashboard,
  BarChart3,
  CheckCircle2,
  Clock,
  Users,
  Shield,
  ChevronRight,
  Zap,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

export function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F7F9FC] font-sans">
      <section className="relative overflow-hidden bg-gradient-to-br from-[#003893] via-[#001F5C] to-[#1a0010]">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_20%_50%,#C8102E_0%,transparent_50%),radial-gradient(circle_at_80%_20%,#ffffff_0%,transparent_40%)]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-6 bg-white/10 border border-white/20">
                <Zap className="w-3.5 h-3.5 text-yellow-300" />
                <span className="text-white text-xs font-medium">AI-Powered Government Services</span>
              </div>
              <h1 className="font-heading font-extrabold text-white leading-tight mb-5 text-[clamp(2rem,4vw,3.25rem)]">
                AI-Powered Citizen Services for Smart Municipalities
              </h1>
              <p className="text-white/75 text-lg leading-relaxed mb-8 max-w-[520px]">
                Access ward services, check required documents, track applications, and receive updates digitally. Built for Nepal's modern municipalities.
              </p>
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={() => navigate("/services")}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl text-white font-semibold text-[0.9375rem] bg-[#C8102E] hover:bg-[#a50d26] transition-all"
                >
                  Get Started <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => navigate("/track-application")}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-[0.9375rem] bg-white/12 text-white border-2 border-white/30 hover:bg-white/20 transition-all"
                >
                  Track Application
                </button>
              </div>
              <div className="flex items-center gap-6 mt-10">
                {[{ v: "50+", l: "Municipalities" }, { v: "2L+", l: "Applications" }, { v: "92%", l: "Satisfaction" }].map(({ v, l }) => (
                  <div key={l}>
                    <div className="font-heading font-bold text-2xl text-white">{v}</div>
                    <div className="text-white/60 text-xs">{l}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="hidden md:block">
              <div className="relative">
                <div className="rounded-2xl overflow-hidden shadow-2xl bg-white/8 border border-white/15 backdrop-blur-sm">
                  <div className="p-4 border-b border-white/10 bg-black/20">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-400" />
                      <div className="w-3 h-3 rounded-full bg-yellow-400" />
                      <div className="w-3 h-3 rounded-full bg-green-400" />
                      <span className="ml-2 text-white/60 text-xs">Smart Palika AI Assistant</span>
                    </div>
                  </div>
                  <div className="p-6 space-y-4">
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-white/15">
                        <Users className="w-4 h-4 text-white" />
                      </div>
                      <div className="rounded-xl rounded-tl-none px-4 py-3 bg-white/12 text-white text-sm">
                        बसाइँसराइ गर्न के चाहिन्छ?
                      </div>
                    </div>
                    <div className="flex gap-3 flex-row-reverse">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-[#C8102E]">
                        <Zap className="w-4 h-4 text-white" />
                      </div>
                      <div className="rounded-xl rounded-tr-none px-4 py-3 max-w-xs bg-white/95 text-slate-800 text-sm">
                        <p className="font-semibold mb-2 text-[#003893]">Required Documents:</p>
                        {["Citizenship Certificate", "Migration Form", "Tax Clearance"].map((d) => (
                          <div key={d} className="flex items-center gap-2 text-xs text-slate-800 mb-1">
                            <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
                            {d}
                          </div>
                        ))}
                        <div className="mt-3 pt-3 border-t border-slate-200">
                          <span className="text-slate-500 text-xs">Processing Time: </span>
                          <span className="text-[#003893] font-semibold text-xs">2 Days</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-white/15">
                        <Users className="w-4 h-4 text-white" />
                      </div>
                      <div className="rounded-xl rounded-tl-none px-4 py-3 bg-white/12 text-white text-sm">
                        Can I apply online?
                      </div>
                    </div>
                  </div>
                </div>
                <div className="absolute -top-4 -right-4 w-24 h-24 rounded-full opacity-20 bg-[#C8102E] blur-3xl" />
                <div className="absolute -bottom-4 -left-4 w-32 h-32 rounded-full opacity-10 bg-white blur-[40px]" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <div className="inline-block px-3 py-1 rounded-full text-sm font-medium mb-4 bg-indigo-100 text-[#003893]">Core Features</div>
          <h2 className="font-heading font-bold text-[clamp(1.5rem,3vw,2.25rem)] text-slate-800 mb-4">
            Everything you need for digital governance
          </h2>
          <p className="text-slate-500 max-w-[560px] mx-auto leading-relaxed">
            From AI-powered service guidance to real-time application tracking, PalikaAI modernizes every touchpoint between citizens and municipality.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: MessageSquare, title: "AI Service Assistant", desc: "Get instant answers about required documents and procedures in Nepali or English.", iconBg: "bg-indigo-100", iconColor: "text-[#003893]", accent: "#003893", screen: "/smart-palika-ai" },
            { icon: FileSearch, title: "Application Tracking", desc: "Track your application status in real-time with a unique Application ID.", iconBg: "bg-red-50", iconColor: "text-[#C8102E]", accent: "#C8102E", screen: "/track-application" },
            { icon: LayoutDashboard, title: "Digital Clerk Dashboard", desc: "Ward staff can manage applications, review documents, and update statuses efficiently.", iconBg: "bg-green-50", iconColor: "text-green-700", accent: "#2E7D32", screen: "/staff" },
            { icon: BarChart3, title: "Municipality Analytics", desc: "Executive dashboards with KPIs, ward comparisons, and performance trends.", iconBg: "bg-yellow-50", iconColor: "text-yellow-700", accent: "#F9A825", screen: "/admin" },
          ].map(({ icon: Icon, title, desc, iconBg, iconColor, screen }) => (
            <button
              key={title}
              onClick={() => navigate(screen)}
              className="text-left p-6 rounded-2xl bg-white border border-slate-200 transition-all hover:-translate-y-0.5 group hover:shadow-lg"
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${iconBg}`}>
                <Icon className={`w-6 h-6 ${iconColor}`} />
              </div>
              <h3 className="font-heading font-semibold text-slate-800 mb-2">{title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
              <div className="flex items-center gap-1 mt-4 text-slate-500">
                <span className="text-xs font-semibold">Learn more</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </button>
          ))}
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-[#003893] to-[#001F5C]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="font-heading font-bold text-[clamp(1.5rem,3vw,2.25rem)] text-white mb-3">
              Transforming Public Service Delivery
            </h2>
            <p className="text-white/70 max-w-[480px] mx-auto">Real impact across municipalities in Nepal</p>
          </div>
          <div className="grid sm:grid-cols-3 gap-8">
            {[
              { icon: Zap, value: "73%", label: "Faster Service Delivery", desc: "Average processing time reduced from 7 days to 1.8 days" },
              { icon: Users, value: "60%", label: "Reduced Office Visits", desc: "Citizens complete applications digitally without visiting the ward" },
              { icon: Shield, value: "92%", label: "Improved Transparency", desc: "Citizens can track every step of their application in real-time" },
            ].map(({ icon: Icon, value, label, desc }) => (
              <div key={label} className="text-center p-8 rounded-2xl bg-white/8 border border-white/12">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5 bg-[rgba(200,16,46,0.2)] border border-[rgba(200,16,46,0.3)]">
                  <Icon className="w-7 h-7 text-[#ff6b81]" />
                </div>
                <div className="font-heading font-extrabold text-[2.5rem] text-white leading-none">{value}</div>
                <div className="font-heading font-semibold text-base text-white/90 my-2">{label}</div>
                <p className="text-white/60 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <div className="inline-block px-3 py-1 rounded-full text-sm font-medium mb-4 bg-red-50 text-[#C8102E]">Popular Services</div>
          <h2 className="font-heading font-bold text-[clamp(1.5rem,3vw,2.25rem)] text-slate-800">
            Access government services instantly
          </h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {[
            { name: "Birth Registration", time: "3 days", id: "birth" },
            { name: "Death Registration", time: "2 days", id: "death" },
            { name: "Migration Certificate", time: "2 days", id: "migration" },
            { name: "Residence Verification", time: "1 day", id: "residence" },
            { name: "House Recommendation", time: "5 days", id: "house" },
            { name: "Business Recommendation", time: "7 days", id: "business" },
            { name: "Citizenship Recommendation", time: "3 days", id: "citizenship" },
            { name: "Income Certificate",  time: "2 days", id: "income" },
          ].map(({ name, time, id }) => (
            <button
              key={name}
              onClick={() => navigate(`/apply/${id}`)}
              className="p-4 rounded-xl bg-white border border-slate-200 text-left transition-all hover:border-[#003893] hover:shadow-[0_4px_16px_rgba(0,56,147,0.12)]"
            >
              <div className="font-semibold text-slate-800 text-sm mb-1">{name}</div>
              <div className="flex items-center gap-1 text-slate-500 text-xs">
                <Clock className="w-3 h-3" />
                {time}
              </div>
            </button>
          ))}
        </div>
        <div className="text-center mt-8">
          <Link
            to="/services"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold bg-[#003893] text-white hover:bg-[#002a6e] transition-colors"
          >
            View All Services <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
export default LandingPage;
