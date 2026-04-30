"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ChevronDown, Heart, ShieldAlert, LogIn, Menu, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function GlobalNavbar() {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const menuItems = [
    {
      title: "About Us",
      links: [
        { name: "Who We are", href: "/about/who-we-are" },
        { name: "Our Team", href: "/about/our-team" },
        { name: "Land Acknowledgement", href: "/about/land-acknowledgement" }
      ]
    },
    {
      title: "Programs & Services",
      links: [
        { name: "Child, Youth & Family Program", href: "/services/child-youth-family" },
        { name: "Adult Program", href: "/services/adult" },
        { name: "Anti-Human Trafficking Program", href: "/services/anti-human-trafficking" },
        { name: "Newcomer’s Health & Well-Being Program", href: "/services/newcomers" },
        { name: "Outreach & Prevention", href: "/services/outreach" }
      ]
    },
    { title: "STAIR Portal", href: "/login", primary: true }
  ];

  const handleSafeExit = () => {
    window.location.href = "https://www.google.com";
  };

  return (
    <>
      {/* Sticky Safe Exit Button */}
      <button 
        onClick={handleSafeExit}
        className="fixed bottom-8 right-8 z-[1000] bg-[#E57E6B] text-white px-8 py-4 rounded-full font-black uppercase tracking-[0.2em] shadow-2xl hover:scale-110 active:scale-95 transition-all flex items-center gap-3"
      >
        <ShieldAlert className="w-5 h-5" />
        Safe Exit
      </button>

      <header className={`fixed top-0 w-full z-[500] transition-all duration-500 ${scrolled ? 'bg-white shadow-xl py-3' : 'bg-transparent py-6'}`}>
        <div className="max-w-7xl mx-auto px-8 flex justify-between items-center">
          
          <div className="flex items-center gap-12">
            <Link href="/" className="shrink-0">
               <img src="https://cedarcentre.ca/wp-content/uploads/2023/07/cedar-logo1.svg" className="h-12 md:h-16" alt="Cedar Centre" />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden xl:flex items-center gap-8">
               <div className="relative group" onMouseEnter={() => setActiveMenu('about')}>
                  <button className={`flex items-center gap-2 text-xs font-black uppercase tracking-widest ${scrolled ? 'text-slate-700' : 'text-slate-800'} hover:text-[#006180] transition-colors`}>
                    About Us <ChevronDown className="w-3 h-3" />
                  </button>
                  <AnimatePresence>
                     {activeMenu === 'about' && (
                        <motion.div 
                          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                          onMouseLeave={() => setActiveMenu(null)}
                          className="absolute top-full left-0 mt-4 w-64 bg-white shadow-2xl rounded-2xl border border-slate-100 overflow-hidden py-4"
                        >
                           {menuItems[0].links?.map(link => (
                              <Link key={link.href} href={link.href} className="block px-8 py-3 text-xs font-bold text-slate-600 hover:bg-slate-50 hover:text-[#006180] transition-all">{link.name}</Link>
                           ))}
                        </motion.div>
                     )}
                  </AnimatePresence>
               </div>

               <div className="relative group" onMouseEnter={() => setActiveMenu('programs')}>
                  <button className={`flex items-center gap-2 text-xs font-black uppercase tracking-widest ${scrolled ? 'text-slate-700' : 'text-slate-800'} hover:text-[#006180] transition-colors`}>
                    Programs & Services <ChevronDown className="w-3 h-3" />
                  </button>
                  <AnimatePresence>
                     {activeMenu === 'programs' && (
                        <motion.div 
                          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                          onMouseLeave={() => setActiveMenu(null)}
                          className="absolute top-full left-0 mt-4 w-80 bg-white shadow-2xl rounded-2xl border border-slate-100 overflow-hidden py-4"
                        >
                           {menuItems[1].links?.map(link => (
                              <Link key={link.href} href={link.href} className="block px-8 py-3 text-xs font-bold text-slate-600 hover:bg-slate-50 hover:text-[#006180] transition-all">{link.name}</Link>
                           ))}
                        </motion.div>
                     )}
                  </AnimatePresence>
               </div>

               <Link href="/child-youth-advocacy" className={`text-xs font-black uppercase tracking-widest ${scrolled ? 'text-slate-700' : 'text-slate-800'} hover:text-[#006180] transition-colors`}>CYAC</Link>
               <Link href="/resources" className={`text-xs font-black uppercase tracking-widest ${scrolled ? 'text-slate-700' : 'text-slate-800'} hover:text-[#006180] transition-colors`}>Resources</Link>
               <Link href="/support-us" className={`text-xs font-black uppercase tracking-widest ${scrolled ? 'text-slate-700' : 'text-slate-800'} hover:text-[#006180] transition-colors`}>Support Us</Link>
               <Link href="/contact" className={`text-xs font-black uppercase tracking-widest ${scrolled ? 'text-slate-700' : 'text-slate-800'} hover:text-[#006180] transition-colors`}>Contact</Link>
            </nav>
          </div>

          <div className="flex items-center gap-4">
             <button className="p-3 text-slate-400 hover:text-[#006180] transition-colors"><Search className="w-5 h-5" /></button>
             <Link href="/donate" className="bg-[#006180] text-white px-8 py-3 rounded-full text-xs font-black uppercase tracking-widest shadow-xl hover:bg-[#004a63] transition-all hidden md:block">Donate</Link>
             <Link href="/login" className="flex items-center gap-2 bg-slate-900 text-white px-8 py-3 rounded-full text-xs font-black uppercase tracking-widest hover:scale-105 transition-all">
                <LogIn className="w-4 h-4" /> Member Login
             </Link>
             <button onClick={() => setMobileMenu(!mobileMenu)} className="xl:hidden p-2 text-slate-800"><Menu /></button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenu && (
            <motion.div initial={{ opacity: 0, x: '100%' }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: '100%' }} className="fixed inset-0 bg-white z-[600] flex flex-col p-12">
               <button onClick={() => setMobileMenu(false)} className="self-end p-4"><X className="w-8 h-8" /></button>
               <div className="flex flex-col gap-8 mt-12">
                  <MobileNavItem label="About Us" href="/about/who-we-are" />
                  <MobileNavItem label="Programs" href="/services" />
                  <MobileNavItem label="CYAC" href="/child-youth-advocacy" />
                  <MobileNavItem label="Resources" href="/resources" />
                  <MobileNavItem label="Donate" href="/donate" />
                  <MobileNavItem label="Contact" href="/contact" />
               </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}

function MobileNavItem({ label, href }: { label: string, href: string }) {
  return <Link href={href} className="text-3xl font-serif text-slate-800">{label}</Link>;
}
