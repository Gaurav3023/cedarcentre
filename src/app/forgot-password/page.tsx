"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Mail, ArrowLeft, Loader2, CheckCircle } from "lucide-react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setSent(true);
      } else {
        const data = await res.json();
        alert(data.error || "Something went wrong. Please try again.");
      }
    } catch (err) {
      alert("Network error. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cedar-background flex items-center justify-center p-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="white glass-card rounded-[3.5rem] w-full max-w-lg p-12 md:p-16 text-center"
      >
        {!sent ? (
          <>
            <div className="w-20 h-20 bg-cedar-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-10 text-cedar-primary">
              <Mail className="w-10 h-10" />
            </div>
            <h1 className="text-3xl font-bold text-slate-800">Reset Password</h1>
            <p className="text-slate-500 mt-3 mb-10">Enter your email and we&apos;ll send you instructions to reset your password.</p>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="text-left">
                <label className="text-sm font-semibold text-slate-700 ml-1">Account Email</label>
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="input-field mt-2"
                />
              </div>
              <button type="submit" disabled={loading} className="btn-premium w-full py-5">
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Send Instructions"}
              </button>
            </form>
          </>
        ) : (
          <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }}>
            <div className="w-20 h-20 bg-green-50 rounded-3xl flex items-center justify-center mx-auto mb-10 text-green-500">
              <CheckCircle className="w-10 h-10" />
            </div>
            <h1 className="text-3xl font-bold text-slate-800">Instructions Sent</h1>
            <p className="text-slate-500 mt-3 mb-10">Check your inbox for a reset link. It should arrive in a few minutes.</p>
            <button onClick={() => setSent(false)} className="text-sm font-bold text-cedar-primary hover:underline">Try another email</button>
          </motion.div>
        )}

        <div className="mt-12 pt-8 border-t border-slate-100">
           <Link href="/login" className="flex items-center justify-center gap-2 text-slate-400 hover:text-cedar-primary transition-colors font-bold text-sm uppercase tracking-widest">
             <ArrowLeft className="w-4 h-4" /> Back to Login
           </Link>
        </div>
      </motion.div>
    </div>
  );
}
