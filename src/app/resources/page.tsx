"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import GlobalNavbar from "@/components/GlobalNavbar";
import { Search, ExternalLink, HelpCircle, Phone, Heart } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import RoleGuard from "@/components/RoleGuard";

type Category = 'Crisis' | 'Mental Health' | 'Children & Youth' | 'Service Providers' | 'Police';

export default function ResourcesPage() {
  const [activeTab, setActiveTab] = useState<Category>('Crisis');

  const resources = {
    'Crisis': [
      { name: "310-COPE", desc: "24/7 Crisis Support Line in York Region", link: "#" },
      { name: "Kids Help Phone", desc: "Professional counseling for children and youth", link: "#" },
      { name: "Victim Services York Region", desc: "Immediate support for victims of crime or tragedy", link: "#" }
    ],
    'Mental Health': [
      { name: "CMHA York Region", desc: "Mental health community support and programs", link: "#" },
      { name: "York Hills", desc: "Centre for Children, Youth and Families", link: "#" },
      { name: "Psychology Today", desc: "Find a therapist in your area", link: "#" }
    ],
    'Children & Youth': [
      { name: "Children's Aid Society", desc: "Child protection and family support services", link: "#" },
      { name: "Big Brothers Big Sisters", desc: "Mentorship programs for youth", link: "#" },
      { name: "Yellow Brick House", desc: "Support for women and children in transition", link: "#" }
    ],
    'Service Providers': [
      { name: "Trauma-Informed Practice Guide", desc: "Standardized manual for service providers", link: "#" },
      { name: "York Region Human Services", desc: "Inter-agency coordination resources", link: "#" }
    ],
    'Police': [
      { name: "York Regional Police", desc: "Special Victims Unit (SVU) contact", link: "#" },
      { name: "Crime Stoppers", desc: "Anonymous reporting of criminal activity", link: "#" }
    ]
  };

  return (
    <RoleGuard allowedRoles={['student', 'educator', 'admin']}>
    <div className="min-h-screen bg-white text-slate-800">
      <GlobalNavbar />

      <section className="bg-[#006180] pt-48 pb-32 text-white">
         <div className="max-w-7xl mx-auto px-8">
            <p className="text-[10px] font-black uppercase tracking-[0.4em] mb-4 opacity-60">Help is Available</p>
            <h1 className="text-5xl md:text-7xl font-serif mb-6 italic">Resources</h1>
            <p className="text-xl opacity-80 max-w-2xl font-medium italic">
               Finding help in your community. Use the categories below to find professional support and services in York Region.
            </p>
         </div>
      </section>

      {/* Tabs Filter Replica */}
      <section className="py-24 max-w-7xl mx-auto px-8">
         <div className="flex flex-wrap border-b border-slate-100 mb-16 gap-2">
            {(Object.keys(resources) as Category[]).map(cat => (
               <button 
                 key={cat}
                 onClick={() => setActiveTab(cat)}
                 className={`px-8 py-5 text-xs font-black uppercase tracking-widest transition-all ${
                   activeTab === cat 
                   ? 'bg-[#006180] text-white shadow-xl translate-y-[-2px]' 
                   : 'bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-slate-600'
                 }`}
               >
                  {cat}
               </button>
            ))}
         </div>

         <AnimatePresence mode="wait">
            <motion.div 
               key={activeTab}
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0, y: -10 }}
               className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
               {resources[activeTab].map((res, i) => (
                  <div key={i} className="p-10 bg-white border border-slate-100 rounded-[3rem] shadow-sm hover:shadow-xl transition-all group">
                     <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center mb-8 text-[#006180] group-hover:scale-110 group-hover:bg-[#006180] group-hover:text-white transition-all">
                        <ExternalLink className="w-5 h-5" />
                     </div>
                     <h3 className="text-xl font-bold text-slate-800 mb-3">{res.name}</h3>
                     <p className="text-xs text-slate-400 font-medium leading-relaxed mb-10">{res.desc}</p>
                     <a href={res.link} className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#E57E6B] hover:underline">
                        Visit Website <ArrowRightIcon />
                     </a>
                  </div>
               ))}
            </motion.div>
         </AnimatePresence>
      </section>

      {/* Crisis Call To Action */}
      <section className="py-32 bg-[#F8FAFB] overflow-hidden">
         <div className="max-w-7xl mx-auto px-8 text-center">
            <div className="inline-flex items-center gap-4 px-6 py-2 bg-red-50 text-red-500 rounded-full text-[10px] font-black uppercase tracking-widest mb-10 border border-red-100">
               <Phone className="w-4 h-4 animate-pulse" />
               <span>In Case of Emergency</span>
            </div>
            <h2 className="text-5xl font-serif text-slate-900 mb-8 italic">Always call 911 if you are in <br /> immediate danger.</h2>
            <div className="flex justify-center gap-6">
               <button className="bg-red-500 text-white px-12 py-5 rounded-full font-black uppercase text-xs tracking-widest shadow-2xl hover:scale-105 transition-all">Call Crisis Line</button>
               <button className="bg-white border border-slate-200 text-slate-600 px-12 py-5 rounded-full font-black uppercase text-xs tracking-widest shadow-xl hover:bg-slate-50 transition-all">Police Support</button>
            </div>
         </div>
      </section>

      <FooterMini />
    </div>
    </RoleGuard>
  );
}

function ArrowRightIcon() {
  return <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
}

function FooterMini() {
  return (
    <footer className="py-16 border-t border-slate-100 text-center">
       <p className="text-[10px] font-black uppercase text-slate-300 tracking-widest">Finding The Right Path Together</p>
    </footer>
  );
}
