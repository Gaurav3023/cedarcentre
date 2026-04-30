import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X, Check, ExternalLink, MessageCircle, Book, FileText, Star, ShieldAlert } from 'lucide-react';
import { useAuth, Notification } from '@/context/AuthContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function NotificationsDropdown() {
  const { notifications, markNotificationAsRead, markAllNotificationsAsRead, clearAllNotifications } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const unreadCount = notifications.filter(n => !n.read).length;

  const getTypeIcon = (type: Notification['type']) => {
    switch (type) {
      case 'chat': return <MessageCircle className="w-4 h-4 text-blue-500" />;
      case 'lesson': return <Book className="w-4 h-4 text-emerald-500" />;
      case 'submission': return <FileText className="w-4 h-4 text-amber-500" />;
      case 'grade': return <Star className="w-4 h-4 text-yellow-500" />;
      default: return <ShieldAlert className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`p-3 rounded-2xl border transition-all relative group ${unreadCount > 0 ? 'bg-cedar-primary text-white border-cedar-primary shadow-lg shadow-cedar-primary/20' : 'bg-white text-slate-400 border-slate-100 hover:bg-slate-50'}`}
      >
        <Bell className={`w-5 h-5 ${unreadCount > 0 ? 'animate-pulse' : ''}`} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[8px] font-black rounded-full flex items-center justify-center border-2 border-white shadow-sm">
            {unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-[150]" onClick={() => setIsOpen(false)} />
            <motion.div 
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute right-0 mt-4 w-80 md:w-96 bg-white rounded-[2.5rem] shadow-2xl border border-slate-50 z-[160] overflow-hidden"
            >
              <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                <div className="flex items-center gap-2">
                  <h3 className="font-serif text-lg text-slate-800">Notifications</h3>
                  {unreadCount > 0 && <span className="px-2 py-0.5 bg-cedar-primary/10 text-cedar-primary text-[8px] font-black rounded-full uppercase tracking-widest">{unreadCount} New</span>}
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={markAllNotificationsAsRead}
                    className="p-2 text-slate-400 hover:text-cedar-primary transition-colors title='Mark all as read'"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                  <button onClick={() => setIsOpen(false)} className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                {notifications.length === 0 ? (
                  <div className="p-12 text-center">
                    <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Bell className="w-8 h-8 text-slate-200" />
                    </div>
                    <p className="text-slate-400 italic text-sm font-medium">No activity recorded yet.</p>
                  </div>
                ) : (
                  <div className="divide-y divide-slate-50">
                    {notifications.map((n) => (
                      <div 
                        key={n.id} 
                        onClick={() => {
                          if (n.link) {
                            router.push(n.link);
                            setIsOpen(false);
                            markNotificationAsRead(n.id);
                          }
                        }}
                        className={`p-5 transition-all group relative ${!n.read ? 'bg-cedar-primary/5' : ''} ${n.link ? 'cursor-pointer hover:bg-slate-50' : ''}`}
                      >
                        {!n.read && <div className="absolute left-0 top-0 bottom-0 w-1 bg-cedar-primary" />}
                        <div className="flex gap-4">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${!n.read ? 'bg-white' : 'bg-slate-50'}`}>
                            {getTypeIcon(n.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start mb-1">
                              <h4 className={`text-sm font-bold truncate ${!n.read ? 'text-slate-900' : 'text-slate-600'}`}>{n.title}</h4>
                              <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest whitespace-nowrap ml-2">
                                {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                            <p className="text-xs text-slate-500 leading-relaxed line-clamp-2 mb-3 font-medium">
                              {n.message}
                            </p>
                            <div className="flex items-center gap-3">
                              {n.link && n.type !== 'grade' && n.type !== 'chat' && (
                                <Link 
                                  href={n.link} 
                                  prefetch={true}
                                  onClick={() => { 
                                    setIsOpen(false);
                                    // mark as read in background
                                    markNotificationAsRead(n.id); 
                                  }}
                                  className="text-[9px] font-black uppercase text-cedar-primary tracking-widest hover:underline flex items-center gap-1"
                                >
                                  View Details <ExternalLink className="w-2.5 h-2.5" />
                                </Link>
                              )}
                              {!n.read && (
                                <button 
                                  onClick={() => markNotificationAsRead(n.id)}
                                  className="text-[9px] font-black uppercase text-slate-300 hover:text-cedar-primary tracking-widest transition-colors"
                                >
                                  Mark read
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {notifications.length > 0 && (
                <div className="p-4 bg-slate-50/50 flex flex-col gap-2 border-t border-slate-50">
                  <button 
                    onClick={clearAllNotifications}
                    className="text-[9px] font-black uppercase text-red-400 hover:text-red-600 tracking-widest transition-all text-center py-2"
                  >
                    Clear All Notifications
                  </button>
                  <p className="text-[8px] font-black uppercase text-slate-300 tracking-[0.2em] text-center">Latest Activities Only</p>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
