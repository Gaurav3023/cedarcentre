"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { useAuth, UserRole } from "@/context/AuthContext";
import { User, Mail, ShieldCheck, ArrowRight, Loader2, CheckCircle2, Lock } from "lucide-react";
import Link from "next/link";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("student");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { signup } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    if (password.length < 4) {
      setError("Password must be at least 4 characters.");
      setLoading(false);
      return;
    }

    try {
      const success = await signup(name, email, password, role);
      if (!success) setError("Email already exists.");
    } catch (err) {
      setError("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cedar-background py-20 px-8 flex items-center justify-center">
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white glass-card rounded-[3.5rem] w-full max-w-2xl p-10 md:p-20 relative overflow-hidden"
      >
        <div className="text-center mb-12 relative z-10">
          <Link href="/" className="inline-block mb-8">
            <img src="https://cedarcentre.ca/wp-content/uploads/2023/07/cedar-logo1.svg" alt="Cedar Centre" className="h-20" />
          </Link>
          <h1 className="text-4xl font-bold text-slate-800">Start Your Journey</h1>
          <p className="text-slate-500 mt-3 font-medium">Join the Cedar Centre STAIR platform today.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <RoleOption 
               selected={role === 'student'} 
               onClick={() => setRole('student')}
               icon={<User className="w-6 h-6" />}
               label="I am a Student"
               description="I want to learn and grow."
             />
             <RoleOption 
               selected={role === 'educator'} 
               onClick={() => setRole('educator')}
               icon={<ShieldCheck className="w-6 h-6" />}
               label="I am an Educator"
               description="I want to support and guide."
             />
          </div>

          <div className="space-y-5">
            <div>
              <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Full Name</label>
              <div className="mt-2 relative">
                <User className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter your name" className="input-field pl-14" />
              </div>
            </div>

            <div>
              <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Email Address</label>
              <div className="mt-2 relative">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@example.com" className="input-field pl-14" />
              </div>
            </div>

            <div>
              <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Secure Password</label>
              <div className="mt-2 relative">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="input-field pl-14" />
              </div>
            </div>
          </div>

          {error && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-500 text-sm font-bold bg-red-50 p-4 rounded-2xl border border-red-100">{error}</motion.p>
          )}

          <button 
            type="submit" 
            disabled={loading}
            className="btn-premium w-full py-5 text-lg"
          >
            {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <>Register for Approval <ArrowRight className="w-6 h-6" /></>}
          </button>
        </form>

        <p className="text-center text-slate-500 mt-10">
          Already have an account? <Link href="/login" className="text-cedar-primary font-bold hover:underline underline-offset-4">Sign in here</Link>
        </p>
      </motion.div>
    </div>
  );
}

function RoleOption({ selected, onClick, icon, label, description }: { selected: boolean, onClick: () => void, icon: React.ReactNode, label: string, description: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`p-6 rounded-[2.5rem] border-2 text-left transition-all relative group ${
        selected ? 'bg-cedar-primary border-cedar-primary text-white shadow-xl translate-y-[-4px]' : 'bg-white border-slate-100 text-slate-500 hover:border-cedar-aqua'
      }`}
    >
      {selected && <CheckCircle2 className="absolute top-4 right-4 w-5 h-5 text-cedar-aqua" />}
      <div className={`p-4 rounded-2xl w-fit mb-4 transition-colors ${selected ? 'bg-white/20' : 'bg-slate-50 group-hover:bg-cedar-aqua/10'}`}>
        {icon}
      </div>
      <div className="font-bold mb-1">{label}</div>
      <div className="text-[10px] opacity-70 leading-relaxed uppercase tracking-widest font-black">{description}</div>
    </button>
  );
}
