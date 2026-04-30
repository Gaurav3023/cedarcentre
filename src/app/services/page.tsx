"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Heart, Users, Shield, Sparkles, Sun, Wind, ArrowRight, ArrowLeft } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import RoleGuard from "@/components/RoleGuard";

export default function ServicesPage() {
  return (
    <RoleGuard allowedRoles={['student', 'educator', 'admin']}>
    <div className="min-h-screen bg-cedar-background">
      
      {/* Mini Nav */}
      <nav className="p-8 flex justify-between items-center max-w-7xl mx-auto">
        <Link href="/">
           <img src="https://cedarcentre.ca/wp-content/uploads/2023/07/cedar-logo1.svg" className="h-10" alt="Logo" />
        </Link>
        <Link href="/" className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-400 hover:text-cedar-primary transition-colors">
           <ArrowLeft className="w-4 h-4" /> Return to Home
        </Link>
      </nav>

      {/* Page Header */}
      <section className="pt-20 pb-32 max-w-7xl mx-auto px-8">
        <div className="max-w-4xl">
           <p className="text-[10px] font-black uppercase tracking-[0.4em] text-cedar-primary mb-8">Our Paths to Healing</p>
           <h1 className="text-7xl md:text-8xl font-serif text-slate-900 leading-[1.05] mb-12">Programs & <br />Services</h1>
           <p className="text-2xl text-slate-500 leading-relaxed font-medium">
             We offer specialized, trauma-specific therapy plans designed to meet each person’s unique needs, strengths and challenges.
           </p>
        </div>
      </section>

      {/* Service Detail List */}
      <section className="max-w-7xl mx-auto px-8 pb-40">
        <div className="space-y-32">
           
           <ServiceDetail 
             icon={<Heart className="w-10 h-10" />}
             title="Child, Youth & Family Program"
             subtitle="Strength-based support for ages 3 to 18"
             desc="A family-centred program for children and youth who have experienced interpersonal trauma, including sexual abuse, physical abuse, emotional abuse, witnessing domestic violence, bullying, and acts of war."
             color="bg-cedar-aqua/10"
           />

           <ServiceDetail 
             icon={<Users className="w-10 h-10" />}
             title="Adult Program"
             subtitle="Two Phase Recovery"
             desc="A specialized program for adults 19+ who have experienced interpersonal childhood trauma. The first phase focuses on STAIR Coaching (Skills Training in Affective and Interpersonal Regulation)."
             color="bg-purple-50"
             reverse
           />

           <ServiceDetail 
             icon={<Shield className="w-10 h-10" />}
             title="Child & Youth Advocacy"
             subtitle="Coordinated Justice Response"
             desc="York Region’s first fully coordinated response to child abuse where criminal justice, child protection, and mental health services wrap around the child to ensure safe, timely resources."
             color="bg-cedar-coral/10"
           />

           <ServiceDetail 
             icon={<Sparkles className="w-10 h-10" />}
             title="Anti-Human Trafficking"
             subtitle="Specific trauma services"
             desc="Dedicated therapy for children and youth ages 3 to 18 who have experienced or are at risk of human trafficking, along with support for their non-offending caregivers."
             color="bg-slate-900"
             dark
             reverse
           />

           <div className="grid md:grid-cols-2 gap-12 pt-20">
              <div className="p-16 rounded-[4rem] bg-white border border-slate-100 shadow-premium">
                 <Sun className="w-12 h-12 text-amber-500 mb-8" />
                 <h3 className="text-3xl font-serif text-slate-800 mb-6">Newcomers Wellbeing</h3>
                 <p className="text-slate-500 font-medium leading-relaxed mb-10">In partnership with CMHA York Region, offering mental and physical health assistance to newcomers ages 12 and older.</p>
                 <button className="flex items-center gap-3 text-xs font-black uppercase text-cedar-primary tracking-widest hover:underline">Learn More <ArrowRight className="w-4 h-4" /></button>
              </div>
              <div className="p-16 rounded-[4rem] bg-white border border-slate-100 shadow-premium">
                 <Wind className="w-12 h-12 text-blue-400 mb-8" />
                 <h3 className="text-3xl font-serif text-slate-800 mb-6">Outreach & Prevention</h3>
                 <p className="text-slate-500 font-medium leading-relaxed mb-10">Providing community support through info sharing and resource presentations to groups, schools, and professionals.</p>
                 <button className="flex items-center gap-3 text-xs font-black uppercase text-cedar-primary tracking-widest hover:underline">Request Presentation <ArrowRight className="w-4 h-4" /></button>
              </div>
           </div>

        </div>
      </section>

      {/* Final Call to Action */}
      <section className="bg-slate-900 py-32 rounded-t-[10rem] text-center px-8">
        <h2 className="text-4xl md:text-6xl font-serif text-white mb-10">Not sure which path is right?</h2>
        <p className="text-white/60 max-w-xl mx-auto mb-16 font-medium">Contact our intake team. We will guide you through our Home programs to find the perfect fit for your healing journey.</p>
        <Link href="/contact" className="btn-premium px-16 py-7 text-lg bg-white text-slate-900">Get in Touch</Link>
      </section>

    </div>
    </RoleGuard>
  );
}

function ServiceDetail({ icon, title, subtitle, desc, color, reverse = false, dark = false }: { icon: React.ReactNode, title: string, subtitle: string, desc: string, color: string, reverse?: boolean, dark?: boolean }) {
  return (
    <div className={`flex flex-col ${reverse ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-center gap-20`}>
       <div className={`flex-1 aspect-[4/3] ${color} rounded-[5rem] flex items-center justify-center p-20 shadow-inner group overflow-hidden relative`}>
          <div className={`relative z-10 ${dark ? 'text-white' : 'text-cedar-primary'} group-hover:scale-125 transition-transform duration-1000`}>
             {icon}
          </div>
          <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
       </div>
       <div className="flex-1 space-y-8">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-cedar-primary mb-4">{subtitle}</p>
            <h3 className="text-5xl font-serif text-slate-900 leading-tight">{title}</h3>
          </div>
          <p className="text-xl text-slate-500 leading-relaxed font-medium">
             {desc}
          </p>
          <div className="pt-8">
             <button className="px-12 py-5 bg-white border border-slate-100 shadow-xl rounded-[2rem] font-bold text-sm text-slate-800 hover:shadow-2xl transition-all flex items-center gap-4">
                Full Program Details <ArrowRight className="w-5 h-5 text-cedar-primary" />
             </button>
          </div>
       </div>
    </div>
  );
}
