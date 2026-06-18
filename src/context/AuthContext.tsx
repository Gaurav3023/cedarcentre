"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

export type UserRole = 'student' | 'educator' | 'admin';
export type UserStatus = 'pending' | 'approved' | 'rejected' | 'suspended';

export interface Lesson {
  id: string;
  educatorId: string;
  assignedStudents: string[];
  title: string;
  content: string;
  type: 'video' | 'text' | 'activity';
  fileUrls?: string[]; 
  videoUrl?: string;
  releaseDate?: string; 
  deadline?: string;    
  weekNumber?: number; 
  weekTitle?: string;
  resourceLinks?: string[];
  createdAt: string;
}

export interface Submission {
  id: string;
  lessonId: string;
  studentId: string;
  content: string;
  fileUrls?: string[]; 
  links?: string[];
  submittedAt: string;
  status: 'pending' | 'reviewed';
  rewardStars?: number;
  feedback?: string;
}

export interface SupportRequest {
  id: string;
  studentId: string;
  educatorId: string;
  message: string;
  status: 'open' | 'resolved';
  studentHasUnread?: boolean;
  educatorHasUnread?: boolean;
  chat?: {
    senderId: string;
    senderRole: string;
    content: string;
    timestamp: string;
  }[];
  createdAt: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  status: UserStatus;
  joinedAt: string;
  assignedEducatorId?: string;
  stars?: number;
  readLessons?: string[];
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'system' | 'lesson' | 'submission' | 'chat' | 'grade';
  link?: string;
  read: boolean;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  users: User[];
  lessons: Lesson[];
  submissions: Submission[];
  supportRequests: SupportRequest[];
  notifications: Notification[];
  login: (email: string, pass: string, isAdmin?: boolean) => Promise<boolean>;
  signup: (name: string, email: string, pass: string, role: UserRole) => Promise<boolean>;
  logout: () => void;
  updateUserStatus: (userId: string, status: UserStatus) => void;
  assignStudent: (studentId: string, educatorId: string) => void;
  createLesson: (lesson: Omit<Lesson, 'id' | 'createdAt'>) => void;
  updateLesson: (id: string, updates: Partial<Lesson>) => void;
  deleteLesson: (id: string) => void;
  submitWork: (lessonId: string, content: string, fileUrls?: string[], links?: string[]) => void;
  sendSupportRequest: (message: string) => void;
  rewardSubmission: (submissionId: string, stars: number, feedback: string) => void;
  resolveSupport: (requestId: string) => void;
  sendSupportChatMessage: (requestId: string, content: string) => void;
  markSupportAsRead: (requestId: string, role: 'student' | 'educator') => void;
  deleteUser: (userId: string) => void;
  getLessonsForStudent: (studentId: string) => Lesson[];
  addStarsToUser: (amount: number) => void;
  markLessonAsRead: (lessonId: string) => Promise<void>;
  markNotificationAsRead: (notificationId: string) => void;
  markAllNotificationsAsRead: () => Promise<void>;
  clearAllNotifications: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [supportRequests, setSupportRequests] = useState<SupportRequest[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const router = useRouter();

  // Map raw API data to typed objects
  const mapUser = (u: any): User => ({
    ...u,
    id: u.id || u._id,
    assignedEducatorId: u.educatorId || u.assignedEducatorId
  });

  const mapLesson = (l: any): Lesson => ({
    ...l,
    id: l._id || l.id,
    assignedStudents: l.assignedStudents || [],
    fileUrls: l.fileUrls || (l.fileUrl ? [l.fileUrl] : []),
    weekNumber: l.weekNumber || 0,
    weekTitle: l.weekTitle || ''
  });

  const mapSubmission = (s: any): Submission => ({
    ...s,
    id: s._id || s.id,
    submittedAt: s.createdAt,
    fileUrls: s.fileUrls || (s.fileUrl ? [s.fileUrl] : [])
  });

  const fetchAll = useCallback(async () => {
    try {
      const res = await fetch('/api/sync', { cache: 'no-store' });
      if (!res.ok) return;
      
      const data = await res.json();
      const { users: uData, lessons: lData, submissions: sData, supportRequests: supData, notifications: nData } = data;

      const mappedUsers = uData.map(mapUser);
      setUsers(mappedUsers); 
      
      // Update local user state if it changed in DB
      const sessionStr = localStorage.getItem('cedar_session_v5');
      if (sessionStr) {
        const currentUser = JSON.parse(sessionStr);
        const freshUser = mappedUsers.find((u: any) => u.id === currentUser.id);
        if (freshUser) {
          setUser(prev => ({ ...prev, ...freshUser }));
        }
      }
      
      setLessons(lData.map(mapLesson));
      setSubmissions(sData.map(mapSubmission));
      setSupportRequests(supData.map((su: any) => ({ ...su, id: su._id })));
      setNotifications(nData.map((n: any) => ({ ...n, id: n._id })));
    } catch (e) {
      console.error("Failed to sync data", e);
    }
  }, []);

  const logout = useCallback(async () => { 
    await fetch('/api/auth/logout', { method: 'POST' });
    setUser(null); 
    localStorage.removeItem('cedar_session_v5'); 
    router.push('/login'); 
  }, [router]);

  useEffect(() => {
    if (!user) return;

    let timeout: NodeJS.Timeout;

    const resetTimer = () => {
      if (timeout) clearTimeout(timeout);
      timeout = setTimeout(() => {
        logout();
        alert("Your session has expired due to inactivity. Please log in again.");
      }, 30 * 60 * 1000);
    };

    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    events.forEach(name => document.addEventListener(name, resetTimer));
    
    resetTimer();

    return () => {
      if (timeout) clearTimeout(timeout);
      events.forEach(name => document.removeEventListener(name, resetTimer));
    };
  }, [user, logout]);

  useEffect(() => {
    const session = localStorage.getItem('cedar_session_v5');
    if (session) {
      const parsed = JSON.parse(session);
      if (parsed.expiresAt && Date.now() > parsed.expiresAt) {
        logout();
      } else {
        setUser(parsed);
      }
    }
    setLoading(false);
    fetchAll();

    // Auto-sync every 60 seconds
    const interval = setInterval(fetchAll, 60000);
    return () => clearInterval(interval);
  }, [fetchAll, user?.id]);

  const login = async (email: string, pass: string, isAdmin: boolean = false) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password: pass })
    });

    if (!res.ok) return false;
    const found = await res.json();
    const mappedUser = { 
      ...found, 
      id: found.id || found._id, 
      assignedEducatorId: found.educatorId,
      expiresAt: Date.now() + (4 * 60 * 60 * 1000)
    };

    if (isAdmin && mappedUser.role !== 'admin') return false;
    if (mappedUser.status === 'pending') { router.push('/pending'); return true; }
    
    setUser(mappedUser);
    localStorage.setItem('cedar_session_v5', JSON.stringify(mappedUser));
    await fetchAll();
    router.push(mappedUser.role === 'admin' ? '/admin' : mappedUser.role === 'educator' ? '/educator' : '/student');
    return true;
  };

  const signup = async (name: string, email: string, pass: string, role: UserRole) => {
    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password: pass, role })
    });

    if (!res.ok) return false;
    router.push('/pending');
    fetchAll(); 
    return true;
  };

  // ─── OPTIMISTIC UPDATE HELPERS ────────────────────────────────────────────
  // All mutation functions below:
  //   1. Update local state IMMEDIATELY (optimistic) so UI is instant
  //   2. Fire the network request in the background
  //   3. Only call fetchAll on error, or schedule a quiet background reconcile

  const updateUserStatus = async (userId: string, status: UserStatus) => {
    // Optimistic: flip status in local state right away
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, status } : u));
    try {
      await fetch('/api/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, status })
      });
    } catch {
      // Rollback on failure
      fetchAll();
    }
  };

  const assignStudent = async (studentId: string, educatorId: string) => {
    // Optimistic: assign locally
    setUsers(prev => prev.map(u => u.id === studentId ? { ...u, assignedEducatorId: educatorId } : u));
    try {
      await fetch('/api/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: studentId, educatorId })
      });
    } catch {
      fetchAll();
    }
  };

  const markLessonAsRead = async (lessonId: string) => {
    if (!user || user.readLessons?.includes(lessonId)) return;
    // Instant local update
    setUser(prev => prev ? { ...prev, readLessons: [...(prev.readLessons || []), lessonId] } : null);
    // Fire-and-forget
    fetch('/api/users', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: user.id, readLessonId: lessonId })
    }).catch(() => {});
  };

  const createLesson = async (data: Omit<Lesson, 'id' | 'createdAt'>) => {
    // Optimistic: add a temporary lesson immediately
    const tempId = `temp-${Date.now()}`;
    const tempLesson: Lesson = {
      ...data,
      id: tempId,
      createdAt: new Date().toISOString(),
      assignedStudents: data.assignedStudents || [],
      fileUrls: data.fileUrls || [],
    };
    setLessons(prev => [tempLesson, ...prev]);

    try {
      const res = await fetch('/api/lessons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!res.ok) {
        // Rollback temp lesson
        setLessons(prev => prev.filter(l => l.id !== tempId));
        const err = await res.json();
        console.error("Creation Failed:", err);
        return;
      }
      const newLesson = await res.json();
      const mapped = mapLesson(newLesson);
      // Replace temp with real
      setLessons(prev => prev.map(l => l.id === tempId ? mapped : l));
    } catch {
      setLessons(prev => prev.filter(l => l.id !== tempId));
      fetchAll();
    }
  };

  const updateLesson = async (id: string, updates: Partial<Lesson>) => {
    // Optimistic update
    setLessons(prev => prev.map(l => l.id === id ? { ...l, ...updates } : l));
    try {
      await fetch(`/api/lessons/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
    } catch {
      fetchAll();
    }
  };

  const deleteLesson = async (id: string) => {
    // Optimistic remove
    const prev = lessons;
    setLessons(p => p.filter(l => l.id !== id));
    try {
      await fetch(`/api/lessons/${id}`, { method: 'DELETE' });
    } catch {
      setLessons(prev);
    }
  };

  const submitWork = async (lessonId: string, content: string, fileUrls?: string[], links?: string[]) => {
    if (!user) return;
    const res = await fetch('/api/submissions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ lessonId, studentId: user.id, content, fileUrls, links })
    });
    if (res.ok) {
      const newSub = await res.json();
      const mapped: Submission = {
        ...newSub,
        id: newSub._id || newSub.id,
        submittedAt: newSub.createdAt || new Date().toISOString(),
        fileUrls: newSub.fileUrls || []
      };
      setSubmissions(prev => [mapped, ...prev]);
    }
    // Background reconcile after 3s — no await
    setTimeout(fetchAll, 3000);
  };

  const sendSupportRequest = async (message: string) => {
    if (!user || user.role !== 'student' || !user.assignedEducatorId) return;
    // Optimistic: add temporary support request
    const tempId = `temp-${Date.now()}`;
    const tempReq: SupportRequest = {
      id: tempId,
      studentId: user.id,
      educatorId: user.assignedEducatorId,
      message,
      status: 'open',
      createdAt: new Date().toISOString(),
      chat: []
    };
    setSupportRequests(prev => [tempReq, ...prev]);
    try {
      const res = await fetch('/api/support', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          studentId: user.id, 
          educatorId: user.assignedEducatorId,
          message, 
          status: 'open' 
        })
      });
      if (res.ok) {
        const newReq = await res.json();
        setSupportRequests(prev => prev.map(r => r.id === tempId ? { ...newReq, id: newReq._id } : r));
      } else {
        setSupportRequests(prev => prev.filter(r => r.id !== tempId));
      }
    } catch {
      setSupportRequests(prev => prev.filter(r => r.id !== tempId));
      fetchAll();
    }
  };

  const rewardSubmission = async (submissionId: string, stars: number, feedback: string) => {
    const sub = submissions.find(s => s.id === submissionId);
    if (!sub) return;
    // Optimistic: update submission immediately
    setSubmissions(prev => prev.map(s =>
      s.id === submissionId ? { ...s, rewardStars: stars, feedback, status: 'reviewed' } : s
    ));
    // Optimistic: add stars to student
    setUsers(prev => prev.map(u =>
      u.id === sub.studentId ? { ...u, stars: (u.stars || 0) + stars } : u
    ));
    try {
      await fetch('/api/submissions', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ submissionId, stars, feedback, studentId: sub.studentId })
      });
    } catch {
      fetchAll();
    }
  };

  const resolveSupport = async (requestId: string) => {
    // Optimistic
    setSupportRequests(prev => prev.map(r => r.id === requestId ? { ...r, status: 'resolved' } : r));
    try {
      await fetch('/api/support', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requestId, status: 'resolved' })
      });
    } catch {
      fetchAll();
    }
  };

  const sendSupportChatMessage = async (requestId: string, content: string) => {
    if (!user) return;
    const newMessage = {
      senderId: user.id,
      senderRole: user.role,
      content,
      timestamp: new Date().toISOString()
    };
    // Optimistic: add message to chat immediately
    setSupportRequests(prev => prev.map(r =>
      r.id === requestId
        ? { ...r, chat: [...(r.chat || []), newMessage], educatorHasUnread: user.role === 'student', studentHasUnread: user.role === 'educator' }
        : r
    ));
    try {
      await fetch('/api/support', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requestId, chatMessage: { senderId: user.id, senderRole: user.role, content } })
      });
    } catch {
      fetchAll();
    }
  };

  const markSupportAsRead = async (requestId: string, role: 'student' | 'educator') => {
    // Optimistic
    setSupportRequests(prev => prev.map(r =>
      r.id === requestId
        ? { ...r, studentHasUnread: role === 'student' ? false : r.studentHasUnread, educatorHasUnread: role === 'educator' ? false : r.educatorHasUnread }
        : r
    ));
    // Fire-and-forget (non-critical read receipt)
    fetch('/api/support', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ requestId, markReadFor: role })
    }).catch(() => {});
  };

  const deleteUser = async (userId: string) => {
    if (!confirm("Are you sure? This will delete all data related to this user.")) return;
    // Optimistic remove
    const prevUsers = users;
    setUsers(prev => prev.filter(u => u.id !== userId));
    try {
      await fetch(`/api/users/${userId}`, { method: 'DELETE' });
    } catch {
      setUsers(prevUsers);
    }
  };

  const addStarsToUser = async (amount: number) => {
    if (!user) return;
    // Optimistic
    const updated = { ...user, stars: (user.stars || 0) + amount };
    setUser(updated);
    localStorage.setItem('cedar_session_v5', JSON.stringify(updated));
    setUsers(prev => prev.map(u => u.id === user.id ? updated : u));
    try {
      const res = await fetch('/api/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, addStars: amount })
      });
      if (res.ok) {
        const updatedUser = await res.json();
        const mappedUser = { ...updatedUser, id: updatedUser._id, assignedEducatorId: updatedUser.educatorId };
        setUser(mappedUser);
        localStorage.setItem('cedar_session_v5', JSON.stringify(mappedUser));
      }
    } catch {
      // Rollback
      setUser(user);
      fetchAll();
    }
  };

  const getLessonsForStudent = (studentId: string) => {
    const student = users.find(u => u.id === studentId);
    if (!student || !student.assignedEducatorId) return [];
    return lessons.filter(l => {
      const isAssigned = l.assignedStudents?.includes('all') || l.assignedStudents?.includes(studentId);
      return l.educatorId === student.assignedEducatorId && isAssigned;
    });
  };

  const markNotificationAsRead = async (notificationId: string) => {
    // Optimistic
    setNotifications(prev => prev.map(n => n.id === notificationId ? { ...n, read: true } : n));
    try {
      const res = await fetch('/api/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notificationId })
      });
      if (!res.ok) throw new Error("Failed to mark notification as read");
    } catch {
      fetchAll();
    }
  };

  const markAllNotificationsAsRead = async () => {
    if (!user) return;
    // Optimistic
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    try {
      const res = await fetch('/api/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, readAll: true })
      });
      if (!res.ok) throw new Error("Failed to mark all as read");
    } catch {
      fetchAll();
    }
  };

  const clearAllNotifications = async () => {
    if (!user) return;
    const prevNotifications = notifications;
    // Optimistic
    setNotifications([]);
    try {
      const res = await fetch(`/api/notifications?userId=${user.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error("Failed to clear notifications");
    } catch {
      setNotifications(prevNotifications);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, loading, users, lessons, submissions, supportRequests, notifications,
      login, signup, logout, updateUserStatus, assignStudent,
      createLesson, updateLesson, deleteLesson,
      submitWork, sendSupportRequest, rewardSubmission, resolveSupport,
      sendSupportChatMessage, markSupportAsRead, deleteUser, getLessonsForStudent, addStarsToUser,
      markLessonAsRead, markNotificationAsRead, markAllNotificationsAsRead, clearAllNotifications
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
