'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 text-center bg-lumaire-cream overflow-hidden">
      
      {/* 1. Logo & Title */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }} // "Luxurious" easing curve
      >
        <h1 className="font-script text-6xl md:text-7xl text-lumaire-wine mb-6">
          Lumaire Studio
        </h1>
      </motion.div>

      {/* 2. Subtitle */}
      <motion.p
        className="font-serif text-2xl text-lumaire-brown max-w-lg leading-relaxed"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
      >
        A sanctuary for wedding planners.
      </motion.p>

      {/* 3. The Enter Button */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
        className="mt-10"
      >
        <Link 
          href="/dashboard" 
          className="group relative inline-flex items-center justify-center px-8 py-3 overflow-hidden font-sans text-sm font-medium tracking-widest text-lumaire-brown uppercase border border-lumaire-tan transition-all duration-300 hover:bg-lumaire-wine hover:text-white hover:border-lumaire-wine"
        >
          <span className="relative z-10">Enter Studio</span>
        </Link>
      </motion.div>

      {/* 4. System Status (Your original box) */}
      <motion.div 
        className="mt-16 p-8 border border-lumaire-tan/30 rounded-sm bg-white/40 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5, delay: 0.6 }}
      >
        <div className="flex items-center justify-center gap-2 mb-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            <p className="text-xs uppercase tracking-widest text-lumaire-brown/60">System Status</p>
        </div>
        <div className="font-serif text-xl text-lumaire-brown">Ready for Phase 1 Build</div>
      </motion.div>

    </main>
  );
}
