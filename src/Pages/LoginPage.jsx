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
    try {
      if (isLogin) {
        // --- LOGIN LOGIC ---
        const res = await axios.post('http://localhost:5000/api/login', {
          email: formData.email,
          password: formData.password
        });
        
        localStorage.setItem('token', res.data.token);
        toast.success('Successfully Logged In!');
        navigate('/home'); // সরাসরি হোমপেজে
      } else {
        // --- SIGNUP LOGIC ---
        await axios.post('http://localhost:5000/api/register', formData);
        toast.success('Account Created! Verification code sent.');
        navigate('/verify-otp', { state: { email: formData.email } }); // OTP পেজে যাবে
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-4 font-sans">
      <Toaster position="top-center" />
      <div className="max-w-md w-full relative">
        <div className="bg-slate-900/50 backdrop-blur-xl rounded-3xl shadow-2xl border border-slate-800 p-8 relative overflow-hidden">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
            <p className="text-slate-400">{isLogin ? 'Enter details to sign in' : 'Join us to start shortening links'}</p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            {!isLogin && (
              <div className="relative">
                <label className="text-xs font-semibold text-slate-400 uppercase">Full Name</label>
                <div className="mt-1 relative">
                  <User className="absolute left-3 top-3.5 h-5 w-5 text-slate-500" />
                  <input name="name" onChange={handleInput} type="text" className="block w-full pl-10 pr-3 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white outline-none" placeholder="John Doe" />
                </div>
              </div>
            )}

            <div className="relative">
              <label className="text-xs font-semibold text-slate-400 uppercase">Email Address</label>
              <div className="mt-1 relative">
                <Mail className="absolute left-3 top-3.5 h-5 w-5 text-slate-500" />
                <input name="email" onChange={handleInput} required type="email" className="block w-full pl-10 pr-3 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white outline-none" placeholder="hello@example.com" />
              </div>
            </div>

            <div className="relative">
              <label className="text-xs font-semibold text-slate-400 uppercase">Password</label>
              <div className="mt-1 relative">
                <Lock className="absolute left-3 top-3.5 h-5 w-5 text-slate-500" />
                <input name="password" onChange={handleInput} required type="password" className="block w-full pl-10 pr-3 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white outline-none" placeholder="••••••••" />
              </div>
            </div>

            <button type="submit" className="w-full flex items-center justify-center py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all active:scale-95">
              {isLogin ? 'Sign In' : 'Sign Up'} <ArrowRight className="ml-2 h-5 w-5" />
            </button>
          </form>

          <div className="mt-8 text-center border-t border-slate-800 pt-6">
            <p className="text-slate-400 text-sm">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
              <button onClick={() => setIsLogin(!isLogin)} className="ml-2 font-bold text-blue-400 hover:underline">
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