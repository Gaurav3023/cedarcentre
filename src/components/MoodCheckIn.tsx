"use client";

import { motion } from "framer-motion";
import { useState } from "react";

const moods = [
  { emoji: "😊", label: "Happy", color: "bg-yellow-100 text-yellow-700" },
  { emoji: "😐", label: "Okay", color: "bg-blue-100 text-blue-700" },
  { emoji: "😢", label: "Sad", color: "bg-indigo-100 text-indigo-700" },
  { emoji: "😤", label: "Angry", color: "bg-red-100 text-red-700" },
  { emoji: "😴", label: "Tired", color: "bg-purple-100 text-purple-700" },
  { emoji: "✨", label: "Magical", color: "bg-pink-100 text-pink-700" },
];

export default function MoodCheckIn() {
  const [selected, setSelected] = useState<number | null>(null);

  return (
    <div className="bg-white/80 p-8 rounded-[3rem] shadow-sm">
      <h3 className="text-xl font-bold text-slate-800 mb-2">How are you feeling?</h3>
      <p className="text-slate-500 text-sm mb-6">It&apos;s okay to feel however you feel.</p>
      
      <div className="grid grid-cols-3 gap-3">
        {moods.map((mood, idx) => (
          <motion.button
            key={mood.label}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelected(idx)}
            className={`p-4 rounded-3xl flex flex-col items-center justify-center transition-all border-2 ${
              selected === idx 
              ? `${mood.color} border-current` 
              : "bg-slate-50 border-transparent text-slate-400 grayscale"
            }`}
          >
            <span className="text-3xl mb-1">{mood.emoji}</span>
            <span className="text-[10px] font-bold uppercase tracking-wider">{mood.label}</span>
          </motion.button>
        ))}
      </div>
      
      {selected !== null && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 p-4 bg-cedar-50 rounded-2xl text-cedar-700 text-center text-sm font-medium"
        >
          Thank you for sharing. You are safe here.
        </motion.div>
      )}
    </div>
  );
}
