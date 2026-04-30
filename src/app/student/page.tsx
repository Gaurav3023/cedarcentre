"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useAuth, Lesson } from "@/context/AuthContext";
import { Trees, Compass, Heart, LogOut, Sun, Cloud, Book, PlayCircle, Star, Sparkles, ChevronRight, MessageCircle, X, Send, Clock, CheckCircle, Menu, AlertCircle, Calendar, LayoutGrid, List } from "lucide-react";
import MoodCheckIn from "@/components/MoodCheckIn";
import JourneyMap from "@/components/JourneyMap";
import Link from "next/link";
import React, { useState, useEffect, useMemo, useCallback } from "react";
import RoleGuard from "@/components/RoleGuard";
import { useSearchParams } from "next/navigation";
import NotificationsDropdown from "@/components/NotificationsDropdown";
import { inspirationalQuotes } from "@/data/quotes";

export default function StudentDashboard() {
  const { user, users, lessons, markLessonAsRead, getLessonsForStudent, sendSupportRequest, sendSupportChatMessage, markSupportAsRead, supportRequests, submissions, logout } = useAuth();
  const searchParams = useSearchParams();
  
  const [showSupportModal, setShowSupportModal] = useState(false);

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab === 'support') setShowSupportModal(true);
  }, [searchParams]);
  const [showStarsModal, setShowStarsModal] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [supportMsg, setSupportMsg] = useState("");
  const [sent, setSent] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);
  const [chatMsg, setChatMsg] = useState("");
  const [currentPhase, setCurrentPhase] = useState(1);

  const myEducator = useMemo(() => 
    users.find(u => u.id === user?.assignedEducatorId),
    [users, user?.assignedEducatorId]
  );

  const hasUnreadSupport = useMemo(() => 
    supportRequests.some(r => r.studentId === user?.id && r.studentHasUnread),
    [supportRequests, user?.id]
  );

  useEffect(() => {
    if (!user) return;
    const saved = localStorage.getItem(`cedar_forest_progress_${user.id}`);
    if (saved) {
      try {
        const completed = JSON.parse(saved);
        const phase = Math.floor(completed.length / 10) + 1;
        setCurrentPhase(Math.min(phase, 12));
      } catch (e) {
        console.error("Failed to parse progress", e);
      }
    }
  }, [user]);

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    const savedMode = localStorage.getItem('student_journey_view_mode');
    if (savedMode === 'list' || savedMode === 'grid') {
      setViewMode(savedMode);
    }
  }, []);

  const handleViewModeChange = (mode: 'grid' | 'list') => {
    setViewMode(mode);
    localStorage.setItem('student_journey_view_mode', mode);
  };

  const [showQuickCalm, setShowQuickCalm] = useState(false);
  const [buddyMessage, setBuddyMessage] = useState("Hello! I'm here for you.");
  
  const buddyMessages = [
    "You're doing so well today!",
    "One small step is still progress.",
    "The forest is proud of your bravery!",
    "Remember to breathe deeply.",
    "You are strong and capable.",
    "It's okay to take a break.",
    "You've got this, warrior!"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setBuddyMessage(buddyMessages[Math.floor(Math.random() * buddyMessages.length)]);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);

  useEffect(() => {
    const updateQuote = () => {
      const now = new Date();
      const totalMinutes = Math.floor(now.getTime() / 60000);
      setCurrentQuoteIndex(totalMinutes % inspirationalQuotes.length);
    };

    updateQuote();
    const timer = setInterval(updateQuote, 10000);
    return () => clearInterval(timer);
  }, []);

  const myLessons = useMemo(() => user ? getLessonsForStudent(user.id) : [], [user, getLessonsForStudent]);

  const groupedLessons = useMemo(() => {
    const groups: Record<number, { title: string, lessons: Lesson[] }> = {};
    myLessons.forEach(l => {
      const weekNum = l.weekNumber || 0;
      if (!groups[weekNum]) {
        groups[weekNum] = { 
          title: l.weekTitle || (weekNum === 0 ? "Introduction & Welcome" : `Week #${weekNum}`), 
          lessons: [] 
        };
      }
      groups[weekNum].lessons.push(l);
      if (l.weekTitle) groups[weekNum].title = l.weekTitle;
    });
    return groups;
  }, [myLessons]);

  const handleSupport = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (!supportMsg.trim()) return;
    sendSupportRequest(supportMsg);
    setSent(true);
    setTimeout(() => {
      setShowSupportModal(false);
      setSent(false);
      setSupportMsg("");
    }, 2000);
  }, [supportMsg, sendSupportRequest]);

  const cardColors = [
    'bg-blue-50 border-blue-100 text-blue-600',
    'bg-purple-50 border-purple-100 text-purple-600',
    'bg-emerald-50 border-emerald-100 text-emerald-600',
    'bg-amber-50 border-amber-100 text-amber-600',
    'bg-rose-50 border-rose-100 text-rose-600',
    'bg-indigo-50 border-indigo-100 text-indigo-600',
  ];

  const SidebarContent = () => (
    <div className="flex flex-col gap-10">
      <MoodCheckIn />
      <div className="bg-white p-8 md:p-10 rounded-[3rem] shadow-premium border border-slate-50">
         <div className="flex items-center gap-3 mb-8 px-2">
            <div className="w-10 h-10 bg-cedar-coral/10 rounded-xl flex items-center justify-center"><Heart className="w-5 h-5 text-cedar-coral fill-current" /></div>
            <h3 className="text-xl font-serif text-slate-800">Resource Hub</h3>
         </div>
         <div className="grid grid-cols-1 gap-4">
            <ResourceCard href="/student/safe-space" icon={<Cloud className="text-blue-400" />} title="Breathing rhythms" desc="Find your center" color="hover:border-blue-200" />
            <ResourceCard href="/student/affirmations" icon={<Sun className="text-amber-500" />} title="Safe Affirmations" desc="Gentle daily reminders" color="hover:border-amber-200" />
            <ResourceCard href="/student/journal" icon={<Book className="text-indigo-400" />} title="Reflective Journal" desc="Safe space for thoughts" color="hover:border-indigo-200" />
         </div>
      </div>
    </div>
  );

  return (
    <RoleGuard allowedRoles="student">
      <div className="min-h-screen bg-[#FDFDFD]">
        <header className="px-6 md:px-12 py-5 flex justify-between items-center bg-white/80 backdrop-blur-md sticky top-0 z-[100] border-b border-slate-100 shadow-sm">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsMobileMenuOpen(true)} className="lg:hidden p-3 bg-white hover:bg-slate-50 text-slate-400 transition-all rounded-2xl shadow-sm border border-slate-100 mr-2"><Menu className="w-5 h-5" /></button>
            <Link href="/"><img src="https://cedarcentre.ca/wp-content/uploads/2023/07/cedar-logo1.svg" className="h-12 md:h-14 hover:scale-105 transition-transform" alt="Logo" /></Link>
            <div className="h-8 w-[1px] bg-slate-100 hidden sm:block" />
            <div className="hidden sm:block">
               <p className="font-black text-[9px] uppercase tracking-[0.2em] text-cedar-primary leading-none">Cedar Centre</p>
               <p className="font-serif italic text-xs text-slate-400 mt-1">STAIR Platform</p>
            </div>
          </div>
          <div className="flex items-center gap-3 md:gap-4">
            <button 
              onClick={() => setShowStarsModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-yellow-50 rounded-full border border-yellow-100 shadow-sm hover:bg-yellow-100 transition-all group"
            >
              <Star className="w-5 h-5 text-yellow-400 fill-current group-hover:scale-110 transition-transform" />
              <span className="font-bold text-slate-700 text-sm">{user?.stars || 0}</span>
            </button>
            <NotificationsDropdown />
            <button 
              onClick={() => setShowSupportModal(true)} 
              className={`p-3 transition-all rounded-2xl border shadow-sm relative group ${hasUnreadSupport ? 'bg-red-500 text-white border-red-600 scale-110' : 'bg-red-50 text-red-500 border-red-100 hover:bg-red-500 hover:text-white'}`}
            >
              <MessageCircle className="w-5 h-5" />
              {hasUnreadSupport && <span className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full border-2 border-red-500 animate-ping" />}
            </button>
            <button onClick={logout} className="flex items-center gap-2 px-5 py-3 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition-all rounded-2xl shadow-sm border border-red-100 group">
              <LogOut className="w-5 h-5" />
              <span className="font-bold text-[10px] uppercase tracking-widest ">Logout</span>
            </button>
          </div>
        </header>

        <AnimatePresence>
          {isMobileMenuOpen && (
            <div className="fixed inset-0 z-[110] lg:hidden">
               <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsMobileMenuOpen(false)} className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" />
               <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} className="absolute top-0 bottom-0 right-0 w-80 bg-white shadow-2xl flex flex-col p-8 overflow-y-auto">
                  <div className="flex justify-between items-center mb-10"><h3 className="font-serif text-2xl text-slate-800">Menu</h3><button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-slate-400"><X className="w-6 h-6" /></button></div>
                  <SidebarContent />
                  <button onClick={logout} className="mt-12 w-full flex items-center gap-4 px-8 py-5 bg-red-50 text-red-500 rounded-3xl font-bold text-sm"><LogOut className="w-5 h-5" /> Log Out</button>
               </motion.div>
            </div>
          )}
        </AnimatePresence>

        <main className="max-w-7xl mx-auto px-6 md:px-12 py-12 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-20">
            <div className="lg:col-span-2 space-y-20">
              <motion.div 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                className="relative p-12 md:p-16 rounded-[4rem] shadow-premium overflow-hidden group border border-white bg-white"
              >
                 {/* Vibrant Shifting Rainbow Background */}
                 <motion.div 
                   animate={{ 
                     background: [
                       "linear-gradient(to bottom right, rgba(239, 68, 68, 0.15), rgba(255, 255, 255, 0))", // Red
                       "linear-gradient(to bottom right, rgba(249, 115, 22, 0.15), rgba(255, 255, 255, 0))", // Orange
                       "linear-gradient(to bottom right, rgba(234, 179, 8, 0.15), rgba(255, 255, 255, 0))",  // Yellow
                       "linear-gradient(to bottom right, rgba(34, 197, 94, 0.15), rgba(255, 255, 255, 0))",  // Green
                       "linear-gradient(to bottom right, rgba(59, 130, 246, 0.15), rgba(255, 255, 255, 0))", // Blue
                       "linear-gradient(to bottom right, rgba(168, 85, 247, 0.15), rgba(255, 255, 255, 0))", // Purple
                       "linear-gradient(to bottom right, rgba(239, 68, 68, 0.15), rgba(255, 255, 255, 0))"  // Back to Red
                     ]
                   }}
                   transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                   className="absolute inset-0 z-0"
                 />
                 
                 {/* Soft Moving Glow Spots */}
                 <motion.div 
                   animate={{ 
                     x: [0, 100, 0],
                     y: [0, 50, 0],
                     opacity: [0.1, 0.2, 0.1]
                   }}
                   transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
                   className="absolute -top-20 -right-20 w-96 h-96 bg-cedar-primary/10 blur-[100px] rounded-full pointer-events-none"
                 />
                 <motion.div 
                   animate={{ 
                     x: [0, -80, 0],
                     y: [0, -40, 0],
                     opacity: [0.1, 0.15, 0.1]
                   }}
                   transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                   className="absolute -bottom-20 -left-20 w-80 h-80 bg-cedar-aqua/10 blur-[80px] rounded-full pointer-events-none"
                 />



                 <div className="relative z-10">
                    <motion.div 
                      whileHover={{ scale: 1.05 }}
                      className="inline-flex items-center gap-2 px-5 py-2 bg-cedar-aqua/20 text-cedar-primary rounded-full text-[10px] font-black uppercase tracking-widest mb-8 cursor-default shadow-sm border border-cedar-aqua/10"
                    >
                      <Sparkles className="w-4 h-4 animate-pulse" /><span>Warrior in Progress</span>
                    </motion.div>
                    <h2 className="text-5xl md:text-6xl font-serif text-slate-800 mb-6 leading-tight italic">
                      Hello, <span className="text-transparent bg-clip-text bg-gradient-to-r from-cedar-primary via-cedar-aqua to-cedar-primary bg-[length:200%_auto] animate-pulse">{user?.name.split(' ')[0]}</span>
                    </h2>
                    <p className="text-xl md:text-2xl text-slate-500 max-w-md leading-relaxed font-medium mb-8">Ready for your next STAIR step?</p>
                    
                    {/* Rotating Inspiration Quote */}
                    <motion.div 
                      key={currentQuoteIndex}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="relative pl-8 border-l-4 border-cedar-primary/20 py-2 max-w-xl group/quote"
                    >
                       <p className="text-slate-400 font-serif italic text-lg md:text-xl leading-relaxed group-hover/quote:text-cedar-primary transition-colors duration-500">
                         &quot;{inspirationalQuotes[currentQuoteIndex].split(' — ')[0]}&quot;
                       </p>
                       {inspirationalQuotes[currentQuoteIndex].includes(' — ') && (
                         <p className="text-[10px] font-black uppercase tracking-widest text-slate-300 mt-3 flex items-center gap-2">
                           <div className="w-4 h-[1px] bg-slate-200" />
                           {inspirationalQuotes[currentQuoteIndex].split(' — ')[1]}
                         </p>
                       )}
                       <div className="absolute -left-1 top-0 bottom-0 w-1 bg-cedar-primary opacity-0 group-hover/quote:opacity-100 transition-opacity" />
                    </motion.div>
                 </div>
                 
                 <div className="absolute -right-20 -bottom-20 opacity-[0.03] pointer-events-none group-hover:opacity-[0.08] transition-all duration-1000 group-hover:scale-110 group-hover:-rotate-6">
                    <Trees className="w-[600px] h-[600px] text-cedar-primary" />
                 </div>
              </motion.div>

              <section className="space-y-16">
                 <div className="px-4 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                       <h3 className="text-4xl font-serif text-slate-800 italic">Your STAIR Path</h3>
                       <p className="text-slate-400 mt-2 font-medium italic">Guided phases to support your growth.</p>
                    </div>
                    <div className="flex items-center gap-4">
                       <div className="flex p-1 bg-white border border-slate-100 rounded-2xl shadow-sm mr-2">
                          <button 
                             onClick={() => handleViewModeChange('grid')} 
                             className={`p-2 rounded-xl transition-all ${viewMode === 'grid' ? 'bg-cedar-primary text-white shadow-lg shadow-cedar-primary/20' : 'text-slate-400 hover:text-slate-600'}`}
                          >
                             <LayoutGrid className="w-5 h-5" />
                          </button>
                          <button 
                             onClick={() => handleViewModeChange('list')} 
                             className={`p-2 rounded-xl transition-all ${viewMode === 'list' ? 'bg-cedar-primary text-white shadow-lg shadow-cedar-primary/20' : 'text-slate-400 hover:text-slate-600'}`}
                          >
                             <List className="w-5 h-5" />
                          </button>
                       </div>
                       {myEducator && (
                          <div className="flex items-center gap-4 px-6 py-4 bg-white rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-premium transition-all group">
                             <div className="w-12 h-12 bg-cedar-primary text-white rounded-2xl flex items-center justify-center text-xs font-black shadow-lg shadow-cedar-primary/10 group-hover:scale-110 transition-transform">
                                {myEducator.name[0]}
                             </div>
                             <div>
                                <p className="text-[9px] font-black uppercase text-cedar-primary tracking-[0.2em] leading-none mb-1.5">Your Mentor</p>
                                <p className="text-sm font-bold text-slate-700">{myEducator.name}</p>
                                <p className="text-[10px] text-slate-400 font-medium mt-1">{myEducator.email}</p>
                             </div>
                          </div>
                       )}
                    </div>
                 </div>

                 {myLessons.length === 0 ? (
                    <div className="bg-slate-50/50 border-2 border-dashed border-slate-200 p-24 rounded-[4rem] text-center"><p className="text-slate-400 italic font-medium">No active journey steps. Check back soon!</p></div>
                 ) : (
                    <div className="space-y-20">
                      {Object.keys(groupedLessons).sort((a,b) => parseInt(a) - parseInt(b)).map(weekNumStr => {
                         const weekNum = parseInt(weekNumStr);
                         const group = groupedLessons[weekNum];
                         return (
                          <div key={weekNum} className="space-y-10">
                             <div className="flex items-end gap-6 px-4">
                                <div>
                                <h4 className="text-3xl font-serif text-slate-800 italic leading-none">{group.title}</h4>
                             </div>
                                <div className="h-[2px] flex-1 bg-slate-100 rounded-full mb-2" />
                             </div>
                             <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 gap-8" : "space-y-4"}>
                                {group.lessons.map((lesson, idx) => {
                                   const isRead = user?.readLessons?.includes(lesson.id);
                                   const isCompleted = submissions.some(s => s.lessonId === lesson.id && s.studentId === user?.id);
                                   const isOverdue = lesson.deadline && !isCompleted && new Date(lesson.deadline) < new Date();
                                   const isDueSoon = lesson.deadline && !isCompleted && !isOverdue && (new Date(lesson.deadline).getTime() - new Date().getTime()) < 24 * 60 * 60 * 1000;
                                   const colorClass = isOverdue ? 'bg-red-50 border-red-100 text-red-600' : isDueSoon ? 'bg-amber-50 border-amber-100 text-amber-600' : cardColors[idx % cardColors.length];
                                   
                                   return viewMode === 'grid' ? (
                                     <motion.div key={lesson.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }} className={`p-10 rounded-[3.5rem] border shadow-premium hover:shadow-premium-hover transition-all group flex flex-col relative overflow-hidden ${isCompleted ? 'bg-slate-50/50 border-slate-100 grayscale opacity-60' : `${colorClass.split(' ')[0]} ${colorClass.split(' ')[1]}`}`}>
                                         {!isRead && !isCompleted && <div className="absolute top-0 left-0 p-5 bg-cedar-primary text-white text-[8px] font-black uppercase tracking-widest rounded-br-[2rem] z-20 shadow-lg">New</div>}
                                        {isOverdue && <div className="absolute top-0 right-0 p-5 bg-red-600 text-white text-[10px] font-black uppercase tracking-widest rounded-bl-[2rem] flex items-center gap-2 shadow-lg z-10 animate-pulse"><AlertCircle className="w-4 h-4" /> Overdue</div>}
                                        {isDueSoon && <div className="absolute top-0 right-0 p-5 bg-amber-500 text-white text-[10px] font-black uppercase tracking-widest rounded-bl-[2rem] flex items-center gap-2 shadow-lg z-10"><Clock className="w-4 h-4" /> Due Soon</div>}
                                        
                                        <div className="flex justify-between items-start mb-8">
                                           <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 bg-white shadow-sm ${isOverdue ? 'text-red-500' : colorClass.split(' ')[2]}`}>{lesson.type === 'video' ? <PlayCircle className="w-8 h-8" /> : <Book className="w-8 h-8" />}</div>
                                           {isCompleted && <div className="flex items-center gap-2 px-4 py-2 bg-white text-green-500 rounded-full text-[9px] font-black uppercase tracking-widest border border-green-100 shadow-sm"><CheckCircle className="w-3 h-3" /> Completed</div>}
                                        </div>
                                        <h4 className={`text-2xl font-bold mb-3 ${isCompleted ? 'text-slate-400' : 'text-slate-800'}`}>{lesson.title}</h4>
                                        <p className="text-slate-500 text-sm leading-relaxed font-medium line-clamp-2 mb-10">{lesson.content}</p>
                                        <div className="mt-auto pt-8 border-t border-slate-200/50 flex justify-between items-center">
                                           <div className="space-y-1">{lesson.deadline && !isCompleted && <div className={`flex items-center gap-2 text-[9px] font-black uppercase tracking-widest ${isOverdue ? 'text-red-600' : 'text-slate-400'}`}><Clock className={`w-3.5 h-3.5 ${isOverdue ? 'text-red-600' : 'text-amber-400'}`} /> {isOverdue ? 'Critical Delay' : `Due: ${new Date(lesson.deadline).toLocaleDateString([], { month: 'short', day: 'numeric' })} at ${new Date(lesson.deadline).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}</div>}</div>
                                           <Link href={`/student/lesson/${lesson.id}`} onClick={() => markLessonAsRead(lesson.id)} className={`flex items-center gap-3 font-bold text-[10px] uppercase tracking-widest px-6 py-3 rounded-2xl transition-all shadow-sm ${isCompleted ? 'bg-white text-slate-400 hover:text-cedar-primary' : isOverdue ? 'bg-red-600 text-white hover:bg-red-700' : 'bg-white text-slate-700 hover:bg-slate-900 hover:text-white'}`}>{isCompleted ? 'Review' : 'Begin'} <ChevronRight className="w-4 h-4" /></Link>
                                        </div>
                                     </motion.div>
                                   ) : (
                                     <motion.div key={lesson.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.05 }} className={`p-6 rounded-[2rem] border transition-all flex items-center justify-between group ${isCompleted ? 'bg-slate-50/50 border-slate-100 grayscale opacity-60' : 'bg-white border-slate-100 hover:border-cedar-primary/20 shadow-sm hover:shadow-md'}`}>
                                        <div className="flex items-center gap-6">
                                           <div className={`w-14 h-14 rounded-xl flex items-center justify-center shadow-inner ${isCompleted ? 'bg-slate-100 text-slate-400' : 'bg-slate-50 text-cedar-primary'}`}>{lesson.type === 'video' ? <PlayCircle className="w-6 h-6" /> : <Book className="w-6 h-6" />}</div>
                                           <div>
                                              <div className="flex items-center gap-3 mb-1">
                                                 <h5 className={`font-bold text-sm ${isCompleted ? 'text-slate-400' : 'text-slate-800'}`}>{lesson.title}</h5>
                                                 {!isRead && !isCompleted && <span className="w-2 h-2 bg-cedar-primary rounded-full" />}
                                              </div>
                                              <p className="text-[10px] text-slate-400 font-medium line-clamp-1">{lesson.content}</p>
                                           </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                           {isCompleted ? (
                                              <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-green-50 text-green-500 rounded-full text-[8px] font-black uppercase tracking-widest border border-green-100"><CheckCircle className="w-3 h-3" /> Done</div>
                                           ) : (
                                              <div className="hidden sm:flex flex-col items-end">
                                                 {lesson.deadline && <p className={`text-[8px] font-black uppercase tracking-widest ${isOverdue ? 'text-red-500' : 'text-slate-400'}`}>{isOverdue ? 'Overdue' : `Due ${new Date(lesson.deadline).toLocaleDateString([], { month: 'short', day: 'numeric' })}`}</p>}
                                              </div>
                                           )}
                                           <Link href={`/student/lesson/${lesson.id}`} onClick={() => markLessonAsRead(lesson.id)} className={`p-3 rounded-xl transition-all ${isCompleted ? 'bg-slate-50 text-slate-300 hover:text-cedar-primary' : 'bg-cedar-primary/5 text-cedar-primary hover:bg-cedar-primary hover:text-white'}`}><ChevronRight className="w-4 h-4" /></Link>
                                        </div>
                                     </motion.div>
                                   );
                                })}
                             </div>
                          </div>
                         );
                      })}
                    </div>
                 )}
              </section>
              <section className="bg-slate-50/30 border-2 border-dashed border-slate-100 p-12 md:p-16 rounded-[5rem] transition-colors hover:bg-white hover:border-cedar-aqua/20">
                <div className="mb-14 flex flex-col md:flex-row md:items-center justify-between gap-6"><div><h3 className="text-3xl font-serif text-slate-800 flex items-center gap-4 italic"><Compass className="text-cedar-primary w-8 h-8" />The Forest Journey</h3><p className="text-slate-400 font-medium mt-2">See how far your courage has taken you.</p></div><span className="px-6 py-3 bg-white border border-slate-100 text-cedar-primary text-[10px] font-black uppercase tracking-widest rounded-2xl shadow-sm">Currently Phase {currentPhase} / 12</span></div>
                <JourneyMap />
              </section>
            </div>
            <aside className="space-y-12 lg:sticky lg:top-32 h-fit hidden lg:block"><SidebarContent /></aside>
          </div>
        </main>
        <AnimatePresence>
          {showSupportModal && (
            <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm z-[200] flex items-center justify-center p-6">
               <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white rounded-[3.5rem] w-full max-w-2xl p-10 relative overflow-hidden shadow-2xl flex flex-col min-h-[500px]">
                  <button onClick={() => { setShowSupportModal(false); setSelectedRequestId(null); }} className="absolute top-8 right-8 p-3 hover:bg-slate-100 rounded-full transition-colors z-[10]"><X className="w-8 h-8 text-slate-400" /></button>
                  {!selectedRequestId ? (
                     <div className="flex-1 flex flex-col">
                        <div className="text-center mb-10"><div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-6"><MessageCircle className="w-8 h-8" /></div><h3 className="text-3xl font-serif text-slate-800">Support Center</h3><p className="text-slate-500 text-sm font-medium">Connect with your guide for assistance.</p></div>
                        <div className="space-y-3 overflow-y-auto max-h-[250px] mb-10 pr-2 custom-scrollbar">
                           {supportRequests.filter(r => r.studentId === user?.id && r.status === 'open').map(req => (
                             <div 
                                key={req.id} 
                                onClick={() => {
                                   setSelectedRequestId(req.id);
                                   if (req.studentHasUnread) markSupportAsRead(req.id, 'student');
                                }} 
                                className={`p-6 rounded-[1.5rem] border cursor-pointer transition-all flex justify-between items-center group relative ${req.studentHasUnread ? 'bg-white border-red-200 ring-2 ring-red-50 shadow-md' : 'bg-slate-50 border-slate-100 hover:border-cedar-primary'}`}
                             >
                                {req.studentHasUnread && <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[8px] font-black px-2 py-0.5 rounded-full shadow-lg z-10">NEW RESPONSE</span>}
                                <div className="flex-1">
                                   <p className={`text-xs font-bold line-clamp-1 italic ${req.studentHasUnread ? 'text-red-500' : 'text-slate-800'}`}>&quot;{req.message}&quot;</p>
                                   <p className="text-[8px] text-slate-400 uppercase tracking-widest mt-1 font-black">Case #{req.id.slice(-4)}</p>
                                </div>
                                <ChevronRight className={`w-5 h-5 transition-all ${req.studentHasUnread ? 'text-red-500 group-hover:translate-x-1' : 'text-slate-300 group-hover:text-cedar-primary'}`} />
                             </div>
                           ))}
                        </div>
                        <div className="mt-auto border-t border-slate-100 pt-8">
                           <form onSubmit={handleSupport} className="space-y-4"><textarea required value={supportMsg} onChange={(e) => setSupportMsg(e.target.value)} className="w-full p-6 bg-slate-50 border-none rounded-2xl text-sm font-medium outline-none focus:ring-4 focus:ring-red-50/50 resize-none min-h-[100px] shadow-inner" placeholder="How can we help you right now?" />{!sent ? (<button type="submit" className="w-full bg-red-500 py-4 text-white rounded-2xl font-bold text-xs uppercase tracking-widest shadow-xl shadow-red-500/20 flex items-center justify-center gap-3 transition-all">Send Request <Send className="w-4 h-4" /></button>) : (<div className="w-full bg-green-500 py-4 text-white rounded-2xl font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-3"><CheckCircle className="w-4 h-4" /> Sent</div>)}</form>
                        </div>
                     </div>
                  ) : (
                     <div className="flex-1 flex flex-col">
                        <div className="flex items-center gap-6 mb-8">
                           <button onClick={() => setSelectedRequestId(null)} className="p-3 bg-slate-50 rounded-2xl text-slate-400 transition-all shadow-sm">
                              <ChevronRight className="w-5 h-5 rotate-180" />
                           </button>
                           <div>
                              <h4 className="text-xl font-serif text-slate-800 italic leading-none">Conversation Thread</h4>
                              <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest mt-1">Directly with your mentor</p>
                           </div>
                        </div>
                        <div className="flex-1 space-y-6 overflow-y-auto max-h-[350px] mb-8 pr-4 custom-scrollbar">
                           <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 mb-8 relative">
                              <div className="absolute -top-3 left-6 px-3 py-1 bg-white border border-slate-100 rounded-full text-[8px] font-black uppercase tracking-widest text-slate-400">Original Inquiry</div>
                              <p className="text-sm text-slate-600 font-medium leading-relaxed italic">&quot;{supportRequests.find(r => r.id === selectedRequestId)?.message}&quot;</p>
                           </div>
                           
                           {supportRequests.find(r => r.id === selectedRequestId)?.chat?.map((msg, i) => {
                             const isStudent = msg.senderRole === 'student';
                             const senderName = isStudent ? user?.name : (users.find(u => u.id === msg.senderId)?.name || 'Mentor');
                             const initial = senderName?.[0] || '?';
                             
                             return (
                               <div key={i} className={`flex gap-4 ${isStudent ? 'flex-row-reverse' : 'flex-row'}`}>
                                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-xs font-black shrink-0 shadow-inner ${isStudent ? 'bg-cedar-primary text-white' : 'bg-slate-100 text-slate-400'}`}>
                                     {initial}
                                  </div>
                                  <div className={`flex flex-col max-w-[80%] ${isStudent ? 'items-end' : 'items-start'}`}>
                                     <div className={`p-5 rounded-[1.8rem] text-sm font-medium leading-relaxed shadow-sm ${isStudent ? 'bg-cedar-primary text-white rounded-tr-none' : 'bg-white text-slate-700 rounded-tl-none border border-slate-100'}`}>
                                        {msg.content}
                                     </div>
                                     <span className="text-[8px] text-slate-300 mt-2 font-black uppercase tracking-widest px-2">{new Date(msg.timestamp || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                  </div>
                               </div>
                             );
                           })}
                        </div>
                        <div className="mt-auto flex gap-3 p-2 bg-slate-50 rounded-2xl border border-slate-100">
                           <input 
                              type="text" 
                              className="flex-1 px-4 py-3 bg-transparent border-none text-sm font-medium outline-none" 
                              placeholder="Type a reply to your mentor..." 
                              value={chatMsg} 
                              onChange={(e) => setChatMsg(e.target.value)} 
                              onKeyDown={(e) => e.key === 'Enter' && (sendSupportChatMessage(selectedRequestId!, chatMsg), setChatMsg(""))} 
                           />
                           <button onClick={() => { sendSupportChatMessage(selectedRequestId!, chatMsg); setChatMsg(""); }} className="p-3 bg-cedar-primary text-white rounded-xl shadow-lg shadow-cedar-primary/20 hover:scale-105 active:scale-95 transition-all">
                              <Send className="w-4 h-4" />
                           </button>
                        </div>
                     </div>
                  )}
               </motion.div>
            </div>
          )}
          {showStarsModal && (
            <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm z-[200] flex items-center justify-center p-6">
               <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white rounded-[3.5rem] w-full max-w-2xl p-10 relative overflow-hidden shadow-2xl flex flex-col max-h-[80vh]">
                  <button onClick={() => setShowStarsModal(false)} className="absolute top-8 right-8 p-3 hover:bg-slate-100 rounded-full transition-colors z-[10]"><X className="w-8 h-8 text-slate-400" /></button>
                  
                  <div className="text-center mb-10">
                     <div className="w-20 h-20 bg-yellow-50 text-yellow-400 rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-inner">
                        <Star className="w-10 h-10 fill-current" />
                     </div>
                     <h3 className="text-3xl font-serif text-slate-800">Your Courage Stars</h3>
                     <p className="text-slate-500 text-sm font-medium">A history of your growth and achievements.</p>
                  </div>

                  <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-4">
                     {submissions.filter(s => s.studentId === user?.id && (s.rewardStars || 0) > 0).sort((a,b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()).length === 0 ? (
                       <div className="text-center py-20 bg-slate-50 rounded-[2.5rem] border-2 border-dashed border-slate-100">
                          <p className="text-slate-400 italic font-medium">Your journey is just beginning. <br/>Earn stars by completing steps!</p>
                       </div>
                     ) : (
                       submissions
                        .filter(s => s.studentId === user?.id && (s.rewardStars || 0) > 0)
                        .sort((a,b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime())
                        .map(sub => {
                           const lesson = lessons.find(l => l.id === sub.lessonId);
                           return (
                             <div key={sub.id} className="p-8 bg-white rounded-[2.5rem] border border-slate-50 shadow-premium flex flex-col gap-4 group hover:border-yellow-100 transition-all">
                                <div className="flex justify-between items-start">
                                   <div className="space-y-1">
                                      <p className="text-[10px] font-black uppercase text-cedar-aqua tracking-widest">{lesson?.weekTitle || `Week #${lesson?.weekNumber}`}</p>
                                      <h4 className="text-xl font-bold text-slate-800 line-clamp-1">{lesson?.title || "Deleted Lesson"}</h4>
                                   </div>
                                   <div className="flex items-center gap-2 px-4 py-2 bg-yellow-50 text-yellow-600 rounded-xl border border-yellow-100 font-black text-xs">
                                      <Star className="w-4 h-4 fill-current" /> +{sub.rewardStars}
                                   </div>
                                </div>
                                {sub.feedback && (
                                  <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 relative">
                                     <Sparkles className="absolute -top-2 -right-2 w-5 h-5 text-yellow-400 opacity-50" />
                                     <p className="text-xs text-slate-500 italic leading-relaxed font-medium">&quot;{sub.feedback}&quot;</p>
                                  </div>
                                )}
                                <p className="text-[8px] text-slate-300 font-black uppercase tracking-widest text-right">{new Date(sub.submittedAt).toLocaleDateString([], { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                             </div>
                           );
                        })
                     )}
                  </div>

                  <div className="mt-10 p-8 bg-slate-900 rounded-[2.5rem] text-center relative overflow-hidden">
                     <div className="relative z-10">
                        <p className="text-white/50 text-[10px] font-black uppercase tracking-[0.2em] mb-2">Current Total</p>
                        <p className="text-5xl font-serif text-white italic">{user?.stars || 0} Stars</p>
                     </div>
                     <Star className="absolute -right-4 -bottom-4 w-24 h-24 text-white/5 rotate-12" />
                  </div>
               </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Journey Buddy & Quick Calm */}
        <div className="fixed bottom-10 right-10 z-[1000] flex flex-col items-end gap-4">
           <AnimatePresence>
              {buddyMessage && (
                 <motion.div 
                   initial={{ opacity: 0, scale: 0.8, y: 20 }}
                   animate={{ opacity: 1, scale: 1, y: 0 }}
                   exit={{ opacity: 0, scale: 0.8, y: 20 }}
                   className="bg-white px-6 py-4 rounded-[2rem] shadow-premium border border-slate-100 mb-2 max-w-[200px] relative"
                 >
                    <p className="text-xs font-bold text-slate-700 leading-relaxed italic">"{buddyMessage}"</p>
                    <div className="absolute -bottom-2 right-8 w-4 h-4 bg-white border-r border-b border-slate-100 rotate-45" />
                 </motion.div>
              )}
           </AnimatePresence>
           
           <motion.button
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setShowQuickCalm(true)}
              className="w-20 h-20 bg-gradient-to-br from-cedar-primary to-cedar-aqua rounded-full shadow-premium flex items-center justify-center text-white relative group"
           >
              <motion.div 
                animate={{ scale: [1, 1.2, 1] }} 
                transition={{ duration: 3, repeat: Infinity }} 
                className="absolute inset-0 bg-white/20 rounded-full" 
              />
              <Trees className="w-10 h-10 relative z-10" />
              <div className="absolute -top-12 right-0 bg-slate-900 text-white text-[9px] font-black uppercase tracking-widest px-4 py-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">Click for Quick Calm</div>
           </motion.button>
        </div>

        {/* Quick Calm Overlay */}
        <AnimatePresence>
           {showQuickCalm && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[2000] bg-white/95 backdrop-blur-xl flex flex-col items-center justify-center p-10 text-center"
              >
                 <button 
                   onClick={() => setShowQuickCalm(false)} 
                   className="absolute top-10 right-10 p-4 text-slate-400 hover:text-slate-600 transition-colors"
                 >
                    <X className="w-8 h-8" />
                 </button>

                 <div className="max-w-md w-full space-y-12">
                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      className="space-y-4"
                    >
                       <h2 className="text-4xl font-serif text-slate-800 italic">Breath of the Forest</h2>
                       <p className="text-slate-500 font-medium">Follow the circle to find your center.</p>
                    </motion.div>

                    <div className="relative flex items-center justify-center h-80">
                       <motion.div 
                         animate={{ 
                           scale: [1, 2.5, 1],
                           opacity: [0.3, 0.1, 0.3]
                         }}
                         transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                         className="absolute w-32 h-32 bg-cedar-primary rounded-full blur-3xl"
                       />
                       <motion.div 
                         animate={{ 
                           scale: [1, 2.5, 1]
                         }}
                         transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                         className="w-32 h-32 border-4 border-cedar-primary rounded-full flex items-center justify-center relative z-10"
                       >
                          <div className="text-cedar-primary font-black uppercase tracking-[0.2em] text-[10px] relative flex items-center justify-center w-full">
                             <motion.span 
                               animate={{ opacity: [1, 0, 0, 0] }} 
                               transition={{ duration: 8, repeat: Infinity, times: [0, 0.4, 0.6, 1] }}
                               className="absolute"
                             >
                                Breathe In
                             </motion.span>
                             <motion.span 
                               animate={{ opacity: [0, 0, 1, 0] }} 
                               transition={{ duration: 8, repeat: Infinity, times: [0, 0.4, 0.6, 1] }}
                               className="absolute"
                             >
                                Breathe Out
                             </motion.span>
                          </div>
                       </motion.div>
                    </div>

                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1 }}
                      className="space-y-6"
                    >
                       <div className="flex justify-center gap-3">
                          {[...Array(3)].map((_, i) => (
                             <motion.div 
                               key={i}
                               animate={{ opacity: [0.2, 1, 0.2] }}
                               transition={{ duration: 2, repeat: Infinity, delay: i * 0.5 }}
                               className="w-2 h-2 bg-cedar-primary rounded-full"
                             />
                          ))}
                       </div>
                       <button 
                         onClick={() => setShowQuickCalm(false)} 
                         className="px-10 py-4 bg-slate-900 text-white rounded-[2rem] font-bold text-sm hover:scale-105 transition-all shadow-xl"
                       >
                          I Feel Better
                       </button>
                    </motion.div>
                 </div>
              </motion.div>
           )}
        </AnimatePresence>
      </div>
    </RoleGuard>
  );
}

const ResourceCard = React.memo(({ href, icon, title, desc, color }: { href: string, icon: React.ReactNode, title: string, desc: string, color: string }) => {
  return (
    <Link href={href}>
      <div className={`p-6 rounded-3xl border-2 border-slate-50 bg-slate-50/50 flex items-center gap-5 cursor-pointer transition-all hover:bg-white hover:shadow-premium group ${color}`}>
        <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform">{icon}</div>
        <div><p className="font-bold text-slate-800 text-sm tracking-tight">{title}</p><p className="text-[10px] text-slate-400 font-medium">{desc}</p></div>
      </div>
    </Link>
  );
});

ResourceCard.displayName = 'ResourceCard';
