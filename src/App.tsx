/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import Landing from './components/Landing';
import Assessment from './components/Assessment';
import Results from './components/Results';
import { AnimatePresence, motion } from 'motion/react';

type AppState = 'landing' | 'assessment' | 'results';

export default function App() {
  const [appState, setAppState] = useState<AppState>('landing');
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const handleStart = () => {
    setAppState('assessment');
    setAnswers({});
  };

  const handleComplete = (finalAnswers: Record<string, string>) => {
    setAnswers(finalAnswers);
    setAppState('results');
  };

  const handleRestart = () => {
    setAppState('landing');
    setAnswers({});
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100 transition-colors duration-300">
      <AnimatePresence mode="wait">
        {appState === 'landing' && (
          <motion.div
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Landing onStart={handleStart} />
          </motion.div>
        )}
        
        {appState === 'assessment' && (
          <motion.div
            key="assessment"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            <Assessment onComplete={handleComplete} />
          </motion.div>
        )}
        
        {appState === 'results' && (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <Results answers={answers} onRestart={handleRestart} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
