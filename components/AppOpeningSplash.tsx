'use client';

import React, {useEffect} from 'react';
import {motion} from 'motion/react';

interface AppOpeningSplashProps {
  onFinish: () => void;
}

export default function AppOpeningSplash({onFinish}: AppOpeningSplashProps) {
  useEffect(() => {
    const timer = window.setTimeout(() => {
      onFinish();
    }, 1350);
    return () => window.clearTimeout(timer);
  }, [onFinish]);

  return (
    <motion.div
      initial={{opacity: 1}}
      animate={{opacity: 1}}
      exit={{opacity: 0, transition: {duration: 0.22, ease: 'easeOut'}}}
      className="fixed inset-0 z-50 bg-[#123B63] flex flex-col items-center justify-center p-6 text-white select-none"
    >
      <motion.div
        initial={{scale: 0.8, opacity: 0}}
        animate={{scale: 1, opacity: 1}}
        transition={{duration: 0.4, ease: [0.16, 1, 0.3, 1]}}
        className="relative flex flex-col items-center text-center max-w-md"
      >
        <div className="relative mb-6 flex items-center justify-center">
          <motion.div
            animate={{scale: [1, 1.15, 1], opacity: [0.35, 0.12, 0.35]}}
            transition={{duration: 1.5, repeat: Infinity, ease: 'easeInOut'}}
            className="absolute h-36 w-36 rounded-full border-2 border-[#FAB401]/50"
          />
          <div className="h-24 w-24 rounded-3xl bg-white flex items-center justify-center shadow-xl border border-[#D9DEE5]">
            <svg viewBox="0 0 64 64" className="h-14 w-14" fill="none">
              <path
                d="M12 36C17 22 25 16 32 16C39 16 47 22 52 36"
                stroke="#D32828"
                strokeWidth="3.8"
                strokeLinecap="round"
              />
              <path
                d="M18 42C22 30 27 25 32 25C37 25 42 30 46 42"
                stroke="#F0A900"
                strokeWidth="3.2"
                strokeLinecap="round"
              />
              <circle cx="32" cy="15" r="4" fill="#D32828" />
              <path
                d="M16 50H48"
                stroke="#123B63"
                strokeWidth="3.2"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>

        <motion.div
          initial={{y: 8, opacity: 0}}
          animate={{y: 0, opacity: 1}}
          transition={{delay: 0.1, duration: 0.3}}
        >
          <div className="text-xs font-bold tracking-widest text-[#FAB401] uppercase">
            Government of Gujarat · Digital India
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-white mt-2 tracking-tight">
            SevaAI
          </h1>
          <p className="text-sm sm:text-base text-white/85 mt-1.5 font-medium">
            સ્માર્ટ તાલુકા કચેરી · સરળ નાગરિક સેવા કિઓસ્ક
          </p>
        </motion.div>

        <div className="w-56 h-1.5 rounded-full bg-white/20 overflow-hidden mt-7">
          <motion.div
            initial={{width: '0%'}}
            animate={{width: '100%'}}
            transition={{duration: 1.15, ease: 'easeInOut'}}
            className="h-full rounded-full bg-gradient-to-r from-[#F0A900] via-[#FFFFFF] to-[#046A38]"
          />
        </div>

        <button
          type="button"
          onClick={onFinish}
          className="mt-6 text-xs font-bold text-[#FAB401] hover:text-white underline underline-offset-4 cursor-pointer"
        >
          પ્રવેશ કરો (Enter Now)
        </button>
      </motion.div>
    </motion.div>
  );
}
