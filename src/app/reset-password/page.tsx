"use client";

import { motion } from "framer-motion";
import { useState, useEffect, Suspense } from "react";
import { Lock, ArrowLeft, Loader2, CheckCircle, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");
  
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (!token) {
      alert("Invalid or missing reset token.");
      router.push("/login");
    }
  }, [token, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    
    setLoading(true);
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });
      
      if (res.ok) {
        setSuccess(true);
        setTimeout(() => {
          router.push("/login");
        }, 3000);
      } else {
        const data = await res.json();
        alert(data.error || "Reset failed. Token may be expired.");
      }
    } catch (err) {
      alert("Network error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="white glass-card rounded-[3.5rem] w-full max-w-lg p-12 md:p-16 text-center"
    >
      {!success ? (
        <>
          <div className="w-20 h-20 bg-cedar-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-10 text-cedar-primary">
            <Lock className="w-10 h-10" />
          </div>
          <h1 className="text-3xl font-bold text-slate-800">Set New Password</h1>
          <p className="text-slate-500 mt-3 mb-10">Choose a strong password to secure your account.</p>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="text-left relative">
              <label className="text-sm font-semibold text-slate-700 ml-1">New Password</label>
              <div className="relative mt-2">
                <input 
                  type={showPassword ? "text" : "password"} 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="input-field pr-12"
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="text-left">
              <label className="text-sm font-semibold text-slate-700 ml-1">Confirm New Password</label>
              <input 
                type={showPassword ? "text" : "password"} 
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="input-field mt-2"
              />
            </div>

            <button type="submit" disabled={loading} className="btn-premium w-full py-5">
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Update Password"}
            </button>
          </form>
        </>
      ) : (
        <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }}>
          <div className="w-20 h-20 bg-green-50 rounded-3xl flex items-center justify-center mx-auto mb-10 text-green-500">
            <CheckCircle className="w-10 h-10" />
          </div>
          <h1 className="text-3xl font-bold text-slate-800">Password Updated</h1>
          <p className="text-slate-500 mt-3 mb-10">Your password has been reset successfully. Redirecting you to login...</p>
          <Link href="/login" className="text-sm font-bold text-cedar-primary hover:underline">Go to Login now</Link>
        </motion.div>
      )}

      <div className="mt-12 pt-8 border-t border-slate-100">
         <Link href="/login" className="flex items-center justify-center gap-2 text-slate-400 hover:text-cedar-primary transition-colors font-bold text-sm uppercase tracking-widest">
           <ArrowLeft className="w-4 h-4" /> Back to Login
         </Link>
      </div>
    </motion.div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-cedar-background flex items-center justify-center p-8">
      <Suspense fallback={<Loader2 className="w-10 h-10 animate-spin text-cedar-primary" />}>
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}
