import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ShieldCheck, ArrowRight, RefreshCcw } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios'; 

const OtpPage = () => {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(60);
  const navigate = useNavigate();
  const location = useLocation();

  // Retrieve email passed from the LoginPage state
  const email = location.state?.email;

  useEffect(() => {
    // Redirect to login if email is missing (e.g., direct URL access)
    if (!email) {
      navigate('/login');
    }

    // Initialize countdown timer for resending OTP
    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [email, navigate]);

  const handleVerify = async (e) => {
    e.preventDefault();
    
    // Basic validation for 6-digit OTP
    if (otp.length < 6) {
      return toast.error("Please enter 6-digit OTP");
    }

    setLoading(true);
    const loadingToast = toast.loading('Verifying your code...');

    try {
      // Backend API call for OTP verification
      const res = await axios.post('http://localhost:5001/api/verify-otp', {
        email: email,
        otp: otp
      });

      if (res.data.success) {
        toast.dismiss(loadingToast);
        toast.success("Identity Verified Successfully!");

        // Save authentication data to sessionStorage for the Home session
        sessionStorage.setItem('token', res.data.token);
        sessionStorage.setItem('userName', res.data.userName);
        sessionStorage.setItem('userEmail', res.data.userEmail);

        // Redirect to homepage after successful verification
        setTimeout(() => navigate('/home'), 1500);
      }
    } catch (err) {
      toast.dismiss(loadingToast);
      setLoading(false);
      const errorMsg = err.response?.data?.message || "Invalid OTP! Please check again.";
      toast.error(errorMsg);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-4">
      <Toaster position="top-center" />
      
      {/* Decorative Background Glows */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-[100px]"></div>
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-[100px]"></div>

      <div className="max-w-md w-full bg-slate-900/50 backdrop-blur-xl border border-slate-800 p-8 rounded-[2.5rem] shadow-2xl relative z-10">
        
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-500/10 rounded-2xl mb-4 border border-blue-500/20">
            <ShieldCheck className="text-blue-500 w-8 h-8" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">Check your email</h2>
          <p className="text-slate-400">
            We've sent a 6-digit verification code to <br />
            <span className="text-blue-400 font-medium">{email}</span>
          </p>
        </div>

        <form onSubmit={handleVerify} className="space-y-6">
          <div>
            <input
              type="text"
              maxLength="6"
              value={otp}
              // Only allow numeric input
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
              placeholder="0 0 0 0 0 0"
              className="w-full bg-slate-800/50 border border-slate-700 rounded-2xl py-4 text-center text-3xl font-bold tracking-[0.5em] text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder:text-slate-600 shadow-inner"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg shadow-blue-900/20"
          >
            {loading ? "Verifying..." : "Verify OTP"}
            {!loading && <ArrowRight size={20} />}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-slate-500 text-sm">
            Didn't receive the code?
          </p>
          <button
            disabled={timer > 0}
            onClick={() => toast.error("Resend feature coming soon!")}
            className={`mt-2 inline-flex items-center gap-2 font-bold text-sm transition-colors ${
              timer > 0 ? 'text-slate-600 cursor-not-allowed' : 'text-blue-400 hover:text-blue-300'
            }`}
          >
            <RefreshCcw size={14} className={timer > 0 ? '' : 'animate-spin-slow'} />
            {timer > 0 ? `Resend in ${timer}s` : "Resend OTP Now"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OtpPage;