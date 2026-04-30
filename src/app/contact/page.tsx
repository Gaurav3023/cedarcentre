"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Phone, Mail, MapPin, Clock, ArrowLeft, Send, ShieldCheck } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import RoleGuard from "@/components/RoleGuard";

export default function ContactPage() {
  return (
    <RoleGuard allowedRoles={['student', 'educator', 'admin']}>
    <div className="min-h-screen bg-[#FDFCFB]">
      
      {/* Mini Nav */}
      <nav className="p-8 flex justify-between items-center max-w-7xl mx-auto">
        <Link href="/">
           <img src="https://cedarcentre.ca/wp-content/uploads/2023/07/cedar-logo1.svg" className="h-10" alt="Logo" />
        </Link>
        <Link href="/" className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-400 hover:text-cedar-primary transition-colors">
           <ArrowLeft className="w-4 h-4" /> Exit to Home
        </Link>
      </nav>

      <main className="max-w-7xl mx-auto px-8 pt-20 pb-40">
        <div className="grid lg:grid-cols-2 gap-32">
           
           <div>
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-cedar-primary mb-8">Reach Out</p>
              <h1 className="text-7xl md:text-8xl font-serif text-slate-900 leading-[1.05] mb-12">Get in <br />Touch</h1>
              <p className="text-xl text-slate-500 leading-relaxed font-medium mb-16">
                 Recovering from childhood trauma begins here. Whether you are looking for therapy, training, or information, we are here to listen.
              </p>

              <div className="space-y-12">
                 <ContactItem 
                   icon={<Phone className="w-6 h-6" />}
                   title="Telephone"
                   value="905-853-3040"
                   sub="Toll Free: 1-800-263-2240"
                 />
                 <ContactItem 
                   icon={<Mail className="w-6 h-6" />}
                   title="Email"
                   value="info@cedarcentre.ca"
                   sub="Monitored daily during business hours"
                 />
                 <ContactItem 
                   icon={<MapPin className="w-6 h-6" />}
                   title="Location"
                   value="Newmarket, Ontario"
                   sub="Serving the community of York Region"
                 />
              </div>

              <div className="mt-20 p-8 bg-cedar-aqua/10 rounded-[3rem] border border-cedar-aqua/20 flex items-center gap-6">
                 <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                    <Clock className="w-6 h-6 text-cedar-primary" />
                 </div>
                 <div>
                    <h4 className="font-bold text-slate-800">Business Hours</h4>
                    <p className="text-xs text-slate-500 font-medium">Mon - Fri: 9:00 AM - 5:00 PM</p>
                 </div>
              </div>
           </div>

           <div className="relative">
              <div className="bg-white rounded-[5rem] p-12 md:p-20 shadow-premium border border-slate-50 relative z-10">
                 <h2 className="text-3xl font-serif text-slate-800 mb-10">Send a Private Message</h2>
                 <form className="space-y-8">
                    <div className="grid md:grid-cols-2 gap-8">
                       <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Full Name</label>
                          <input type="text" className="input-field py-4 px-6 text-sm" placeholder="Your name" />
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Email Address</label>
                          <input type="email" className="input-field py-4 px-6 text-sm" placeholder="email@example.com" />
                       </div>
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase text-slate-400 ml-1">How can we help?</label>
                       <select className="input-field py-4 px-6 text-sm appearance-none cursor-pointer">
                          <option>Inquiry for Therapy</option>
                          <option>Education / Training</option>
                          <option>Donation / Volunteering</option>
                          <option>Other</option>
                       </select>
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Your Message</label>
                       <textarea rows={6} className="input-field py-4 px-6 text-sm resize-none" placeholder="How can we assist you today?"></textarea>
                    </div>
                    <button type="submit" className="btn-premium w-full py-6 text-lg flex items-center justify-center gap-4">
                       Send Message <Send className="w-5 h-5" />
                    </button>
                    <div className="flex items-center justify-center gap-2 text-[10px] font-black uppercase text-slate-300 tracking-widest mt-8">
                       <ShieldCheck className="w-4 h-4" /> Secure & Anonymous Transmission
                    </div>
                 </form>
              </div>
              
              {/* Decorative Blur */}
              <div className="absolute top-20 -right-20 w-[400px] h-[400px] bg-cedar-coral/10 blur-[100px] rounded-full pointer-events-none" />
           </div>

        </div>
      </main>

    </div>
    </RoleGuard>
  );
}

function ContactItem({ icon, title, value, sub }: { icon: React.ReactNode, title: string, value: string, sub: string }) {
  return (
    <div className="flex gap-8 group">
       <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center shadow-lg border border-slate-50 group-hover:scale-110 transition-transform">
          <div className="text-cedar-primary">{icon}</div>
       </div>
       <div>
          <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2">{title}</h4>
          <p className="text-2xl font-bold text-slate-800 mb-1">{value}</p>
          <p className="text-sm text-slate-400 font-medium">{sub}</p>
       </div>
    </div>
  );
}
