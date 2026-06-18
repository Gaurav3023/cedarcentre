"use client";

import React, { useState, useEffect, useRef } from "react";
import { Calendar as CalendarIcon, Clock, ChevronLeft, ChevronRight, X, ChevronUp, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface DateTimePickerProps {
  value: string; // "YYYY-MM-DDTHH:mm" format or empty
  onChange: (value: string) => void;
  label: string;
}

export default function DateTimePicker({ value, onChange, label }: DateTimePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Parse current value or default to now
  const parsedDate = value ? new Date(value) : null;
  const initialYear = parsedDate ? parsedDate.getFullYear() : new Date().getFullYear();
  const initialMonth = parsedDate ? parsedDate.getMonth() : new Date().getMonth();

  // Temporary picker states
  const [viewYear, setViewYear] = useState(initialYear);
  const [viewMonth, setViewMonth] = useState(initialMonth); // 0-11
  const [selectedDay, setSelectedDay] = useState<number | null>(parsedDate ? parsedDate.getDate() : null);

  const [hours, setHours] = useState(parsedDate ? (parsedDate.getHours() % 12 || 12) : 12);
  const [minutes, setMinutes] = useState(parsedDate ? Math.floor(parsedDate.getMinutes() / 5) * 5 : 0); // round to nearest 5 mins
  const [ampm, setAmpm] = useState<"AM" | "PM">(parsedDate && parsedDate.getHours() >= 12 ? "PM" : "AM");

  // Keep internal states in sync with external value updates
  useEffect(() => {
    if (value) {
      const d = new Date(value);
      if (!isNaN(d.getTime())) {
        setViewYear(d.getFullYear());
        setViewMonth(d.getMonth());
        setSelectedDay(d.getDate());
        const rawH = d.getHours();
        setHours(rawH % 12 || 12);
        setMinutes(d.getMinutes());
        setAmpm(rawH >= 12 ? "PM" : "AM");
      }
    } else {
      setSelectedDay(null);
    }
  }, [value]);

  // Click outside to close
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDayIndex = new Date(viewYear, viewMonth, 1).getDay();

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const handlePrevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear(prev => prev - 1);
    } else {
      setViewMonth(prev => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear(prev => prev + 1);
    } else {
      setViewMonth(prev => prev + 1);
    }
  };

  const formatOutput = (day: number, h: number, m: number, meridian: "AM" | "PM") => {
    let finalHour = h;
    if (meridian === "PM" && h < 12) finalHour += 12;
    if (meridian === "AM" && h === 12) finalHour = 0;

    const pad = (num: number) => String(num).padStart(2, "0");
    return `${viewYear}-${pad(viewMonth + 1)}-${pad(day)}T${pad(finalHour)}:${pad(m)}`;
  };

  const handleDaySelect = (day: number) => {
    setSelectedDay(day);
    const newVal = formatOutput(day, hours, minutes, ampm);
    onChange(newVal);
  };

  const handleTimeChange = (newHours: number, newMinutes: number, newAmpm: "AM" | "PM") => {
    setHours(newHours);
    setMinutes(newMinutes);
    setAmpm(newAmpm);
    if (selectedDay !== null) {
      const newVal = formatOutput(selectedDay, newHours, newMinutes, newAmpm);
      onChange(newVal);
    } else {
      // If no day selected, select today automatically
      const today = new Date();
      let dayToUse = today.getDate();
      if (viewYear === today.getFullYear() && viewMonth === today.getMonth()) {
        dayToUse = today.getDate();
      } else {
        dayToUse = 1;
      }
      setSelectedDay(dayToUse);
      onChange(formatOutput(dayToUse, newHours, newMinutes, newAmpm));
    }
  };

  const incrementHour = () => {
    let nextH = hours + 1;
    if (nextH > 12) nextH = 1;
    handleTimeChange(nextH, minutes, ampm);
  };

  const decrementHour = () => {
    let prevH = hours - 1;
    if (prevH < 1) prevH = 12;
    handleTimeChange(prevH, minutes, ampm);
  };

  const incrementMinute = () => {
    let nextM = minutes + 5;
    if (nextM >= 60) nextM = 0;
    handleTimeChange(hours, nextM, ampm);
  };

  const decrementMinute = () => {
    let prevM = minutes - 5;
    if (prevM < 0) prevM = 55;
    handleTimeChange(hours, prevM, ampm);
  };

  const handleClear = () => {
    onChange("");
    setSelectedDay(null);
    setIsOpen(false);
  };

  // Human friendly formatting for button display
  const getDisplayString = () => {
    if (!value || !parsedDate) return "Choose date & time...";
    return parsedDate.toLocaleString([], {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true
    });
  };

  // Generate day cells
  const dayCells = [];
  // Empty slots for offset
  for (let i = 0; i < firstDayIndex; i++) {
    dayCells.push(<div key={`empty-${i}`} className="w-10 h-10" />);
  }
  // Days of the month
  for (let d = 1; d <= daysInMonth; d++) {
    const isSelected = selectedDay === d && parsedDate && parsedDate.getMonth() === viewMonth && parsedDate.getFullYear() === viewYear;
    const isToday = new Date().getDate() === d && new Date().getMonth() === viewMonth && new Date().getFullYear() === viewYear;
    
    dayCells.push(
      <button
        key={`day-${d}`}
        type="button"
        onClick={() => handleDaySelect(d)}
        className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all relative ${
          isSelected
            ? "bg-cedar-primary text-white scale-105 shadow-md shadow-cedar-primary/20"
            : isToday
            ? "border border-cedar-primary text-cedar-primary font-bold"
            : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
        }`}
      >
        {d}
        {isToday && !isSelected && (
          <span className="absolute bottom-1 w-1 h-1 bg-cedar-primary rounded-full" />
        )}
      </button>
    );
  }

  return (
    <div className="relative w-full" ref={containerRef}>
      <label className="text-xs font-black uppercase text-slate-400 tracking-widest ml-1 block mb-2">{label}</label>
      
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-slate-50 border border-slate-100 rounded-3xl px-8 py-5 text-sm outline-none cursor-pointer flex items-center justify-between text-left hover:bg-slate-100/50 transition-colors focus:ring-4 focus:ring-cedar-primary/5"
      >
        <span className={`font-medium ${value ? "text-slate-800" : "text-slate-400"}`}>
          {getDisplayString()}
        </span>
        <div className="flex items-center gap-2 text-slate-400">
          {value && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleClear();
              }}
              className="p-1 hover:text-slate-600 rounded-full transition-colors mr-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <CalendarIcon className="w-5 h-5" />
        </div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute z-[500] left-0 mt-3 bg-white border border-slate-100 rounded-[2.5rem] p-6 shadow-2xl w-full max-w-[360px] md:max-w-[400px]"
          >
            {/* Calendar Header */}
            <div className="flex justify-between items-center mb-6">
              <button
                type="button"
                onClick={handlePrevMonth}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-xl transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="font-serif text-lg font-bold text-slate-800 italic">
                {monthNames[viewMonth]} {viewYear}
              </span>
              <button
                type="button"
                onClick={handleNextMonth}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-xl transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Weekdays */}
            <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-black uppercase text-slate-400 tracking-wider mb-2">
              <div>Su</div>
              <div>Mo</div>
              <div>Tu</div>
              <div>We</div>
              <div>Th</div>
              <div>Fr</div>
              <div>Sa</div>
            </div>

            {/* Days Grid */}
            <div className="grid grid-cols-7 gap-1 mb-6 justify-items-center">
              {dayCells}
            </div>

            {/* Time Picker Divider */}
            <div className="border-t border-slate-100 pt-5 mb-5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-cedar-primary" /> Select Time
                </span>
                
                {/* AM/PM Toggle */}
                <div className="flex bg-slate-50 p-1 rounded-xl border border-slate-100/50">
                  <button
                    type="button"
                    onClick={() => handleTimeChange(hours, minutes, "AM")}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                      ampm === "AM" ? "bg-white text-cedar-primary shadow-sm" : "text-slate-400"
                    }`}
                  >
                    AM
                  </button>
                  <button
                    type="button"
                    onClick={() => handleTimeChange(hours, minutes, "PM")}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                      ampm === "PM" ? "bg-white text-cedar-primary shadow-sm" : "text-slate-400"
                    }`}
                  >
                    PM
                  </button>
                </div>
              </div>

              {/* Time Control Dials */}
              <div className="flex items-center justify-center gap-4 mt-4 bg-slate-50/50 rounded-2xl p-4 border border-slate-100/50">
                {/* Hour */}
                <div className="flex flex-col items-center">
                  <button
                    type="button"
                    onClick={incrementHour}
                    className="p-1.5 text-slate-400 hover:text-cedar-primary hover:bg-white rounded-lg transition-all"
                  >
                    <ChevronUp className="w-4 h-4" />
                  </button>
                  <span className="text-2xl font-bold text-slate-700 w-8 text-center select-none my-1">
                    {String(hours).padStart(2, "0")}
                  </span>
                  <button
                    type="button"
                    onClick={decrementHour}
                    className="p-1.5 text-slate-400 hover:text-cedar-primary hover:bg-white rounded-lg transition-all"
                  >
                    <ChevronDown className="w-4 h-4" />
                  </button>
                </div>

                <span className="text-2xl font-bold text-slate-400 select-none animate-pulse">:</span>

                {/* Minute */}
                <div className="flex flex-col items-center">
                  <button
                    type="button"
                    onClick={incrementMinute}
                    className="p-1.5 text-slate-400 hover:text-cedar-primary hover:bg-white rounded-lg transition-all"
                  >
                    <ChevronUp className="w-4 h-4" />
                  </button>
                  <span className="text-2xl font-bold text-slate-700 w-8 text-center select-none my-1">
                    {String(minutes).padStart(2, "0")}
                  </span>
                  <button
                    type="button"
                    onClick={decrementMinute}
                    className="p-1.5 text-slate-400 hover:text-cedar-primary hover:bg-white rounded-lg transition-all"
                  >
                    <ChevronDown className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Done Action */}
            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="bg-cedar-primary text-white font-serif italic text-sm px-6 py-2.5 rounded-2xl shadow-lg hover:scale-105 transition-all animate-pulse"
              >
                Set Date & Time
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
