import React, { useState } from 'react';
import { Mail, Lock, User, ArrowRight } from 'lucide-react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const navigate = useNavigate();

  const handleInput = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  
  // ১. লোডিং টোস্টার শুরু করুন
  const loadingToast = toast.loading('Sending verification email...');

  try {
    const res = await axios.post('http://localhost:5000/api/register', formData);
    
    if (res.data.success) {
      // ২. লোডিং বন্ধ করে সাকসেস টোস্টার দেখান
      toast.dismiss(loadingToast);
      toast.success(res.data.message, {
        duration: 4000,
        position: 'top-center',
      });

      // ৩. ৩ সেকেন্ড পর ওটিপি পেজে পাঠান
      setTimeout(() => {
        navigate('/verify-otp', { state: { email: formData.email } });
      }, 1500);
    }
  } catch (err) {
    // ৪. এরর হলে লোডিং বন্ধ করে এরর টোস্টার দেখান
    toast.dismiss(loadingToast);
    const errorMsg = err.response?.data?.message || 'Connection failed!';
    toast.error(errorMsg);
  }
};

  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-4 font-sans">
      <Toaster position="top-center" />
      
      {/* Background Glow */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-md w-full relative">
        <div className="bg-slate-900/50 backdrop-blur-xl rounded-3xl shadow-2xl border border-slate-800 p-8 relative overflow-hidden">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">
                {isLogin ? 'Welcome Back' : 'Create Account'}
            </h2>
            <p className="text-slate-400">
                {isLogin ? 'Enter details to sign in' : 'Join us to start shortening links'}
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            {!isLogin && (
              <div className="relative">
                <label className="text-xs font-semibold text-slate-400 uppercase">Full Name</label>
                <div className="mt-1 relative">
                  <User className="absolute left-3 top-3.5 h-5 w-5 text-slate-500" />
                  <input 
                    name="name" 
                    onChange={handleInput} 
                    type="text" 
                    required={!isLogin}
                    className="block w-full pl-10 pr-3 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white outline-none focus:ring-2 focus:ring-blue-500 transition-all" 
                    placeholder="John Doe" 
                  />
                </div>
              </div>
            )}

            <div className="relative">
              <label className="text-xs font-semibold text-slate-400 uppercase">Email Address</label>
              <div className="mt-1 relative">
                <Mail className="absolute left-3 top-3.5 h-5 w-5 text-slate-500" />
                <input 
                    name="email" 
                    onChange={handleInput} 
                    required 
                    type="email" 
                    className="block w-full pl-10 pr-3 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white outline-none focus:ring-2 focus:ring-blue-500 transition-all" 
                    placeholder="hello@example.com" 
                />
              </div>
            </div>

            <div className="relative">
              <label className="text-xs font-semibold text-slate-400 uppercase">Password</label>
              <div className="mt-1 relative">
                <Lock className="absolute left-3 top-3.5 h-5 w-5 text-slate-500" />
                <input 
                    name="password" 
                    onChange={handleInput} 
                    required 
                    type="password" 
                    className="block w-full pl-10 pr-3 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white outline-none focus:ring-2 focus:ring-blue-500 transition-all" 
                    placeholder="••••••••" 
                />
              </div>
            </div>

            <button type="submit" className="w-full flex items-center justify-center py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all active:scale-95 shadow-lg shadow-blue-900/20">
              {isLogin ? 'Sign In' : 'Sign Up'} <ArrowRight className="ml-2 h-5 w-5" />
            </button>
          </form>

          <div className="mt-8 text-center border-t border-slate-800 pt-6">
            <p className="text-slate-400 text-sm">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
              <button 
                onClick={() => setIsLogin(!isLogin)} 
                className="ml-2 font-bold text-blue-400 hover:underline"
              >
                {isLogin ? 'Create Account' : 'Sign In Now'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;