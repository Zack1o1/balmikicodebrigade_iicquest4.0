import { Link } from 'react-router-dom';
import logoSrc from '../assets/logo.png';

export default function Footer() {
  return (
    <footer className="bg-[#0F172A] text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <img src={logoSrc} alt="Smart Palika Logo" className="w-32 h-16" />
              <span className="font-heading font-bold text-xl">Smart Palika</span>
            </div>
            <p className="text-slate-400 text-sm">
              AI-Powered Citizen Services for Smart Municipalities in Nepal.
            </p>
          </div>
          <div>
            <h3 className="font-heading font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><Link to="/" className="hover:text-white transition-colors">Home</Link></li>
              <li><Link to="/services" className="hover:text-white transition-colors">Services</Link></li>
              <li><Link to="/services" className="hover:text-white transition-colors">Track Application</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-heading font-semibold text-lg mb-4">Legal</h3>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><Link to="/services" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link to="/services" className="hover:text-white transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-heading font-semibold text-lg mb-4">Contact</h3>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>Email: info@smartpalika.gov.np</li>
              <li>Phone: +977 1-2345678</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-slate-800 mt-12 pt-8 text-center text-sm text-slate-500">
          &copy; {new Date().getFullYear()} Smart Palika. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
