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

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  return (
    <div className="min-h-screen" style={{ fontFamily: "'Inter', sans-serif", background: "#F7F9FC" }}>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, #003893 0%, #001F5C 60%, #1a0010 100%)" }} />
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 20% 50%, #C8102E 0%, transparent 50%), radial-gradient(circle at 80% 20%, #ffffff 0%, transparent 40%)" }} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-6" style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)" }}>
                <Zap className="w-3.5 h-3.5 text-yellow-300" />
                <span className="text-white text-xs font-medium">AI-Powered Government Services</span>
              </div>
              <h1 style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 800, fontSize: "clamp(2rem, 4vw, 3.25rem)", color: "white", lineHeight: 1.15, marginBottom: "1.25rem" }}>
                AI-Powered Citizen Services for Smart Municipalities
              </h1>
              <p style={{ color: "rgba(255,255,255,0.75)", fontSize: "1.125rem", lineHeight: 1.7, marginBottom: "2rem", maxWidth: "520px" }}>
                Access ward services, check required documents, track applications, and receive updates digitally. Built for Nepal's modern municipalities.
              </p>
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={() => handleNavigate("/services")}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl text-white font-semibold transition-all"
                  style={{ background: "#C8102E", fontSize: "0.9375rem" }}
                  onMouseEnter={e => (e.currentTarget.style.background = "#a50d26")}
                  onMouseLeave={e => (e.currentTarget.style.background = "#C8102E")}
                >
                  Get Started <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleNavigate("/track-application")}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all"
                  style={{ background: "rgba(255,255,255,0.12)", color: "white", border: "1.5px solid rgba(255,255,255,0.3)", fontSize: "0.9375rem" }}
                  onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.2)")}
                  onMouseLeave={e => (e.currentTarget.style.background = "rgba(255,255,255,0.12)")}
                >
                  Track Application
                </button>
              </div>
              <div className="flex items-center gap-6 mt-10">
                {[{ v: "50+", l: "Municipalities" }, { v: "2L+", l: "Applications" }, { v: "92%", l: "Satisfaction" }].map(({ v, l }) => (
                  <div key={l}>
                    <div style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: "1.5rem", color: "white" }}>{v}</div>
                    <div style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.8125rem" }}>{l}</div>
                  </div>
                ))}
              </div>
            </div>
            {/* Hero Illustration */}
            <div className="hidden md:block">
              <div className="relative">
                <div className="rounded-2xl overflow-hidden shadow-2xl" style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", backdropFilter: "blur(10px)" }}>
                  <div className="p-4 border-b" style={{ borderColor: "rgba(255,255,255,0.1)", background: "rgba(0,0,0,0.2)" }}>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-400" />
                      <div className="w-3 h-3 rounded-full bg-yellow-400" />
                      <div className="w-3 h-3 rounded-full bg-green-400" />
                      <span className="ml-2 text-white/60 text-xs">PalikaAI Assistant</span>
                    </div>
                  </div>
                  <div className="p-6 space-y-4">
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "rgba(255,255,255,0.15)" }}>
                        <Users className="w-4 h-4 text-white" />
                      </div>
                      <div className="rounded-xl rounded-tl-none px-4 py-3" style={{ background: "rgba(255,255,255,0.12)", color: "white", fontSize: "0.875rem" }}>
                        बसाइँसराइ गर्न के चाहिन्छ?
                      </div>
                    </div>
                    <div className="flex gap-3 flex-row-reverse">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "#C8102E" }}>
                        <Zap className="w-4 h-4 text-white" />
                      </div>
                      <div className="rounded-xl rounded-tr-none px-4 py-3 max-w-xs" style={{ background: "rgba(255,255,255,0.95)", color: "#1E293B", fontSize: "0.875rem" }}>
                        <p className="font-semibold mb-2" style={{ color: "#003893" }}>Required Documents:</p>
                        {["Citizenship Certificate", "Migration Form", "Tax Clearance"].map((d) => (
                          <div key={d} className="flex items-center gap-2 text-xs" style={{ color: "#1E293B", marginBottom: "4px" }}>
                            <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
                            {d}
                          </div>
                        ))}
                        <div className="mt-3 pt-3 border-t" style={{ borderColor: "#E2E8F0" }}>
                          <span style={{ color: "#64748B", fontSize: "0.75rem" }}>Processing Time: </span>
                          <span style={{ color: "#003893", fontWeight: 600, fontSize: "0.75rem" }}>2 Days</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "rgba(255,255,255,0.15)" }}>
                        <Users className="w-4 h-4 text-white" />
                      </div>
                      <div className="rounded-xl rounded-tl-none px-4 py-3" style={{ background: "rgba(255,255,255,0.12)", color: "white", fontSize: "0.875rem" }}>
                        Can I apply online?
                      </div>
                    </div>
                  </div>
                </div>
                <div className="absolute -top-4 -right-4 w-24 h-24 rounded-full opacity-20" style={{ background: "#C8102E", filter: "blur(30px)" }} />
                <div className="absolute -bottom-4 -left-4 w-32 h-32 rounded-full opacity-10" style={{ background: "#ffffff", filter: "blur(40px)" }} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <div className="inline-block px-3 py-1 rounded-full text-sm font-medium mb-4" style={{ background: "#EEF2FF", color: "#003893" }}>Core Features</div>
          <h2 style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: "clamp(1.5rem, 3vw, 2.25rem)", color: "#1E293B", marginBottom: "1rem" }}>
            Everything you need for digital governance
          </h2>
          <p style={{ color: "#64748B", maxWidth: "560px", margin: "0 auto", lineHeight: 1.7 }}>
            From AI-powered service guidance to real-time application tracking, PalikaAI modernizes every touchpoint between citizens and municipality.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: MessageSquare, title: "AI Service Assistant", desc: "Get instant answers about required documents and procedures in Nepali or English.", color: "#003893", bg: "#EEF2FF", screen: "/smart-palika-ai" },
            { icon: FileSearch, title: "Application Tracking", desc: "Track your application status in real-time with a unique Application ID.", color: "#C8102E", bg: "#FFF1F3", screen: "/track-application" },
            { icon: LayoutDashboard, title: "Digital Clerk Dashboard", desc: "Ward staff can manage applications, review documents, and update statuses efficiently.", color: "#2E7D32", bg: "#F0FDF4", screen: "/staff" },
            { icon: BarChart3, title: "Municipality Analytics", desc: "Executive dashboards with KPIs, ward comparisons, and performance trends.", color: "#F9A825", bg: "#FFFBEB", screen: "/admin" },
          ].map(({ icon: Icon, title, desc, color, bg, screen }) => (
            <button
              key={title}
              onClick={() => handleNavigate(screen)}
              className="text-left p-6 rounded-2xl bg-white border transition-all group"
              style={{ borderColor: "#E2E8F0" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = color; e.currentTarget.style.boxShadow = `0 8px 24px ${color}20`; e.currentTarget.style.transform = "translateY(-2px)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "#E2E8F0"; e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "translateY(0)"; }}
            >
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ background: bg }}>
                <Icon className="w-6 h-6" style={{ color }} />
              </div>
              <h3 style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600, color: "#1E293B", marginBottom: "0.5rem" }}>{title}</h3>
              <p style={{ color: "#64748B", fontSize: "0.875rem", lineHeight: 1.6 }}>{desc}</p>
              <div className="flex items-center gap-1 mt-4" style={{ color }}>
                <span style={{ fontSize: "0.8125rem", fontWeight: 600 }}>Learn more</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Impact Statistics */}
      <section style={{ background: "linear-gradient(135deg, #003893 0%, #001F5C 100%)" }} className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: "clamp(1.5rem, 3vw, 2.25rem)", color: "white", marginBottom: "0.75rem" }}>
              Transforming Public Service Delivery
            </h2>
            <p style={{ color: "rgba(255,255,255,0.7)", maxWidth: "480px", margin: "0 auto" }}>Real impact across municipalities in Nepal</p>
          </div>
          <div className="grid sm:grid-cols-3 gap-8">
            {[
              { icon: Zap, value: "73%", label: "Faster Service Delivery", desc: "Average processing time reduced from 7 days to 1.8 days" },
              { icon: Users, value: "60%", label: "Reduced Office Visits", desc: "Citizens complete applications digitally without visiting the ward" },
              { icon: Shield, value: "92%", label: "Improved Transparency", desc: "Citizens can track every step of their application in real-time" },
            ].map(({ icon: Icon, value, label, desc }) => (
              <div key={label} className="text-center p-8 rounded-2xl" style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)" }}>
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5" style={{ background: "rgba(200,16,46,0.2)", border: "1px solid rgba(200,16,46,0.3)" }}>
                  <Icon className="w-7 h-7" style={{ color: "#ff6b81" }} />
                </div>
                <div style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 800, fontSize: "2.5rem", color: "white", lineHeight: 1 }}>{value}</div>
                <div style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600, fontSize: "1rem", color: "rgba(255,255,255,0.9)", margin: "0.5rem 0 0.75rem" }}>{label}</div>
                <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.875rem", lineHeight: 1.6 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Quick Access */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <div className="inline-block px-3 py-1 rounded-full text-sm font-medium mb-4" style={{ background: "#FFF1F3", color: "#C8102E" }}>Popular Services</div>
          <h2 style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: "clamp(1.5rem, 3vw, 2.25rem)", color: "#1E293B" }}>
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
              onClick={() => handleNavigate(`/apply/${id}`)}
              className="p-4 rounded-xl bg-white border text-left transition-all"
              style={{ borderColor: "#E2E8F0" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "#003893"; e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,56,147,0.12)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "#E2E8F0"; e.currentTarget.style.boxShadow = "none"; }}
            >

              <div style={{ fontWeight: 600, color: "#1E293B", fontSize: "0.875rem", marginBottom: "0.25rem" }}>{name}</div>
              <div className="flex items-center gap-1" style={{ color: "#64748B", fontSize: "0.75rem" }}>
                <Clock className="w-3 h-3" />
                {time}
              </div>
            </button>
          ))}
        </div>
        <div className="text-center mt-8">
          <button className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold" style={{ background: "#003893", color: "white" }}>
           <Link to="/services"> View All Services </Link><ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>
    </div>
  );
}
export default LandingPage; 
