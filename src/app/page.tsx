'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 text-center bg-lumaire-ivory">
      
      <h1 className="font-script text-6xl text-lumaire-wine mb-4">Lumaire Studio</h1>
      
      <p className="font-serif text-2xl text-lumaire-brown max-w-lg leading-relaxed">
        A sanctuary for wedding planners.
      </p>

      {/* BREATHABLE ENTER BUTTON */}
      <motion.div
        className="mt-10"
        animate={{ scale: [1, 1.05, 1] }} // Subtle breathing effect
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        <Link 
          href="/dashboard" 
          className="px-10 py-4 bg-lumaire-wine text-white font-sans text-xs uppercase tracking-[0.2em] hover:bg-lumaire-brown transition-colors shadow-sm"
        >
          Enter Studio
        </Link>
      </motion.div>

      <div className="mt-16 p-8 border border-lumaire-tan rounded-sm">
        <p className="text-sm uppercase tracking-widest text-lumaire-brown/60 mb-2">System Status</p>
        {/* Updated Marketing Text */}
        <div className="font-serif text-xl text-lumaire-brown">Elevating the Industry Standard</div>
      </div>

    </main>
  );
}
