"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useAuth, User, Lesson, Submission, SupportRequest } from "@/context/AuthContext";
import { Users, FileText, Plus, LogOut, ArrowRight, ArrowLeft, X, PlayCircle, Book, CheckCircle2, MessageCircle, Star, Calendar, Clock, ChevronDown, Menu, Search, Filter, Briefcase, GraduationCap, Send, Trash2, Edit2, ExternalLink, Activity, Save, FileUp, BookOpen, ChevronUp, Zap, Link as LinkIcon, Paperclip, Type, ClipboardList, ShieldCheck, UserPlus, LayoutGrid, List } from "lucide-react";
import React, { useState, useMemo, useCallback, useEffect, Suspense } from "react";
import Link from "next/link";
import RoleGuard from "@/components/RoleGuard";
import NotificationsDropdown from "@/components/NotificationsDropdown";
import { useSearchParams } from "next/navigation";

const EduNavItem = React.memo(({ icon, label, active, onClick, badge }: { icon: React.ReactNode, label: string, active?: boolean, onClick: () => void, badge?: number }) => {
  return (
    <button onClick={onClick} className={`w-full flex items-center justify-between px-6 py-4 rounded-[1.5rem] transition-all group ${active ? 'bg-cedar-primary text-white shadow-xl shadow-cedar-primary/20 scale-105' : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'}`}>
      <div className="flex items-center gap-4"><div className={`transition-transform group-hover:scale-110 ${active ? 'text-white' : 'text-slate-400'}`}>{icon}</div><span className="text-sm font-bold tracking-tight">{label}</span></div>
      {badge ? (<span className={`px-2.5 py-1 rounded-full text-[10px] font-black ${active ? 'bg-white text-cedar-primary' : 'bg-red-500 text-white shadow-sm'}`}>{badge}</span>) : null}
    </button>
  );
});
EduNavItem.displayName = 'EduNavItem';

const StatCard = React.memo(({ icon, label, value, color }: { icon: React.ReactNode, label: string, value: number, color: string }) => {
  return (
    <div className="bg-white p-6 md:p-10 rounded-[2.5rem] md:rounded-[4rem] border border-slate-50 shadow-sm hover:shadow-premium transition-all group">
      <div className={`w-14 h-14 md:w-16 md:h-16 rounded-2xl md:rounded-3xl flex items-center justify-center mb-6 md:mb-8 shadow-inner transition-transform group-hover:rotate-6 ${color}`}>{icon}</div>
      <p className="text-[9px] md:text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] mb-2 md:mb-3">{label}</p>
      <p className="text-4xl md:text-5xl font-serif text-slate-800 italic">{value}</p>
    </div>
  );
});
StatCard.displayName = 'StatCard';

