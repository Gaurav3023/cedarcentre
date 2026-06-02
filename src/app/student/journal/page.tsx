"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Book, Home, Save, Trash2, Calendar, Edit3, Trash } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import RoleGuard from "@/components/RoleGuard";

interface JournalEntry {
  id: string;
  date: string;
  content: string;
  mood: string;
}

export default function JournalPage() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [currentNote, setCurrentNote] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('cedar_reflections');
    if (saved) setEntries(JSON.parse(saved));
  }, []);

  const saveEntry = () => {
    if (!currentNote.trim()) return;
    setIsSaving(true);
    const newEntry: JournalEntry = {
      id: Date.now().toString(),
      date: new Date().toLocaleString(),
      content: currentNote,
      mood: "neutral"
    };
    const updated = [newEntry, ...entries];
    setEntries(updated);
    localStorage.setItem('cedar_reflections', JSON.stringify(updated));
    setCurrentNote("");
    setTimeout(() => setIsSaving(false), 800);
  };

  const deleteEntry = (id: string) => {
    if (!confirm("Are you sure you want to delete this reflection? Your voice is safe here, but you can remove what you no longer need.")) return;
    const updated = entries.filter(e => e.id !== id);
    setEntries(updated);
    localStorage.setItem('cedar_reflections', JSON.stringify(updated));
  };

  return (
    <RoleGuard allowedRoles="student">
    <div className="min-h-screen bg-white pb-32">
      <header className="px-12 py-10 flex justify-between items-center bg-slate-50 border-b border-slate-100 sticky top-0 z-50">
         <div className="flex items-center gap-6">
            <Link href="/student" className="p-4 bg-white rounded-2xl shadow-sm border border-slate-100 text-slate-400 hover:text-cedar-primary transition-all">
               <Home className="w-6 h-6" />
            </Link>
            <div>
               <h1 className="text-3xl font-serif text-slate-800">Reflective Journal</h1>
               <p className="text-xs font-black uppercase text-cedar-primary tracking-widest mt-1">Your Personal Safe Space</p>
            </div>
         </div>
         <div className="text-right hidden md:block">
            <p className="text-sm font-medium text-slate-400">{entries.length} Reflections Logged</p>
         </div>
      </header>

      <main className="max-w-5xl mx-auto px-12 pt-20">
         <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
            {/* Editor */}
            <div className="lg:col-span-2 space-y-8">
               <div className="bg-slate-50 p-10 rounded-[3rem] border border-slate-100 shadow-inner">
                  <div className="flex items-center gap-4 mb-8">
                     <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                        <Edit3 className="w-6 h-6 text-cedar-primary" />
                     </div>
                     <h3 className="text-xl font-bold text-slate-700">What's on your heart today?</h3>
                  </div>
                  <textarea 
                    value={currentNote}
                    onChange={(e) => setCurrentNote(e.target.value)}
                    className="w-full min-h-[300px] bg-transparent border-none outline-none text-xl text-slate-700 leading-relaxed font-medium placeholder:text-slate-300 resize-none"
                    placeholder="This space is just for you. No one else can see these words..."
                  />
                  <div className="mt-8 flex justify-end">
                     <button 
                       onClick={saveEntry}
                       disabled={!currentNote.trim() || isSaving}
                       className={`flex items-center gap-3 px-10 py-5 rounded-[2rem] font-bold text-white transition-all shadow-xl ${!currentNote.trim() || isSaving ? 'bg-slate-300 shadow-none' : 'bg-cedar-primary shadow-cedar-primary/20 hover:scale-105 active:scale-95'}`}
                     >
                        <Save className="w-5 h-5" /> {isSaving ? "Saving..." : "Seal Reflection"}
                     </button>
                  </div>
               </div>
            </div>

            {/* Past Entries */}
            <div className="space-y-8">
               <h3 className="text-sm font-black uppercase text-slate-400 tracking-widest flex items-center gap-3">
                  <Calendar className="w-4 h-4" /> Past Reflections
               </h3>
               <div className="space-y-6 max-h-[600px] overflow-y-auto pr-4 custom-scrollbar">
                  <AnimatePresence>
                     {entries.map(entry => (
                       <motion.div 
                         key={entry.id}
                         initial={{ opacity: 0, x: 20 }}
                         animate={{ opacity: 1, x: 0 }}
                         exit={{ opacity: 0, x: -20 }}
                         className="p-8 bg-white border border-slate-100 rounded-[2rem] hover:border-cedar-primary/20 transition-all group shadow-sm"
                       >
                          <div className="flex justify-between items-start mb-4">
                             <span className="text-[10px] font-black uppercase text-slate-300 tracking-widest">{entry.date}</span>
                             <button onClick={() => deleteEntry(entry.id)} className="p-2 opacity-0 group-hover:opacity-100 text-slate-300 hover:text-red-400 transition-all">
                                <Trash2 className="w-4 h-4" />
                             </button>
                          </div>
                          <p className="text-slate-600 text-sm leading-relaxed font-medium line-clamp-3 italic">&quot;{entry.content}&quot;</p>
                       </motion.div>
                     ))}
                  </AnimatePresence>
                  {entries.length === 0 && (
                    <div className="text-center py-20 bg-slate-50/50 rounded-[2.5rem] border border-dashed border-slate-200 text-slate-400 italic text-sm">
                       No reflections yet. Begin whenever you feel ready.
                    </div>
                  )}
               </div>
            </div>
         </div>
      </main>
    </div>
    </RoleGuard>
  );
}
