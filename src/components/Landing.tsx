import React from 'react';
import { motion } from 'motion/react';
import { Shield, Smartphone, Globe, MessageSquare, ArrowRight } from 'lucide-react';
import UrlSafetyChecker from './UrlSafetyChecker';

interface LandingProps {
  onStart: () => void;
}

export default function Landing({ onStart }: LandingProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-6 relative overflow-hidden transition-colors duration-300">
      {/* Background decorative elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40rem] h-[40rem] bg-indigo-500/20 dark:bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40rem] h-[40rem] bg-purple-500/20 dark:bg-purple-600/20 rounded-full blur-[120px] pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, type: "spring", bounce: 0.3 }}
        className="max-w-4xl w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-[3rem] shadow-2xl dark:shadow-indigo-900/20 overflow-hidden border border-white/40 dark:border-slate-800/60 relative z-10"
      >
        <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-800 p-12 md:p-20 text-center text-white">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
          
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="relative z-10 flex flex-col items-center"
          >
            <h1 className="text-5xl md:text-7xl font-black mb-8 tracking-tighter leading-[1.1]">
              Master Your <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-200 via-purple-200 to-indigo-200 animate-gradient-x">
                Digital World
              </span>
            </h1>
            <p className="text-indigo-100/90 text-lg md:text-2xl max-w-2xl mx-auto font-medium leading-relaxed">
              Does growing up with technology automatically lead to digital literacy? 
              Test your skills, discover your strengths, and get a personalized AI-generated avatar.
            </p>
          </motion.div>
        </div>
        
        <div className="p-8 md:p-12 lg:p-16">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-800 dark:text-slate-100 mb-6 tracking-tight">
              What we measure
            </h2>
            <div className="w-24 h-1.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full mx-auto"></div>
          </div>
          
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-12 mb-16"
          >
            <motion.div variants={itemVariants} className="flex items-start gap-6 group">
              <div className="p-5 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-2xl group-hover:scale-110 group-hover:bg-indigo-100 dark:group-hover:bg-indigo-500/20 transition-all duration-300 shadow-sm border border-indigo-100/50 dark:border-indigo-500/20">
                <Globe className="w-8 h-8" />
              </div>
              <div>
                <h3 className="font-bold text-xl text-slate-800 dark:text-slate-100 mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">Information Literacy</h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-base">Evaluating sources, spotting fake news, and finding reliable information.</p>
              </div>
            </motion.div>
            
            <motion.div variants={itemVariants} className="flex items-start gap-6 group">
              <div className="p-5 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-2xl group-hover:scale-110 group-hover:bg-emerald-100 dark:group-hover:bg-emerald-500/20 transition-all duration-300 shadow-sm border border-emerald-100/50 dark:border-emerald-500/20">
                <Shield className="w-8 h-8" />
              </div>
              <div>
                <h3 className="font-bold text-xl text-slate-800 dark:text-slate-100 mb-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">Privacy & Security</h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-base">Protecting personal data, creating strong passwords, and avoiding scams.</p>
              </div>
            </motion.div>
            
            <motion.div variants={itemVariants} className="flex items-start gap-6 group">
              <div className="p-5 bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-2xl group-hover:scale-110 group-hover:bg-amber-100 dark:group-hover:bg-amber-500/20 transition-all duration-300 shadow-sm border border-amber-100/50 dark:border-amber-500/20">
                <Smartphone className="w-8 h-8" />
              </div>
              <div>
                <h3 className="font-bold text-xl text-slate-800 dark:text-slate-100 mb-2 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">Digital Footprint</h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-base">Understanding the long-term impact of your online presence and identity.</p>
              </div>
            </motion.div>
            
            <motion.div variants={itemVariants} className="flex items-start gap-6 group">
              <div className="p-5 bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 rounded-2xl group-hover:scale-110 group-hover:bg-rose-100 dark:group-hover:bg-rose-500/20 transition-all duration-300 shadow-sm border border-rose-100/50 dark:border-rose-500/20">
                <MessageSquare className="w-8 h-8" />
              </div>
              <div>
                <h3 className="font-bold text-xl text-slate-800 dark:text-slate-100 mb-2 group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">Digital Communication</h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-base">Practicing good netiquette and handling online interactions responsibly.</p>
              </div>
            </motion.div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="flex justify-center mb-16"
          >
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onStart}
              className="group relative inline-flex items-center justify-center gap-4 px-10 py-5 bg-slate-900 dark:bg-indigo-600 hover:bg-slate-800 dark:hover:bg-indigo-500 text-white rounded-full font-black text-xl transition-all duration-300 shadow-xl hover:shadow-2xl hover:shadow-indigo-500/30 overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-3">
                Start Assessment
                <ArrowRight className="w-6 h-6 group-hover:translate-x-1.5 transition-transform" />
              </span>
              <div className="absolute inset-0 h-full w-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" style={{ transform: 'skewX(-20deg)' }} />
            </motion.button>
          </motion.div>

          <UrlSafetyChecker />
        </div>
      </motion.div>
    </div>
  );
}