function EducatorDashboardContent() {
  const { user, users, lessons, createLesson, updateLesson, deleteLesson, submissions, rewardSubmission, supportRequests, resolveSupport, sendSupportChatMessage, markSupportAsRead, logout } = useAuth();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'lessons' | 'students' | 'submissions' | 'support'>('dashboard');
  
  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab === 'support') setActiveTab('support');
  }, [searchParams]);

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    const savedMode = localStorage.getItem('educator_curriculum_view_mode');
    if (savedMode === 'list' || savedMode === 'grid') {
      setViewMode(savedMode);
    }
  }, []);

  const handleViewModeChange = (mode: 'grid' | 'list') => {
    setViewMode(mode);
    localStorage.setItem('educator_curriculum_view_mode', mode);
  };

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [studentDetail, setStudentDetail] = useState<User | null>(null);
  const [expandedStudents, setExpandedStudents] = useState<Record<string, boolean>>({});
  
  // Modals
  const [lessonModal, setLessonModal] = useState<{ mode: 'create' | 'edit', lesson?: Lesson } | null>(null);
  const [submissionModal, setSubmissionModal] = useState<Submission | null>(null);
  const [rewardModal, setRewardModal] = useState<{ submissionId: string } | null>(null);

  const [lessonForm, setLessonForm] = useState<{
    title: string;
    content: string;
    type: 'video' | 'text' | 'activity';
    educatorId: string;
    assignedStudents: string[];
    videoUrl: string;
    fileUrls: string[];
    mediaUrls: string[]; 
    deadline: string;
    releaseDate: string;
    weekNumber: number;
    weekTitle: string;
  }>({
    title: "",
    content: "",
    type: "video",
    educatorId: "",
    assignedStudents: ["all"],
    videoUrl: "",
    fileUrls: [],
    mediaUrls: [""],
    deadline: "",
    releaseDate: "",
    weekNumber: 1,
    weekTitle: ""
  });

  const resetLessonForm = () => setLessonForm({
    title: "", content: "", type: "video", educatorId: "", assignedStudents: ["all"],
    videoUrl: "", fileUrls: [], mediaUrls: [""], deadline: "", releaseDate: "", weekNumber: 1, weekTitle: ""
  });

  const openEditModal = (lesson: Lesson) => {
    setLessonForm({
      title: lesson.title,
      content: lesson.content,
      type: lesson.type,
      educatorId: lesson.educatorId,
      assignedStudents: lesson.assignedStudents || ['all'],
      videoUrl: lesson.videoUrl || "",
      fileUrls: lesson.fileUrls || [],
      mediaUrls: lesson.resourceLinks || [""],
      deadline: lesson.deadline || "",
      releaseDate: lesson.releaseDate || "",
      weekNumber: lesson.weekNumber || 1,
      weekTitle: lesson.weekTitle || ""
    });
    setLessonModal({ mode: 'edit', lesson });
  };

  const handleCreateLessson = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lessonForm.title || !lessonForm.content || !user) return;
    await createLesson({ 
      ...lessonForm, 
      educatorId: user.id,
      resourceLinks: lessonForm.mediaUrls.filter(u => u.trim() !== "") 
    });
    setLessonModal(null);
    resetLessonForm();
  };

  const handleUpdateLesson = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lessonModal?.lesson?.id) return;
    await updateLesson(lessonModal.lesson.id, { 
      ...lessonForm,
      resourceLinks: lessonForm.mediaUrls.filter(u => u.trim() !== "")
    });
    setLessonModal(null);
    resetLessonForm();
  };

  const handleReward = (submissionId: string, stars: number, feedback: string) => {
    rewardSubmission(submissionId, stars, feedback);
    setRewardModal(null);
    setSubmissionModal(null);
  };

  const myStudents = useMemo(() => users.filter(u => u.role === 'student' && u.assignedEducatorId === user?.id), [users, user?.id]);
  const myLessons = useMemo(() => lessons.filter(l => l.educatorId === user?.id), [lessons, user?.id]);
  const myLessonIds = useMemo(() => new Set(myLessons.map(l => l.id)), [myLessons]);
  const mySupportRequests = useMemo(() => supportRequests.filter(r => r.educatorId === user?.id), [supportRequests, user?.id]);
  
  const submissionsByStudent = useMemo(() => {
    const grouped: Record<string, { student: User, pending: Submission[], reviewed: Submission[] }> = {};
    myStudents.forEach(st => {
      grouped[st.id] = {
        student: st,
        pending: submissions.filter(s => s.studentId === st.id && s.status === 'pending' && myLessonIds.has(s.lessonId)),
        reviewed: submissions.filter(s => s.studentId === st.id && s.status === 'reviewed' && myLessonIds.has(s.lessonId))
      };
    });
    return grouped;
  }, [myStudents, submissions, myLessonIds]);

  const pendingSubmissionsCount = submissions.filter(s => s.status === 'pending' && myStudents.some(st => st.id === s.studentId) && myLessonIds.has(s.lessonId)).length;

  const stats = useMemo(() => ({
    students: myStudents.length,
    lessons: myLessons.length,
    pending: pendingSubmissionsCount,
    support: mySupportRequests.filter(r => r.status === 'open').length
  }), [myStudents, myLessons, pendingSubmissionsCount, mySupportRequests]);

  const hasUnreadSupport = useMemo(() => 
    mySupportRequests.some(r => r.educatorHasUnread),
    [mySupportRequests]
  );

  const SidebarContent = () => (
    <div className="flex flex-col h-full p-8">
      <div className="flex flex-col gap-6 mb-12 px-2">
        <Link href="/">
           <img src="https://cedarcentre.ca/wp-content/uploads/2023/07/cedar-logo1.svg" className="h-14 mb-2" alt="Logo" />
        </Link>
      </div>

      <nav className="space-y-2 flex-1">
        <EduNavItem icon={<Activity className="w-5 h-5" />} label="Dashboard" active={activeTab === 'dashboard'} onClick={() => { setActiveTab('dashboard'); setIsMobileMenuOpen(false); }} />
        <EduNavItem icon={<BookOpen className="w-5 h-5" />} label="Curriculum" active={activeTab === 'lessons'} onClick={() => { setActiveTab('lessons'); setIsMobileMenuOpen(false); }} />
        <EduNavItem icon={<Users className="w-5 h-5" />} label="Classroom" active={activeTab === 'students'} onClick={() => { setActiveTab('students'); setIsMobileMenuOpen(false); }} />
        <EduNavItem icon={<FileText className="w-5 h-5" />} label="Submissions" active={activeTab === 'submissions'} onClick={() => { setActiveTab('submissions'); setIsMobileMenuOpen(false); }} badge={pendingSubmissionsCount} />
      </nav>

      <div className="mt-auto pt-8 border-t border-slate-100">
        <div className="bg-slate-50 p-6 rounded-[2rem] mb-6 flex items-center gap-4">
           <div className="w-12 h-12 bg-cedar-primary text-white rounded-2xl flex items-center justify-center font-black shadow-lg shadow-cedar-primary/20">{user?.name[0]}</div>
           <div className="flex-1 min-w-0"><p className="font-bold text-slate-800 text-sm truncate">{user?.name}</p><p className="text-[10px] text-slate-400 font-medium uppercase tracking-widest">Educator Portal</p></div>
        </div>
        <button onClick={logout} className="w-full flex items-center gap-4 px-6 py-4 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all font-bold text-sm"><LogOut className="w-5 h-5" /> Sign Out</button>
      </div>
    </div>
  );

  const totalNotifications = pendingSubmissionsCount; // Only include submissions in the hamburger menu badge now that support has its own button

  const toggleStudentAssignment = (id: string) => {
    let current = [...lessonForm.assignedStudents];
    if (current.includes('all')) current = []; // Switching from all to selective
    
    if (current.includes(id)) {
      current = current.filter(sid => sid !== id);
    } else {
      current.push(id);
    }
    
    if (current.length === 0) current = ['all']; // Default back to all if none selected
    setLessonForm({ ...lessonForm, assignedStudents: current });
  };

  return (
    <RoleGuard allowedRoles={['educator']}>
      <div className="flex flex-col lg:flex-row h-screen bg-slate-50/50 overflow-hidden">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-80 bg-white border-r border-slate-100 overflow-y-auto shrink-0">
          <SidebarContent />
        </aside>

        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {/* Desktop Top Bar */}
          <header className="hidden lg:flex bg-white/60 backdrop-blur-xl border-b border-slate-100 px-12 py-4 justify-between items-center z-[100]">
            <div className="flex items-center gap-4">
               <div className="w-2 h-2 bg-cedar-primary rounded-full animate-pulse" />
               <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Professional Journey Manager</span>
            </div>
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setActiveTab('support')} 
                className={`p-3 transition-all rounded-2xl border shadow-sm relative group ${hasUnreadSupport ? 'bg-red-500 text-white border-red-600 scale-105' : 'bg-red-50 text-red-500 border-red-100 hover:bg-red-500 hover:text-white'}`}
              >
                <MessageCircle className="w-5 h-5" />
                {hasUnreadSupport && <span className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full border-2 border-red-500 animate-ping" />}
              </button>
              <NotificationsDropdown />
              <button onClick={logout} className="flex items-center gap-3 px-6 py-3 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition-all rounded-2xl shadow-sm border border-red-100 group">
                <LogOut className="w-4 h-4" />
                <span className="font-bold text-[10px] uppercase tracking-widest ">Logout</span>
              </button>
            </div>
          </header>

          {/* Mobile Sticky Header */}
          <header className="lg:hidden bg-white/80 backdrop-blur-md sticky top-0 z-[200] border-b border-slate-100 px-6 py-4 flex justify-between items-center shadow-sm shrink-0">
             <button onClick={() => setIsMobileMenuOpen(true)} className="p-3 bg-white rounded-xl shadow-sm border border-slate-100 relative">
                <Menu className="w-6 h-6 text-slate-600" />
                {totalNotifications > 0 && <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[8px] font-black rounded-full flex items-center justify-center border-2 border-white animate-bounce">{totalNotifications}</span>}
             </button>
             <Link href="/"><img src="https://cedarcentre.ca/wp-content/uploads/2023/07/cedar-logo1.svg" className="h-10" alt="Logo" /></Link>
             <div className="flex items-center gap-3">
                <button 
                  onClick={() => setActiveTab('support')} 
                  className={`p-2.5 transition-all rounded-xl border shadow-sm relative group ${hasUnreadSupport ? 'bg-red-500 text-white border-red-600' : 'bg-red-50 text-red-500 border-red-100'}`}
                >
                  <MessageCircle className="w-4 h-4" />
                  {hasUnreadSupport && <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-white rounded-full border-2 border-red-500 animate-ping" />}
                </button>
                <NotificationsDropdown />
                <button onClick={logout} className="flex items-center gap-2 px-4 py-3 bg-red-50 text-red-600 rounded-xl border border-red-100 font-bold text-[9px] uppercase tracking-widest shadow-sm"><LogOut className="w-4 h-4" /> Logout</button>
             </div>
          </header>

          <main className="flex-1 p-6 lg:p-12 overflow-y-auto w-full">
            <AnimatePresence>
              {isMobileMenuOpen && (
                <div className="fixed inset-0 z-[300] lg:hidden">
                   <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsMobileMenuOpen(false)} className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" />
                   <motion.div initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }} className="absolute inset-y-0 left-0 bg-white w-80 shadow-2xl flex flex-col">
                      <button onClick={() => setIsMobileMenuOpen(false)} className="absolute top-8 right-8 p-2 text-slate-400"><X className="w-6 h-6" /></button>
                      <SidebarContent />
                   </motion.div>
                </div>
              )}
            </AnimatePresence>

            <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <p className="text-[10px] font-black uppercase text-cedar-primary tracking-[0.3em] mb-3">Educator Portal</p>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-slate-800 italic leading-none">
                  {activeTab === 'dashboard' ? `Hello, ${user?.name.split(' ')[0]}!` : activeTab === 'lessons' ? 'Curriculum' : activeTab === 'students' ? 'Classroom' : activeTab === 'submissions' ? 'Submissions' : 'Assistance'}
                </h1>
                <p className="text-slate-400 mt-4 font-medium tracking-tight">
                  {activeTab === 'dashboard' ? 'Here is what is happening in your learning community today.' : 
                   activeTab === 'lessons' ? 'Manage journey steps and educational content.' :
                   activeTab === 'students' ? 'Track progress and engagement for all students.' :
                   activeTab === 'submissions' ? 'Review submissions and award star points.' :
                   'Direct student support and case management.'}
                </p>
              </div>
              {activeTab === 'lessons' && (
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
                  <button onClick={() => { resetLessonForm(); setLessonModal({ mode: 'create' }); }} className="flex items-center gap-3 bg-cedar-primary text-white px-6 md:px-8 py-3 md:py-4 rounded-2xl md:rounded-[2rem] font-bold text-xs md:text-sm shadow-xl shadow-cedar-primary/20 hover:scale-105 transition-all w-full md:w-fit justify-center md:justify-start"><Plus className="w-5 h-5" /> Create Stair Step</button>
                </div>
              )}
          </header>

          <AnimatePresence mode="wait">
            {activeTab === 'dashboard' && (
              <motion.div key="dashboard-tab" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                  <StatCard icon={<Users />} label="Active Students" value={stats.students} color="bg-blue-50 text-blue-500" />
                  <StatCard icon={<Book />} label="Journey Steps" value={stats.lessons} color="bg-emerald-50 text-emerald-500" />
                  <StatCard icon={<FileText />} label="Pending Reviews" value={stats.pending} color="bg-amber-50 text-amber-500" />
                  <StatCard icon={<MessageCircle />} label="Support Cases" value={stats.support} color="bg-indigo-50 text-indigo-500" />
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
                   <div className="xl:col-span-2 space-y-8">
                      <div className="flex items-center justify-between"><h3 className="text-2xl font-serif text-slate-800 italic">Recent Student Activity</h3><button onClick={() => setActiveTab('submissions')} className="text-xs font-black uppercase text-cedar-primary tracking-widest flex items-center gap-2 hover:gap-3 transition-all">View All <ArrowRight className="w-4 h-4" /></button></div>
                      <div className="space-y-4">
                         {submissions.filter(s => myStudents.some(st => st.id === s.studentId) && myLessonIds.has(s.lessonId)).slice(0, 4).map(sub => (
                           <div key={sub.id} className="bg-white p-6 rounded-[2.5rem] border border-slate-100 flex items-center justify-between shadow-sm hover:shadow-premium transition-all">
                              <div className="flex items-center gap-5">
                                 <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center font-bold text-slate-400">{users.find(u => u.id === sub.studentId)?.name[0]}</div>
                                 <div><p className="font-bold text-slate-800">{users.find(u => u.id === sub.studentId)?.name}</p><p className="text-[10px] text-slate-400 uppercase tracking-widest mt-1">{lessons.find(l => l.id === sub.lessonId)?.title}</p></div>
                              </div>
                              <div className="flex items-center gap-4">
                                 <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${sub.status === 'pending' ? 'bg-amber-100 text-amber-600' : 'bg-emerald-100 text-emerald-600'}`}>{sub.status}</span>
                                 <button onClick={() => { setSubmissionModal(sub); setActiveTab('submissions'); }} className="p-3 text-slate-300 hover:text-cedar-primary transition-colors"><ExternalLink className="w-4 h-4" /></button>
                              </div>
                           </div>
                         ))}
                         {stats.pending === 0 && <div className="py-20 text-center bg-white rounded-[3rem] border border-dashed border-slate-200"><p className="text-slate-400 italic">No recent activity to display.</p></div>}
                      </div>
                   </div>

                   <div className="space-y-8">
                      <h3 className="text-2xl font-serif text-slate-800 italic">Quick Insights</h3>
                      <div className="bg-white p-10 rounded-[3.5rem] border border-slate-100 shadow-sm space-y-8">
                         <div className="flex items-center gap-5">
                            <div className="w-14 h-14 bg-cedar-primary/10 text-cedar-primary rounded-2xl flex items-center justify-center"><Zap className="w-7 h-7" /></div>
                            <div><p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Next Milestone</p><p className="font-bold text-slate-800">Review {stats.pending} Submissions</p></div>
                         </div>
                         <div className="h-[1px] bg-slate-50" />
                         <div className="space-y-4">
                            <button onClick={() => { resetLessonForm(); setLessonModal({ mode: 'create' }); setActiveTab('lessons'); }} className="w-full flex items-center justify-between p-5 bg-slate-50 hover:bg-cedar-primary hover:text-white rounded-3xl transition-all group">
                               <span className="font-bold text-sm">Create STAIR Step</span><Plus className="w-5 h-5 text-cedar-primary group-hover:text-white" />
                            </button>
                            <button onClick={() => setActiveTab('support')} className="w-full flex items-center justify-between p-5 bg-slate-50 hover:bg-cedar-primary hover:text-white rounded-3xl transition-all group">
                               <span className="font-bold text-sm">Assistance Case Management</span><MessageCircle className="w-5 h-5 text-cedar-primary group-hover:text-white" />
                            </button>
                         </div>
                      </div>
                   </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'lessons' && (
              <motion.div key="lessons-tab" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-12">
                 {(() => {
                    const grouped = myLessons.reduce((acc: any, l) => {
                       const week = l.weekNumber || 0;
                       if (!acc[week]) acc[week] = { title: l.weekTitle || `Week ${week}`, lessons: [] };
                       acc[week].lessons.push(l);
                       return acc;
                    }, {});

                    return Object.keys(grouped).sort((a,b) => parseInt(a) - parseInt(b)).map(weekNum => (
                      <div key={weekNum} className="space-y-8">
                         <div className="flex items-center gap-6 px-2"><h4 className="text-2xl font-serif text-slate-800 italic">{grouped[weekNum].title}</h4><div className="h-[1px] flex-1 bg-slate-100" /></div>
                         <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8" : "space-y-4"}>
                            {grouped[weekNum].lessons.map((lesson: Lesson) => (
                              viewMode === 'grid' ? (
                                <div key={lesson.id} className="bg-white rounded-[2.5rem] md:rounded-[4rem] border border-slate-50 shadow-sm hover:shadow-premium transition-all flex flex-col overflow-hidden group">
                                   <div className="p-8 md:p-10 flex-1">
                                      <div className="flex justify-between items-start mb-10"><div className="w-20 h-20 bg-[#F1F5F9] rounded-[2rem] flex items-center justify-center shadow-inner">{lesson.type === 'video' ? <PlayCircle className="w-8 h-8 text-slate-500" /> : lesson.type === 'activity' ? <ClipboardList className="w-8 h-8 text-slate-500" /> : <BookOpen className="w-8 h-8 text-slate-500" />}</div><div className="flex items-center gap-2"><button onClick={() => openEditModal(lesson)} className="p-3 text-slate-300 hover:text-cedar-primary transition-colors"><Edit2 className="w-5 h-5" /></button><button onClick={() => { if(confirm("Delete this journey step?")) deleteLesson(lesson.id); }} className="p-3 text-slate-300 hover:text-red-500 transition-colors"><Trash2 className="w-5 h-5" /></button></div></div>
                                      <p className="text-[11px] font-black uppercase text-cedar-aqua tracking-[0.15em] mb-4">{lesson.type}</p>
                                      <h5 className="text-3xl md:text-4xl font-serif text-slate-800 italic mb-6 leading-tight">{lesson.title}</h5>
                                      <p className="text-slate-500 text-lg leading-relaxed line-clamp-3 mb-8">{lesson.content}</p>
                                      
                                      <div className="flex flex-wrap gap-3 mb-10">
                                         {lesson.videoUrl && (
                                           <div className="flex items-center gap-2 px-4 py-2 bg-cedar-aqua/5 text-cedar-primary rounded-xl text-[9px] font-black uppercase tracking-widest border border-cedar-aqua/10">
                                              <LinkIcon className="w-3 h-3" /> {lesson.videoUrl.split(',').filter(u => u.trim()).length} Links
                                           </div>
                                         )}
                                         {lesson.fileUrls && lesson.fileUrls.length > 0 && (
                                           <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 text-slate-400 rounded-xl text-[9px] font-black uppercase tracking-widest border border-slate-100">
                                              <Paperclip className="w-3 h-3" /> {lesson.fileUrls.length} Files
                                           </div>
                                         )}
                                      </div>

                                      {lesson.deadline && <div className="inline-flex items-center gap-3 px-6 py-3 bg-red-50 text-red-500 rounded-full text-[10px] font-black uppercase tracking-widest border border-red-100 mb-6"><Clock className="w-4 h-4" /> Due {new Date(lesson.deadline).toLocaleDateString([], { month: 'short', day: 'numeric' })} at {new Date(lesson.deadline).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>}
                                   </div>
                                   <div className="px-10 py-8 border-t border-slate-50 flex justify-between items-center bg-slate-50/30 rounded-b-[4rem]"><div className="flex items-center gap-3 text-[10px] font-black uppercase text-slate-400 tracking-widest"><Users className="w-4 h-4" /> {lesson.assignedStudents?.includes('all') ? 'Entire Community' : 'Selective Group'}</div><div className="w-2.5 h-2.5 bg-emerald-400 rounded-full shadow-[0_0_10px_rgba(52,211,153,0.5)]" /></div>
                                </div>
                              ) : (
                                <div key={lesson.id} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-premium transition-all flex items-center justify-between group">
                                   <div className="flex items-center gap-6">
                                      <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400">{lesson.type === 'video' ? <PlayCircle className="w-6 h-6" /> : lesson.type === 'activity' ? <ClipboardList className="w-6 h-6" /> : <BookOpen className="w-6 h-6" />}</div>
                                      <div>
                                         <div className="flex items-center gap-3 mb-1">
                                            <h5 className="font-bold text-slate-800">{lesson.title}</h5>
                                            <span className="px-3 py-1 bg-cedar-aqua/10 text-cedar-primary rounded-full text-[8px] font-black uppercase tracking-widest">{lesson.type}</span>
                                         </div>
                                         <p className="text-xs text-slate-400 font-medium line-clamp-1">{lesson.content}</p>
                                      </div>
                                   </div>
                                   <div className="flex items-center gap-6">
                                      {lesson.deadline && <div className="hidden md:flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-slate-400"><Clock className="w-3.5 h-3.5" /> {new Date(lesson.deadline).toLocaleDateString([], { month: 'short', day: 'numeric' })}</div>}
                                      <div className="flex items-center gap-2">
                                         <button onClick={() => openEditModal(lesson)} className="p-2 text-slate-300 hover:text-cedar-primary transition-colors"><Edit2 className="w-4 h-4" /></button>
                                         <button onClick={() => { if(confirm("Delete this journey step?")) deleteLesson(lesson.id); }} className="p-2 text-slate-300 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                                      </div>
                                   </div>
                                </div>
                              )
                            ))}
                         </div>
                      </div>
                    ));
                 })()}
              </motion.div>
            )}

            {activeTab === 'students' && (
              <motion.div key="students-tab" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                 {myStudents.map(student => (
                    <div key={student.id} onClick={() => setStudentDetail(student)} className="bg-white p-8 rounded-[3rem] shadow-sm border border-slate-100 hover:border-cedar-primary/20 transition-all group cursor-pointer hover:shadow-premium">
                       <div className="flex items-center gap-6 mb-8">
                          <div className="w-20 h-20 bg-slate-50 rounded-[1.5rem] flex items-center justify-center font-bold text-3xl text-slate-400 group-hover:bg-cedar-primary group-hover:text-white transition-all shadow-inner uppercase">{student.name[0]}</div>
                          <div><h4 className="font-bold text-slate-800 text-xl">{student.name}</h4><p className="text-xs text-slate-400 font-medium italic">{student.email}</p></div>
                       </div>
                       <div className="grid grid-cols-2 gap-4">
                          <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 text-center"><p className="text-[9px] font-black uppercase text-slate-400 tracking-widest mb-1">Stars</p><p className="text-xl font-bold text-yellow-600">{student.stars || 0}</p></div>
                          <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 text-center"><p className="text-[9px] font-black uppercase text-slate-400 tracking-widest mb-1">Status</p><p className="text-xs font-bold text-slate-500 uppercase">Active</p></div>
                       </div>
                    </div>
                 ))}
              </motion.div>
            )}

            {activeTab === 'submissions' && (
              <motion.div key="submissions-tab" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-12">
                 <section className="space-y-6">
                    <h3 className="text-sm font-black uppercase text-red-500 tracking-widest flex items-center gap-3"><Clock className="w-4 h-4" /> Needs Your Review</h3>
                    {submissions.filter(s => s.status === 'pending' && myStudents.some(st => st.id === s.studentId) && myLessonIds.has(s.lessonId)).map(sub => (
                      <div key={sub.id} className="bg-white p-8 rounded-[3rem] border border-red-50 shadow-sm hover:shadow-premium transition-all flex flex-col md:flex-row items-center gap-8">
                         <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center font-bold text-2xl uppercase">{users.find(u => u.id === sub.studentId)?.name[0]}</div>
                         <div className="flex-1 text-center md:text-left"><h4 className="font-bold text-slate-800">{users.find(u => u.id === sub.studentId)?.name}</h4><p className="text-slate-400 text-xs mt-1">Reflecting on: {lessons.find(l => l.id === sub.lessonId)?.title}</p></div>
                         <button onClick={() => setSubmissionModal(sub)} className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold text-xs uppercase tracking-widest hover:scale-105 transition-all">Review Now</button>
                      </div>
                    ))}
                    {pendingSubmissionsCount === 0 && <p className="text-slate-300 italic text-sm text-center py-10 bg-white rounded-[3rem] border border-dashed border-slate-100">All submissions have been reviewed.</p>}
                 </section>

                 <section className="space-y-8">
                    <h3 className="text-sm font-black uppercase text-slate-400 tracking-widest flex items-center gap-3"><CheckCircle2 className="w-4 h-4 text-emerald-400" />Submissions</h3>
                    {Object.entries(submissionsByStudent).map(([studentId, data]) => {
                      if (data.pending.length === 0 && data.reviewed.length === 0) return null;
                      const isExpanded = expandedStudents[studentId];
                      const totalPending = data.pending.length;

                      return (
                        <div key={studentId} className="bg-white rounded-[3.5rem] border border-slate-100 shadow-sm overflow-hidden transition-all">
                           <button 
                             onClick={() => setExpandedStudents(prev => ({ ...prev, [studentId]: !prev[studentId] }))}
                             className="w-full p-8 flex items-center justify-between hover:bg-slate-50 transition-all"
                           >
                              <div className="flex items-center gap-6">
                                 <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center font-black text-2xl text-slate-400 uppercase">{data.student.name[0]}</div>
                                 <div className="text-left">
                                    <h4 className="font-bold text-slate-800 text-xl">{data.student.name}</h4>
                                    <p className="text-slate-400 text-xs font-medium uppercase tracking-widest mt-1">{data.pending.length + data.reviewed.length} Total Reflections</p>
                                 </div>
                              </div>
                              <div className="flex items-center gap-6">
                                 {totalPending > 0 && <span className="bg-red-500 text-white text-[10px] font-black px-4 py-2 rounded-full shadow-lg shadow-red-500/20 animate-pulse">{totalPending} NEW</span>}
                                 <div className={`p-3 rounded-xl bg-slate-50 text-slate-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}><ChevronDown className="w-5 h-5" /></div>
                              </div>
                           </button>

                           <AnimatePresence>
                              {isExpanded && (
                                <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden bg-slate-50/30 border-t border-slate-50">
                                   <div className="p-8 space-y-4">
                                      {[...data.pending, ...data.reviewed].map(sub => {
                                         const isPending = sub.status === 'pending';
                                         return (
                                           <div key={sub.id} className={`bg-white p-6 rounded-[2.5rem] border flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm transition-all ${isPending ? 'border-red-100' : 'border-slate-100'}`}>
                                              <div className="flex items-center gap-5">
                                                 <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-inner ${isPending ? 'bg-red-50 text-red-500' : 'bg-emerald-50 text-emerald-500'}`}>{isPending ? <Clock className="w-5 h-5" /> : <CheckCircle2 className="w-5 h-5" />}</div>
                                                 <div>
                                                    <p className={`font-bold ${isPending ? 'text-slate-800' : 'text-slate-700'}`}>{lessons.find(l => l.id === sub.lessonId)?.title}</p>
                                                    <p className={`text-[10px] font-black uppercase tracking-widest mt-1 ${isPending ? 'text-red-400' : 'text-slate-400'}`}>{isPending ? 'Needs Review' : `Reviewed • ${sub.rewardStars || 0} Stars`}</p>
                                                 </div>
                                              </div>
                                              <button onClick={() => setSubmissionModal(sub)} className={`px-8 py-3 rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all ${isPending ? 'bg-red-500 text-white shadow-lg shadow-red-500/20' : 'bg-slate-100 text-slate-400 hover:bg-cedar-primary hover:text-white'}`}>{isPending ? 'Review Now' : 'Edit Review'}</button>
                                           </div>
                                         );
                                      })}
                                   </div>
                                </motion.div>
                              )}
                           </AnimatePresence>
                        </div>
                      );
                    })}
                 </section>
              </motion.div>
            )}

            {activeTab === 'support' && (
              <motion.div key="support-tab" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-8">
                 {mySupportRequests.filter(r => r.status === 'open' || r.educatorHasUnread).map(req => (
                   <motion.div key={req.id} onViewportEnter={() => req.educatorHasUnread && markSupportAsRead(req.id, 'educator')} className={`bg-white p-6 md:p-8 rounded-[2rem] md:rounded-[4rem] border transition-all flex flex-col gap-6 md:gap-8 shadow-sm relative ${req.educatorHasUnread ? 'ring-2 ring-red-500/10 border-red-100' : 'border-slate-50'}`}>
                      {req.educatorHasUnread && <div className="absolute top-0 right-0 p-4 bg-red-500 text-white text-[8px] font-black uppercase tracking-widest rounded-bl-[1.5rem] animate-bounce z-10">New Message</div>}
                      <div className="flex justify-between items-center border-b border-slate-50 pb-6">
                         <div className="flex items-center gap-4"><div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center font-bold text-slate-400">{users.find(u => u.id === req.studentId)?.name[0]}</div><div><h4 className="font-bold text-slate-800">{users.find(u => u.id === req.studentId)?.name}</h4><p className="text-[9px] text-slate-400 font-black uppercase tracking-widest">Case #{req.id.slice(-4)}</p></div></div>
                         <button onClick={() => resolveSupport(req.id)} className="px-5 py-2 text-emerald-500 border border-emerald-100 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-emerald-500 hover:text-white transition-all">Resolve</button>
                      </div>
                      <div className="space-y-6">
                         {/* Original Inquiry */}
                         <div className="flex gap-4 flex-row">
                            <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-xs font-black shrink-0 shadow-inner bg-slate-100 text-slate-400">
                               {users.find(u => u.id === req.studentId)?.name[0] || '?'}
                            </div>
                            <div className="flex flex-col max-w-[80%] items-start">
                               <div className="p-5 rounded-[1.8rem] text-sm font-bold leading-relaxed shadow-sm bg-slate-50 text-slate-800 rounded-tl-none border-2 border-slate-100 italic">
                                  "{req.message}"
                               </div>
                               <span className="text-[8px] text-slate-300 mt-2 font-black uppercase tracking-widest px-2">Original Inquiry • {new Date(req.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                         </div>

                         {req.chat?.map((msg, i) => {
                           const isEducator = msg.senderRole === 'educator';
                           const senderName = users.find(u => u.id === msg.senderId)?.name || (isEducator ? user?.name : 'Student');
                           const initial = senderName?.[0] || '?';
                           
                           return (
                             <div key={i} className={`flex gap-4 ${isEducator ? 'flex-row-reverse' : 'flex-row'}`}>
                                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-xs font-black shrink-0 shadow-inner ${isEducator ? 'bg-cedar-primary text-white' : 'bg-slate-100 text-slate-400'}`}>
                                   {initial}
                                </div>
                                <div className={`flex flex-col max-w-[80%] ${isEducator ? 'items-end' : 'items-start'}`}>
                                   <div className={`p-5 rounded-[1.8rem] text-sm font-medium leading-relaxed shadow-sm ${isEducator ? 'bg-cedar-primary text-white rounded-tr-none' : 'bg-white text-slate-700 rounded-tl-none border border-slate-100'}`}>
                                      {msg.content}
                                   </div>
                                   <span className="text-[8px] text-slate-300 mt-2 font-black uppercase tracking-widest px-2">{new Date(msg.timestamp || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                </div>
                             </div>
                           );
                         })}
                      </div>
                      <form onSubmit={(e) => { e.preventDefault(); const target = e.target as any; if (target.reply.value) { sendSupportChatMessage(req.id, target.reply.value); target.reply.value = ''; } }} className="flex gap-3 pt-6 border-t border-slate-50"><input name="reply" placeholder="Write a response..." className="flex-1 bg-slate-50 rounded-2xl px-6 py-4 text-sm font-medium outline-none focus:ring-4 focus:ring-cedar-primary/5 transition-all" onFocus={() => req.educatorHasUnread && markSupportAsRead(req.id, 'educator')} /><button type="submit" className="p-4 bg-cedar-primary text-white rounded-xl shadow-lg hover:scale-105 transition-all"><Send className="w-5 h-5" /></button></form>
                   </motion.div>
                 ))}
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        {/* Modals */}
        {studentDetail && (
           <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-md z-[600] flex items-center justify-center p-4 md:p-6">
              <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white rounded-[2rem] md:rounded-[4rem] w-full max-w-4xl p-8 md:p-12 shadow-2xl relative flex flex-col max-h-[90vh]">
                 <button onClick={() => setStudentDetail(null)} className="absolute top-6 right-6 md:top-10 md:right-10 p-3 text-slate-300 hover:text-slate-600 transition-colors"><X className="w-8 h-8" /></button>
                 <div className="flex items-center gap-6 md:gap-8 mb-8 md:mb-12 border-b border-slate-50 pb-8 md:pb-10"><div className="w-20 h-20 md:w-24 md:h-24 bg-cedar-primary text-white rounded-2xl md:rounded-[2rem] flex items-center justify-center font-black text-3xl md:text-4xl uppercase">{studentDetail.name[0]}</div><div><h3 className="text-3xl md:text-4xl font-serif text-slate-800 italic">{studentDetail.name}</h3><p className="text-slate-400 font-medium tracking-tight mt-1">{studentDetail.email} • {studentDetail.stars || 0} Total Stars</p></div></div>
                 <div className="flex-1 overflow-y-auto pr-4 custom-scrollbar">
                    <h4 className="text-sm font-black uppercase text-slate-400 tracking-widest mb-8 px-2 flex items-center gap-3">
                      <GraduationCap className="w-5 h-5" /> Assigned STAIR Path
                    </h4>
                    <div className="space-y-4">
                      {(() => { 
                        const studentLessons = myLessons.filter(l => l.assignedStudents?.includes('all') || l.assignedStudents?.includes(studentDetail.id)); 
                        return studentLessons.map(lesson => { 
                          const submission = submissions.find(s => s.studentId === studentDetail.id && s.lessonId === lesson.id); 
                          const isCompleted = submission?.status === 'reviewed'; 
                          const isPending = submission && !isCompleted; 
                          const isOverdue = lesson.deadline && !submission && new Date(lesson.deadline) < new Date(); 
                          return (
                            <div key={lesson.id} className="flex items-center justify-between p-6 bg-slate-50 rounded-3xl border border-slate-100 group hover:bg-white hover:border-cedar-primary/10 transition-all">
                              <div className="flex items-center gap-6">
                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${isCompleted ? 'bg-green-50 text-green-500' : isOverdue ? 'bg-red-50 text-red-500' : 'bg-white text-slate-400 shadow-sm'}`}>
                                  {lesson.type === 'video' ? <PlayCircle className="w-6 h-6" /> : lesson.type === 'activity' ? <ClipboardList className="w-6 h-6" /> : <BookOpen className="w-6 h-6" />}
                                </div>
                                <div>
                                  <p className="font-bold text-slate-800 text-sm">{lesson.title}</p>
                                  <p className="text-[10px] text-slate-400 uppercase tracking-widest font-black mt-1">Week {lesson.weekNumber}</p>
                                </div>
                              </div>
                              <div className={`px-5 py-2.5 rounded-2xl text-[9px] font-black uppercase tracking-widest ${isCompleted ? 'bg-green-500 text-white shadow-lg shadow-green-500/20' : isPending ? 'bg-amber-500 text-white animate-pulse shadow-lg shadow-amber-500/20' : isOverdue ? 'bg-red-500 text-white shadow-lg shadow-red-500/20' : 'bg-slate-200 text-slate-400'}`}>
                                {isCompleted ? 'Completed' : isPending ? 'Pending' : isOverdue ? 'Overdue' : 'Not Started'}
                              </div>
                            </div>
                          ); 
                        }); 
                      })()}
                    </div>
                 </div>
              </motion.div>
           </div>
        )}

        {lessonModal && (
          <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-md z-[400] flex items-center justify-center p-4 md:p-6">
             <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white rounded-[2rem] md:rounded-[4rem] w-full max-w-4xl p-8 md:p-12 lg:p-16 shadow-2xl relative max-h-[90vh] overflow-y-auto custom-scrollbar">
                <button onClick={() => setLessonModal(null)} className="absolute top-6 right-6 md:top-10 md:right-10 p-3 text-slate-300 hover:text-slate-600 transition-colors"><X className="w-6 h-6 md:w-8 md:h-8" /></button>
                <div className="mb-10 md:mb-12"><h3 className="text-3xl md:text-4xl font-serif text-slate-800 italic">{lessonModal.mode === 'create' ? 'Create STAIR Step' : 'Refine Journey Step'}</h3><p className="text-slate-400 font-medium mt-2">Design an impactful learning experience for your students.</p></div>
                <form onSubmit={lessonModal.mode === 'create' ? handleCreateLessson : handleUpdateLesson} className="space-y-12">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                      <div className="space-y-4"><label className="text-xs font-black uppercase text-slate-400 tracking-widest ml-1">Step Title</label><input required placeholder="e.g., The Forest Rhythm" value={lessonForm.title} onChange={e => setLessonForm({...lessonForm, title: e.target.value})} className="w-full bg-slate-50 border border-slate-100 rounded-3xl px-8 py-5 text-sm font-medium outline-none focus:ring-4 focus:ring-cedar-primary/5 transition-all" /></div>
                      <div className="space-y-4">
                        <label className="text-xs font-black uppercase text-slate-400 tracking-widest ml-1">Style</label>
                        <div className="grid grid-cols-3 gap-3">
                           <button type="button" onClick={() => setLessonForm({...lessonForm, type: 'video'})} className={`py-4 rounded-2xl flex flex-col items-center gap-2 border transition-all ${lessonForm.type === 'video' ? 'bg-cedar-primary text-white border-cedar-primary shadow-lg' : 'bg-slate-50 text-slate-400 border-slate-100 hover:bg-slate-100'}`}><PlayCircle className="w-5 h-5" /><span className="text-[10px] font-black uppercase tracking-widest">Video</span></button>
                           <button type="button" onClick={() => setLessonForm({...lessonForm, type: 'activity'})} className={`py-4 rounded-2xl flex flex-col items-center gap-2 border transition-all ${lessonForm.type === 'activity' ? 'bg-cedar-primary text-white border-cedar-primary shadow-lg' : 'bg-slate-50 text-slate-400 border-slate-100 hover:bg-slate-100'}`}><ClipboardList className="w-5 h-5" /><span className="text-[10px] font-black uppercase tracking-widest">Reading</span></button>
                           <button type="button" onClick={() => setLessonForm({...lessonForm, type: 'text'})} className={`py-4 rounded-2xl flex flex-col items-center gap-2 border transition-all ${lessonForm.type === 'text' ? 'bg-cedar-primary text-white border-cedar-primary shadow-lg' : 'bg-slate-50 text-slate-400 border-slate-100 hover:bg-slate-100'}`}><Type className="w-5 h-5" /><span className="text-[10px] font-black uppercase tracking-widest">Task</span></button>
                        </div>

                        {lessonForm.type === 'video' && (
                           <div className="mt-8 space-y-4 animate-in fade-in slide-in-from-top-4 duration-300">
                              {!lessonForm.videoUrl ? (
                                 <button 
                                   type="button" 
                                   onClick={() => setLessonForm({...lessonForm, videoUrl: " "})}
                                   className="w-full py-10 border-2 border-dashed border-slate-200 rounded-[2rem] flex flex-col items-center justify-center hover:border-cedar-primary hover:bg-cedar-primary/5 transition-all text-slate-400 hover:text-cedar-primary group"
                                 >
                                    <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center mb-2 group-hover:scale-110 transition-all"><Plus className="w-5 h-5" /></div>
                                    <span className="text-[10px] font-black uppercase tracking-widest">Attach Video URL</span>
                                 </button>
                              ) : (
                                 <div className="space-y-4 bg-slate-50/50 p-6 rounded-[2.5rem] border border-slate-100">
                                    <div className="flex items-center justify-between px-1">
                                       <h4 className="text-[9px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-2"><PlayCircle className="w-3.5 h-3.5" /> Primary Video</h4>
                                       <button type="button" onClick={() => setLessonForm({...lessonForm, videoUrl: ""})} className="text-[9px] font-black uppercase text-red-400 hover:underline">Remove</button>
                                    </div>
                                    <div className="relative group">
                                       <LinkIcon className={`absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 ${lessonForm.videoUrl.trim() ? 'text-cedar-primary' : 'text-slate-300'}`} />
                                       <input 
                                         placeholder="Paste YouTube or Vimeo URL here..." 
                                         value={lessonForm.videoUrl.trim()} 
                                         onChange={e => setLessonForm({...lessonForm, videoUrl: e.target.value})} 
                                         className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl text-xs font-bold outline-none focus:border-cedar-primary transition-all shadow-sm" 
                                       />
                                    </div>
                                    
                                    {lessonForm.videoUrl.trim() && (
                                       <div className="aspect-video bg-slate-900 rounded-2xl overflow-hidden shadow-xl border-4 border-white relative">
                                          {(() => {
                                             const url = lessonForm.videoUrl.trim();
                                             let embedUrl = url;
                                             if (url.includes('youtube.com') || url.includes('youtu.be')) {
                                               const videoId = url.includes('v=') ? url.split('v=')[1]?.split('&')[0] : url.split('youtu.be/')[1]?.split('?')[0];
                                               embedUrl = videoId ? `https://www.youtube.com/embed/${videoId}` : url;
                                             } else if (url.includes('vimeo.com')) {
                                               const vimeoId = url.split('/').pop()?.split('?')[0];
                                               embedUrl = vimeoId ? `https://player.vimeo.com/video/${vimeoId}` : url;
                                             }
                                             return <iframe className="w-full h-full" src={embedUrl} allowFullScreen />;
                                          })()}
                                       </div>
                                    )}
                                 </div>
                              )}
                           </div>
                        )}
                      </div>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-8 bg-slate-50/50 p-8 rounded-[3rem] border border-slate-100">
                        <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] flex items-center gap-2 mb-2"><Calendar className="w-4 h-4" /> Phase Organization</h4>
                        <div className="grid grid-cols-1 gap-6">
                           <div className="space-y-4"><label className="text-xs font-black uppercase text-slate-400 tracking-widest ml-1">Week Number</label><input type="number" min="1" value={lessonForm.weekNumber} onChange={e => setLessonForm({...lessonForm, weekNumber: parseInt(e.target.value)})} className="w-full bg-white border border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold text-cedar-primary focus:ring-4 focus:ring-cedar-primary/5 transition-all outline-none" /></div>
                           <div className="space-y-4"><label className="text-xs font-black uppercase text-slate-400 tracking-widest ml-1">Week Title</label><input placeholder="e.g., Finding Safety..." value={lessonForm.weekTitle} onChange={e => setLessonForm({...lessonForm, weekTitle: e.target.value})} className="w-full bg-white border border-slate-100 rounded-2xl px-6 py-4 text-sm font-medium focus:ring-4 focus:ring-cedar-primary/5 transition-all outline-none" /></div>
                        </div>
                      </div>

                      <div className="space-y-8 bg-slate-50/50 p-8 rounded-[3rem] border border-slate-100">
                        <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] flex items-center gap-2 mb-2"><ShieldCheck className="w-4 h-4" /> Visibility & Access</h4>
                        <div className="space-y-6">
                           <div className="flex p-1 bg-white border border-slate-100 rounded-2xl">
                              <button type="button" onClick={() => setLessonForm({...lessonForm, assignedStudents: ['all']})} className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${lessonForm.assignedStudents.includes('all') ? 'bg-cedar-primary text-white shadow-lg' : 'text-slate-400'}`}>Entire Community</button>
                              <button type="button" onClick={() => setLessonForm({...lessonForm, assignedStudents: []})} className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${!lessonForm.assignedStudents.includes('all') ? 'bg-cedar-primary text-white shadow-lg' : 'text-slate-400'}`}>Specific Students</button>
                           </div>
                           
                           {!lessonForm.assignedStudents.includes('all') && (
                             <div className="space-y-3 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
                                {myStudents.map(st => (
                                  <label key={st.id} className="flex items-center gap-3 p-3 bg-white rounded-xl border border-slate-50 cursor-pointer hover:border-cedar-primary/20 transition-all">
                                     <input type="checkbox" checked={lessonForm.assignedStudents.includes(st.id)} onChange={() => toggleStudentAssignment(st.id)} className="w-4 h-4 accent-cedar-primary" />
                                     <span className="text-[10px] font-bold text-slate-700">{st.name}</span>
                                  </label>
                                ))}
                             </div>
                           )}
                        </div>
                      </div>
                   </div>
                   

                    
                    <div className="space-y-4"><label className="text-xs font-black uppercase text-slate-400 tracking-widest ml-1">Guiding Content</label><textarea required rows={4} placeholder="Description..." value={lessonForm.content} onChange={e => setLessonForm({...lessonForm, content: e.target.value})} className="w-full bg-slate-50 border border-slate-100 rounded-[2.5rem] px-8 py-8 text-sm font-medium outline-none focus:ring-4 focus:ring-cedar-primary/5 transition-all resize-none" /></div>
                   
                   <div className="space-y-8">
                      <div className="flex items-center justify-between px-1"><h4 className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] flex items-center gap-2"><LinkIcon className="w-4 h-4" /> External Resources</h4><button type="button" onClick={() => setLessonForm({...lessonForm, mediaUrls: [...lessonForm.mediaUrls, ""]})} className="text-[10px] font-black uppercase text-cedar-primary flex items-center gap-1 hover:underline"><Plus className="w-3 h-3" /> Add Link</button></div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {lessonForm.mediaUrls.map((url, idx) => (
                           <div key={idx} className="flex gap-2">
                             <input placeholder="https://..." value={url} onChange={e => { const newUrls = [...lessonForm.mediaUrls]; newUrls[idx] = e.target.value; setLessonForm({...lessonForm, mediaUrls: newUrls}); }} className="flex-1 bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-xs outline-none" />
                             {lessonForm.mediaUrls.length > 1 && <button type="button" onClick={() => setLessonForm({...lessonForm, mediaUrls: lessonForm.mediaUrls.filter((_, i) => i !== idx)})} className="p-4 text-red-300 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>}
                           </div>
                        ))}
                      </div>
                   </div>

                   <div className="space-y-8">
                      <div className="flex items-center justify-between px-1">
                        <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] flex items-center gap-2">
                          <Paperclip className="w-4 h-4" /> File Attachments
                        </h4>
                      </div>
                      
                      <div className="bg-slate-50/50 p-10 rounded-[3rem] border border-slate-100">
                        <div className="space-y-6">
                          {lessonForm.fileUrls.length > 0 && (
                            <div className="flex flex-wrap gap-3 mb-6">
                              {lessonForm.fileUrls.map((url, i) => (
                                <div key={i} className="flex items-center gap-3 bg-white border border-slate-100 pl-4 pr-2 py-2 rounded-xl text-[10px] font-bold text-slate-600 shadow-sm group/item">
                                   <FileText className="w-4 h-4 text-cedar-primary" />
                                   <span className="truncate max-w-[150px]">Artifact {i+1}</span>
                                   <button type="button" onClick={() => setLessonForm({...lessonForm, fileUrls: lessonForm.fileUrls.filter((_, idx) => idx !== i)})} className="p-1.5 hover:bg-red-50 hover:text-red-500 rounded-lg transition-all">
                                     <X className="w-4 h-4" />
                                   </button>
                                </div>
                              ))}
                            </div>
                          )}
                          
                          <div className="relative group">
                             <div className="w-full h-40 border-2 border-dashed border-slate-200 rounded-[2.5rem] flex flex-col items-center justify-center hover:border-cedar-primary hover:bg-cedar-primary/5 transition-all cursor-pointer bg-white/50 shadow-inner">
                                <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                   <FileUp className="w-6 h-6 text-slate-400 group-hover:text-cedar-primary" />
                                </div>
                                <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Upload Device Artifacts</p>
                                <p className="text-[9px] text-slate-300 mt-1 uppercase font-bold tracking-tight">PDF, Doc, Image or Video</p>
                             </div>
                             <input 
                               type="file" 
                               multiple
                               className="absolute inset-0 opacity-0 cursor-pointer" 
                               onChange={async (e) => {
                                  const files = e.target.files;
                                  if (!files) return;
                                  
                                  const newUrls = [...lessonForm.fileUrls];
                                  for (let i = 0; i < files.length; i++) {
                                    const data = new FormData();
                                    data.append('file', files[i]);
                                    try {
                                      const res = await fetch('/api/upload', { method: 'POST', body: data });
                                      const { url } = await res.json();
                                      newUrls.push(url);
                                    } catch (err) {
                                      console.error("Upload failed", err);
                                    }
                                  }
                                  setLessonForm({...lessonForm, fileUrls: newUrls});
                               }}
                             />
                          </div>
                        </div>
                      </div>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                      <div className="space-y-4"><label className="text-xs font-black uppercase text-slate-400 tracking-widest ml-1">Release Date</label><input type="datetime-local" onClick={(e) => (e.target as any).showPicker?.()} value={lessonForm.releaseDate} onChange={e => setLessonForm({...lessonForm, releaseDate: e.target.value})} className="w-full bg-slate-50 border border-slate-100 rounded-3xl px-8 py-5 text-sm outline-none cursor-pointer" /></div>
                      <div className="space-y-4"><label className="text-xs font-black uppercase text-slate-400 tracking-widest ml-1">Deadline</label><input type="datetime-local" onClick={(e) => (e.target as any).showPicker?.()} value={lessonForm.deadline} onChange={e => setLessonForm({...lessonForm, deadline: e.target.value})} className="w-full bg-slate-50 border border-slate-100 rounded-3xl px-8 py-5 text-sm outline-none cursor-pointer" /></div>
                   </div>

                   <button type="submit" className="w-full bg-cedar-primary text-white py-5 md:py-8 rounded-2xl md:rounded-[3rem] text-lg md:text-xl font-bold shadow-2xl hover:scale-[1.01] transition-all">Launch Journey Step</button>
                </form>
             </motion.div>
          </div>
        )}

        {submissionModal && (
          <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-[400] flex items-center justify-center p-6">
             <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white rounded-[4rem] w-full max-w-3xl p-12 shadow-2xl relative max-h-[90vh] overflow-y-auto custom-scrollbar">
                <button onClick={() => setSubmissionModal(null)} className="absolute top-10 right-10 p-3 text-slate-300 hover:text-slate-600 transition-colors"><X className="w-6 h-6" /></button>
                <div className="flex items-center gap-6 mb-10"><div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center font-bold text-2xl text-slate-400">{users.find(u => u.id === submissionModal.studentId)?.name[0]}</div><div><h3 className="text-3xl font-serif text-slate-800 italic">{users.find(u => u.id === submissionModal.studentId)?.name}</h3><p className="text-slate-400 font-medium tracking-tight">Step: {lessons.find(l => l.id === submissionModal.lessonId)?.title}</p></div></div>
                
                <div className="space-y-8 mb-10">
                   <div className="bg-slate-50 rounded-[2.5rem] p-10 border border-slate-100">
                      <p className="text-slate-600 font-medium whitespace-pre-wrap leading-relaxed">{submissionModal.content}</p>
                   </div>

                   {((submissionModal.links?.length ?? 0) > 0 || (submissionModal.fileUrls?.length ?? 0) > 0) && (
                     <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase text-cedar-primary tracking-[0.3em] ml-2">Submitted Artifacts</label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                           {submissionModal.links?.filter(l => l.trim()).map((l, i) => (
                             <a key={i} href={l} target="_blank" className="flex items-center justify-between px-6 py-4 bg-white rounded-2xl text-[10px] font-black uppercase tracking-widest text-cedar-primary border border-cedar-aqua/20 hover:bg-cedar-primary hover:text-white transition-all group">
                                <span className="flex items-center gap-3"><LinkIcon className="w-4 h-4" /> Link Artifact #{i+1}</span>
                                <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                             </a>
                           ))}
                           {submissionModal.fileUrls?.filter(url => url.trim()).map((url, i) => (
                             <a key={i} href={url} target="_blank" className="flex items-center justify-between px-6 py-4 bg-cedar-primary text-white rounded-2xl text-[10px] font-black uppercase tracking-widest border border-transparent shadow-lg shadow-cedar-primary/10 hover:translate-y-[-2px] transition-all group">
                                <span className="flex items-center gap-3"><Paperclip className="w-4 h-4" /> File Artifact #{i+1}</span>
                                <ExternalLink className="w-4 h-4" />
                             </a>
                           ))}
                        </div>
                     </div>
                   )}
                </div>

                <div className="flex gap-4"><button onClick={() => setRewardModal({ submissionId: submissionModal.id })} className="flex-1 bg-cedar-primary text-white py-5 rounded-[2rem] font-bold text-lg shadow-xl shadow-cedar-primary/20 hover:scale-105 transition-all">{submissionModal.status === 'reviewed' ? 'Refine Review' : 'Award Stars'}</button><button onClick={() => setSubmissionModal(null)} className="px-10 py-5 text-slate-400 font-bold hover:text-slate-600 transition-colors uppercase tracking-widest text-xs">Back</button></div>
             </motion.div>
          </div>
        )}

        {rewardModal && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-[500] flex items-center justify-center p-6">
             <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white rounded-[4rem] w-full max-w-lg p-12 shadow-2xl relative border-4 border-yellow-400/20">
                <div className="w-24 h-24 bg-yellow-50 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner"><Star className="w-12 h-12 text-yellow-500 fill-yellow-500 animate-pulse" /></div>
                <form onSubmit={(e) => { e.preventDefault(); const target = e.target as any; handleReward(rewardModal.submissionId, parseInt(target.stars.value), target.feedback.value); }} className="space-y-8"><div className="space-y-2"><label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Stars</label><input name="stars" required type="number" defaultValue={submissions.find(sub => sub.id === rewardModal.submissionId)?.rewardStars || 10} className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-xl font-bold text-center text-yellow-600 focus:outline-none focus:ring-4 focus:ring-yellow-100 transition-all shadow-inner" /></div><div className="space-y-2"><label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Feedback</label><textarea name="feedback" required rows={4} defaultValue={submissions.find(sub => sub.id === rewardModal.submissionId)?.feedback || ""} placeholder="Thoughts..." className="w-full bg-slate-50 border border-slate-100 rounded-3xl px-6 py-5 text-sm focus:outline-none focus:ring-4 focus:ring-cedar-primary/5 transition-all resize-none shadow-inner" /></div><div className="flex gap-4"><button type="submit" className="flex-1 bg-yellow-500 text-white py-5 rounded-[2rem] font-bold text-lg shadow-xl">Send Celebration</button><button type="button" onClick={() => setRewardModal(null)} className="px-8 py-5 text-slate-400 font-bold hover:text-slate-600 transition-colors uppercase tracking-widest text-[10px]">Wait</button></div></form>
             </motion.div>
          </div>
        )}
      </div>
    </div>
    </RoleGuard>
  );
}

export default function EducatorDashboard() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-cedar-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-6">
           <img src="https://cedarcentre.ca/wp-content/uploads/2023/07/cedar-logo1.svg" className="h-16 animate-pulse" alt="Logo" />
           <p className="text-slate-400 font-serif italic animate-pulse">Preparing the portal...</p>
        </div>
      </div>
    }>
      <EducatorDashboardContent />
    </Suspense>
  );
}
