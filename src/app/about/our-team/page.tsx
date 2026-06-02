"use client";

import { motion } from "framer-motion";
import GlobalNavbar from "@/components/GlobalNavbar";
import { User, Shield, Briefcase, Award } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import RoleGuard from "@/components/RoleGuard";

export default function TeamPage() {
  return (
    <RoleGuard allowedRoles={['student', 'educator', 'admin']}>
    <div className="min-h-screen bg-white text-slate-800">
      <GlobalNavbar />

      {/* Page Title Header */}
      <section className="bg-[#006180] pt-48 pb-32 text-center text-white">
         <div className="max-w-7xl mx-auto px-8">
            <h1 className="text-5xl md:text-7xl font-serif mb-6 italic">Our Team</h1>
            <div className="w-24 h-1.5 bg-[#E57E6B] mx-auto rounded-full mb-8" />
            <p className="text-xl md:text-2xl opacity-80 font-medium max-w-2xl mx-auto italic leading-relaxed">
               Committed professionals working together to foster healing, recovery and community support.
            </p>
         </div>
      </section>

      {/* Leadership Section */}
      <section className="py-24 max-w-7xl mx-auto px-8">
         <div className="border-b-2 border-slate-100 pb-8 mb-16 flex items-center justify-between">
            <h2 className="text-3xl font-serif text-[#006180]">Leadership Team</h2>
            <Briefcase className="text-slate-200" />
         </div>
         
         <div className="grid md:grid-cols-2 gap-12">
            <LeaderCard 
              name="Executive Director"
              role="Leadership & Strategy"
              desc="Oversees the mission, community partnerships, and strategic growth of Cedar Centre."
            />
            <LeaderCard 
              name="Clinical Director"
              role="Clinical Excellence"
              desc="Provides leadership for our trauma-specific therapy programs and clinical quality standards."
            />
         </div>
      </section>

      {/* Clinical Team Section */}
      <section className="py-24 bg-[#F8FAFB]">
         <div className="max-w-7xl mx-auto px-8">
            <div className="border-b-2 border-slate-200 pb-8 mb-16 flex items-center justify-between">
               <h2 className="text-3xl font-serif text-[#006180]">Clinical Team</h2>
               <HeartIcon />
            </div>
            
            <p className="text-slate-500 font-medium leading-relaxed max-w-3xl mb-12 italic">
               Our clinical team consists of specialized Psychotherapists and specialized trauma treatment providers committed to holistic, trauma-informed care.
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
               {[1,2,3,4,5,6,7,8,9,10].map(i => (
                  <div key={i} className="bg-white p-6 rounded-2xl shadow-sm flex flex-col items-center text-center">
                     <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                        <User className="w-8 h-8 text-slate-300" />
                     </div>
                     <span className="text-[10px] font-black uppercase text-slate-800 tracking-widest">Clinical Member</span>
                     <p className="text-[8px] font-bold text-slate-400 mt-1 uppercase">Trauma Specialist</p>
                  </div>
               ))}
            </div>
         </div>
      </section>

      {/* Board of Directors Section */}
      <section className="py-24 max-w-7xl mx-auto px-8">
         <div className="border-b-2 border-slate-100 pb-8 mb-16 flex items-center justify-between">
            <h2 className="text-3xl font-serif text-[#006180]">Board of Directors</h2>
            <Shield className="text-slate-200" />
         </div>
         
         <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm font-bold text-slate-600">
            <div className="space-y-4">
               <BoardMember name="Chair" />
               <BoardMember name="Vice Chair" />
               <BoardMember name="Secretary" />
            </div>
            <div className="space-y-4">
               <BoardMember name="Treasurer" />
               <BoardMember name="Member at Large (3)" />
            </div>
         </div>
      </section>

      {/* Funders Grid Replica */}
      <section className="py-32 bg-white">
         <div className="max-w-7xl mx-auto px-8 text-center">
            <h3 className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-300 mb-16">Our Generous Funders</h3>
            <div className="flex flex-wrap justify-center gap-16 grayscale opacity-40">
               {/* Funder Logo Placeholders */}
               <div className="h-12 w-32 bg-slate-100 rounded" />
               <div className="h-12 w-48 bg-slate-100 rounded" />
               <div className="h-12 w-40 bg-slate-100 rounded" />
               <div className="h-12 w-36 bg-slate-100 rounded" />
            </div>
         </div>
      </section>
      
      <FooterReplica />
    </div>
    </RoleGuard>
  );
}

function LeaderCard({ name, role, desc }: { name: string, role: string, desc: string }) {
  return (
    <div className="p-12 bg-white rounded-[3rem] border border-slate-100 shadow-xl flex gap-8 items-start hover:translate-y-[-5px] transition-all">
       <div className="w-24 h-24 bg-[#006180] text-white rounded-[2rem] flex items-center justify-center shrink-0">
          <Award className="w-10 h-10" />
       </div>
       <div>
          <h4 className="text-2xl font-bold text-slate-900 mb-2">{name}</h4>
          <p className="text-xs font-black uppercase text-[#E57E6B] tracking-widest mb-6">{role}</p>
          <p className="text-sm text-slate-500 font-medium leading-relaxed">{desc}</p>
       </div>
    </div>
  );
}

function BoardMember({ name }: { name: string }) {
  return (
    <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl">
       <div className="w-2 h-2 bg-[#E57E6B] rounded-full" />
       <span>{name}</span>
    </div>
  );
}

function HeartIcon() {
  return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-200"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.51 4.05 3 5.5l7 7Z"/></svg>
}

function FooterReplica() {
  return (
    <footer className="py-20 bg-[#006180] text-white text-center cursor-default">
       <p className="text-[10px] font-black uppercase tracking-widest opacity-60 italic mb-4">Connecting Hearts to Healing</p>
       <p className="text-[8px] font-bold opacity-30">Cedar Centre - Custom Infrastructure v1</p>
    </footer>
  )
}
