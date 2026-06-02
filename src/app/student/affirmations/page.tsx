"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Sun, ChevronLeft, ChevronRight, Home, Sparkles, Heart } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import RoleGuard from "@/components/RoleGuard";

const affirmations = [
  "I am safe, I am strong, I am enough.",
  "My courage is a forest that grows stronger every day.",
  "I have the power to heal and the right to be happy.",
  "Every breath I take is an act of self-love.",
  "I am not defined by my past; I am the architect of my future.",
  "My voice matters, and my feelings are valid.",
  "I am surrounded by support, even when I feel alone.",
  "I give myself permission to rest and regroup.",
  "I am resilient, capable, and full of infinite light.",
  "Today, I choose to be kind to myself."
];

export default function AffirmationsPage() {
  const [index, setIndex] = useState(0);

  const nextAffirmation = () => setIndex((prev) => (prev + 1) % affirmations.length);
  const prevAffirmation = () => setIndex((prev) => (prev - 1 + affirmations.length) % affirmations.length);

  return (
    <RoleGuard allowedRoles="student">
    <div className="min-h-screen bg-cedar-background flex flex-col items-center justify-center p-8 md:p-20 relative overflow-hidden">
      {/* Background Zen Elements */}
      <motion.div 
        animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
        transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-yellow-100/30 rounded-full blur-[120px]"
      />
      <motion.div 
        animate={{ scale: [1, 1.2, 1], rotate: [0, -10, 10, 0] }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -bottom-40 -left-40 w-[800px] h-[800px] bg-cedar-aqua/20 rounded-full blur-[150px]"
      />

      <Link href="/student" className="absolute top-12 left-12 flex items-center gap-3 px-6 py-3 bg-white/60 backdrop-blur-xl rounded-full border border-white/40 text-slate-600 font-bold hover:bg-white transition-all shadow-sm z-50">
         <Home className="w-5 h-5" /> Home
      </Link>

      <div className="max-w-4xl w-full relative z-10 text-center">
         <motion.div 
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           className="mb-20 inline-flex items-center gap-4 px-6 py-2 bg-white/80 backdrop-blur-md rounded-full shadow-sm border border-white"
         >
            <div className="w-10 h-10 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center">
               <Sun className="w-6 h-6 animate-spin-slow" />
            </div>
            <span className="text-[10px] font-black uppercase text-slate-500 tracking-[0.3em]">Safe Affirmations</span>
         </motion.div>

         <div className="relative min-h-[400px] flex items-center justify-center">
            <AnimatePresence mode="wait">
               <motion.div
                 key={index}
                 initial={{ opacity: 0, scale: 0.9, x: 20 }}
                 animate={{ opacity: 1, scale: 1, x: 0 }}
                 exit={{ opacity: 0, scale: 1.1, x: -20 }}
                 className="space-y-12"
               >
                  <h1 className="text-5xl md:text-7xl font-serif text-slate-800 leading-tight italic">
                    &quot;{affirmations[index]}&quot;
                  </h1>
                  <div className="flex items-center justify-center gap-3">
                     <Sparkles className="w-6 h-6 text-cedar-primary" />
                     <Heart className="w-6 h-6 text-cedar-coral fill-current" />
                     <Sparkles className="w-6 h-6 text-cedar-primary" />
                  </div>
               </motion.div>
            </AnimatePresence>
         </div>

         <div className="mt-24 flex items-center justify-center gap-10">
            <button 
              onClick={prevAffirmation}
              className="p-6 bg-white rounded-full shadow-premium hover:shadow-premium-hover hover:scale-110 active:scale-95 transition-all text-slate-400 hover:text-cedar-primary"
            >
               <ChevronLeft className="w-8 h-8" />
            </button>
            <div className="flex gap-3">
               {affirmations.map((_, i) => (
                 <div key={i} className={`w-2 h-2 rounded-full transition-all duration-500 ${i === index ? 'bg-cedar-primary w-8' : 'bg-slate-200'}`} />
               ))}
            </div>
            <button 
              onClick={nextAffirmation}
              className="p-6 bg-white rounded-full shadow-premium hover:shadow-premium-hover hover:scale-110 active:scale-95 transition-all text-slate-400 hover:text-cedar-primary"
            >
               <ChevronRight className="w-8 h-8" />
            </button>
         </div>
      </div>
    </div>
    </RoleGuard>
  );
}
