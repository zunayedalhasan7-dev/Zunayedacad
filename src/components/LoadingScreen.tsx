import React from 'react';
import { GraduationCap } from 'lucide-react';
import { motion } from 'motion/react';

export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-white z-[9999]">
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          opacity: [1, 0.8, 1],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="bg-primary-600 p-4 rounded-2xl shadow-xl shadow-primary-200"
      >
        <GraduationCap className="h-12 w-12 text-white" />
      </motion.div>
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-6 text-primary-900 font-medium tracking-wide flex items-center space-x-2"
      >
        <span>জুনায়েদ একাডেমি লোড হচ্ছে...</span>
      </motion.p>
    </div>
  );
}
