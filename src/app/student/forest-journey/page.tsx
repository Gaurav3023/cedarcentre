"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { CheckCircle2, ChevronRight, Home, Star, Wind, X } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { forestActivities } from "@/data/forestActivities";
import RoleGuard from "@/components/RoleGuard";

export default function ForestJourneyPage() {
  const { user, addStarsToUser } = useAuth();
  const [completed, setCompleted] = useState<number[]>([]);
  const [activeId, setActiveId] = useState<number | null>(null);
  const [inputVal, setInputVal] = useState("");
  const [showCelebration, setShowCelebration] = useState(false);
  const [showStarFly, setShowStarFly] = useState(false);
  const [activeChapter, setActiveChapter] = useState(1);

  useEffect(() => {
    if (!user) return;
    const saved = localStorage.getItem(`cedar_forest_progress_${user.id}`);
    if (saved) {
       const completedIds = JSON.parse(saved);
       setCompleted(completedIds);
       const latestPhase = Math.floor(completedIds.length / 10) + 1;
       setActiveChapter(Math.min(latestPhase, 12));
    }
  }, [user]);

  const handleComplete = (id: number) => {
    if (!user || completed.includes(id)) return;
    const updated = [...completed, id];
    setCompleted(updated);
    localStorage.setItem(`cedar_forest_progress_${user.id}`, JSON.stringify(updated));
    
    addStarsToUser(1);
    setShowStarFly(true);

    setTimeout(() => {
       setShowStarFly(false);
       setShowCelebration(true);
    }, 2500);

    setTimeout(() => {
      setShowCelebration(false);
      setActiveId(null);
      setInputVal("");
    }, 5000);
  };

  const resetProgress = () => {
    if (!user) return;
    if (confirm("Reset your journey? You can walk the path as many times as you need.")) {
      setCompleted([]);
      localStorage.removeItem(`cedar_forest_progress_${user.id}`);
      setActiveChapter(1);
    }
  };

  const activeChapterData = forestActivities.slice((activeChapter - 1) * 10, activeChapter * 10);

  const chapters = [
    { id: 1, name: "Quiet Glade" }, { id: 2, name: "Rising Mist" }, { id: 3, name: "Golden Grove" },
    { id: 4, name: "Whispering Wind" }, { id: 5, name: "Crystal Lake" }, { id: 6, name: "Ancient Peak" },
    { id: 7, name: "Sky Horizon" }, { id: 8, name: "Velvet Valley" }, { id: 9, name: "Prismatic Path" },
    { id: 10, name: "Echoing Cave" }, { id: 11, name: "Solar Summit" }, { id: 12, name: "Cosmic Cradle" },
  ];

  return (
    <RoleGuard allowedRoles="student">
    <div className="min-h-screen bg-cedar-background pb-32">
       <header className="px-12 py-8 flex justify-between items-center bg-white/60 backdrop-blur-xl border-b border-white sticky top-0 z-50">
          <div className="flex items-center gap-6">
             <Link href="/student" className="p-3 bg-white rounded-2xl shadow-sm border border-slate-100 text-slate-400 hover:text-cedar-primary transition-all">
                <Home className="w-6 h-6" />
             </Link>
             <div>
                <h1 className="text-3xl font-serif text-slate-800">The Forest Journey</h1>
                <p className="text-[10px] font-black uppercase text-cedar-primary tracking-[0.2em] mt-1">
                   {completed.length} / 120 Steps Mastered
                </p>
             </div>
          </div>
          <button onClick={resetProgress} className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-300 hover:text-red-400 transition-colors">
             Reset 
          </button>
       </header>

       <main className="max-w-7xl mx-auto px-12 pt-16">
          <div className="flex justify-start mb-16 overflow-x-auto pb-4 px-4 no-scrollbar">
             <div className="bg-white/40 p-2 rounded-[2.5rem] flex gap-2 border border-white/40 backdrop-blur-sm shadow-sm min-w-max">
                {chapters.map(ch => (
                  <button 
                    key={ch.id}
                    onClick={() => setActiveChapter(ch.id)}
                    className={`px-8 py-4 rounded-[1.8rem] text-[9px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeChapter === ch.id ? 'bg-cedar-primary text-white shadow-lg shadow-cedar-primary/20 scale-105' : 'text-slate-400 hover:bg-white hover:text-cedar-primary'}`}
                  >
                     Phase {ch.id}: {ch.name}
                  </button>
                ))}
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
             {activeChapterData.map((act, idx) => {
                const isCompleted = completed.includes(act.id);
                const isLocked = act.id > 1 && !completed.includes(act.id - 1);

                return (
                  <motion.div 
                    key={act.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.05 }}
                    onClick={() => !isLocked && setActiveId(act.id)}
                    className={`relative p-8 rounded-[2.5rem] border shadow-sm transition-all group overflow-hidden h-[240px] flex flex-col justify-between ${
                      isLocked ? 'bg-slate-50/50 border-slate-100 opacity-60 grayscale cursor-not-allowed' : 
                      isCompleted ? 'bg-white border-green-100' : 
                      'bg-white border-slate-50 hover:border-cedar-primary/20 cursor-pointer hover:shadow-xl hover:-translate-y-1'
                    }`}
                  >
                     <div>
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:rotate-12 ${act.color}`}>
                           <act.icon className="w-6 h-6" />
                        </div>
                        <h3 className={`text-lg font-bold leading-tight ${isLocked ? 'text-slate-400' : 'text-slate-800'}`}>{act.title}</h3>
                     </div>
                     
                     <div className="flex justify-between items-center">
                        <span className="text-[8px] font-black uppercase text-slate-300 tracking-widest">Step {act.id}</span>
                        {isCompleted ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : isLocked ? <Star className="w-4 h-4 text-slate-200" /> : <ChevronRight className="w-4 h-4 text-cedar-primary" />}
                     </div>
                  </motion.div>
                );
             })}
          </div>

          {activeChapter < 12 && (
            <div className="mt-20 flex justify-center">
               <button 
                onClick={() => {
                  setActiveChapter(prev => prev + 1);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="group flex items-center gap-6 px-12 py-6 bg-white rounded-[3rem] border border-slate-100 shadow-premium hover:shadow-premium-hover transition-all text-slate-800"
               >
                  <div className="text-left">
                     <p className="text-[10px] font-black uppercase text-cedar-primary tracking-[0.2em] mb-1">Journey Continues</p>
                     <p className="text-2xl font-serif font-bold">Move to Phase {activeChapter + 1}</p>
                  </div>
                  <div className="w-16 h-16 bg-cedar-primary text-white rounded-full flex items-center justify-center group-hover:translate-x-2 transition-transform shadow-lg shadow-cedar-primary/20">
                     <ChevronRight className="w-8 h-8" />
                  </div>
               </button>
            </div>
          )}
       </main>

       <AnimatePresence>
          {activeId && (
            <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xl z-[100] flex items-center justify-center p-8">
               <motion.div 
                 initial={{ opacity: 0, scale: 0.9, y: 30 }}
                 animate={{ opacity: 1, scale: 1, y: 0 }}
                 exit={{ opacity: 0, scale: 0.9, y: 30 }}
                 className="bg-white rounded-[4rem] w-full max-w-2xl p-12 md:p-20 relative overflow-hidden"
               >
                  {!showCelebration && !showStarFly ? (
                    <>
                      <button onClick={() => setActiveId(null)} className="absolute top-10 right-10 p-4 hover:bg-slate-50 rounded-full transition-colors text-slate-400"><X className="w-6 h-6" /></button>
                      <div className="text-center">
                         <div className={`w-24 h-24 rounded-[2.5rem] flex items-center justify-center mx-auto mb-10 ${forestActivities.find(a => a.id === activeId)?.color}`}>
                            {(() => {
                              const Icon = forestActivities.find(a => a.id === activeId)?.icon;
                              return Icon && <Icon className="w-12 h-12" />;
                            })()}
                         </div>
                         <h2 className="text-4xl font-serif text-slate-800 mb-6">{forestActivities.find(a => a.id === activeId)?.title}</h2>
                         <p className="text-slate-500 mb-12 text-lg font-medium">{forestActivities.find(a => a.id === activeId)?.task}</p>
                         
                         <div className="space-y-8">
                            {forestActivities.find(a => a.id === activeId)?.type === 'breath' ? (
                              <motion.div animate={{ scale: [1, 1.5, 1] }} transition={{ duration: 4, repeat: 3, ease: "easeInOut" }} className="w-32 h-32 bg-blue-100 rounded-full mx-auto flex items-center justify-center border-8 border-blue-50 text-blue-500">
                                 <Wind className="w-12 h-12" />
                              </motion.div>
                            ) : forestActivities.find(a => a.id === activeId)?.type === 'color' ? (
                              <div className="flex justify-center gap-4">
                                 {['bg-rose-400', 'bg-amber-400', 'bg-emerald-400', 'bg-blue-400', 'bg-purple-400'].map(c => (
                                   <button key={c} onClick={() => setInputVal(c)} className={`w-16 h-16 rounded-2xl ${c} hover:scale-110 transition-all ${inputVal === c ? 'ring-4 ring-offset-4 ring-slate-200' : ''}`} />
                                 ))}
                              </div>
                            ) : (
                              <textarea value={inputVal} onChange={(e) => setInputVal(e.target.value)} className="w-full p-8 bg-slate-50 border-none rounded-3xl text-xl font-medium outline-none h-48 resize-none placeholder:text-slate-300" placeholder="Type here..." />
                            )}
                            <button 
                              onClick={() => {
                                const act = forestActivities.find(a => a.id === activeId);
                                if (act?.type !== 'breath' && !inputVal.trim()) {
                                  alert("Please share a reflection or select an option before completing.");
                                  return;
                                }
                                handleComplete(activeId);
                              }} 
                              className={`w-full py-6 text-white rounded-3xl font-bold text-lg shadow-xl transition-all flex items-center justify-center gap-3 ${
                                (forestActivities.find(a => a.id === activeId)?.type !== 'breath' && !inputVal.trim())
                                ? 'bg-slate-300 cursor-not-allowed shadow-none'
                                : 'bg-cedar-primary shadow-cedar-primary/20 hover:scale-[1.02] active:scale-[0.98]'
                              }`}
                            >
                               Complete activity <CheckCircle2 className="w-6 h-6" />
                            </button>
                         </div>
                      </div>
                    </>
                  ) : showStarFly ? (
                     <div className="text-center py-20 flex flex-col items-center justify-center h-full">
                        <motion.div initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }} className="relative mb-12">
                           <Star className="w-40 h-40 text-yellow-400 fill-current filter drop-shadow-[0_0_30px_rgba(250,204,21,0.4)]" />
                           <motion.div animate={{ scale: [1, 1.4, 1], opacity: [0.5, 0.2, 0.5] }} transition={{ duration: 2, repeat: Infinity }} className="absolute inset-0 bg-yellow-400 rounded-full blur-3xl -z-10" />
                        </motion.div>
                        <motion.h2 initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-5xl font-black text-slate-800 uppercase tracking-tighter italic">
                           You earned a star!
                        </motion.h2>
                        <p className="text-slate-400 font-bold text-lg mt-4 uppercase tracking-widest">Your light shines brighter</p>
                     </div>
                  ) : (
                    <div className="text-center py-20">
                       <motion.div animate={{ scale: [0, 1.2, 1], rotate: [0, 10, -10, 0] }}>
                          <CheckCircle2 className="w-32 h-32 text-green-500 mx-auto mb-10" />
                       </motion.div>
                       <h3 className="text-4xl font-serif text-slate-800 mb-6 font-bold">Incredible!</h3>
                       <p className="text-xl text-slate-500 font-medium">You took another step forward. You are doing so well.</p>
                    </div>
                  )}
               </motion.div>
            </div>
          )}
       </AnimatePresence>
    </div>
    </RoleGuard>
  );
}
