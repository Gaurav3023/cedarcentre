"use client";

import { motion } from "framer-motion";
import { Clock, ShieldCheck, ArrowLeft, Mail } from "lucide-react";
import Link from "next/link";

export default function PendingPage() {
  return (
    <div className="min-h-screen bg-cedar-background p-8 flex flex-col items-center justify-center text-center">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-xl"
      >
        <div className="w-24 h-24 bg-cedar-aqua/20 rounded-full flex items-center justify-center mx-auto mb-10 text-cedar-primary">
          <Clock className="w-12 h-12" />
        </div>
        
        <h1 className="text-4xl md:text-5xl font-serif text-slate-800 mb-6">Account Pending Approval</h1>
        <p className="text-xl text-slate-500 leading-relaxed mb-12">
          Thank you for joining Cedar Centre STAIR. To ensure a safe environment for everyone, our administrators review and approve each new account manually.
        </p>

        <div className="bg-white p-8 rounded-[3rem] shadow-premium mb-12 space-y-6 text-left">
           <div className="flex gap-5">
             <div className="w-10 h-10 bg-cedar-50 rounded-xl flex items-center justify-center shrink-0">
               <ShieldCheck className="w-5 h-5 text-cedar-primary" />
             </div>
             <div>
               <h4 className="font-bold text-slate-800">What happens next?</h4>
               <p className="text-sm text-slate-500 mt-1">An administrator will review your educator or student credentials.</p>
             </div>
           </div>
           <div className="flex gap-5">
             <div className="w-10 h-10 bg-cedar-50 rounded-xl flex items-center justify-center shrink-0">
               <Mail className="w-5 h-5 text-cedar-primary" />
             </div>
             <div>
               <h4 className="font-bold text-slate-800">Email Notification</h4>
               <p className="text-sm text-slate-500 mt-1">You&apos;ll receive an email as soon as your account is ready for use.</p>
             </div>
           </div>
        </div>

        <Link href="/login" className="btn-outline inline-flex">
          <ArrowLeft className="w-5 h-5" /> Back to Login
        </Link>
      </motion.div>

      <footer className="mt-20 text-slate-400 text-sm italic">
        "Your recovery is our priority. Thank you for your patience."
      </footer>
    </div>
  );
}
