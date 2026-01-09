import React, { useState } from 'react';
import { 
Link2, Copy, Check, LayoutDashboard, 
User, Globe, Zap, LogOut, ArrowRight, MousePointerClick 
} from 'lucide-react';

const HomePage = () => {
const [longUrl, setLongUrl] = useState('');
const [shortenedUrl, setShortenedUrl] = useState(''); 
const [copied, setCopied] = useState(false);
const [loading, setLoading] = useState(false);

  // ১, ২ ও ৩. URL Shortening & unique code logic
  const handleShorten = (e) => {
    e.preventDefault();
    if (!longUrl) return;
    
    setLoading(true);
    
    // ৫ সেকেন্ড পর রেজাল্ট দেখানোর অভিনয় (Simulation)
    setTimeout(() => {
      // ৬-৮ ক্যারেক্টারের র‍্যান্ডম কোড জেনারেশন
      const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
      const codeLength = Math.floor(Math.random() * (8 - 6 + 1)) + 6;
      let code = '';
      for (let i = 0; i < codeLength; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      
      // ৪. সম্পূর্ণ শর্ট URL ডিসপ্লে
      setShortenedUrl(`https://ziplink.co/${code}`);
      setLoading(false);
    }, 800);
  };

  // ৫. Copy to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(shortenedUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#fcfcfd]">
      {/* --- PREMIMUM NAVBAR --- */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-slate-100 px-6 py-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-2 rounded-xl shadow-lg shadow-blue-200">
              <Link2 className="text-white h-5 w-5" />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900">ZipLink</span>
          </div>

          {/* Nav Links & Profile */}
          <div className="flex items-center gap-4 md:gap-8">
            <button className="hidden sm:flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors">
              <LayoutDashboard size={18} />
              Dashboard
            </button>

            <div className="flex items-center gap-3 border-l pl-6 border-slate-200">
              <div className="text-right hidden md:block">
                <p className="text-sm font-bold text-slate-900 leading-none">Mehedi Hasan</p>
                <p className="text-[11px] font-bold text-blue-500 uppercase mt-1 tracking-wider font-mono">12/100 Links Used</p>
              </div>
              
              {/* Avatar Icon */}
              <div className="h-10 w-10 bg-slate-100 rounded-full border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-blue-50 hover:text-blue-600 cursor-pointer transition-all">
                <User size={20} />
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <main className="max-w-5xl mx-auto px-6 pt-20 pb-12">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-6 border border-blue-100">
            <Zap size={14} className="fill-current" /> Fast & Reliable URL Shortener
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-6 tracking-tight leading-tight">
            One tiny link, <br />
            <span className="text-blue-600">infinite possibilities.</span>
          </h1>
          <p className="text-slate-500 text-lg md:text-xl max-w-2xl mx-auto">
            
          </p>
        </div>

        {/* --- URL INPUT SECTION (Bitly Style) --- */}
        <div className="relative max-w-4xl mx-auto">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-[2.5rem] blur opacity-20"></div>
          
          <div className="relative bg-white rounded-[2rem] shadow-xl border border-slate-100 p-2">
            <form onSubmit={handleShorten} className="flex flex-col md:flex-row gap-2">
              <div className="flex-1 relative">
                <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none text-slate-400">
                  <Globe size={20} />
                </div>
                <input
                  type="url"
                  required
                  placeholder="Paste your long URL here..."
                  className="w-full pl-14 pr-6 py-5 bg-transparent rounded-2xl outline-none text-slate-800 text-lg placeholder:text-slate-400"
                  value={longUrl}
                  onChange={(e) => setLongUrl(e.target.value)}
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-10 py-5 rounded-2xl transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-70"
              >
                {loading ? 'Shortening...' : 'Shorten'}
                <ArrowRight size={20} />
              </button>
            </form>
          </div>

          {/* --- RESULT DISPLAY --- */}
          {shortenedUrl && (
            <div className="mt-8 animate-in fade-in slide-in-from-top-4 duration-500">
              <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4 overflow-hidden">
                  <div className="h-12 w-12 bg-white rounded-xl flex items-center justify-center text-blue-600 shadow-sm flex-shrink-0">
                    <MousePointerClick size={24} />
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-xs font-bold text-blue-500 uppercase tracking-widest mb-0.5">Your Tiny URL</p>
                    <p className="text-xl font-bold text-slate-800 truncate">{shortenedUrl}</p>
                  </div>
                </div>
                
                <button
                  onClick={copyToClipboard}
                  className={`flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-bold transition-all ${
                    copied 
                    ? 'bg-green-500 text-white shadow-lg shadow-green-200' 
                    : 'bg-slate-900 text-white hover:bg-slate-800 shadow-lg shadow-slate-200'
                  }`}
                >
                  {copied ? <Check size={20} /> : <Copy size={20} />}
                  {copied ? 'Copied' : 'Copy URL'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* --- FOOTER INFO --- */}
        <div className="mt-16 text-center">
            <p className="text-slate-400 text-sm font-medium">
                By shortening, you agree to our <span className="text-slate-600 underline cursor-pointer">Terms of Service</span>
            </p>
        </div>
      </main>
    </div>
  );
};

export default HomePage;