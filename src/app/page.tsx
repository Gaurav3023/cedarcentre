"use client";

import { useAuth } from "@/context/AuthContext";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (user) {
        if (user.role === 'admin') router.push('/admin');
        else if (user.role === 'educator') router.push('/educator');
        else router.push('/student');
      } else {
        router.push('/login');
      }
    }
  }, [user, loading, router]);

  return (
    <div className="min-h-screen bg-cedar-background flex items-center justify-center">
      <div className="flex flex-col items-center gap-6">
         <img src="https://cedarcentre.ca/wp-content/uploads/2023/07/cedar-logo1.svg" className="h-16 animate-pulse" alt="Logo" />
         <p className="text-slate-400 font-serif italic animate-pulse">Connecting you to your journey...</p>
      </div>
    </div>
  );
}
