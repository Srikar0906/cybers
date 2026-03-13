import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { questions, Question } from '../data/questions';
import { CheckCircle2, XCircle, ArrowRight } from 'lucide-react';

interface AssessmentProps {
  onComplete: (answers: Record<string, string>) => void;
}

export default function Assessment({ onComplete }: AssessmentProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showExplanation, setShowExplanation] = useState(false);

  const currentQuestion = questions[currentQuestionIndex];
  const totalQuestions = questions.length;
  const answeredCount = Object.keys(answers).length;
  const remainingCount = totalQuestions - answeredCount;
  const progress = (answeredCount / totalQuestions) * 100;

  const handleOptionSelect = (optionId: string) => {
    if (showExplanation) return; // Prevent changing answer after selection
    setAnswers({ ...answers, [currentQuestion.id]: optionId });
    setShowExplanation(true);
  };

  const handleNext = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setShowExplanation(false);
    } else {
      onComplete(answers);
    }
  };

  const selectedOption = answers[currentQuestion.id];
  const isCorrect = selectedOption 
    ? currentQuestion.options.find(o => o.id === selectedOption)?.isCorrect 
    : null;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-[-20%] right-[-10%] w-[40rem] h-[40rem] bg-indigo-500/10 dark:bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-20%] left-[-10%] w-[40rem] h-[40rem] bg-emerald-500/10 dark:bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-3xl relative z-10">
        {/* Progress bar */}
        <div className="mb-10 bg-white/60 dark:bg-slate-900/60 backdrop-blur-md p-6 rounded-[2rem] shadow-lg border border-slate-200/50 dark:border-slate-700/50">
          <div className="flex justify-between items-end mb-4">
            <div>
              <span className="text-sm font-black text-slate-800 dark:text-slate-200 uppercase tracking-widest">Question {currentQuestionIndex + 1} <span className="text-slate-400 dark:text-slate-500 font-medium">/ {totalQuestions}</span></span>
              <div className="text-xs font-bold text-slate-500 dark:text-slate-400 mt-2 flex items-center gap-2">
                <span className="bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 px-3 py-1 rounded-full shadow-sm">{answeredCount} answered</span>
                <span className="bg-slate-200 dark:bg-slate-800 px-3 py-1 rounded-full shadow-sm">{remainingCount} remaining</span>
              </div>
            </div>
            <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-slate-200/80 dark:bg-slate-800/80 rounded-full h-4 shadow-inner overflow-hidden relative">
            <motion.div 
              className="bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 h-full rounded-full relative"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%`, backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
              transition={{ 
                width: { duration: 0.5, ease: "easeOut" },
                backgroundPosition: { duration: 3, repeat: Infinity, ease: "linear" }
              }}
              style={{ backgroundSize: "200% 100%" }}
            >
              <div className="absolute inset-0 bg-white/20 w-full h-full animate-[shimmer_2s_infinite]" style={{ transform: 'skewX(-20deg)' }}></div>
            </motion.div>
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion.id}
            initial={{ opacity: 0, x: 40, filter: 'blur(8px)' }}
            animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, x: -40, filter: 'blur(8px)' }}
            transition={{ duration: 0.5, type: "spring", bounce: 0.25 }}
            className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl dark:shadow-indigo-900/20 overflow-hidden border border-slate-100 dark:border-slate-800 relative"
          >
            {/* Subtle card gradient background */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 to-transparent dark:from-indigo-900/10 dark:to-transparent pointer-events-none" />
            
            <div className="p-8 md:p-12 relative z-10">
              <div className="inline-flex items-center gap-2 px-5 py-2 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 text-xs font-black rounded-full mb-8 uppercase tracking-widest border border-indigo-100 dark:border-indigo-500/20 shadow-sm">
                {currentQuestion.category}
              </div>
              
              <motion.h2 
                key={currentQuestion.id + "-text"}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.15 }}
                className="text-2xl md:text-3xl font-extrabold text-slate-800 dark:text-slate-100 mb-10 leading-snug tracking-tight"
              >
                {currentQuestion.text}
              </motion.h2>

              <div className="space-y-4">
                {currentQuestion.options.map((option, index) => {
                  const isSelected = selectedOption === option.id;
                  let optionClass = "w-full text-left p-6 rounded-2xl border-2 transition-all duration-300 group relative overflow-hidden ";
                  
                  if (!showExplanation) {
                    optionClass += isSelected 
                      ? "border-indigo-600 bg-indigo-50 dark:bg-indigo-900/30 dark:border-indigo-500 shadow-md" 
                      : "border-slate-200 dark:border-slate-700 hover:border-indigo-400 dark:hover:border-indigo-500 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:shadow-lg hover:-translate-y-1";
                  } else {
                    if (option.isCorrect) {
                      optionClass += isSelected 
                        ? "border-emerald-500 bg-emerald-500 shadow-xl shadow-emerald-500/30 scale-[1.02] ring-4 ring-emerald-500/20 z-10 relative" 
                        : "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/30 shadow-md ring-2 ring-emerald-500/50";
                    } else if (isSelected && !option.isCorrect) {
                      optionClass += "border-rose-500 bg-rose-50 dark:bg-rose-900/30 shadow-md ring-2 ring-rose-500/50";
                    } else {
                      optionClass += "border-slate-200 dark:border-slate-800 opacity-40 bg-slate-50 dark:bg-slate-900 grayscale";
                    }
                  }

                  return (
                    <motion.button
                      key={option.id}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ 
                        opacity: 1, 
                        y: 0,
                        scale: isSelected ? 1.02 : 1,
                        x: isSelected && showExplanation && !option.isCorrect ? [0, -4, 4, -4, 4, 0] : 0
                      }}
                      transition={{ 
                        duration: 0.4, 
                        delay: isSelected ? 0 : 0.2 + index * 0.1,
                        x: { duration: 0.4, times: [0, 0.2, 0.4, 0.6, 0.8, 1] }
                      }}
                      onClick={() => handleOptionSelect(option.id)}
                      disabled={showExplanation}
                      className={optionClass}
                      whileHover={!showExplanation ? { scale: 1.01, x: 4 } : {}}
                      whileTap={!showExplanation ? { scale: 0.98 } : {}}
                    >
                      <div className="flex items-center justify-between relative z-10">
                        <span className={`text-lg font-semibold text-left leading-relaxed pr-4 ${showExplanation ? (option.isCorrect ? (isSelected ? 'text-white' : 'text-emerald-900 dark:text-emerald-300') : (isSelected ? 'text-rose-900 dark:text-rose-300' : 'text-slate-500 dark:text-slate-400')) : 'text-slate-700 dark:text-slate-200 group-hover:text-slate-900 dark:group-hover:text-white transition-colors'}`}>
                          {option.text}
                        </span>
                        {showExplanation && option.isCorrect && (
                          <motion.div 
                            initial={{ scale: 0, rotate: -90, opacity: 0 }} 
                            animate={{ scale: 1.2, rotate: 0, opacity: 1 }} 
                            transition={{ 
                              type: "spring", 
                              stiffness: 400, 
                              damping: 10,
                              scale: { duration: 0.3, repeat: 1, repeatType: "reverse" }
                            }}
                          >
                            <CheckCircle2 className={`w-8 h-8 flex-shrink-0 ml-2 ${isSelected ? 'text-white' : 'text-emerald-600 dark:text-emerald-400'}`} />
                          </motion.div>
                        )}
                        {showExplanation && isSelected && !option.isCorrect && (
                          <motion.div 
                            initial={{ scale: 0, x: -20, opacity: 0 }} 
                            animate={{ scale: 1, x: 0, opacity: 1 }} 
                            transition={{ type: "spring", stiffness: 500, damping: 15 }}
                          >
                            <XCircle className="w-8 h-8 text-rose-600 dark:text-rose-400 flex-shrink-0 ml-2" />
                          </motion.div>
                        )}
                      </div>
                      {/* Hover effect background */}
                      {!showExplanation && (
                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-50/0 via-indigo-50/50 to-indigo-50/0 dark:from-indigo-900/0 dark:via-indigo-900/20 dark:to-indigo-900/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out" />
                      )}
                    </motion.button>
                  );
                })}
              </div>

              {showExplanation && (
                <motion.div 
                  initial={{ opacity: 0, y: 30, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.3 }}
                  className={`mt-10 p-8 md:p-10 rounded-[2rem] border-2 relative overflow-hidden ${isCorrect ? 'bg-emerald-50 dark:bg-emerald-900/10 border-emerald-200 dark:border-emerald-800/50 shadow-2xl shadow-emerald-100/50 dark:shadow-emerald-900/20' : 'bg-rose-50 dark:bg-rose-900/10 border-rose-200 dark:border-rose-800/50 shadow-2xl shadow-rose-100/50 dark:shadow-rose-900/20'}`}
                >
                  {/* Decorative background icon */}
                  <div className="absolute -right-12 -top-12 opacity-[0.03] pointer-events-none">
                    {isCorrect ? <CheckCircle2 className="w-64 h-64 text-emerald-900" /> : <XCircle className="w-64 h-64 text-rose-900" />}
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8 relative z-10">
                    <div className="flex items-center gap-5">
                      {isCorrect ? (
                        <motion.div
                          initial={{ scale: 0, rotate: -180 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{ type: "spring", stiffness: 300, damping: 15, delay: 0.4 }}
                          className="bg-emerald-100 dark:bg-emerald-800/50 p-3 rounded-2xl shadow-sm"
                        >
                          <CheckCircle2 className="w-10 h-10 text-emerald-600 dark:text-emerald-400" />
                        </motion.div>
                      ) : (
                        <motion.div
                          initial={{ scale: 0, rotate: 180 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{ type: "spring", stiffness: 300, damping: 15, delay: 0.4 }}
                          className="bg-rose-100 dark:bg-rose-800/50 p-3 rounded-2xl shadow-sm"
                        >
                          <XCircle className="w-10 h-10 text-rose-600 dark:text-rose-400" />
                        </motion.div>
                      )}
                      <h3 className={`font-black text-3xl md:text-4xl tracking-tight ${isCorrect ? 'text-emerald-800 dark:text-emerald-300' : 'text-rose-800 dark:text-rose-300'}`}>
                        {isCorrect ? 'Spot On!' : 'Not Quite.'}
                      </h3>
                    </div>
                  </div>
                  
                  <div className="mt-6 relative z-10">
                    <div className={`p-6 md:p-8 rounded-2xl border ${isCorrect ? 'bg-emerald-100/50 dark:bg-emerald-900/20 border-emerald-200/50 dark:border-emerald-800/30' : 'bg-rose-100/50 dark:bg-rose-900/20 border-rose-200/50 dark:border-rose-800/30'}`}>
                      <p className={`text-lg leading-relaxed font-medium ${isCorrect ? 'text-emerald-900 dark:text-emerald-200' : 'text-rose-900 dark:text-rose-200'}`}>
                        {currentQuestion.options.find(o => o.id === selectedOption)?.explanation || 
                         currentQuestion.options.find(o => o.isCorrect)?.explanation}
                      </p>
                    </div>
                  </div>
                  
                  <div className="mt-10 flex justify-end relative z-10">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleNext}
                      className="group relative flex items-center gap-3 px-10 py-5 bg-slate-900 dark:bg-indigo-600 hover:bg-slate-800 dark:hover:bg-indigo-500 text-white rounded-2xl font-bold text-lg transition-all shadow-xl hover:shadow-2xl overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-white/20 w-full h-full animate-[shimmer_2s_infinite]" style={{ transform: 'skewX(-20deg)' }}></div>
                      <span className="relative z-10">{currentQuestionIndex < totalQuestions - 1 ? 'Next Question' : 'Reveal My Profile'}</span>
                      <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform relative z-10" />
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
