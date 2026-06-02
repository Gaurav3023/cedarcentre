"use client";

import { motion } from "framer-motion";
import { Lock, CheckCircle2, ChevronRight, Star } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { forestActivities } from "@/data/forestActivities";
import { useAuth } from "@/context/AuthContext";

export default function JourneyMap() {
  const { user } = useAuth();
  const [completed, setCompleted] = useState<number[]>([]);
  const [currentPhase, setCurrentPhase] = useState(1);

  useEffect(() => {
    if (!user) return;
    const saved = localStorage.getItem(`cedar_forest_progress_${user.id}`);
    if (saved) {
      const completedIds = JSON.parse(saved);
      setCompleted(completedIds);
      const phase = Math.floor(completedIds.length / 10) + 1;
      setCurrentPhase(Math.min(phase, 12));
    } else {
      setCompleted([]);
      setCurrentPhase(1);
    }
  }, [user]);
  
  const currentPhaseActivities = forestActivities.slice((currentPhase - 1) * 10, currentPhase * 10);
  
  return (
    <div className="relative py-10">
      <div className="absolute left-[39px] top-0 bottom-0 w-1 bg-slate-100 hidden md:block" />
      
      <div className="space-y-12">
        <div className="mb-8 px-4 flex justify-between items-center">
           <h5 className="text-[10px] font-black text-cedar-primary uppercase tracking-[0.3em]">
             Focusing on Phase {currentPhase}
           </h5>
           <Link href="/student/forest-journey" className="text-[10px] font-black text-slate-400 hover:text-cedar-primary uppercase tracking-widest transition-colors flex items-center gap-2">
              See All Phases <ChevronRight className="w-3 h-3" />
           </Link>
        </div>

        {currentPhaseActivities.map((act, idx) => {
          const isCompleted = completed.includes(act.id);
          const isLocked = act.id > 1 && !completed.includes(act.id - 1);
          const isCurrent = act.id === 1 || (completed.includes(act.id - 1) && !isCompleted);

          return (
            <motion.div 
              key={act.id}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className={`flex items-center gap-8 relative z-10 ${isLocked ? 'opacity-40 grayscale' : 'opacity-100'}`}
            >
              <div className={`w-20 h-20 rounded-[2.5rem] flex items-center justify-center border-4 transition-all duration-500 ${
                isCompleted 
                ? 'bg-cedar-primary text-white border-cedar-primary/20 shadow-lg' 
                : isCurrent
                ? 'bg-white border-cedar-primary text-cedar-primary shadow-xl shadow-cedar-primary/20 animate-pulse'
                : 'bg-slate-50 border-slate-100 text-slate-300'
              }`}>
                {isCompleted ? (
                   <CheckCircle2 className="w-10 h-10" />
                ) : isLocked ? (
                   <Lock className="w-8 h-8" />
                ) : (
                   <act.icon className="w-10 h-10" />
                )}
              </div>
              
              <div className={`bg-white p-8 rounded-[2.5rem] shadow-premium flex-1 border border-slate-50 relative group transition-all ${!isLocked ? 'hover:border-cedar-primary/30 hover:translate-x-2' : ''}`}>
                <div className="flex justify-between items-center">
                   <div>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] block mb-2">
                        Forest Step {act.id}
                      </span>
                      <h4 className={`text-2xl font-serif ${isLocked ? 'text-slate-400' : 'text-slate-800'}`}>{act.title}</h4>
                   </div>
                   {!isLocked && (
                      <Link href="/student/forest-journey" className={`p-4 rounded-2xl transition-all ${isCompleted ? 'bg-green-50 text-green-500 hover:bg-green-500 hover:text-white' : 'bg-slate-50 text-slate-400 group-hover:bg-cedar-primary group-hover:text-white'}`}>
                         <ChevronRight className="w-6 h-6" />
                      </Link>
                   )}
                </div>
                
                {isCurrent && (
                  <div className="mt-6">
                     <Link href="/student/forest-journey" className="inline-flex items-center gap-3 px-8 py-3 bg-brand-gradient text-white rounded-full text-xs font-black uppercase tracking-widest shadow-xl shadow-cedar-primary/20 hover:scale-105 transition-all">
                        Take This Step <ChevronRight className="w-4 h-4" />
                     </Link>
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
