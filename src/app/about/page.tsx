"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Shield, Users, Heart, Award, CheckCircle, ArrowLeft } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import RoleGuard from "@/components/RoleGuard";

export default function AboutPage() {
  return (
    <RoleGuard allowedRoles={['student', 'educator', 'admin']}>
    <div className="min-h-screen bg-cedar-background selection:bg-cedar-aqua/30">
      
      {/* Mini Nav */}
      <nav className="p-8 flex justify-between items-center max-w-7xl mx-auto">
        <Link href="/">
           <img src="https://cedarcentre.ca/wp-content/uploads/2023/07/cedar-logo1.svg" className="h-10" alt="Logo" />
        </Link>
        <Link href="/" className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-400 hover:text-cedar-primary transition-colors">
           <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>
      </nav>

      {/* Hero Header */}
      <section className="pt-20 pb-32 max-w-7xl mx-auto px-8">
        <div className="max-w-3xl">
           <p className="text-[10px] font-black uppercase tracking-[0.4em] text-cedar-primary mb-8">Our History & Heart</p>
           <h1 className="text-7xl md:text-8xl font-serif text-slate-900 leading-[1.1] mb-12">Who We Are</h1>
           <p className="text-2xl text-slate-500 leading-relaxed font-medium">
             Cedar Centre has a long history of helping children, youth, and adults recover from the impact that interpersonal childhood trauma has had on their lives.
           </p>
        </div>
      </section>

      {/* Content Grid */}
      <section className="max-w-7xl mx-auto px-8 pb-40">
        <div className="grid lg:grid-cols-2 gap-32">
           <div className="space-y-12">
              <div className="bg-white p-12 rounded-[4rem] shadow-premium border border-slate-50 relative overflow-hidden">
                 <div className="absolute top-0 right-0 p-12 opacity-5">
                    <Shield className="w-40 h-40" />
                 </div>
                 <h2 className="text-4xl font-serif text-slate-800 mb-8">Founded in 1987.</h2>
                 <p className="text-slate-500 leading-relaxed font-medium mb-8">
                   Serving the community of York Region for over three decades, just as cedar trees are known for their resilience and restorative properties, our mission is to provide a unique and holistic approach to therapy, education and advocacy.
                 </p>
                 <p className="text-slate-500 leading-relaxed font-medium">
                   We work from anti-racist and anti-oppressive frameworks, serving people ages 3 years old and older. We are committed to improving lives through trauma-specific plans designed to meet unique needs.
                 </p>
              </div>

              <div className="grid grid-cols-2 gap-8">
                 <StatBox label="Years of Service" value="37+" />
                 <StatBox label="Lives Impacted" value="10k+" />
                 <StatBox label="Specialists" value="50+" />
                 <StatBox label="Success Rate" value="98%" />
              </div>
           </div>

           <div className="space-y-16">
              <div>
                 <h3 className="text-3xl font-serif text-slate-800 mb-10">Our Pillars of Excellence</h3>
                 <div className="space-y-10">
                    <PillarItem 
                      icon={<Award className="w-6 h-6 text-cedar-primary" />} 
                      title="Clinical Excellence" 
                      desc="Highest standards of trauma-specific psychiatric and psychological care." 
                    />
                    <PillarItem 
                      icon={<Users className="w-6 h-6 text-cedar-primary" />} 
                      title="Our People" 
                      desc="A diverse team of compassionate professionals dedicated to healing." 
                    />
                    <PillarItem 
                      icon={<Heart className="w-6 h-6 text-cedar-primary" />} 
                      title="Education" 
                      desc="Sharing knowledge to prevent trauma and support secondary recovery." 
                    />
                     <PillarItem 
                      icon={<Shield className="w-6 h-6 text-cedar-primary" />} 
                      title="Leadership" 
                      desc="Setting the standard for trauma-informed care in Ontario and beyond." 
                    />
                 </div>
              </div>

              <div className="bg-slate-900 rounded-[3rem] p-12 text-white shadow-2xl relative overflow-hidden">
                 <div className="absolute inset-0 bg-brand-gradient opacity-20" />
                 <h4 className="text-2xl font-serif mb-6 relative z-10">Join our team?</h4>
                 <p className="text-sm font-medium opacity-60 mb-10 relative z-10">We are always looking for compassionate individuals to join our Home.</p>
                 <button className="px-10 py-4 bg-white text-slate-900 font-bold rounded-2xl text-xs relative z-10 hover:bg-cedar-aqua transition-colors">View Careers</button>
              </div>
           </div>
        </div>
      </section>

      {/* Corporate Values */}
      <section className="bg-white py-40 rounded-t-[10rem]">
         <div className="max-w-7xl mx-auto px-8">
            <div className="text-center mb-24">
               <h2 className="text-5xl font-serif text-slate-900 mb-6">Our Guiding Values</h2>
               <p className="text-slate-400 font-medium max-w-xl mx-auto italic">The principles that navigate every interaction and therapeutic plan within our Home.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-12">
               <ValueBox title="Acknowledgement" desc="Validating and bearing witness to the experiences of our community." />
               <ValueBox title="Safety" desc="Establishing physical and emotional security for all who enter." />
               <ValueBox title="Trustworthiness" desc="Clarity in communication and transparency in our therapeutic processes." />
               <ValueBox title="Choice & Control" desc="Empowering individuals to lead their own journey of recovery." />
               <ValueBox title="Collaboration" desc="Cultivating mutual respect and shared decision making with participants." />
               <ValueBox title="Empowerment" desc="Harnessing strengths to build resilience and future confidence." />
            </div>
         </div>
      </section>

    </div>
    </RoleGuard>
  );
}

function StatBox({ label, value }: { label: string, value: string }) {
  return (
    <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-50 text-center hover:shadow-premium transition-all">
       <h4 className="text-4xl font-serif text-cedar-primary mb-2">{value}</h4>
       <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{label}</p>
    </div>
  );
}

function PillarItem({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="flex gap-8 group">
       <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-lg border border-slate-50 group-hover:scale-110 transition-transform">
          {icon}
       </div>
       <div>
          <h4 className="font-bold text-slate-800 text-xl mb-2">{title}</h4>
          <p className="text-sm text-slate-500 font-medium leading-relaxed">{desc}</p>
       </div>
    </div>
  );
}

function ValueBox({ title, desc }: { title: string, desc: string }) {
  return (
    <div className="p-12 bg-cedar-background rounded-[4rem] border border-slate-50 hover:bg-white hover:shadow-premium transition-all">
       <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center mb-8 shadow-sm">
          <CheckCircle className="w-5 h-5 text-cedar-primary" />
       </div>
       <h4 className="font-bold text-xl text-slate-800 mb-4">{title}</h4>
       <p className="text-sm text-slate-500 leading-relaxed font-medium">{desc}</p>
    </div>
  );
}
