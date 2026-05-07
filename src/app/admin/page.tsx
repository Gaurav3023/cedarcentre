"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useAuth, User, UserStatus } from "@/context/AuthContext";
import { CheckCircle2, XCircle, UserCheck, Shield, Users, Activity, BarChart3, Settings, LogOut, ArrowRight, UserPlus, Link as LinkIcon, Trash2, Menu, X, Search, Filter, GraduationCap, Briefcase, Star } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import RoleGuard from "@/components/RoleGuard";

export default function AdminDashboard() {
  const { user, users, logout, updateUserStatus, assignStudent, deleteUser } = useAuth();
  const [activeTab, setActiveTab] = useState<'approvals' | 'users' | 'assignments'>('approvals');
  const [assignmentModal, setAssignmentModal] = useState<{ studentId: string } | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Search and Filter States
  const [studentSearch, setStudentSearch] = useState("");
  const [educatorSearch, setEducatorSearch] = useState("");
  const [studentFilter, setStudentFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [educatorFilter, setEducatorFilter] = useState<'all' | 'active' | 'inactive'>('all');

  // Filter out Master Admin and Pending Users
  const allApprovedUsers = users.filter(u => u.role !== 'admin' && u.status === 'approved');
  
  const pendingUsers = users.filter(u => u.status === 'pending');
  
  const students = allApprovedUsers.filter(u => 
    u.role === 'student' && 
    (u.name.toLowerCase().includes(studentSearch.toLowerCase()) || u.email.toLowerCase().includes(studentSearch.toLowerCase()))
  );
  
  const educators = allApprovedUsers.filter(u => 
    u.role === 'educator' && 
    (u.name.toLowerCase().includes(educatorSearch.toLowerCase()) || u.email.toLowerCase().includes(educatorSearch.toLowerCase()))
  );

  const handleStatusUpdate = (userId: string, status: UserStatus) => {
    updateUserStatus(userId, status);
  };

  const handleAssignment = (studentId: string, educatorId: string) => {
    assignStudent(studentId, educatorId);
    setAssignmentModal(null);
  };

  const stats = [
    { label: "Pending Approvals", value: pendingUsers.length, icon: UserCheck, color: "text-amber-500", bg: "bg-amber-50" },
    { label: "Active Students", value: students.length, icon: GraduationCap, color: "text-cedar-primary", bg: "bg-cedar-primary/10" },
    { label: "Verified Educators", value: educators.length, icon: Briefcase, color: "text-emerald-500", bg: "bg-emerald-50" },
    { label: "System Uptime", value: "100%", icon: Activity, color: "text-blue-500", bg: "bg-blue-50" },
  ];

  const SidebarContent = () => (
    <div className="flex flex-col h-full p-8">
      <div className="flex flex-col gap-6 mb-12 px-2">
        <Link href="/">
           <img src="https://cedarcentre.ca/wp-content/uploads/2023/07/cedar-logo1.svg" className="h-14 mb-2" alt="Logo" />
        </Link>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-[0.8rem] flex items-center justify-center shadow-md">
            <img src="https://cedarcentre.ca/wp-content/uploads/2023/07/cedar-logo1.svg" className="h-6" alt="Icon" />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 text-sm">Cedar Admin</h3>
            <p className="text-[10px] text-slate-400 font-black tracking-widest uppercase italic">Management Portal</p>
          </div>
        </div>
      </div>
      
      <nav className="space-y-2 flex-1">
        <AdminNavItem 
          icon={<UserCheck className="w-5 h-5" />} 
          label="Pending Approvals" 
          active={activeTab === 'approvals'} 
          onClick={() => { setActiveTab('approvals'); setIsMobileMenuOpen(false); }}
          badge={pendingUsers.length}
        />
        <AdminNavItem 
          icon={<Users className="w-5 h-5" />} 
          label="Organization Directory" 
          active={activeTab === 'users'} 
          onClick={() => { setActiveTab('users'); setIsMobileMenuOpen(false); }}
        />
        <AdminNavItem 
          icon={<LinkIcon className="w-5 h-5" />} 
          label="Mentor Assignments" 
          active={activeTab === 'assignments'} 
          onClick={() => { setActiveTab('assignments'); setIsMobileMenuOpen(false); }}
        />
      </nav>
      
      <div className="mt-auto space-y-4">
         <div className="p-5 bg-slate-50 rounded-[1.5rem] border border-slate-100 shadow-inner">
            <p className="text-[9px] font-black uppercase text-slate-400 tracking-[0.2em] mb-2">Master Administrator</p>
            <p className="font-bold text-slate-800 truncate text-sm">{user?.name}</p>
         </div>
         <button onClick={logout} className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-slate-400 hover:bg-red-50 hover:text-red-500 transition-all font-bold text-sm">
           <LogOut className="w-5 h-5" /> Log Out
         </button>
      </div>
    </div>
  );

  return (
    <RoleGuard allowedRoles="admin">
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col lg:flex-row">
      
      {/* Mobile Header */}
      <div className="lg:hidden bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center sticky top-0 z-[100] shadow-sm">
         <img src="https://cedarcentre.ca/wp-content/uploads/2023/07/cedar-logo1.svg" className="h-10" alt="Logo" />
         <button onClick={() => setIsMobileMenuOpen(true)} className="p-3 bg-slate-50 rounded-xl text-slate-600">
            <Menu className="w-6 h-6" />
         </button>
      </div>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-[110] lg:hidden">
             <motion.div 
               initial={{ opacity: 0 }} 
               animate={{ opacity: 1 }} 
               exit={{ opacity: 0 }} 
               onClick={() => setIsMobileMenuOpen(false)}
               className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
             />
             <motion.div 
               initial={{ x: "-100%" }} 
               animate={{ x: 0 }} 
               exit={{ x: "-100%" }}
               className="absolute top-0 bottom-0 left-0 w-80 bg-white shadow-2xl flex flex-col"
             >
                <div className="absolute top-6 right-6">
                   <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-slate-400 hover:text-slate-800"><X className="w-6 h-6" /></button>
                </div>
                <SidebarContent />
             </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <aside className="w-80 bg-white border-r border-slate-200 hidden lg:flex flex-col sticky top-0 h-screen">
        <SidebarContent />
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 lg:p-12 overflow-y-auto max-w-[1600px] mx-auto w-full">
        <header className="mb-12">
            <p className="text-[10px] font-black uppercase text-cedar-primary tracking-[0.3em] mb-2">Platform Administration</p>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif text-slate-800 italic">
              {activeTab === 'approvals' ? 'Registration Requests' : activeTab === 'assignments' ? 'Mentor Matching' : 'Member Directory'}
            </h1>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
           {stats.map((stat, i) => (
             <motion.div 
               key={i} 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: i * 0.1 }}
               className="bg-white p-6 md:p-8 rounded-3xl md:rounded-[2.5rem] shadow-sm border border-slate-100 flex items-center gap-6 group hover:shadow-premium-hover transition-all"
             >
                <div className={`w-14 h-14 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center group-hover:rotate-12 transition-transform`}>
                   <stat.icon className="w-7 h-7" />
                </div>
                <div>
                   <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{stat.label}</p>
                   <p className="text-3xl font-serif font-bold text-slate-800 mt-1">{stat.value}</p>
                </div>
             </motion.div>
           ))}
        </div>

        {/* Tab Content */}
        <div className="space-y-16">
          {activeTab === 'approvals' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between mb-8">
                 <h3 className="text-2xl font-serif text-slate-800">Pending Approvals</h3>
                 <span className="px-4 py-2 bg-amber-50 text-amber-600 rounded-xl text-[10px] font-black uppercase tracking-widest border border-amber-100">{pendingUsers.length} Waiting</span>
              </div>
              {pendingUsers.length === 0 ? (
                 <div className="bg-white p-10 md:p-20 rounded-3xl md:rounded-[3rem] text-center border-2 border-dashed border-slate-100">
                    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                       <CheckCircle2 className="w-10 h-10 text-slate-200" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800">Everything is up to date</h3>
                    <p className="text-slate-500 mt-2">Check back later for new registration requests.</p>
                 </div>
              ) : (
                pendingUsers.map((pUser, i) => (
                  <motion.div 
                    key={pUser.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="bg-white p-6 md:p-8 rounded-[2rem] md:rounded-[3rem] shadow-sm flex flex-col md:flex-row justify-between items-center border border-slate-100 hover:border-cedar-primary/20 transition-all gap-8"
                  >
                    <div className="flex items-center gap-6 w-full md:w-auto">
                      <div className="w-20 h-20 bg-slate-50 text-slate-400 rounded-[1.5rem] flex items-center justify-center font-bold text-3xl uppercase shadow-inner">
                         {pUser.name[0]}
                      </div>
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                           <h4 className="text-2xl font-bold text-slate-800">{pUser.name}</h4>
                           <span className="px-3 py-1 bg-cedar-primary/10 text-cedar-primary text-[9px] font-black uppercase tracking-widest rounded-full">{pUser.role}</span>
                        </div>
                        <p className="text-slate-400 font-medium">{pUser.email}</p>
                      </div>
                    </div>
                    <div className="flex gap-4 w-full md:w-auto">
                       <button onClick={() => deleteUser(pUser.id)} className="p-4 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all"><Trash2 className="w-6 h-6" /></button>
                       <button onClick={() => handleStatusUpdate(pUser.id, 'rejected')} className="px-8 py-4 text-slate-600 font-bold hover:bg-slate-100 rounded-2xl transition-colors">Ignore</button>
                       <button onClick={() => handleStatusUpdate(pUser.id, 'approved')} className="bg-cedar-primary text-white px-10 py-4 rounded-2xl font-bold shadow-lg shadow-cedar-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all">Approve Access</button>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          )}

          {activeTab === 'assignments' && (
            <div className="bg-white rounded-[2rem] md:rounded-[3.5rem] shadow-sm border border-slate-100 overflow-hidden">
              <div className="p-6 md:p-10 border-b border-slate-50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                 <h3 className="text-xl md:text-2xl font-serif text-slate-800">Student & Educator Pairing</h3>
                 <div className="flex items-center gap-2 text-xs font-black uppercase text-slate-400 tracking-widest">
                    <Activity className="w-4 h-4 text-cedar-primary" /> System Matchmaking
                 </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-50/50">
                    <tr className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                      <th className="px-10 py-6">Student Learner</th>
                      <th className="px-10 py-6">Learning Score</th>
                      <th className="px-10 py-6">Assigned Mentor</th>
                      <th className="px-10 py-6 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {students.map(s => {
                      const assignedEdu = educators.find(e => e.id === s.assignedEducatorId);
                      return (
                        <tr key={s.id} className="hover:bg-slate-50/30 transition-colors">
                          <td className="px-10 py-10">
                             <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center font-bold text-slate-400 uppercase text-sm">{s.name[0]}</div>
                                <div>
                                   <p className="font-bold text-slate-800">{s.name}</p>
                                   <p className="text-xs text-slate-400 font-medium">{s.email}</p>
                                </div>
                             </div>
                          </td>
                          <td className="px-10 py-10">
                             <div className="flex items-center gap-3">
                                <Star className="w-5 h-5 text-yellow-400 fill-current" />
                                <span className="text-sm font-bold text-slate-700">{s.stars || 0} Points</span>
                             </div>
                          </td>
                          <td className="px-10 py-10">
                            {assignedEdu ? (
                              <div className="flex items-center gap-3">
                                 <div className="w-8 h-8 bg-cedar-primary/10 text-cedar-primary rounded-lg flex items-center justify-center font-bold text-xs uppercase">{assignedEdu.name[0]}</div>
                                 <span className="text-sm font-medium text-slate-600">{assignedEdu.name}</span>
                              </div>
                            ) : (
                              <span className="text-[8px] font-black uppercase tracking-widest text-red-400 bg-red-50 px-3 py-1 rounded-full border border-red-50">Pending Match</span>
                            )}
                          </td>
                          <td className="px-10 py-10 text-right">
                            <button onClick={() => setAssignmentModal({ studentId: s.id })} className="text-cedar-primary font-bold hover:underline text-xs uppercase tracking-widest">
                              Match Mentor
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="space-y-24">
              {/* Students Section */}
              <section className="space-y-12">
                 <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                    <div>
                       <div className="flex items-center gap-4 mb-4">
                          <div className="p-3 bg-cedar-primary/10 rounded-2xl">
                             <GraduationCap className="w-8 h-8 text-cedar-primary" />
                          </div>
                          <h3 className="text-2xl md:text-4xl font-serif text-slate-800 italic">Learners Community</h3>
                       </div>
                       <p className="text-slate-400 font-medium ml-1">Manage active students and track their journey progress.</p>
                    </div>
                    
                    <div className="flex items-center gap-4 w-full md:w-auto">
                       <div className="relative flex-1 md:w-64">
                          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 w-4 h-4" />
                          <input 
                            type="text" 
                            placeholder="Find a learner..." 
                            value={studentSearch}
                            onChange={(e) => setStudentSearch(e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-2xl pl-12 pr-6 py-4 text-sm font-medium focus:ring-4 focus:ring-cedar-primary/5 outline-none transition-all shadow-sm"
                          />
                       </div>
                       <button className="p-4 bg-white border border-slate-200 rounded-2xl text-slate-400 hover:text-cedar-primary transition-all shadow-sm">
                          <Filter className="w-5 h-5" />
                       </button>
                    </div>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                    {students.map(u => (
                      <motion.div 
                        key={u.id}
                        layout
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white p-6 md:p-8 rounded-[2rem] md:rounded-[3rem] shadow-sm border border-slate-100 hover:border-cedar-primary/20 transition-all group"
                      >
                         <div className="flex justify-between items-start mb-8">
                            <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center font-bold text-2xl text-slate-400 group-hover:bg-cedar-primary group-hover:text-white transition-all shadow-inner uppercase">
                               {u.name[0]}
                            </div>
                            <div className="flex items-center gap-2">
                               <div className="flex items-center gap-2 px-4 py-2 bg-yellow-50 text-yellow-600 rounded-full text-[9px] font-black uppercase tracking-widest border border-yellow-100">
                                  <Star className="w-3 h-3 fill-current" /> {u.stars || 0}
                               </div>
                               <button onClick={() => deleteUser(u.id)} className="p-3 text-slate-200 hover:text-red-400 transition-colors"><Trash2 className="w-5 h-5" /></button>
                            </div>
                         </div>
                         <div className="mb-8">
                            <h4 className="font-bold text-slate-800 text-xl mb-1">{u.name}</h4>
                            <p className="text-xs text-slate-400 font-medium truncate italic">{u.email}</p>
                         </div>
                         <div className="flex justify-between items-center pt-8 border-t border-slate-50">
                            <span className="text-[9px] font-black uppercase text-cedar-primary tracking-widest bg-cedar-primary/5 px-4 py-1.5 rounded-full">Active Learner</span>
                            <div className="text-[9px] font-black uppercase text-slate-300 tracking-widest">Cedar Centre Verified</div>
                         </div>
                      </motion.div>
                    ))}
                    {students.length === 0 && <div className="col-span-full py-20 bg-slate-50/50 border-2 border-dashed border-slate-200 rounded-[3rem] text-center text-slate-400 italic">No learners found matching your search.</div>}
                 </div>
              </section>

              {/* Educators Section */}
              <section className="space-y-12">
                 <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                    <div>
                       <div className="flex items-center gap-4 mb-4">
                          <div className="p-3 bg-emerald-50 rounded-2xl">
                             <Briefcase className="w-8 h-8 text-emerald-500" />
                          </div>
                          <h3 className="text-2xl md:text-4xl font-serif text-slate-800 italic">Professional Mentors</h3>
                       </div>
                       <p className="text-slate-400 font-medium ml-1">Verified educators providing guidance and reviewing submissions.</p>
                    </div>
                    
                    <div className="flex items-center gap-4 w-full md:w-auto">
                       <div className="relative flex-1 md:w-64">
                          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 w-4 h-4" />
                          <input 
                            type="text" 
                            placeholder="Find a mentor..." 
                            value={educatorSearch}
                            onChange={(e) => setEducatorSearch(e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-2xl pl-12 pr-6 py-4 text-sm font-medium focus:ring-4 focus:ring-emerald-50 outline-none transition-all shadow-sm"
                          />
                       </div>
                       <button className="p-4 bg-white border border-slate-200 rounded-2xl text-slate-400 hover:text-emerald-500 transition-all shadow-sm">
                          <Filter className="w-5 h-5" />
                       </button>
                    </div>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                    {educators.map(u => (
                      <motion.div 
                        key={u.id}
                        layout
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white p-6 md:p-8 rounded-[2rem] md:rounded-[3rem] shadow-sm border border-slate-100 hover:border-emerald-200/50 transition-all group"
                      >
                         <div className="flex justify-between items-start mb-8">
                            <div className="w-16 h-16 bg-emerald-50 text-emerald-400 rounded-2xl flex items-center justify-center font-bold text-2xl group-hover:bg-emerald-500 group-hover:text-white transition-all shadow-inner uppercase">
                               {u.name[0]}
                            </div>
                            <button onClick={() => deleteUser(u.id)} className="p-3 text-slate-200 hover:text-red-400 transition-colors"><Trash2 className="w-5 h-5" /></button>
                         </div>
                         <div className="mb-8">
                            <div className="flex items-center gap-2 mb-1">
                               <h4 className="font-bold text-slate-800 text-xl">{u.name}</h4>
                               <Shield className="w-4 h-4 text-emerald-400 fill-emerald-400 opacity-20" />
                            </div>
                            <p className="text-xs text-slate-400 font-medium truncate italic">{u.email}</p>
                         </div>
                         <div className="flex justify-between items-center pt-8 border-t border-slate-50">
                            <span className="text-[9px] font-black uppercase text-emerald-600 tracking-widest bg-emerald-50 px-4 py-1.5 rounded-full border border-emerald-100">Verified Mentor</span>
                            <div className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-300 tracking-widest">
                               <div className="w-2 h-2 bg-emerald-400 rounded-full" /> Staff
                            </div>
                         </div>
                      </motion.div>
                    ))}
                    {educators.length === 0 && <div className="col-span-full py-20 bg-slate-50/50 border-2 border-dashed border-slate-200 rounded-[3rem] text-center text-slate-400 italic">No mentors found matching your search.</div>}
                 </div>
              </section>
            </div>
          )}
        </div>
      </main>

      {/* Assignment Modal */}
      {assignmentModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4 md:p-8">
           <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white rounded-[2rem] md:rounded-[3.5rem] w-full max-w-lg p-8 md:p-12 relative overflow-hidden shadow-2xl">
              <h3 className="text-2xl md:text-3xl font-serif text-slate-800 mb-4 italic">Match with Mentor</h3>
              <p className="text-slate-400 mb-10 text-sm font-medium">Connect this student with a professional guide.</p>
              
              <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                 {allApprovedUsers.filter(u => u.role === 'educator').length === 0 && <p className="text-slate-400 text-center py-10 italic">No approved mentors found.</p>}
                 {allApprovedUsers.filter(u => u.role === 'educator').map(edu => (
                   <button 
                     key={edu.id} 
                     onClick={() => handleAssignment(assignmentModal.studentId, edu.id)}
                     className="w-full text-left p-6 rounded-[1.5rem] border border-slate-100 hover:border-cedar-primary hover:bg-cedar-primary/5 transition-all flex justify-between items-center group"
                   >
                     <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center font-bold text-slate-400 uppercase text-xs">{edu.name[0]}</div>
                        <span className="font-bold text-slate-700">{edu.name}</span>
                     </div>
                     <ArrowRight className="w-5 h-5 text-slate-300 group-hover:translate-x-1 group-hover:text-cedar-primary transition-all" />
                   </button>
                 ))}
              </div>
              <button onClick={() => setAssignmentModal(null)} className="w-full mt-6 py-4 text-slate-400 font-bold hover:text-slate-600 transition-colors uppercase tracking-widest text-[10px]">Cancel & Return</button>
           </motion.div>
        </div>
      )}
    </div>
    </RoleGuard>
  );
}

function AdminNavItem({ icon, label, active, onClick, badge }: { icon: React.ReactNode, label: string, active: boolean, onClick?: () => void, badge?: number }) {
  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-center justify-between px-6 py-4 rounded-2xl transition-all font-bold text-sm ${
        active ? 'bg-cedar-primary text-white shadow-xl shadow-cedar-primary/10' : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'
      }`}
    >
      <div className="flex items-center gap-4">
        {icon}
        <span className="tracking-tight">{label}</span>
      </div>
      {badge ? (
        <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-black ${
          active ? 'bg-white text-cedar-primary shadow-sm' : 'bg-cedar-primary text-white'
        }`}>
          {badge}
        </span>
      ) : null}
    </button>
  );
}
