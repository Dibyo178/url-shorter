import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Copy, Trash2, LayoutDashboard, LogOut, Link as LinkIcon } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
    const [longUrl, setLongUrl] = useState('');
    const [links, setLinks] = useState([]);
    const [user, setUser] = useState({ name: '', email: '' });
    const [showDashboard, setShowDashboard] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        // 1. Retrieve user data and token from sessionStorage
        const name = sessionStorage.getItem('userName');
        const email = sessionStorage.getItem('userEmail');
        const token = sessionStorage.getItem('token');
        
        // Redirect to login if no token is found
        if (!token) {
            navigate('/');
        } else {
            // 2. Set user state with fallback values for undefined data
            const currentUser = { 
                name: name && name !== "undefined" ? name : "User", 
                email: email && email !== "undefined" ? email : "No Email Provided" 
            };
            setUser(currentUser);
            
            // 3. Fetch user-specific links if email is valid
            if (email && email !== "undefined") {
                fetchUserLinks(email);
            }
        }
    }, [navigate]);

    const fetchUserLinks = async (email) => {
        try {
            const res = await axios.get(`http://localhost:5001/api/user-links?email=${email}`);
            if (res.data.success) {
                setLinks(res.data.links);
            }
        } catch (err) {
            console.error("Failed to load links");
        }
    };

    const handleShorten = async (e) => {
        e.preventDefault();
        // Ensure user is authenticated before shortening
        if (!user.email || user.email === "No Email Provided") {
            return toast.error("Session expired. Please login again.");
        }

        try {
            const res = await axios.post('http://localhost:5001/api/shorten', {
                long_url: longUrl,
                user_email: user.email
            });
            if (res.data.success) {
                toast.success("Link Shortened!");
                setLongUrl('');
                fetchUserLinks(user.email);
            }
        } catch (err) {
            const errorMsg = err.response?.data?.message || "Error creating link";
            toast.error(errorMsg);
        }
    };

    // --- Clipboard Copy Logic ---
    const copyToClipboard = (shortCode) => {
        const fullLink = `http://localhost:5001/${shortCode}`;
        navigator.clipboard.writeText(fullLink);
        toast.success("Link copied to clipboard!", {
            style: { background: '#1e293b', color: '#fff' },
            icon: '📋'
        });
    };

    const deleteLink = async (id) => {
        if (!window.confirm("Delete this link?")) return;
        try {
            await axios.delete(`http://localhost:5001/api/delete-link/${id}`);
            fetchUserLinks(user.email);
            toast.success("Deleted!");
        } catch (err) {
            toast.error("Failed to delete");
        }
    };

    const handleLogout = () => {
        sessionStorage.clear();
        navigate('/');
    };

    return (
        <div className="min-h-screen bg-[#0f172a] text-white font-sans">
            <Toaster position="top-center" />
            
            {/* --- Navbar Section --- */}
            <nav className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center bg-slate-900/40 backdrop-blur-md sticky top-0 z-50 border-b border-slate-800">
                <div className="flex items-center gap-10">
                    <div className="flex items-center gap-2 text-blue-500 font-bold text-2xl tracking-tighter cursor-pointer" onClick={() => setShowDashboard(false)}>
                        <LinkIcon className="rotate-45" /> URL Shortener Service
                    </div>
                    
                    <button 
                        onClick={() => setShowDashboard(!showDashboard)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all ${showDashboard ? 'bg-blue-600 text-white border-blue-500' : 'bg-blue-600/10 text-blue-400 border-blue-500/20 hover:bg-blue-600/20'}`}
                    >
                        <LayoutDashboard size={18} />
                        <span className="font-semibold text-sm">Dashboard</span>
                    </button>
                </div>

                <div className="flex items-center gap-6">
                    <div className="hidden md:flex flex-col items-end">
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Usage</span>
                            <span className="text-sm font-bold text-blue-400">{links.length}/100</span>
                        </div>
                        <div className="w-24 h-1 bg-slate-800 rounded-full mt-1 overflow-hidden">
                            <div 
                                className="h-full bg-blue-500 transition-all duration-500" 
                                style={{ width: `${Math.min((links.length / 100) * 100, 100)}%` }}
                            ></div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 border-l border-slate-800 pl-6">
                        <div className="bg-blue-600 h-10 w-10 rounded-full flex items-center justify-center font-bold text-lg shadow-lg shadow-blue-500/20 uppercase">
                            {user.name.charAt(0)}
                        </div>
                        <div className="text-left hidden lg:block">
                            <p className="text-sm font-bold leading-none text-white uppercase tracking-tight">{user.name}</p>
                            <p className="text-[10px] text-blue-400/70 mt-1 font-medium italic">{user.email}</p>
                        </div>
                        <button onClick={handleLogout} className="ml-2 p-2 text-slate-400 hover:text-red-500 transition-all">
                            <LogOut size={20} />
                        </button>
                    </div>
                </div>
            </nav>

            <div className="max-w-6xl mx-auto p-6">
                {/* --- Input Form Section --- */}
                <div className="text-center mt-12 mb-12">
                    <h1 className="text-4xl font-black mb-6">Shorten Your <span className="text-blue-500">Links</span></h1>
                    <form onSubmit={handleShorten} className="flex gap-2 max-w-2xl mx-auto bg-slate-900 border border-slate-800 p-2 rounded-2xl shadow-xl focus-within:border-blue-500/50 transition-all">
                        <input 
                            type="url" required value={longUrl}
                            onChange={(e) => setLongUrl(e.target.value)}
                            placeholder="Paste your long link here..."
                            className="flex-1 bg-transparent p-4 outline-none"
                        />
                        <button className="bg-blue-600 hover:bg-blue-700 px-8 py-4 rounded-xl font-bold transition-all active:scale-95 shadow-lg shadow-blue-600/20">
                            Shorten
                        </button>
                    </form>
                </div>

                {/* --- Dashboard Table View --- */}
                {showDashboard ? (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 shadow-2xl">
                             <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-slate-800/50 text-xs text-slate-400 uppercase font-black tracking-widest">
                                        <tr>
                                            <th className="p-5">Original URL</th>
                                            <th className="p-5">Short URL</th>
                                            <th className="p-5 text-center">Clicks</th>
                                            <th className="p-5">Date</th>
                                            <th className="p-5 text-right">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-800">
                                        {links.map((link) => (
                                            <tr key={link.id} className="hover:bg-slate-800/30 transition-colors group">
                                                <td className="p-5 max-w-xs truncate text-sm text-slate-300" title={link.long_url}>{link.long_url}</td>
                                                <td className="p-5">
                                                    <div className="flex items-center gap-3">
                                                        <span className="text-blue-400 font-mono text-sm">
                                                            http://localhost:5001/{link.short_code}
                                                        </span>
                                                        <button 
                                                            onClick={() => copyToClipboard(link.short_code)}
                                                            className="p-1.5 bg-slate-800 rounded-md text-slate-400 hover:text-white hover:bg-blue-600 transition-all"
                                                            title="Copy Link"
                                                        >
                                                            <Copy size={14} />
                                                        </button>
                                                    </div>
                                                </td>
                                                <td className="p-5 text-center">
                                                    <span className="bg-slate-800 px-3 py-1 rounded-lg text-xs font-bold text-blue-400">{link.clicks}</span>
                                                </td>
                                                <td className="p-5 text-slate-500 text-xs">{new Date(link.created_at).toLocaleDateString()}</td>
                                                <td className="p-5 text-right">
                                                    <button onClick={() => deleteLink(link.id)} className="text-slate-500 hover:text-red-500 p-2 transition-colors">
                                                        <Trash2 size={18} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                             </div>
                        </div>
                    </div>
                ) : (
                    // Default Empty State View
                    <div className="text-center py-20 bg-slate-900/20 rounded-3xl border border-dashed border-slate-800">
                        <p className="text-slate-500">Click on <b>Dashboard</b> to manage your existing links</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default HomePage;