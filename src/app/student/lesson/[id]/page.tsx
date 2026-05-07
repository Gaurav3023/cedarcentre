"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useAuth, Lesson } from "@/context/AuthContext";
import { ArrowLeft, PlayCircle, FileText, CheckCircle, Clock, Heart, Sparkles, BookOpen, Send, FileUp, Link as LinkIcon, Plus, X, Star, FileCheck, ExternalLink } from "lucide-react";
import Link from "next/link";
import RoleGuard from "@/components/RoleGuard";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function LessonDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user, lessons, submissions, submitWork, markLessonAsRead } = useAuth();
  
  const [workText, setWorkText] = useState("");
  const [links, setLinks] = useState<string[]>([""]);
  const [fileUrls, setFileUrls] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const lesson = lessons.find(l => l.id === id);
  const mySubmission = submissions.find(s => s.lessonId === id && s.studentId === user?.id);

  const handleAddLink = () => setLinks([...links, ""]);
  const handleRemoveLink = (idx: number) => setLinks(links.filter((_, i) => i !== idx));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    submitWork(id as string, workText, fileUrls, links.filter(l => l.trim() !== ""));
    setSubmitting(false);
  };

  useEffect(() => {
    if (id) markLessonAsRead(id as string);
  }, [id, markLessonAsRead]);

  if (!lesson) return null;

  const isLate = lesson.deadline ? new Date() > new Date(lesson.deadline) : false;
  const isDueSoon = lesson.deadline && !mySubmission && !isLate && (new Date(lesson.deadline).getTime() - new Date().getTime()) < 24 * 60 * 60 * 1000;

  return (
    <RoleGuard allowedRoles="student">
    <div className="min-h-screen bg-cedar-background pb-20">
      <header className="px-4 md:px-12 py-4 md:py-6 bg-white/60 backdrop-blur-xl border-b border-white/40 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <Link href="/student" className="flex items-center gap-3 text-slate-400 hover:text-cedar-primary transition-colors font-bold text-xs uppercase tracking-widest">
            <ArrowLeft className="w-5 h-5" /> Home
          </Link>
          <div className={`flex items-center gap-3 px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest ${mySubmission ? 'bg-green-100 text-green-600' : isDueSoon ? 'bg-amber-100 text-amber-600' : 'bg-cedar-aqua/20 text-cedar-primary'}`}>
             {mySubmission ? <CheckCircle className="w-3 h-3" /> : isDueSoon ? <Clock className="w-3 h-3" /> : <Sparkles className="w-3 h-3" />}
             <span>{mySubmission ? 'Step Completed' : isDueSoon ? 'Due Soon' : 'Active Journey Step'}</span>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 md:px-8 pt-10 md:pt-20">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-16">
           <div className="bg-white p-8 md:p-16 lg:p-24 rounded-[2rem] md:rounded-[4rem] shadow-premium relative overflow-hidden border border-slate-50">
              <div className="flex justify-between items-start mb-10">
                 <span className="px-5 py-2 bg-cedar-aqua/20 text-cedar-primary rounded-full text-[10px] font-black uppercase tracking-widest">{lesson.type}</span>
                 {lesson.deadline && (
                    <div className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest ${isLate ? 'text-red-500' : 'text-slate-400'}`}>
                       <Clock className="w-4 h-4" /> Due: {new Date(lesson.deadline).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                    </div>
                 )}
              </div>

              <h1 className="text-3xl md:text-5xl lg:text-7xl font-serif text-slate-800 leading-[1.1] mb-8 md:mb-12">{lesson.title}</h1>

                {(() => {
                  const urls = lesson.resourceLinks || [];
                  const videoUrl = lesson.videoUrl || "";
                  const mainUrl = videoUrl || urls[0] || "";
                  let embedUrl = mainUrl;
                  
                  if (mainUrl.includes('youtube.com') || mainUrl.includes('youtu.be')) {
                    let videoId = "";
                    if (mainUrl.includes('v=')) {
                      videoId = mainUrl.split('v=')[1].split('&')[0];
                    } else if (mainUrl.includes('youtu.be/')) {
                      videoId = mainUrl.split('youtu.be/')[1].split('?')[0];
                    } else if (mainUrl.includes('embed/')) {
                      videoId = mainUrl.split('embed/')[1].split('?')[0];
                    }
                    embedUrl = videoId ? `https://www.youtube.com/embed/${videoId}` : mainUrl;
                  } else if (mainUrl.includes('vimeo.com')) {
                    const vimeoId = mainUrl.split('/').pop()?.split('?')[0];
                    embedUrl = vimeoId ? `https://player.vimeo.com/video/${vimeoId}` : mainUrl;
                  }

                  const isVideo = mainUrl.includes('youtube.com') || mainUrl.includes('youtu.be') || mainUrl.includes('vimeo.com');

                  return (
                    <>
                      {isVideo && (
                        <div className="aspect-video bg-slate-900 rounded-[1.5rem] md:rounded-[3.5rem] shadow-2xl mb-12 md:mb-16 overflow-hidden relative border-4 md:border-8 border-slate-800">
                           <iframe 
                             className="w-full h-full"
                             src={embedUrl}
                             allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                             allowFullScreen
                           />
                        </div>
                      )}
                      
                      <div className="prose prose-slate prose-xl max-w-none text-slate-600 leading-relaxed font-medium">
                         {lesson.content.split('\n').map((p, i) => p.trim() && <p key={i} className="mb-8">{p}</p>)}
                      </div>

                      {(urls.length > 0 || (lesson.fileUrls && lesson.fileUrls.length > 0)) && (
                        <div className="mt-16 space-y-12">
                          {urls.length > 0 && (
                            <div className="space-y-4">
                              <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 ml-4">External Resources</h4>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {urls.map((url, i) => (
                                  <a key={i} href={url} target="_blank" className="p-8 bg-white rounded-[2.5rem] border border-slate-100 flex items-center justify-between gap-6 group hover:border-cedar-primary transition-all shadow-sm">
                                    <div className="flex items-center gap-5">
                                        <div className="w-12 h-12 bg-cedar-aqua/10 rounded-2xl flex items-center justify-center text-cedar-primary group-hover:bg-cedar-primary group-hover:text-white transition-all">
                                          <LinkIcon className="w-6 h-6" />
                                        </div>
                                        <div className="flex flex-col">
                                          <span className="text-sm font-bold text-slate-700">Web Resource #{i+1}</span>
                                          <span className="text-[10px] text-slate-400 truncate max-w-[150px]">{url.replace('https://', '').replace('www.', '')}</span>
                                        </div>
                                    </div>
                                    <ExternalLink className="w-5 h-5 text-slate-300 group-hover:text-cedar-primary transition-colors" />
                                  </a>
                                ))}
                              </div>
                            </div>
                          )}

                          {lesson.fileUrls && lesson.fileUrls.length > 0 && (
                            <div className="space-y-4">
                              <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 ml-4">Learning Artifacts</h4>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {lesson.fileUrls.map((url, i) => (
                                  <a key={i} href={url} target="_blank" className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 flex items-center justify-between gap-6 group hover:border-cedar-primary transition-all">
                                    <div className="flex items-center gap-5">
                                        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm text-cedar-primary group-hover:bg-cedar-primary group-hover:text-white transition-all">
                                          <FileText className="w-6 h-6" />
                                        </div>
                                        <span className="text-sm font-bold text-slate-700">Document Artifact #{i+1}</span>
                                    </div>
                                    <span className="text-[10px] font-black uppercase text-cedar-primary hover:underline">View</span>
                                  </a>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </>
                  );
               })()}
           </div>

           <div className="bg-white p-8 md:p-16 lg:p-24 rounded-[2rem] md:rounded-[4rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.05)] relative border border-slate-50 overflow-hidden">
              <div className="flex items-center gap-8 mb-16">
                 <div className="w-20 h-20 bg-cedar-aqua/10 rounded-[2.5rem] flex items-center justify-center text-cedar-primary shadow-inner">
                    <FileUp className="w-10 h-10" />
                 </div>
                 <div>
                    <h2 className="text-5xl font-serif text-slate-800 tracking-tight">Your Reflection</h2>
                    <p className="text-slate-400 font-medium mt-1 text-lg">Deepen your journey through mindful submission.</p>
                 </div>
              </div>

              {mySubmission ? (
                <motion.div initial={{ scale: 0.98, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="p-8 md:p-16 bg-cedar-aqua/5 rounded-[2rem] md:rounded-[4rem] border border-cedar-aqua/10 backdrop-blur-sm">
                   <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-10 md:mb-12 border-b border-cedar-aqua/10 pb-10 md:pb-12">
                      <div className="flex items-center gap-5 text-cedar-primary font-bold text-xl md:text-2xl">
                         <div className="w-12 h-12 md:w-14 md:h-14 bg-cedar-primary text-white rounded-xl md:rounded-2xl flex items-center justify-center shadow-lg shadow-cedar-primary/20">
                            <CheckCircle className="w-6 h-6 md:w-8 md:h-8" />
                         </div>
                         <div className="flex flex-col">
                            <span className="leading-none">Step Finalized</span>
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60 mt-1">Journey Entry Recorded</span>
                         </div>
                      </div>
                      {mySubmission.status === 'reviewed' ? (
                        <div className="flex items-center gap-4 md:gap-5 px-6 md:px-10 py-4 md:py-5 bg-white rounded-2xl md:rounded-[2rem] shadow-premium border border-yellow-100">
                           <div className="w-10 h-10 md:w-12 md:h-12 bg-yellow-400 rounded-xl flex items-center justify-center text-white">
                              <Star className="w-5 h-5 md:w-6 md:h-6 fill-current" />
                           </div>
                           <div className="flex flex-col">
                              <span className="font-bold text-slate-800 text-lg md:text-xl">Reward Claimed</span>
                              <span className="text-[10px] font-black uppercase tracking-widest text-yellow-600">{mySubmission.rewardStars} Growth Stars Earned</span>
                           </div>
                        </div>
                      ) : (
                        <div className="px-6 py-3 md:px-8 md:py-4 bg-white/80 rounded-2xl md:rounded-[2rem] text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 border border-slate-100 flex items-center gap-3">
                           <Clock className="w-4 h-4" /> Awaiting Educator Feedback
                        </div>
                      )}
                   </div>

                   <div className="space-y-8 md:space-y-10">
                      {mySubmission.feedback && (
                        <div className="p-6 md:p-10 bg-white rounded-[1.5rem] md:rounded-[3rem] border border-cedar-primary/10 shadow-sm relative">
                           <span className="absolute -top-3 left-6 md:-top-4 md:left-10 px-3 md:px-4 py-1 bg-cedar-primary text-white text-[7px] md:text-[8px] font-black uppercase tracking-widest rounded-full">Guide&apos;s Voice</span>
                           <p className="text-slate-700 italic leading-relaxed text-lg md:text-xl">&quot;{mySubmission.feedback}&quot;</p>
                        </div>
                      )}
                      
                      <div className="space-y-6">
                         <label className="text-[10px] font-black uppercase text-cedar-primary tracking-[0.3em] ml-2">My Insight</label>
                         <div className="p-8 md:p-12 bg-white/80 rounded-[1.5rem] md:rounded-[3rem] shadow-inner border border-white italic text-slate-600 text-base md:text-lg leading-relaxed relative">
                            <span className="absolute -top-3 md:-top-4 -left-1 md:-left-2 text-5xl md:text-7xl text-cedar-aqua/20 font-serif opacity-30 px-3">&quot;</span>
                            {mySubmission.content}
                         </div>
                      </div>

                      {((mySubmission.links?.length ?? 0) > 0 || (mySubmission.fileUrls?.length ?? 0) > 0) && (
                        <div className="pt-6 space-y-4">
                           <label className="text-[10px] font-black uppercase text-cedar-primary tracking-[0.3em] ml-2">Submitted Artifacts</label>
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {mySubmission.links?.map((l, i) => (
                                <a key={i} href={l} target="_blank" className="flex items-center justify-between px-8 py-5 bg-white rounded-2xl text-[10px] font-black uppercase tracking-widest text-cedar-primary border border-cedar-aqua/20 hover:bg-cedar-primary hover:text-white transition-all group">
                                   <span className="flex items-center gap-3"><LinkIcon className="w-4 h-4" /> Link #{i+1}</span>
                                   <ArrowLeft className="w-4 h-4 rotate-180 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </a>
                              ))}
                              {mySubmission.fileUrls?.map((url, i) => (
                                <a key={i} href={url} target="_blank" className="flex items-center justify-between px-8 py-5 bg-cedar-primary text-white rounded-2xl text-[10px] font-black uppercase tracking-widest border border-transparent shadow-lg shadow-cedar-primary/10 hover:translate-y-[-2px] transition-all group">
                                   <span className="flex items-center gap-3"><FileCheck className="w-4 h-4" /> File Artifact #{i+1}</span>
                                   <ArrowLeft className="w-4 h-4 rotate-180" />
                                </a>
                              ))}
                           </div>
                        </div>
                      )}
                   </div>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-16">
                   <div className="space-y-6 group">
                      <div className="flex justify-between items-end px-2">
                         <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 group-focus-within:text-cedar-primary transition-colors">Digital Insight Journal</label>
                         <span className="text-[10px] font-bold text-slate-300">Share your path&hellip;</span>
                      </div>
                      <textarea 
                        required
                        value={workText}
                        onChange={(e) => setWorkText(e.target.value)}
                        className="w-full min-h-[250px] md:min-h-[350px] p-8 md:p-12 bg-slate-50/50 border-2 border-slate-100 rounded-[2rem] md:rounded-[3rem] text-lg md:text-xl leading-relaxed outline-none focus:bg-white focus:border-cedar-aqua/30 focus:ring-[15px] focus:ring-cedar-aqua/5 transition-all shadow-inner resize-none placeholder:text-slate-300 font-serif" 
                        placeholder="I learned that..." 
                      />
                   </div>

                   <div className="space-y-8">
                      <div className="flex justify-between items-end px-2">
                         <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Artifact Collection</label>
                         <span className="text-[10px] font-bold text-slate-300">Links & Digital Proof&hellip;</span>
                      </div>
                      <div className="bg-slate-50/50 p-6 md:p-10 rounded-[2rem] md:rounded-[4rem] border-2 border-slate-100 grid lg:grid-cols-2 gap-8 md:gap-10">
                         <div className="space-y-6">
                            <h4 className="text-xs font-bold text-slate-400 ml-1">Links</h4>
                            <div className="space-y-3">
                               {links.map((link, idx) => (
                                 <div key={idx} className="flex gap-2">
                                    <div className="relative flex-1">
                                       <LinkIcon className={`absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 ${link ? 'text-cedar-primary' : 'text-slate-300'}`} />
                                       <input 
                                         type="url" 
                                         className="w-full pl-12 pr-4 py-4 bg-white border border-slate-100 rounded-2xl text-xs font-bold outline-none focus:border-cedar-aqua/30 transition-all placeholder:text-slate-200" 
                                         placeholder="https://..." 
                                         value={link}
                                         onChange={(e) => {
                                             const next = [...links];
                                             next[idx] = e.target.value;
                                             setLinks(next);
                                         }}
                                       />
                                    </div>
                                    {links.length > 1 && (
                                      <button type="button" onClick={() => handleRemoveLink(idx)} className="p-3 text-red-300 hover:text-red-500 rounded-xl transition-all"><X className="w-4 h-4" /></button>
                                    )}
                                 </div>
                               ))}
                               <button type="button" onClick={handleAddLink} className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-cedar-primary hover:underline ml-1">
                                  <Plus className="w-3 h-3" /> Add Another Link
                                </button>
                            </div>
                         </div>

                         <div className="space-y-6">
                            <h4 className="text-xs font-bold text-slate-400 ml-1">Evidence Artifacts</h4>
                            <div className="space-y-3">
                               <div className="flex flex-wrap gap-2">
                                 {fileUrls.map((url, i) => (
                                   <div key={i} className="flex items-center gap-2 bg-cedar-primary text-white px-4 py-2 rounded-xl text-[9px] font-black">
                                      <FileCheck className="w-3 h-3" /> Artifact {i+1}
                                      <button type="button" onClick={() => setFileUrls(fileUrls.filter((_, idx) => idx !== i))}><X className="w-3 h-3" /></button>
                                   </div>
                                 ))}
                               </div>
                               <div className="relative group">
                                  <div className="w-full h-32 border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center hover:border-cedar-primary hover:bg-cedar-primary/5 transition-all cursor-pointer">
                                     <FileUp className="w-8 h-8 text-slate-300 group-hover:text-cedar-primary" />
                                     <p className="text-[10px] font-black text-slate-400 mt-2">Upload Artifact</p>
                                  </div>
                                  <input 
                                    type="file" 
                                    className="absolute inset-0 opacity-0 cursor-pointer" 
                                    onChange={async (e) => {
                                       const file = e.target.files?.[0];
                                       if (!file) return;
                                       const data = new FormData();
                                       data.append('file', file);
                                       const res = await fetch('/api/upload', { method: 'POST', body: data });
                                       const { url } = await res.json();
                                       setFileUrls([...fileUrls, url]);
                                    }}
                                  />
                               </div>
                            </div>
                         </div>
                      </div>
                   </div>

                   <div className="pt-16 border-t border-slate-100 flex justify-center">
                      <button type="submit" disabled={submitting} className="group relative bg-cedar-primary px-8 md:px-24 py-6 md:py-8 rounded-[1.5rem] md:rounded-[2.5rem] shadow-[0_30px_60px_-15px_rgba(45,123,138,0.4)] hover:shadow-[0_40px_80px_-15px_rgba(45,123,138,0.6)] hover:translate-y-[-5px] active:translate-y-[2px] transition-all overflow-hidden w-full md:w-auto md:min-w-[400px]">
                         <div className="relative z-10 flex items-center justify-center gap-5 text-white font-serif text-2xl">
                            {submitting ? (
                              <span className="animate-pulse flex items-center gap-4"><Sparkles className="w-6 h-6 animate-spin" /> Recording Insight...</span>
                            ) : (
                              <><Send className="w-8 h-8 group-hover:translate-x-2 group-hover:translate-y-[-2px] transition-transform" /> Complete & Submit Step</>
                            )}
                         </div>
                      </button>
                   </div>
                </form>
              )}
           </div>
        </motion.div>
      </main>
    </div>
    </RoleGuard>
  );
}
