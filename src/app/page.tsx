'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { ArrowRight, MoveRight } from 'lucide-react';

// --- COMPONENTS ---

// 1. MAGNETIC BUTTON
// A button that physically pulls towards the cursor
const MagneticButton = ({ children, href }: { children: React.ReactNode, href: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { damping: 15, stiffness: 150, mass: 0.1 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current!.getBoundingClientRect();
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    x.set(middleX * 0.2); // Pull strength
    y.set(middleY * 0.2);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <Link href={href} legacyBehavior>
        <motion.div
            ref={ref}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ x: springX, y: springY }}
            className="cursor-pointer relative group"
        >
            <div className="relative overflow-hidden rounded-full bg-lumaire-wine px-8 py-4 text-white transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-lumaire-wine/30">
                <span className="relative z-10 flex items-center gap-2 font-sans text-sm uppercase tracking-widest">
                    {children} <MoveRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </span>
                {/* Liquid Fill Effect */}
                <div className="absolute inset-0 z-0 h-full w-full scale-0 rounded-full bg-white/10 transition-transform duration-300 group-hover:scale-150" />
            </div>
        </motion.div>
    </Link>
  );
};

// 2. 3D TILT CARD
// The status card that follows mouse movement
const TiltCard = () => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useTransform(y, [-100, 100], [10, -10]); // Reverse physics
  const rotateY = useTransform(x, [-100, 100], [-10, 10]);

  return (
    <motion.div
      style={{ x, y, rotateX, rotateY, z: 100 }}
      drag
      dragConstraints={{ top: 0, left: 0, right: 0, bottom: 0 }}
      dragElastic={0.1}
      whileHover={{ cursor: "grab" }}
      className="relative perspective-1000"
    >
      <div className="relative backdrop-blur-md bg-white/40 border border-white/50 p-8 rounded-sm shadow-xl max-w-sm mx-auto overflow-hidden">
        {/* Shimmer Effect */}
        <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/40 to-white/0 z-0 opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
        
        <div className="relative z-10 text-center">
            <div className="w-2 h-2 bg-green-500 rounded-full mx-auto mb-3 animate-pulse"></div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-lumaire-brown/60 mb-2">System Operational</p>
            <div className="font-serif text-2xl text-lumaire-brown">Ready for Phase 1</div>
        </div>
      </div>
    </motion.div>
  );
};

export default function Home() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center p-8 overflow-hidden">
      
      {/* GLOBAL NOISE OVERLAY */}
      <div className="noise-bg" />

      {/* AMBIENT BACKGROUND BLOBS */}
      <div className="absolute inset-0 overflow-hidden -z-10">
        <motion.div 
            animate={{ 
                x: [-50, 50, -50], 
                y: [-20, 20, -20],
                opacity: [0.3, 0.5, 0.3]
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-1/4 left-1/4 w-96 h-96 bg-lumaire-tan/20 rounded-full blur-[100px]" 
        />
        <motion.div 
            animate={{ 
                x: [50, -50, 50], 
                y: [20, -20, 20],
                opacity: [0.2, 0.4, 0.2]
            }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-lumaire-wine/5 rounded-full blur-[120px]" 
        />
      </div>

      {/* CONTENT */}
      <div className="relative z-10 flex flex-col items-center text-center space-y-12 max-w-3xl">
        
        {/* Animated Title */}
        <div className="overflow-hidden">
            <motion.h1 
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                className="font-script text-7xl md:text-9xl text-lumaire-wine mb-2"
            >
                Lumaire Studio
            </motion.h1>
        </div>

        {/* Animated Subtitle */}
        <motion.p 
            initial={{ opacity: 0, filter: 'blur(10px)' }}
            animate={{ opacity: 1, filter: 'blur(0px)' }}
            transition={{ delay: 0.5, duration: 1 }}
            className="font-serif text-2xl md:text-3xl text-lumaire-brown max-w-lg leading-relaxed"
        >
            A sanctuary for wedding planners.
        </motion.p>

        {/* 3D Tilt Status Card */}
        <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.8 }}
        >
            <TiltCard />
        </motion.div>

        {/* Call to Action */}
        <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="pt-8"
        >
            <MagneticButton href="/dashboard">
                Enter Studio
            </MagneticButton>
        </motion.div>

      </div>

      {/* FOOTER */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-8 text-[10px] uppercase tracking-widest text-lumaire-brown/40"
      >
        Designed in Miami • Est 2026
      </motion.div>
    </main>
  );
}
