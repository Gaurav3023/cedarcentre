"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useAuth, Lesson } from "@/context/AuthContext";
import { ArrowLeft, PlayCircle, FileText, CheckCircle, Clock, Heart, Sparkles, BookOpen, Send, FileUp, Link as LinkIcon, Plus, X, Star, FileCheck, ExternalLink, ChevronLeft, ChevronRight } from "lucide-react";
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
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);

  const lesson = lessons.find(l => l.id === id);
  const mySubmission = submissions.find(s => s.lessonId === id && s.studentId === user?.id);

  const handleAddLink = () => setLinks([...links, ""]);
  const handleRemoveLink = (idx: number) => setLinks(links.filter((_, i) => i !== idx));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await submitWork(id as string, workText, fileUrls, links.filter(l => l.trim() !== ""));
    } catch (err) {
      console.error("Submission failed:", err);
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    if (id) markLessonAsRead(id as string);
  }, [id, markLessonAsRead]);

  if (!lesson) return (
    <RoleGuard allowedRoles="student">
      <div className="min-h-screen bg-cedar-background pb-20">
        <header className="px-8 md:px-12 py-6 bg-white/60 backdrop-blur-xl border-b border-white/40 sticky top-0 z-50">
          <div className="max-w-6xl mx-auto flex justify-between items-center">
            <Link href="/student" className="flex items-center gap-3 text-slate-400 hover:text-cedar-primary transition-colors font-bold text-xs uppercase tracking-widest">
              <ArrowLeft className="w-5 h-5" /> Home
            </Link>
          </div>
        </header>
        <main className="max-w-4xl mx-auto px-8 pt-20">
          <div className="space-y-8 animate-pulse">
            <div className="bg-white p-12 md:p-24 rounded-[4rem] shadow-premium border border-slate-50">
              <div className="h-4 w-24 bg-slate-100 rounded-full mb-10" />
              <div className="h-12 w-3/4 bg-slate-100 rounded-2xl mb-6" />
              <div className="h-8 w-1/2 bg-slate-100 rounded-2xl mb-16" />
              <div className="aspect-video bg-slate-100 rounded-[3rem] mb-12" />
              <div className="space-y-4">
                <div className="h-4 bg-slate-100 rounded-full" />
                <div className="h-4 bg-slate-100 rounded-full w-5/6" />
                <div className="h-4 bg-slate-100 rounded-full w-4/6" />
              </div>
            </div>
            <div className="bg-white p-12 md:p-24 rounded-[4rem] shadow-premium border border-slate-50">
              <div className="h-10 w-48 bg-slate-100 rounded-2xl mb-8" />
              <div className="h-16 w-full bg-slate-100 rounded-[2.5rem]" />
            </div>
          </div>
        </main>
      </div>
    </RoleGuard>
  );

  const isLate = lesson.deadline ? new Date() > new Date(lesson.deadline) : false;
  const isDueSoon = lesson.deadline && !mySubmission && !isLate && (new Date(lesson.deadline).getTime() - new Date().getTime()) < 24 * 60 * 60 * 1000;

  return (
    <RoleGuard allowedRoles="student">
    <div className="min-h-screen bg-cedar-background pb-20">
      <header className="px-8 md:px-12 py-6 bg-white/60 backdrop-blur-xl border-b border-white/40 sticky top-0 z-50">
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

      <main className="max-w-4xl mx-auto px-8 pt-20">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-16">
           <div className="bg-white p-12 md:p-24 rounded-[4rem] shadow-premium relative overflow-hidden border border-slate-50">
              <div className="flex justify-between items-start mb-10">
                 <span className="px-5 py-2 bg-cedar-aqua/20 text-cedar-primary rounded-full text-[10px] font-black uppercase tracking-widest">{lesson.type}</span>
                 {lesson.deadline && (
                    <div className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest ${isLate ? 'text-red-500' : 'text-slate-400'}`}>
                       <Clock className="w-4 h-4" /> Due: {new Date(lesson.deadline).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                    </div>
                 )}
              </div>

              <h1 className="text-5xl md:text-7xl font-serif text-slate-800 leading-[1.1] mb-12">{lesson.title}</h1>

                {(() => {
                  const urls = lesson.resourceLinks || [];
                  const videoUrls = (lesson.videoUrl || "").split(',').map(u => u.trim()).filter(Boolean);

                  const renderVideo = (url: string) => {
                    let embedUrl = url;
                    
                    // Robust YouTube ID extraction
                    const ytMatch = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/);
                    if (ytMatch && ytMatch[1]) {
                      embedUrl = `https://www.youtube.com/embed/${ytMatch[1]}`;
                    } else if (url.includes('vimeo.com')) {
                      const vimeoId = url.split('/').pop()?.split('?')[0];
                      embedUrl = vimeoId ? `https://player.vimeo.com/video/${vimeoId}` : url;
                    }

                    return (
                      <div key={url} className="aspect-video bg-slate-900 rounded-[3.5rem] shadow-2xl overflow-hidden relative border-8 border-slate-800">
                         <iframe 
                           className="w-full h-full"
                           src={embedUrl}
                           allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                           allowFullScreen
                         />
                      </div>
                    );
                  };

                  const handleViewFile = async (e: React.MouseEvent, url: string) => {
                    e.preventDefault();
                    if (url.startsWith('data:')) {
                      // Open window synchronously to avoid mobile popup blockers
                      const newWindow = window.open('', '_blank');
                      try {
                        // Convert data URL to Blob to safely open in a new tab (bypasses browser security blocks on data URIs)
                        const response = await fetch(url);
                        const blob = await response.blob();
                        const blobUrl = URL.createObjectURL(blob);
                        if (newWindow) {
                          newWindow.location.href = blobUrl;
                        } else {
                          window.open(blobUrl, '_blank');
                        }
                        // Clean up after 1 minute
                        setTimeout(() => URL.revokeObjectURL(blobUrl), 60000);
                      } catch (err) {
                        console.error("Error viewing file", err);
                        if (newWindow) newWindow.close();
                      }
                    } else {
                      window.open(url, '_blank');
                    }
                  };

                  const handleDownloadFile = async (e: React.MouseEvent, url: string, fileName: string) => {
                    e.preventDefault();
                    if (url.startsWith('data:')) {
                      try {
                        const response = await fetch(url);
                        const originalBlob = await response.blob();
                        // Force download by overriding the MIME type
                        const blob = new Blob([originalBlob], { type: 'application/octet-stream' });
                        const blobUrl = URL.createObjectURL(blob);
                        
                        const a = document.createElement('a');
                        a.style.display = 'none';
                        a.href = blobUrl;
                        a.download = fileName;
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                        
                        setTimeout(() => URL.revokeObjectURL(blobUrl), 60000);
                      } catch (err) {
                        console.error("Error downloading file", err);
                      }
                    } else {
                      try {
                        // For regular URLs on mobile, fetching it as a blob and forcing octet-stream is the most reliable way to prevent opening in a new tab
                        const response = await fetch(url);
                        const originalBlob = await response.blob();
                        const blob = new Blob([originalBlob], { type: 'application/octet-stream' });
                        const blobUrl = URL.createObjectURL(blob);
                        
                        const a = document.createElement('a');
                        a.style.display = 'none';
                        a.href = blobUrl;
                        a.download = fileName;
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                        
                        setTimeout(() => URL.revokeObjectURL(blobUrl), 60000);
                      } catch (err) {
                        // Fallback if fetch fails (e.g. CORS)
                        const a = document.createElement('a');
                        a.style.display = 'none';
                        a.href = url;
                        a.download = fileName;
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                      }
                    }
                  };

                  return (
                    <>
                      {videoUrls.length > 0 && (
                        <div className="mb-16 relative group">
                          {renderVideo(videoUrls[currentVideoIndex])}
                          
                          {videoUrls.length > 1 && (
                            <>
                              <button 
                                onClick={() => setCurrentVideoIndex(prev => (prev === 0 ? videoUrls.length - 1 : prev - 1))}
                                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 backdrop-blur text-slate-800 rounded-full flex items-center justify-center shadow-xl opacity-0 group-hover:opacity-100 transition-opacity hover:scale-110 hover:bg-white z-10"
                              >
                                <ChevronLeft className="w-6 h-6" />
                              </button>
                              <button 
                                onClick={() => setCurrentVideoIndex(prev => (prev === videoUrls.length - 1 ? 0 : prev + 1))}
                                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 backdrop-blur text-slate-800 rounded-full flex items-center justify-center shadow-xl opacity-0 group-hover:opacity-100 transition-opacity hover:scale-110 hover:bg-white z-10"
                              >
                                <ChevronRight className="w-6 h-6" />
                              </button>
                              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10 bg-slate-900/50 px-4 py-2 rounded-full backdrop-blur">
                                {videoUrls.map((_, idx) => (
                                  <button 
                                    key={idx} 
                                    onClick={() => setCurrentVideoIndex(idx)}
                                    className={`w-2.5 h-2.5 rounded-full transition-all ${idx === currentVideoIndex ? 'bg-white scale-125' : 'bg-white/40 hover:bg-white/60'}`}
                                  />
                                ))}
                              </div>
                            </>
                          )}
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
                                {urls.map((linkStr, i) => {
                                  const parts = linkStr.split('|');
                                  const title = parts.length > 1 ? parts[0].trim() : `Web Resource #${i+1}`;
                                  const url = parts.length > 1 ? parts.slice(1).join('|').trim() : linkStr.trim();
                                  const absoluteUrl = url.startsWith('http') || url.startsWith('/') ? url : `https://${url}`;
                                  return (
                                    <a key={i} href={absoluteUrl} target="_blank" className="p-8 bg-white rounded-[2.5rem] border border-slate-100 flex items-center justify-between gap-6 group hover:border-cedar-primary transition-all shadow-sm">
                                      <div className="flex items-center gap-5">
                                          <div className="w-12 h-12 bg-cedar-aqua/10 rounded-2xl flex items-center justify-center text-cedar-primary group-hover:bg-cedar-primary group-hover:text-white transition-all">
                                            <LinkIcon className="w-6 h-6" />
                                          </div>
                                          <div className="flex flex-col">
                                            <span className="text-sm font-bold text-slate-700">{title}</span>
                                            <span className="text-[10px] text-slate-400 truncate max-w-[150px]">{url.replace('https://', '').replace('http://', '').replace('www.', '')}</span>
                                          </div>
                                      </div>
                                      <ExternalLink className="w-5 h-5 text-slate-300 group-hover:text-cedar-primary transition-colors" />
                                    </a>
                                  );
                                })}
                              </div>
                            </div>
                          )}

                          {lesson.fileUrls && lesson.fileUrls.length > 0 && (
                            <div className="space-y-4">
                              <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 ml-4">Handouts</h4>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {lesson.fileUrls.map((url, i) => {
                                  const absoluteUrl = url.startsWith('http') || url.startsWith('/') || url.startsWith('data:') ? url : `https://${url}`;
                                  let fileName = url.startsWith('data:') 
                                    ? decodeURIComponent(url.split(';name=')[1]?.split(';')[0] || `Handout #${i+1}`)
                                    : (url.includes('---') ? decodeURIComponent(url.split('---')[1]) : url.split('/').pop() || `Handout #${i+1}`);
                                  if (fileName.includes('?')) fileName = fileName.split('?')[0];
                                  
                                  return (
                                    <div 
                                      key={i} 
                                      className="p-6 bg-slate-50 rounded-[2.5rem] border border-slate-100 flex flex-col gap-5 group hover:border-cedar-primary transition-all"
                                    >
                                      <div className="flex items-center gap-5">
                                          <div className="w-12 h-12 shrink-0 bg-white rounded-2xl flex items-center justify-center shadow-sm text-cedar-primary group-hover:bg-cedar-primary group-hover:text-white transition-all">
                                            <FileText className="w-6 h-6" />
                                          </div>
                                          <span className="text-sm font-bold text-slate-700 truncate" title={fileName}>{fileName}</span>
                                      </div>
                                      <div className="flex items-center gap-3">
                                        <button 
                                          onClick={(e) => handleViewFile(e, absoluteUrl)} 
                                          className="flex-1 py-2.5 bg-white text-cedar-primary border border-cedar-primary/20 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-cedar-primary hover:text-white transition-all"
                                        >
                                          View
                                        </button>
                                        <button 
                                          onClick={(e) => handleDownloadFile(e, absoluteUrl, fileName)} 
                                          className="flex-1 py-2.5 bg-cedar-primary text-white border border-cedar-primary rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-cedar-primary/90 transition-all"
                                        >
                                          Download
                                        </button>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </>
                  );
                })()}
           </div>

           <div className="bg-white p-12 md:p-24 rounded-[4rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.05)] relative border border-slate-50 overflow-hidden">
              <div className="flex items-center gap-8 mb-16">
                 <div className="w-20 h-20 bg-cedar-aqua/10 rounded-[2.5rem] flex items-center justify-center text-cedar-primary shadow-inner">
                    <CheckCircle className="w-10 h-10" />
                 </div>
                 <div>
                    <h2 className="text-5xl font-serif text-slate-800 tracking-tight">Complete Step</h2>
                    <p className="text-slate-400 font-medium mt-1 text-lg">Mark this journey step as complete to earn your stars.</p>
                 </div>
              </div>

              {mySubmission ? (
                <motion.div initial={{ scale: 0.98, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="p-16 bg-cedar-aqua/5 rounded-[4rem] border border-cedar-aqua/10 backdrop-blur-sm">
                   <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-12 border-b border-cedar-aqua/10 pb-12">
                      <div className="flex items-center gap-5 text-cedar-primary font-bold text-2xl">
                         <div className="w-14 h-14 bg-cedar-primary text-white rounded-2xl flex items-center justify-center shadow-lg shadow-cedar-primary/20">
                            <CheckCircle className="w-8 h-8" />
                         </div>
                         <div className="flex flex-col">
                            <span className="leading-none">Step Completed</span>
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60 mt-1">Journey Entry Recorded</span>
                         </div>
                      </div>
                      <div className="flex items-center gap-5 px-10 py-5 bg-white rounded-[2rem] shadow-premium border border-yellow-100">
                         <div className="w-12 h-12 bg-yellow-400 rounded-xl flex items-center justify-center text-white">
                            <Star className="w-6 h-6 fill-current" />
                         </div>
                         <div className="flex flex-col">
                            <span className="font-bold text-slate-800 text-xl">Reward Claimed</span>
                            <span className="text-[10px] font-black uppercase tracking-widest text-yellow-600">{mySubmission.rewardStars || 5} Growth Stars Earned</span>
                         </div>
                      </div>
                   </div>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit}>
                   <div className="flex justify-center">
                      <button type="submit" disabled={submitting} className="group relative bg-cedar-primary px-8 py-5 md:px-24 md:py-8 rounded-3xl md:rounded-[2.5rem] shadow-[0_30px_60px_-15px_rgba(45,123,138,0.4)] hover:shadow-[0_40px_80px_-15px_rgba(45,123,138,0.6)] hover:translate-y-[-5px] active:translate-y-[2px] transition-all overflow-hidden w-full md:w-auto md:min-w-[400px]">
                         <div className="relative z-10 flex items-center justify-center gap-5 text-white font-serif text-xl md:text-2xl">
                            {submitting ? (
                              <span className="animate-pulse flex items-center gap-4"><Sparkles className="w-6 h-6 animate-spin" /> Completing...</span>
                            ) : (
                              <><CheckCircle className="w-8 h-8 group-hover:translate-x-2 group-hover:translate-y-[-2px] transition-transform" /> Complete</>
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
