"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { Wind, Waves, Heart, ArrowLeft, Sun, Volume2, VolumeX, Moon, Sparkles, X, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import RoleGuard from "@/components/RoleGuard";

export default function SafeSpacePage() {
  const [exercise, setExercise] = useState<"breathe" | "grounding" | "affirmations" | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isDark, setIsDark] = useState(true);

  const { loading } = useAuth();

  return (
    <RoleGuard allowedRoles="student">
    <div className={`min-h-screen transition-all duration-1000 overflow-hidden relative ${isDark ? 'bg-slate-950 text-white' : 'bg-cedar-background text-slate-800'}`}>
      {/* Immersive Background */}
      <div className="absolute inset-0 z-0">
        <motion.div 
          animate={{ scale: [1, 1.3, 1], opacity: isDark ? [0.1, 0.2, 0.1] : [0.05, 0.1, 0.05] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 left-1/4 w-[800px] h-[800px] bg-cedar-primary rounded-full blur-[160px]"
        />
        <motion.div 
          animate={{ scale: [1.3, 1, 1.3], opacity: isDark ? [0.05, 0.15, 0.05] : [0.02, 0.08, 0.02] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-cedar-aqua rounded-full blur-[120px]"
        />
      </div>
      
      <header className="relative z-10 flex justify-between items-center p-8 md:p-12">
        <Link href="/student" className={`flex items-center gap-4 transition-all group ${isDark ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-cedar-primary'}`}>
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${isDark ? 'bg-white/5 group-hover:bg-white/10' : 'bg-white shadow-sm border border-slate-100'}`}>
            <ArrowLeft className="w-6 h-6" />
          </div>
          <span className="font-black tracking-widest uppercase text-[10px]">Return To Home</span>
        </Link>
        
        <div className="flex items-center gap-4">
           {/* Sound Toggle - Functional */}
           <button 
             onClick={() => setIsMuted(!isMuted)}
             className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${isDark ? 'bg-white/5 hover:bg-white/10 text-cedar-aqua' : 'bg-white border border-slate-100 text-cedar-primary shadow-sm hover:shadow-md'}`}
           >
              {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
              {isMuted && <span className="absolute -bottom-6 text-[8px] font-black uppercase opacity-50">Muted</span>}
           </button>

           {/* Dark Mode Toggle - Functional */}
           <button 
             onClick={() => setIsDark(!isDark)}
             className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${isDark ? 'bg-white/5 hover:bg-white/10 text-yellow-400' : 'bg-white border border-slate-100 text-slate-400 shadow-sm hover:shadow-md'}`}
           >
              {isDark ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
           </button>
        </div>
      </header>

      <main className="relative z-10 max-w-6xl mx-auto px-8">
        <AnimatePresence mode="wait">
          {!exercise ? (
            <motion.div 
              key="menu"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              className="text-center pt-20"
            >
              <h2 className={`text-6xl md:text-8xl font-serif mb-10 ${isDark ? 'text-cedar-aqua' : 'text-cedar-primary'}`}>Rest. Reconnect.</h2>
              <p className={`text-xl md:text-2xl mb-24 max-w-2xl mx-auto leading-relaxed font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Welcome to your digital Home. Every movement here is designed to help you find your steady ground.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                <BreakCard 
                   isDark={isDark}
                   icon={<Wind className="w-12 h-12" />} 
                   title="Guided Rhythm" 
                   description="Calm your mind by syncing your breath with the light."
                   onClick={() => setExercise("breathe")}
                />
                <BreakCard 
                   isDark={isDark}
                   icon={<Waves className="w-12 h-12" />} 
                   title="Ground Yourself" 
                   description="Focus on your five senses to return to the present."
                   onClick={() => setExercise("grounding")}
                />
                <BreakCard 
                   isDark={isDark}
                   icon={<Sparkles className="w-12 h-12" />} 
                   title="Daily Affirmations" 
                   description="Supportive words to remind you of your quiet power."
                   onClick={() => setExercise("affirmations")}
                />
              </div>
            </motion.div>
          ) : exercise === "breathe" ? (
            <BreathingExercise isDark={isDark} onBack={() => setExercise(null)} />
          ) : exercise === "grounding" ? (
             <GroundingExercise isDark={isDark} onBack={() => setExercise(null)} />
          ) : (
            <AffirmationExercise isDark={isDark} onBack={() => setExercise(null)} />
          )}
        </AnimatePresence>
      </main>
    </div>
    </RoleGuard>
  );
}

function BreakCard({ icon, title, description, onClick, isDark }: { icon: React.ReactNode, title: string, description: string, onClick: () => void, isDark: boolean }) {
  return (
    <motion.button
      whileHover={{ y: -15, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`p-10 md:p-14 rounded-[4rem] flex flex-col items-center text-center gap-10 transition-all group border-2 ${
         isDark ? 'bg-white/5 border-white/5 hover:bg-white/10 hover:border-cedar-aqua/20 shadow-2xl' : 'bg-white border-white hover:border-cedar-aqua/40 shadow-premium hover:shadow-premium-hover'
      }`}
    >
      <div className={`p-8 rounded-[2.5rem] transition-all shadow-xl group-hover:scale-110 ${isDark ? 'bg-cedar-primary/20 text-cedar-aqua' : 'bg-cedar-aqua/20 text-cedar-primary'}`}>
        {icon}
      </div>
      <div>
        <span className={`text-2xl font-bold block mb-4 ${isDark ? 'text-white' : 'text-slate-800'}`}>{title}</span>
        <p className={`text-xs font-black uppercase tracking-widest leading-relaxed opacity-60`}>{description}</p>
      </div>
    </motion.button>
  );
}

function BreathingExercise({ onBack, isDark }: { onBack: () => void, isDark: boolean }) {
  const [phase, setPhase] = useState<"in" | "hold" | "out">("in");
  const [breathCount, setBreathCount] = useState(0);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    const run = () => {
      setPhase("in");
      timer = setTimeout(() => {
        setPhase("hold");
        timer = setTimeout(() => {
          setPhase("out");
          setBreathCount(prev => prev + 1);
          timer = setTimeout(run, 5000);
        }, 3000);
      }, 5000);
    };
    run();
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="text-center py-20 flex flex-col items-center justify-center min-h-[70vh]">
      <motion.div 
        className={`w-[320px] h-[320px] md:w-[600px] md:h-[600px] rounded-full border-2 flex items-center justify-center relative mb-24 transition-colors duration-1000 ${
          isDark ? 'border-cedar-aqua/20' : 'border-cedar-primary/20 bg-white shadow-premium'
        }`}
        animate={{ 
          scale: phase === "in" || phase === "hold" ? 1.25 : 1,
          boxShadow: phase === "in" ? `0 0 160px ${isDark ? 'rgba(166, 220, 227, 0.3)' : 'rgba(1, 113, 150, 0.2)'}` : '0 0 40px rgba(0,0,0,0)'
        }}
        transition={{ duration: phase === "hold" ? 0.3 : 5, ease: "easeInOut" }}
      >
        {/* Animated Ripple Circles */}
        <AnimatePresence>
          {phase === "in" && (
             <motion.div 
               initial={{ scale: 0.8, opacity: 0 }}
               animate={{ scale: 1.5, opacity: 0.4 }}
               exit={{ opacity: 0 }}
               transition={{ duration: 5 }}
               className={`absolute inset-0 border-4 rounded-full ${isDark ? 'border-cedar-aqua' : 'border-cedar-primary'}`}
             />
          )}
        </AnimatePresence>

        <div className={`text-4xl md:text-7xl font-serif tracking-widest uppercase transition-colors duration-200 ${
          isDark ? (phase === "hold" ? "text-yellow-400" : "text-cedar-aqua") : "text-cedar-primary"
        }`}>
          {phase === "in" ? "Breathe In" : phase === "hold" ? "Hold" : "Breathe Out"}
        </div>

        <div className="absolute bottom-[-60px] text-xs font-black uppercase tracking-[0.4em] opacity-40">
           {breathCount} Breaths Completed
        </div>
      </motion.div>
      
      <button 
        onClick={onBack} 
        className={`px-12 py-5 rounded-full font-black uppercase text-[10px] tracking-widest transition-all shadow-xl hover:scale-105 active:scale-95 ${
          isDark ? 'bg-white/5 border border-white/10 text-slate-400 hover:bg-white/10 hover:text-white' : 'bg-white border border-slate-100 text-slate-500 hover:bg-cedar-primary hover:text-white'
        }`}
      >
        Finish Session
      </button>
    </div>
  );
}

function GroundingExercise({ onBack, isDark }: { onBack: () => void, isDark: boolean }) {
  const steps = [
    { num: 5, prompt: "Things you can see", sub: "Notice the colors, the patterns, or how the light hits the floor." },
    { num: 4, prompt: "Things you can hear", sub: "Listen for the hum of electronics, the wind, or your own heart." },
    { num: 3, prompt: "Things you can touch", sub: "Feel the texture of your fingertips, your desk, or your feet on the ground." },
    { num: 2, prompt: "Things you can smell", sub: "Breathe in. Notice any faint scent in the air around you." },
    { num: 1, prompt: "Thing you can taste", sub: "Focus on the current sensation in your mouth." },
  ];
  const [idx, setIdx] = useState(0);

  return (
    <div className="max-w-4xl mx-auto text-center py-20 min-h-[70vh] flex flex-col justify-center">
       <AnimatePresence mode="wait">
          <motion.div 
            key={idx}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            className={`p-16 md:p-24 rounded-[5rem] mb-16 relative border-2 ${
              isDark ? 'bg-white/5 border-white/5' : 'bg-white border-cedar-aqua/20 shadow-premium'
            }`}
          >
             <div className="text-8xl md:text-[10rem] font-serif opacity-10 absolute top-[-40px] left-1/2 -translate-x-1/2 select-none">{steps[idx].num}</div>
             <h3 className={`text-5xl md:text-7xl font-bold mb-8 ${isDark ? 'text-cedar-aqua' : 'text-cedar-primary'}`}>{steps[idx].prompt}</h3>
             <p className={`text-xl md:text-3xl leading-relaxed max-w-2xl mx-auto ${isDark ? 'text-slate-400' : 'text-slate-500 font-medium'}`}>{steps[idx].sub}</p>
          </motion.div>
       </AnimatePresence>
       
       <div className="flex justify-center flex-col md:flex-row items-center gap-8">
          {idx < steps.length - 1 ? (
             <button 
               onClick={() => setIdx(i => i + 1)}
               className="btn-premium px-16 py-6 text-xl flex items-center gap-4"
             >
               Next Sensation <ChevronRight className="w-6 h-6" />
             </button>
          ) : (
             <button onClick={onBack} className={`btn-premium px-16 py-6 text-xl bg-cedar-aqua text-slate-900 hover:bg-white`}>
               I feel safe and present
             </button>
          )}
          <button onClick={onBack} className="text-xs font-black uppercase tracking-widest opacity-40 hover:opacity-100 transition-opacity">Abort Exercise</button>
       </div>
    </div>
  );
}

function AffirmationExercise({ onBack, isDark }: { onBack: () => void, isDark: boolean }) {
  const affirmations = [
    "I have survived every single day that came before today.",
    "My feelings are safe, valid, and they belong to me.",
    "I am worthy of peace, patience, and kindness.",
    "Healing is not always a line; it is a quiet, steady circle.",
    "I am exactly where I need to be right now.",
    "I am the author of my own recovery journey.",
  ];

  return (
    <div className="py-20 max-w-5xl mx-auto min-h-[70vh] flex flex-col justify-center">
       <div className="space-y-24">
          {affirmations.map((text, i) => (
             <motion.div 
               key={i}
               initial={{ opacity: 0, filter: "blur(10px)" }}
               whileInView={{ opacity: 1, filter: "blur(0px)" }}
               viewport={{ once: false, margin: "-10%" }}
               transition={{ duration: 2.5 }}
               className={`text-4xl md:text-7xl font-serif italic text-center transition-opacity leading-tight ${isDark ? 'text-cedar-aqua/80' : 'text-cedar-primary/80'}`}
             >
                &quot;{text}&quot;
             </motion.div>
          ))}
       </div>
       <div className="mt-40 text-center">
          <button 
            onClick={onBack}
            className={`px-16 py-6 rounded-3xl font-black uppercase text-[10px] tracking-[0.4em] transition-all ${
              isDark ? 'bg-white/5 text-slate-500 hover:text-white' : 'bg-cedar-primary text-white shadow-xl'
            }`}
          >
            I carry this strength with me
          </button>
       </div>
    </div>
  );
}
