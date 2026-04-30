"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { ShieldAlert, Lock, ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      const success = await login(email, password, true);
      if (!success) setError("Access Denied. Admin credentials required.");
    } catch (err) {
      setError("System error. Please notify tech support.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-8">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-lg bg-slate-900 border border-slate-800 p-12 md:p-16 rounded-[4rem] shadow-2xl"
      >
        <div className="flex flex-col items-center text-center mb-12">
          <Link href="/">
             <img src="https://cedarcentre.ca/wp-content/uploads/2023/07/cedar-logo1.svg" alt="Cedar Centre" className="h-20 mb-8 grayscale invert brightness-0 invert" />
          </Link>
          <h1 className="text-3xl font-bold text-white tracking-tight">Admin Gateway</h1>
          <p className="text-slate-500 mt-2">Authorized personnel only.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Secure Email</label>
            <div className="relative">
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-6 py-5 bg-slate-800/50 border border-slate-700 rounded-2xl focus:ring-4 focus:ring-cedar-primary/20 focus:border-cedar-primary outline-none transition-all text-white font-medium"
                placeholder="admin@cedar.ca"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Access Token</label>
            <div className="relative">
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-6 py-5 bg-slate-800/50 border border-slate-700 rounded-2xl focus:ring-4 focus:ring-cedar-primary/20 focus:border-cedar-primary outline-none transition-all text-white font-medium"
                placeholder="••••••••"
              />
            </div>
          </div>

          {error && (
            <p className="text-red-400 text-sm font-medium bg-red-950/30 p-4 rounded-2xl border border-red-900/50">{error}</p>
          )}

          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-5 bg-cedar-primary text-white rounded-2xl font-bold hover:bg-cedar-dark transition-all flex items-center justify-center gap-3 shadow-lg"
          >
             {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Login <ArrowRight className="w-5 h-5" /></>}
          </button>
        </form>

        <div className="mt-12 text-center">
           <Link href="/login" className="text-slate-600 hover:text-slate-400 text-sm transition-colors">Return to public site</Link>
        </div>
      </motion.div>
    </div>
  );
}
