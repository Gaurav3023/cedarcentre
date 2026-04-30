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
  weekTitle?: string; // Formal week title (e.g. "Finding Safety")
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

  const fetchAll = useCallback(async () => {
    try {
      const res = await fetch('/api/sync', { cache: 'no-store' });
      if (!res.ok) return;
      
      const data = await res.json();
      const { users: uData, lessons: lData, submissions: sData, supportRequests: supData, notifications: nData } = data;

      const mappedUsers = uData.map((u: any) => ({ 
        ...u, 
        id: u.id || u._id, 
        assignedEducatorId: u.educatorId || u.assignedEducatorId 
      })); 
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
      
      setLessons(lData.map((l: any) => ({ 
        ...l, 
        id: l._id, 
        assignedStudents: l.assignedStudents || [],
        fileUrls: l.fileUrls || (l.fileUrl ? [l.fileUrl] : []),
        weekNumber: l.weekNumber || 0,
        weekTitle: l.weekTitle || ""
      })));
      setSubmissions(sData.map((s: any) => ({ 
        ...s, 
        id: s._id, 
        submittedAt: s.createdAt,
        fileUrls: s.fileUrls || (s.fileUrl ? [s.fileUrl] : [])
      })));
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
      // Auto logout after 30 minutes of inactivity
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
      // Session expires after 4 hours of total duration for security
      if (parsed.expiresAt && Date.now() > parsed.expiresAt) {
        logout();
      } else {
        setUser(parsed);
      }
    }
    setLoading(false);
    fetchAll();

    // Auto-sync every 45 seconds to keep dashboard fresh
    const interval = setInterval(fetchAll, 45000);
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
      expiresAt: Date.now() + (4 * 60 * 60 * 1000) // 4 hour session limit
    };

    if (isAdmin && mappedUser.role !== 'admin') return false;
    if (mappedUser.status === 'pending') { router.push('/pending'); return true; }
    
    setUser(mappedUser);
    localStorage.setItem('cedar_session_v5', JSON.stringify(mappedUser));
    await fetchAll(); // Sync immediately so dashboard is ready
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

  const updateUserStatus = async (userId: string, status: UserStatus) => {
    await fetch('/api/users', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, status })
    });
    fetchAll();
  };

  const assignStudent = async (studentId: string, educatorId: string) => {
    await fetch('/api/users', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: studentId, educatorId })
    });
    fetchAll();
  };

  const markLessonAsRead = async (lessonId: string) => {
    if (!user || user.readLessons?.includes(lessonId)) return;
    
    await fetch('/api/users', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: user.id, readLessonId: lessonId })
    });
    
    setUser(prev => prev ? { ...prev, readLessons: [...(prev.readLessons || []), lessonId] } : null);
  };

  const createLesson = async (data: Omit<Lesson, 'id' | 'createdAt'>) => {
    const res = await fetch('/api/lessons', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const err = await res.json();
      console.error("Creation Failed:", err);
      return;
    }
    fetchAll();
  };

  const updateLesson = async (id: string, updates: Partial<Lesson>) => {
    const payload = { ...updates };

    await fetch(`/api/lessons/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    fetchAll();
  };

  const deleteLesson = async (id: string) => {
    await fetch(`/api/lessons/${id}`, { method: 'DELETE' });
    fetchAll();
  };

  const submitWork = async (lessonId: string, content: string, fileUrls?: string[], links?: string[]) => {
    if (!user) return;
    await fetch('/api/submissions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ lessonId, studentId: user.id, content, fileUrls, links })
    });
    fetchAll();
  };

  const sendSupportRequest = async (message: string) => {
    if (!user || user.role !== 'student' || !user.assignedEducatorId) return;
    await fetch('/api/support', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        studentId: user.id, 
        educatorId: user.assignedEducatorId,
        message, 
        status: 'open' 
      })
    });
    fetchAll();
  };

  const rewardSubmission = async (submissionId: string, stars: number, feedback: string) => {
    const sub = submissions.find(s => s.id === submissionId);
    if (!sub) return;
    await fetch('/api/submissions', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ submissionId, stars, feedback, studentId: sub.studentId })
    });
    fetchAll();
  };

  const resolveSupport = async (requestId: string) => {
    await fetch('/api/support', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ requestId, status: 'resolved' })
    });
    fetchAll();
  };

  const sendSupportChatMessage = async (requestId: string, content: string) => {
    if (!user) return;
    await fetch('/api/support', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        requestId, 
        chatMessage: {
          senderId: user.id,
          senderRole: user.role,
          content
        }
      })
    });
    fetchAll();
  };

  const markSupportAsRead = async (requestId: string, role: 'student' | 'educator') => {
    await fetch('/api/support', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ requestId, markReadFor: role })
    });
    fetchAll();
  };

  const deleteUser = async (userId: string) => {
    if (!confirm("Are you sure? This will delete all data related to this user.")) return;
    await fetch(`/api/users/${userId}`, { method: 'DELETE' });
    fetchAll();
  };

  const addStarsToUser = async (amount: number) => {
    if (!user) return;
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
      fetchAll();
    }
  };

  const getLessonsForStudent = (studentId: string) => {
    const student = users.find(u => u.id === studentId);
    if (!student || !student.assignedEducatorId) return [];
    
    const now = new Date();
    return lessons.filter(l => {
      const isAssigned = l.assignedStudents?.includes('all') || l.assignedStudents?.includes(studentId);
      const isReleased = l.releaseDate ? new Date(l.releaseDate) <= now : true;
      return l.educatorId === student.assignedEducatorId && isAssigned && isReleased;
    });
  };

  const markNotificationAsRead = async (notificationId: string) => {
    await fetch('/api/notifications', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ notificationId })
    });
    fetchAll();
  };

  const markAllNotificationsAsRead = async () => {
    if (!user) return;
    await fetch('/api/notifications', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: user.id, readAll: true })
    });
    fetchAll();
  };

  const clearAllNotifications = async () => {
    if (!user) return;
    await fetch(`/api/notifications?userId=${user.id}`, {
      method: 'DELETE'
    });
    fetchAll();
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
