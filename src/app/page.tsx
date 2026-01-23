"use client";

import { motion } from "framer-motion";

export default function Home() {
  // Animation Variants for cleaner code
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.3, // Delay each item by 0.3s
        delayChildren: 0.5    // Wait 0.5s before starting
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20, filter: "blur(10px)" }, // Start blurry and lower
    visible: { 
      opacity: 1, 
      y: 0, 
      filter: "blur(0px)",
      transition: { duration: 1.2, ease: [0.22, 1, 0.36, 1] } // "Cinematic" easing
    }
  };

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center p-8 text-center overflow-hidden">
      
      {/* --- Ambient Background Effects --- */}
      
      {/* 1. The "God Ray" Light Orb */}
      <motion.div 
        className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-lumaire-tan/20 rounded-full blur-[120px] pointer-events-none mix-blend-multiply"
        animate={{ 
          scale: [1, 1.2, 1], 
          x: [0, 50, 0],
          y: [0, 30, 0] 
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
      />
      
      {/* 2. Secondary Wine Orb for depth */}
      <motion.div 
        className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-lumaire-wine/10 rounded-full blur-[100px] pointer-events-none"
        animate={{ 
          scale: [1, 1.1, 1], 
          x: [0, -30, 0] 
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />

      {/* --- Main Content --- */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10"
      >
        {/* Logo */}
        <motion.div variants={itemVariants}>
          <h1 className="font-script text-7xl md:text-9xl text-lumaire-wine mb-6 relative">
            Lumaire Studio
            {/* Subtle glow behind text */}
            <span className="absolute inset-0 blur-2xl bg-lumaire-wine/20 -z-10 opacity-50"></span>
          </h1>
        </motion.div>

        {/* Tagline */}
        <motion.div variants={itemVariants}>
          <p className="font-serif text-2xl md:text-3xl text-lumaire-brown max-w-xl mx-auto leading-relaxed italic opacity-90">
            A sanctuary for wedding planners.
          </p>
        </motion.div>

        {/* Status Box - Glassmorphism & Hover Physics */}
        <motion.div 
          variants={itemVariants} 
          className="mt-16"
        >
          <motion.div 
            whileHover={{ scale: 1.02, y: -5 }} // Magnetic lift effect
            whileTap={{ scale: 0.98 }}
            className="group relative inline-block"
          >
            {/* The Box */}
            <div className="
              relative overflow-hidden
              p-8 md:px-12 md:py-8 
              border border-lumaire-tan/30 
              bg-white/40 backdrop-blur-md 
              shadow-[0_8px_32px_rgba(196,160,146,0.15)]
              rounded-sm
              transition-colors duration-500
              hover:bg-white/60 hover:border-lumaire-tan/50
            ">
              {/* Shimmer Effect on Hover */}
              <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/40 to-transparent z-0 pointer-events-none" />

              <div className="relative z-10">
                <p className="text-xs font-sans uppercase tracking-[0.25em] text-lumaire-brown/60 mb-3">System Status</p>
                <div className="font-serif text-2xl text-lumaire-wine flex items-center gap-3">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                  </span>
                  Ready for Phase 1 Build
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>

      </motion.div>
    </main>
  );
}
