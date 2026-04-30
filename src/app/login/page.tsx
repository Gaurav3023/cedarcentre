"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Mail, Lock, ArrowRight, Loader2, Info } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
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
      const success = await login(email, password, false);
      if (!success) {
        setError("Login failed. Check your credentials or wait for admin approval.");
      }
    } catch (err) {
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-cedar-background">
      {/* Brand Side */}
      <div className="hidden lg:flex bg-cedar-primary relative overflow-hidden items-center justify-center p-24">
        <div className="absolute inset-0 bg-brand-gradient opacity-80" />
        <div className="absolute inset-0 opacity-10 blur-[100px] bg-white rounded-full translate-x-1/2" />
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 text-white max-w-lg"
        >
          <img src="https://cedarcentre.ca/wp-content/uploads/2023/07/cedar-logo1.svg" alt="Cedar" className="h-32 mb-12 grayscale invert brightness-0 invert" />
          <h2 className="text-6xl font-serif mb-8 leading-tight">Healing Begins in a Safe Space.</h2>
          <p className="text-cedar-aqua text-xl opacity-90 leading-relaxed font-medium">Welcome to the STAIR Platform. Your journey and your privacy are our priority.</p>
        </motion.div>
      </div>

      {/* Form Side */}
      <div className="flex items-center justify-center p-8 md:p-16">
        <motion.div 
           initial={{ opacity: 0, x: 30 }}
           animate={{ opacity: 1, x: 0 }}
           className="w-full max-w-md"
        >
          <div className="mb-14 text-center lg:text-left">
             <Link href="/" className="inline-block lg:hidden mb-10">
                <img src="https://cedarcentre.ca/wp-content/uploads/2023/07/cedar-logo1.svg" alt="Logo" className="h-20" />
             </Link>
             <h1 className="text-4xl font-bold text-slate-800">Sign In</h1>
             <p className="text-slate-500 mt-2 font-medium">Please enter your credentials to continue.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Account Email</label>
              <div className="relative">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="input-field pl-14"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-xs font-black uppercase tracking-widest text-slate-400">Password</label>
                <Link href="/forgot-password" className="text-xs text-cedar-primary font-black uppercase tracking-widest hover:underline">Forgot?</Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input 
                  type="password" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="input-field pl-14"
                />
              </div>
            </div>

            {error && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-500 text-sm font-bold bg-red-50 p-4 rounded-2xl border border-red-100 flex items-start gap-3">
                 <Info className="w-5 h-5 shrink-0" />
                 <span>{error}</span>
              </motion.div>
            )}

            <button 
              type="submit" 
              disabled={loading}
              className="btn-premium w-full py-5 shadow-2xl"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Sign In <ArrowRight className="w-5 h-5" /></>}
            </button>
          </form>

          <div className="mt-12 p-6 bg-white rounded-3xl border border-slate-100 shadow-sm">
             <p className="text-center text-slate-500 text-sm font-medium">
               New here? <Link href="/signup" className="text-cedar-primary font-black uppercase tracking-widest hover:underline ml-2">Request Access</Link>
             </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
