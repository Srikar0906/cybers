import React, { useMemo, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { questions, Category } from '../data/questions';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Cell } from 'recharts';
import { Award, AlertTriangle, RefreshCw, BookOpen, Sparkles, Lightbulb, Twitter, Facebook, Linkedin, Moon, Sun, Target, BarChart3, CheckCircle2, Search, ShieldCheck, UserCheck, MessageSquare, Globe, Lock, Eye, Mail, Heart, Zap, ArrowUp } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';

interface ResultsProps {
  answers: Record<string, string>;
  onRestart: () => void;
}

export default function Results({ answers, onRestart }: ResultsProps) {
  const results = useMemo(() => {
    const scores: Record<Category, { total: number; correct: number }> = {
      'Information & Media Literacy': { total: 0, correct: 0 },
      'Privacy & Security': { total: 0, correct: 0 },
      'Digital Footprint & Identity': { total: 0, correct: 0 },
      'Digital Communication & Etiquette': { total: 0, correct: 0 },
    };

    let totalCorrect = 0;

    questions.forEach(q => {
      scores[q.category].total += 1;
      const selectedOptionId = answers[q.id];
      const selectedOption = q.options.find(o => o.id === selectedOptionId);
      
      if (selectedOption?.isCorrect) {
        scores[q.category].correct += 1;
        totalCorrect += 1;
      }
    });

    const chartData = Object.entries(scores).map(([category, data]) => {
      const shortName = category.split(' & ')[0];
      return {
        subject: `${shortName} (${category})`, // Include full name alongside shortened
        fullSubject: category,
        score: Math.round((data.correct / data.total) * 100),
        fullMark: 100,
      };
    });

    return { scores, totalCorrect, chartData };
  }, [answers]);

  const totalScorePercentage = Math.round((results.totalCorrect / questions.length) * 100);

  const getFeedback = () => {
    if (totalScorePercentage >= 95) {
      return { 
        title: "Digital Visionary", 
        text: "Exceptional! You've demonstrated a mastery of the digital landscape that few possess. You're not just a user; you're a leader in the digital age, navigating complex information and security challenges with ease.",
        icon: <Sparkles className="w-12 h-12 text-emerald-400" /> 
      };
    }
    if (totalScorePercentage >= 80) {
      return { 
        title: "Digital Native Master", 
        text: "Excellent work! You have a strong, intuitive grasp of digital literacy concepts. You're well-equipped to protect your privacy and critically evaluate the media you consume.",
        icon: <Award className="w-12 h-12 text-emerald-500" /> 
      };
    }
    if (totalScorePercentage >= 65) {
      return { 
        title: "Digital Navigator", 
        text: "Great job! You're a confident digital citizen who knows how to find their way. While you have a solid foundation, there's still room to sharpen your skills in specific advanced areas.",
        icon: <Target className="w-12 h-12 text-indigo-500" /> 
      };
    }
    if (totalScorePercentage >= 50) {
      return { 
        title: "Digital Explorer", 
        text: "You're on the right track! You understand the basics of digital life, but you might be missing some critical safety or literacy nuances that are important for modern internet use.",
        icon: <BookOpen className="w-12 h-12 text-amber-500" /> 
      };
    }
    if (totalScorePercentage >= 35) {
      return { 
        title: "Digital Apprentice", 
        text: "You're starting your journey. You have some awareness of digital concepts, but there are significant gaps in your knowledge that could leave you vulnerable online.",
        icon: <Lightbulb className="w-12 h-12 text-orange-500" /> 
      };
    }
    return { 
      title: "Digital Novice", 
      text: "It looks like you're just beginning to learn about the complexities of the digital world. Don't worry—everyone starts somewhere! Focus on learning about privacy and source verification first.",
      icon: <AlertTriangle className="w-12 h-12 text-rose-500" /> 
    };
  };

  const feedback = getFeedback();

  const shareText = `I just scored ${totalScorePercentage}% on the Digital Literacy Assessment and earned the title "${feedback.title}"! Test your digital skills here:`;
  const shareUrl = typeof window !== 'undefined' ? window.location.origin : 'https://example.com';

  const lowestCategory = [...results.chartData].sort((a, b) => a.score - b.score)[0];
  const strongestCategory = [...results.chartData].sort((a, b) => b.score - a.score)[0];

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const activeCategory = selectedCategory || lowestCategory.fullSubject;

  const getTipsForCategory = (category: string) => {
    switch (category) {
      case 'Information & Media Literacy':
        return {
          main: "Mastering information literacy means becoming a critical consumer of media.",
          steps: [
            { text: "Practice 'lateral reading' by opening new tabs to verify claims on other sites.", icon: <Globe className="w-3.5 h-3.5" /> },
            { text: "Check the 'About Us' page and external reviews of unfamiliar news sources.", icon: <Search className="w-3.5 h-3.5" /> },
            { text: "Use fact-checking sites like Snopes or PolitiFact for sensational claims.", icon: <CheckCircle2 className="w-3.5 h-3.5" /> }
          ]
        };
      case 'Privacy & Security':
        return {
          main: "Your digital safety depends on strong barriers and vigilant habits.",
          steps: [
            { text: "Switch to a reputable password manager to handle unique, complex passwords.", icon: <Lock className="w-3.5 h-3.5" /> },
            { text: "Enable App-based 2FA (like Google Authenticator) instead of SMS when possible.", icon: <ShieldCheck className="w-3.5 h-3.5" /> },
            { text: "Never click links in urgent emails; always go directly to the official website.", icon: <AlertTriangle className="w-3.5 h-3.5" /> }
          ]
        };
      case 'Digital Footprint & Identity':
        return {
          main: "Your online identity is a permanent asset—manage it with intention.",
          steps: [
            { text: "Search for yourself in 'Incognito' mode to see what others can find.", icon: <Eye className="w-3.5 h-3.5" /> },
            { text: "Audit your social media 'Tagged' photos and remove anything unprofessional.", icon: <UserCheck className="w-3.5 h-3.5" /> },
            { text: "Set up a professional LinkedIn or portfolio site to control your top search results.", icon: <Target className="w-3.5 h-3.5" /> }
          ]
        };
      case 'Digital Communication & Etiquette':
        return {
          main: "Effective digital communication builds bridges and prevents conflict.",
          steps: [
            { text: "Wait 5 minutes before responding to a message that makes you angry.", icon: <Zap className="w-3.5 h-3.5" /> },
            { text: "Use clear subject lines and professional greetings in all formal emails.", icon: <Mail className="w-3.5 h-3.5" /> },
            { text: "Remember the 'Human' on the other side of the screen; avoid anonymous toxicity.", icon: <Heart className="w-3.5 h-3.5" /> }
          ]
        };
      default:
        return {
          main: "Continuous learning is the key to staying safe and effective online.",
          steps: [
            { text: "Stay updated on the latest digital trends and security threats.", icon: <Sparkles className="w-3.5 h-3.5" /> },
            { text: "Share your knowledge with friends and family to build a safer community.", icon: <MessageSquare className="w-3.5 h-3.5" /> },
            { text: "Regularly revisit these assessment topics as technology evolves.", icon: <RefreshCw className="w-3.5 h-3.5" /> }
          ]
        };
    }
  };

  const getMasteryPath = (percentage: number) => {
    if (percentage >= 90) {
      return {
        title: "Digital Leader",
        description: "You have exceptional digital literacy. Your next step is to mentor others and explore advanced topics like AI ethics and algorithmic transparency.",
        icon: <Award className="w-8 h-8 text-emerald-500" />
      };
    } else if (percentage >= 70) {
      return {
        title: "Digital Professional",
        description: "You are highly proficient. Focus on deep-diving into specific advanced security tools or media literacy frameworks to reach the top tier.",
        icon: <ShieldCheck className="w-8 h-8 text-indigo-500" />
      };
    } else if (percentage >= 40) {
      return {
        title: "Digital Explorer",
        description: "You have a solid foundation but some gaps remain. Focus on building consistent security habits and critical thinking when consuming media.",
        icon: <Search className="w-8 h-8 text-amber-500" />
      };
    } else {
      return {
        title: "Digital Learner",
        description: "You're just starting your journey. Focus on the fundamentals of privacy and information verification to build a safer online presence.",
        icon: <BookOpen className="w-8 h-8 text-rose-500" />
      };
    }
  };

  const getStrengthForCategory = (category: string) => {
    switch (category) {
      case 'Information & Media Literacy':
        return "You excel at evaluating sources and identifying credible information. Your critical thinking skills help you navigate the complex digital media landscape effectively.";
      case 'Privacy & Security':
        return "You have a strong understanding of how to protect your personal data. Your knowledge of secure passwords and phishing prevention keeps your digital life safe.";
      case 'Digital Footprint & Identity':
        return "You are highly aware of your online presence. You understand how to manage your digital reputation and the long-term impact of what you share online.";
      case 'Digital Communication & Etiquette':
        return "You communicate respectfully and effectively online. You understand the nuances of digital interactions and maintain a positive online environment.";
      default:
        return "You have a solid foundation in digital literacy principles.";
    }
  };

  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isGeneratingImage, setIsGeneratingImage] = useState(true);
  const [loadingText, setLoadingText] = useState("Analyzing your digital profile...");
  const [generationProgress, setGenerationProgress] = useState(0);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return document.documentElement.classList.contains('dark');
    }
    return false;
  });
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleTheme = () => {
    const isDark = document.documentElement.classList.toggle('dark');
    setIsDarkMode(isDark);
  };

  useEffect(() => {
    if (!isGeneratingImage) {
      setGenerationProgress(100);
      return;
    }
    
    setGenerationProgress(0);
    const duration = 12000; // 12 seconds
    const intervalTime = 50;
    const steps = duration / intervalTime;
    let currentStep = 0;
    
    const progressInterval = setInterval(() => {
      currentStep++;
      // Calculate progress with an ease-out curve so it slows down near the end
      const progress = 1 - Math.pow(1 - currentStep / steps, 3);
      setGenerationProgress(Math.min(Math.round(progress * 99), 99)); // Cap at 99% until actually done
    }, intervalTime);
    
    return () => clearInterval(progressInterval);
  }, [isGeneratingImage]);

  useEffect(() => {
    if (!isGeneratingImage) return;
    
    const messages = [
      "Analyzing your digital profile...",
      "Designing your unique avatar...",
      "Applying neon aesthetics...",
      "Finalizing masterpiece..."
    ];
    
    let i = 0;
    const interval = setInterval(() => {
      i = (i + 1) % messages.length;
      setLoadingText(messages[i]);
    }, 2500);
    
    return () => clearInterval(interval);
  }, [isGeneratingImage]);

  useEffect(() => {
    const generateImage = async () => {
      try {
        setIsGeneratingImage(true);
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY as string });
        
        let categoryVisuals = "";
        switch (strongestCategory.fullSubject) {
          case 'Information & Media Literacy':
            categoryVisuals = "glowing magnifying glasses, floating data streams being sorted, and illuminated puzzle pieces representing truth and knowledge";
            break;
          case 'Privacy & Security':
            categoryVisuals = "high-tech glowing cyber-shields, futuristic padlocks, and protective energy fields surrounding digital data";
            break;
          case 'Digital Footprint & Identity':
            categoryVisuals = "a constellation of glowing nodes forming a digital silhouette, and illuminated footprints leaving a positive mark on a cyber grid";
            break;
          case 'Digital Communication & Etiquette':
            categoryVisuals = "harmonious glowing speech bubbles, interconnected light trails, and bridges of light connecting digital spaces";
            break;
          default:
            categoryVisuals = "glowing digital nodes and interconnected tech elements";
        }
        
        let scoreModifiers = "";
        let visualMetaphor = "";
        let colorPalette = "";
        let lighting = "";

        if (totalScorePercentage >= 90) {
          scoreModifiers = "masterpiece, highly detailed, triumphant, advanced technology, dynamic composition, epic scale, futuristic";
          visualMetaphor = "a towering, illuminated digital metropolis, complex interconnected networks operating flawlessly, a glowing crown of data";
          colorPalette = "vibrant neon cyan, electric purple, and bright gold accents";
          lighting = "dramatic studio lighting, glowing auras, lens flares, high contrast";
        } else if (totalScorePercentage >= 75) {
          scoreModifiers = "polished, confident, steady progress, clear pathways, building blocks of technology, active learning";
          visualMetaphor = "a well-structured digital city under construction, glowing bridges connecting data islands, a clear path leading upward";
          colorPalette = "bright and encouraging, soft pastel blues, greens, and warm oranges";
          lighting = "bright, even studio lighting, soft shadows, welcoming atmosphere";
        } else if (totalScorePercentage >= 50) {
          scoreModifiers = "instructional, foundational, welcoming, stepping stones, learning environment, supportive mood";
          visualMetaphor = "a digital workshop, blueprints coming to life, puzzle pieces being assembled, a glowing compass pointing forward";
          colorPalette = "muted calming colors, soft teals, warm yellows, and light grays";
          lighting = "soft, diffused lighting, gentle glows, clear visibility";
        } else {
          scoreModifiers = "basic, introductory, clear diagrams, blueprint aesthetic, safe space, highly instructional";
          visualMetaphor = "a single glowing seed of data planted in a digital grid, a simple map with a clear starting point, basic geometric shapes forming a structure";
          colorPalette = "monochrome with a single bright accent color (like a guiding light), soft slate and indigo";
          lighting = "flat, clear lighting, no harsh shadows, diagrammatic style";
        }
        
        const prompt = `A premium 3D isometric illustration representing a "${feedback.title}". The central theme focuses on ${strongestCategory.fullSubject}, visually represented by ${categoryVisuals}. 
        Visual Metaphor: ${visualMetaphor}. 
        Atmosphere and Style: ${scoreModifiers}. 
        Color Palette: ${colorPalette}. 
        Lighting: ${lighting}. 
        Art style: Modern tech aesthetic, smooth gradients, Behance style, digital art.`;

        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash-image',
          contents: {
            parts: [{ text: prompt }],
          },
          config: {
            imageConfig: {
              aspectRatio: "16:9",
            }
          }
        });

        for (const part of response.candidates?.[0]?.content?.parts || []) {
          if (part.inlineData) {
            const base64EncodeString = part.inlineData.data;
            setImageUrl(`data:image/png;base64,${base64EncodeString}`);
            break;
          }
        }
      } catch (error) {
        console.error("Failed to generate image:", error);
      } finally {
        setIsGeneratingImage(false);
      }
    };

    generateImage();
  }, [feedback.title, results.chartData]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-indigo-500/10 dark:bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-purple-500/10 dark:bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto space-y-8 relative z-10">
        
        <div className="flex justify-end">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleTheme}
            className="flex items-center gap-3 px-5 py-2.5 bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl rounded-full shadow-lg hover:shadow-indigo-500/20 transition-all text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 group"
            aria-label="Toggle theme"
          >
            <div className="relative w-5 h-5">
              <AnimatePresence mode="wait" initial={false}>
                {isDarkMode ? (
                  <motion.div
                    key="sun"
                    initial={{ scale: 0, rotate: -90, opacity: 0 }}
                    animate={{ scale: 1, rotate: 0, opacity: 1 }}
                    exit={{ scale: 0, rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.25, ease: "backOut" }}
                    className="absolute inset-0"
                  >
                    <Sun className="w-5 h-5 text-amber-500" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="moon"
                    initial={{ scale: 0, rotate: 90, opacity: 0 }}
                    animate={{ scale: 1, rotate: 0, opacity: 1 }}
                    exit={{ scale: 0, rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.25, ease: "backOut" }}
                    className="absolute inset-0"
                  >
                    <Moon className="w-5 h-5 text-indigo-600" />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <span className="text-sm font-black tracking-widest uppercase hidden sm:block">
              {isDarkMode ? 'Light' : 'Dark'}
            </span>
          </motion.button>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl dark:shadow-indigo-900/10 overflow-hidden transition-colors duration-300 border border-slate-100 dark:border-slate-800"
        >
          <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 p-8 md:p-16 text-center text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
            <div className="absolute top-0 left-0 w-full h-full opacity-30 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-500 via-transparent to-transparent"></div>
            
            <div className="relative z-10 flex flex-col items-center">
              <motion.div 
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                className="mb-8 p-6 bg-white/10 rounded-3xl backdrop-blur-md border border-white/20 shadow-xl"
              >
                {React.cloneElement(feedback.icon as React.ReactElement, { className: "w-16 h-16 text-indigo-300" })}
              </motion.div>
              
              <motion.h1 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2, type: "spring", bounce: 0.4 }}
                className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight"
              >
                {feedback.title}
              </motion.h1>
              
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="text-xl md:text-2xl text-indigo-100/90 max-w-3xl mx-auto mb-12 font-medium leading-relaxed"
              >
                {feedback.text}
              </motion.p>
              
              <div className="flex flex-col items-center justify-center bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 mb-10 w-full max-w-sm relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-t from-indigo-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <motion.div 
                  initial={{ opacity: 0, scale: 0.5, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4, type: "spring", bounce: 0.5 }}
                  className="text-7xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-emerald-400 drop-shadow-sm relative z-10 animate-gradient-x"
                >
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1.5, delay: 0.5 }}
                  >
                    {totalScorePercentage}
                  </motion.span>
                  %
                </motion.div>
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                  className="text-indigo-200/70 mt-4 font-bold uppercase tracking-widest text-sm relative z-10"
                >
                  Overall Score ({results.totalCorrect} / {questions.length})
                </motion.div>
              </div>
              
              {/* Social Share Buttons */}
              <div className="flex items-center justify-center gap-4">
                <a 
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors backdrop-blur-sm"
                  aria-label="Share on Twitter"
                >
                  <Twitter className="w-5 h-5 text-white" />
                </a>
                <a 
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors backdrop-blur-sm"
                  aria-label="Share on Facebook"
                >
                  <Facebook className="w-5 h-5 text-white" />
                </a>
                <a 
                  href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent("Digital Literacy Assessment")}&summary=${encodeURIComponent(shareText)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors backdrop-blur-sm"
                  aria-label="Share on LinkedIn"
                >
                  <Linkedin className="w-5 h-5 text-white" />
                </a>
              </div>
            </div>
          </div>

          {/* Personalized Feedback Card */}
          <div className="p-8 md:p-12 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 transition-colors duration-300">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="max-w-4xl mx-auto"
            >
              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 rounded-[2.5rem] p-8 md:p-12 border border-indigo-100/50 dark:border-indigo-500/20 shadow-xl relative overflow-hidden group">
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl group-hover:bg-indigo-500/20 transition-colors duration-700" />
                <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl group-hover:bg-purple-500/20 transition-colors duration-700" />
                
                <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 md:gap-12">
                  <div className="flex-shrink-0">
                    <div className="w-24 h-24 md:w-32 md:h-32 bg-white dark:bg-slate-800 rounded-3xl shadow-lg flex items-center justify-center border border-indigo-100 dark:border-indigo-500/30 transform group-hover:scale-110 transition-transform duration-500">
                      {feedback.icon}
                    </div>
                  </div>
                  
                  <div className="flex-1 text-center md:text-left">
                    <div className="inline-block px-4 py-1.5 bg-indigo-500 text-white text-xs font-black uppercase tracking-[0.2em] rounded-full mb-4 shadow-lg shadow-indigo-500/20">
                      Expert Assessment
                    </div>
                    <h3 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">
                      {feedback.title}
                    </h3>
                    <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                      {feedback.text}
                    </p>
                    
                    <div className="mt-8 flex flex-wrap justify-center md:justify-start gap-4">
                      <div className="flex items-center gap-2 px-4 py-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm">
                        <Target className="w-4 h-4 text-indigo-500" />
                        <span className="text-sm font-bold text-slate-700 dark:text-slate-200">Accuracy: {totalScorePercentage}%</span>
                      </div>
                      <div className="flex items-center gap-2 px-4 py-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        <span className="text-sm font-bold text-slate-700 dark:text-slate-200">{results.totalCorrect} Correct</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* AI Generated Avatar Section */}
          <div className="p-8 md:p-12 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex flex-col items-center transition-colors duration-300">
            <div className="flex items-center gap-2 mb-6">
              <Sparkles className="w-6 h-6 text-indigo-500 dark:text-indigo-400" />
              <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Your Digital Avatar</h3>
            </div>
            <p className="text-slate-600 dark:text-slate-400 text-center max-w-2xl mb-8">
              Based on your score and your strongest skill ({strongestCategory.fullSubject}), our AI has generated a unique avatar just for you.
            </p>
            
            {isGeneratingImage ? (
              <div className="w-full max-w-3xl aspect-video bg-white/50 dark:bg-slate-800/50 backdrop-blur-md rounded-[2rem] flex flex-col items-center justify-center border border-slate-200 dark:border-slate-700 shadow-xl p-8 text-center relative overflow-hidden">
                {/* Background ambient glow */}
                <div className="absolute inset-0 flex items-center justify-center opacity-20 pointer-events-none">
                  <div className="w-96 h-96 bg-indigo-500 rounded-full blur-[100px] animate-pulse"></div>
                </div>
                
                <div className="relative z-10 flex flex-col items-center">
                  <div className="relative mb-10">
                    <div className="p-6 bg-indigo-50 dark:bg-indigo-900/30 rounded-full">
                      <Sparkles className="w-12 h-12 text-indigo-500 dark:text-indigo-400 animate-pulse" />
                    </div>
                    <motion.div 
                      className="absolute inset-0 border-4 border-indigo-400 dark:border-indigo-500 rounded-full"
                      animate={{ scale: [1, 1.8, 2.5], opacity: [1, 0.5, 0] }}
                      transition={{ duration: 2.5, repeat: Infinity, ease: "easeOut" }}
                    />
                    <motion.div 
                      className="absolute inset-0 border-4 border-purple-400 dark:border-purple-500 rounded-full"
                      animate={{ scale: [1, 1.5, 2], opacity: [0, 0.8, 0] }}
                      transition={{ duration: 2.5, delay: 0.5, repeat: Infinity, ease: "easeOut" }}
                    />
                  </div>
                  
                  <div className="flex items-center justify-center gap-3 mb-4">
                    <motion.span 
                      key={loadingText}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="text-slate-800 dark:text-slate-100 font-bold text-2xl tracking-wide"
                    >
                      {loadingText}
                    </motion.span>
                    
                    {/* Animated Dots */}
                    <div className="flex items-center gap-1.5 pt-2">
                      <motion.div
                        className="w-2 h-2 bg-indigo-500 dark:bg-indigo-400 rounded-full"
                        animate={{ y: [0, -8, 0], opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 0.8, repeat: Infinity, delay: 0 }}
                      />
                      <motion.div
                        className="w-2 h-2 bg-indigo-500 dark:bg-indigo-400 rounded-full"
                        animate={{ y: [0, -8, 0], opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 0.8, repeat: Infinity, delay: 0.15 }}
                      />
                      <motion.div
                        className="w-2 h-2 bg-indigo-500 dark:bg-indigo-400 rounded-full"
                        animate={{ y: [0, -8, 0], opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 0.8, repeat: Infinity, delay: 0.3 }}
                      />
                    </div>
                  </div>
                  
                  <p className="text-base text-slate-500 dark:text-slate-400 mb-10 max-w-md leading-relaxed">
                    Our AI is crafting a personalized masterpiece based on your unique skill profile and score.
                  </p>

                  {/* Enhanced Progress Bar */}
                  <div className="w-full max-w-md flex flex-col items-center">
                    <div className="flex justify-between w-full text-sm font-black text-indigo-600 dark:text-indigo-400 mb-3 tracking-widest uppercase">
                      <span>Generating...</span>
                      <span>{generationProgress}%</span>
                    </div>
                    <div className="w-full h-4 bg-slate-200 dark:bg-slate-700/50 rounded-full overflow-hidden shadow-inner relative">
                      <motion.div 
                        className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 relative"
                        animate={{ 
                          width: `${generationProgress}%`, 
                          backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] 
                        }}
                        transition={{ 
                          width: { duration: 0.1, ease: "linear" },
                          backgroundPosition: { duration: 2, repeat: Infinity, ease: "linear" }
                        }}
                        style={{ backgroundSize: "200% 100%" }}
                      >
                        <div className="absolute inset-0 bg-white/20 w-full h-full animate-[shimmer_2s_infinite]" style={{ transform: 'skewX(-20deg)' }}></div>
                      </motion.div>
                    </div>
                  </div>
                </div>
              </div>
            ) : imageUrl ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 40 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
                className="w-full max-w-3xl rounded-[2rem] overflow-hidden shadow-2xl dark:shadow-indigo-900/20 border border-slate-200 dark:border-slate-700 relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 flex items-end justify-center pb-8">
                  <span className="text-white font-medium px-6 py-2 bg-white/20 backdrop-blur-md rounded-full border border-white/30">
                    Your Digital Avatar
                  </span>
                </div>
                <motion.img 
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  src={imageUrl} 
                  alt="Digital Literacy Avatar" 
                  className="w-full h-auto object-cover relative z-0" 
                  referrerPolicy="no-referrer" 
                />
              </motion.div>
            ) : (
              <div className="w-full max-w-3xl aspect-video bg-slate-100 dark:bg-slate-800 rounded-[2rem] flex items-center justify-center border border-slate-200 dark:border-slate-700 shadow-md">
                <span className="text-slate-400 dark:text-slate-500 font-medium">Avatar generation failed.</span>
              </div>
            )}
          </div>

          <div className="p-8 md:p-12 grid grid-cols-1 lg:grid-cols-2 gap-12">
            
            {/* Radar Chart */}
            <div className="flex flex-col items-center">
              <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-6">Skill Profile</h3>
              <div 
                className="w-full h-[300px] focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-xl" 
                role="application" 
                aria-label="Radar chart showing your skill profile across different digital literacy categories. Use Tab to navigate through the data points."
                tabIndex={0}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="55%" data={results.chartData}>
                    <PolarGrid stroke={isDarkMode ? "#334155" : "#e2e8f0"} />
                    <PolarAngleAxis 
                      dataKey="subject" 
                      tick={(props: any) => {
                        const { payload, x, y, textAnchor } = props;
                        const match = payload.value.match(/^(.*?)\s*\((.*?)\)$/);
                        const shortName = match ? match[1] : payload.value;
                        const fullName = match ? match[2] : '';
                        
                        return (
                          <text x={x} y={y} textAnchor={textAnchor} fill={isDarkMode ? "#cbd5e1" : "#334155"}>
                            <tspan x={x} dy="0em" fontSize={12} fontWeight={600}>{shortName}</tspan>
                            {fullName && <tspan x={x} dy="1.2em" fontSize={10} fontWeight={400} fill={isDarkMode ? "#94a3b8" : "#475569"}>({fullName})</tspan>}
                          </text>
                        );
                      }} 
                    />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                    <Radar 
                      name="Score" 
                      dataKey="score" 
                      stroke={isDarkMode ? '#a5b4fc' : '#4338ca'} 
                      strokeWidth={2}
                      fill={isDarkMode ? '#818cf8' : '#4f46e5'} 
                      fillOpacity={0.5} 
                      label={{ fill: isDarkMode ? '#a5b4fc' : '#4338ca', fontSize: 12, fontWeight: 'bold' }}
                      isAnimationActive={true}
                      animationDuration={1500}
                      animationEasing="ease-out"
                      activeDot={{ r: 8, fill: isDarkMode ? '#818cf8' : '#4f46e5', stroke: isDarkMode ? '#1e293b' : '#ffffff', strokeWidth: 2 }}
                      dot={(props: any) => {
                        const { cx, cy, payload, value, onMouseEnter, onMouseLeave } = props;
                        return (
                          <circle
                            key={payload.subject}
                            cx={cx}
                            cy={cy}
                            r={5}
                            fill={isDarkMode ? '#a5b4fc' : '#4338ca'}
                            className="focus:outline-none focus-visible:ring-4 focus-visible:ring-indigo-500/50 cursor-pointer hover:r-6 transition-all duration-300"
                            role="graphics-symbol"
                            aria-label={`${payload.fullSubject} score: ${value}%`}
                            tabIndex={0}
                            onFocus={onMouseEnter}
                            onBlur={onMouseLeave}
                          />
                        );
                      }}
                    />
                    <Tooltip 
                      content={({ active, payload }: any) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-xl border border-slate-100 dark:border-slate-700 transform transition-all">
                              <p className="font-semibold text-slate-800 dark:text-slate-100 mb-1">{data.fullSubject}</p>
                              <p className="text-indigo-600 dark:text-indigo-400 font-bold text-lg">Score: {data.score}%</p>
                            </div>
                          );
                        }
                        return null;
                      }}
                      cursor={{ stroke: isDarkMode ? '#475569' : '#cbd5e1', strokeWidth: 1, strokeDasharray: '3 3' }}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Bar Chart */}
            <div className="flex flex-col justify-center">
              <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-6 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-indigo-500" />
                Category Breakdown
              </h3>
              <div className="h-[400px] w-full bg-white/50 dark:bg-slate-800/30 rounded-3xl p-4 border border-slate-100 dark:border-slate-700/50 shadow-sm" role="img" aria-label="Category scores bar chart">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    layout="vertical"
                    data={results.chartData}
                    margin={{ top: 20, right: 60, left: 10, bottom: 20 }}
                    onClick={(data: any) => {
                      if (data && data.activePayload && data.activePayload.length > 0) {
                        setSelectedCategory(data.activePayload[0].payload.fullSubject);
                      }
                    }}
                  >
                    <CartesianGrid 
                      strokeDasharray="3 3" 
                      horizontal={false} 
                      vertical={true} 
                      stroke={isDarkMode ? "#334155" : "#e2e8f0"} 
                      opacity={0.5}
                    />
                    <XAxis type="number" domain={[0, 100]} hide />
                    <YAxis 
                      dataKey="subject" 
                      type="category" 
                      width={130} 
                      tick={(props: any) => {
                        const { x, y, payload } = props;
                        const shortName = payload.value.split(' (')[0];
                        const isActive = payload.value.includes(activeCategory);
                        return (
                          <text 
                            x={x - 10} 
                            y={y} 
                            textAnchor="end" 
                            fill={isActive ? (isDarkMode ? "#818cf8" : "#4f46e5") : (isDarkMode ? "#cbd5e1" : "#475569")} 
                            fontSize={12} 
                            fontWeight={isActive ? 900 : 700} 
                            dy={4}
                            className="font-sans transition-all duration-300"
                          >
                            {shortName}
                          </text>
                        );
                      }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip 
                      cursor={{ fill: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)', radius: 10 }}
                      content={({ active, payload }: any) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          let colorClass = "text-indigo-600 dark:text-indigo-400";
                          if (data.score < 50) colorClass = "text-rose-600 dark:text-rose-400";
                          else if (data.score < 80) colorClass = "text-amber-600 dark:text-amber-400";
                          else colorClass = "text-emerald-600 dark:text-emerald-400";

                          return (
                            <motion.div 
                              initial={{ opacity: 0, scale: 0.95 }}
                              animate={{ opacity: 1, scale: 1 }}
                              className="bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-800 min-w-[200px]"
                            >
                              <p className="font-black text-slate-800 dark:text-slate-100 text-xs uppercase tracking-widest mb-2 opacity-60">Category</p>
                              <p className="font-bold text-slate-900 dark:text-white text-base mb-3 leading-tight">{data.fullSubject}</p>
                              <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
                                <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Proficiency</span>
                                <span className={`text-lg font-black ${colorClass}`}>{data.score}%</span>
                              </div>
                              <p className="text-[10px] text-slate-400 mt-3 italic">Click bar to view detailed tips</p>
                            </motion.div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Bar 
                      dataKey="score" 
                      radius={[0, 20, 20, 0]} 
                      barSize={32}
                      animationDuration={1500}
                      animationEasing="ease-out"
                      className="cursor-pointer"
                    >
                      {results.chartData.map((entry, index) => {
                        let color = '#6366f1'; // indigo-500
                        const isActive = entry.fullSubject === activeCategory;
                        if (entry.score < 50) color = isDarkMode ? '#fb7185' : '#f43f5e'; // rose
                        else if (entry.score < 80) color = isDarkMode ? '#fbbf24' : '#f59e0b'; // amber
                        else color = isDarkMode ? '#34d399' : '#10b981'; // emerald
                        return (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={color}
                            fillOpacity={isActive ? 1 : 0.6}
                            stroke={isActive ? (isDarkMode ? '#fff' : '#000') : 'none'}
                            strokeWidth={2}
                            className="filter drop-shadow-md transition-all duration-300"
                          />
                        );
                      })}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Legend */}
              <div className="mt-4 flex flex-wrap justify-center gap-6">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-emerald-500" />
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Mastery (80%+)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-amber-500" />
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Proficient (50-79%)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500" />
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Developing (&lt;50%)</span>
                </div>
              </div>

              {/* Personalized Analysis Section */}
              <div className="mt-10 space-y-4">
                {/* Strength Section */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                  className="bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl p-6 border border-emerald-100 dark:border-emerald-800/50 transition-colors duration-300 hover:shadow-md"
                >
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-emerald-100 dark:bg-emerald-900/50 rounded-xl text-emerald-600 dark:text-emerald-400 shrink-0 shadow-sm">
                      <Target className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-1">Top Strength: {strongestCategory.fullSubject}</h4>
                      <div className="flex items-start gap-3">
                        <div className="mt-1 p-1 bg-emerald-100 dark:bg-emerald-900/50 rounded-md text-emerald-500 dark:text-emerald-400 shrink-0">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        </div>
                        <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
                          {getStrengthForCategory(strongestCategory.fullSubject)}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Tips Section */}
                {(() => {
                  const tips = getTipsForCategory(activeCategory);
                  const isLowest = activeCategory === lowestCategory.fullSubject;
                  return (
                    <motion.div 
                      key={activeCategory}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5 }}
                      className="bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl p-6 border border-indigo-100 dark:border-indigo-800/50 transition-colors duration-300 hover:shadow-md relative overflow-hidden"
                    >
                      <div className="absolute top-0 right-0">
                        <div className={`text-white text-[10px] font-black px-3 py-1 rounded-bl-xl uppercase tracking-tighter ${isLowest ? 'bg-rose-500' : 'bg-indigo-500'}`}>
                          {isLowest ? 'Priority Focus' : 'Skill Insights'}
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-4">
                        <div className="p-3 bg-indigo-100 dark:bg-indigo-900/50 rounded-xl text-indigo-600 dark:text-indigo-400 shrink-0 shadow-sm">
                          <Lightbulb className="w-6 h-6" />
                        </div>
                        <div>
                          <h4 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-2">
                            {isLowest ? 'Improvement Plan' : 'Category Insights'}: {activeCategory}
                          </h4>
                          <p className="text-slate-700 dark:text-slate-300 font-semibold mb-4 text-sm leading-relaxed">
                            {tips.main}
                          </p>
                          <ul className="space-y-4">
                            {tips.steps.map((step, i) => (
                              <li key={i} className="flex items-start gap-3 text-sm text-slate-600 dark:text-slate-400 group/item">
                                <div className="mt-0.5 p-1 bg-indigo-100 dark:bg-indigo-900/50 rounded-md text-indigo-500 dark:text-indigo-400 shrink-0 group-hover/item:scale-110 transition-transform">
                                  {step.icon}
                                </div>
                                <span className="leading-relaxed">{step.text}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </motion.div>
                  );
                })()}
              </div>

              {/* Path to Mastery Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.8 }}
                className="mt-12 p-8 rounded-3xl bg-slate-900 dark:bg-slate-800 text-white shadow-2xl relative overflow-hidden group"
              >
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -mr-32 -mt-32 group-hover:bg-indigo-500/20 transition-colors duration-700" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -ml-32 -mb-32 group-hover:bg-emerald-500/20 transition-colors duration-700" />
                
                <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                  <div className="p-5 bg-white/10 backdrop-blur-md rounded-2xl shadow-inner">
                    {getMasteryPath(results.percentage).icon}
                  </div>
                  <div className="text-center md:text-left">
                    <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                      <span className="px-3 py-1 bg-white/10 rounded-full text-[10px] font-black uppercase tracking-widest text-indigo-300">Your Mastery Path</span>
                      <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
                    </div>
                    <h3 className="text-3xl font-black mb-3 tracking-tight">
                      Level: <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-emerald-300">{getMasteryPath(results.percentage).title}</span>
                    </h3>
                    <p className="text-slate-300 text-lg leading-relaxed max-w-2xl">
                      {getMasteryPath(results.percentage).description}
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Universal Awareness Tips Section */}
              <div className="mt-16">
                <div className="flex items-center gap-3 mb-8">
                  <div className="p-2 bg-indigo-100 dark:bg-indigo-900/50 rounded-lg text-indigo-600 dark:text-indigo-400">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <h3 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight uppercase">
                    Universal Awareness Tips
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    {
                      title: "The 30-Second Rule",
                      desc: "Before sharing or clicking, pause for 30 seconds. Ask: Who created this? Why? Is it trying to trigger an emotion?",
                      icon: <Zap className="w-6 h-6" />,
                      color: "text-amber-500",
                      bg: "bg-amber-50 dark:bg-amber-900/10"
                    },
                    {
                      title: "Digital Hygiene",
                      desc: "Treat your passwords and privacy settings like physical keys. Schedule a 'Digital Checkup' once a month to review permissions.",
                      icon: <ShieldCheck className="w-6 h-6" />,
                      color: "text-emerald-500",
                      bg: "bg-emerald-50 dark:bg-emerald-900/10"
                    },
                    {
                      title: "Cross-Verification",
                      desc: "Never rely on a single source for critical news. If a story is true, multiple reputable outlets will report it with consistent facts.",
                      icon: <Globe className="w-6 h-6" />,
                      color: "text-blue-500",
                      bg: "bg-blue-50 dark:bg-blue-900/10"
                    },
                    {
                      title: "Emotional Awareness",
                      desc: "Be wary of content that makes you feel extreme anger or fear. Misinformation often uses 'emotional hacking' to bypass logic.",
                      icon: <Heart className="w-6 h-6" />,
                      color: "text-rose-500",
                      bg: "bg-rose-50 dark:bg-rose-900/10"
                    }
                  ].map((tip, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 1 + (idx * 0.1) }}
                      className={`${tip.bg} p-6 rounded-2xl border border-black/5 dark:border-white/5 hover:shadow-lg transition-all group`}
                    >
                      <div className={`mb-4 ${tip.color} group-hover:scale-110 transition-transform`}>
                        {tip.icon}
                      </div>
                      <h4 className="text-lg font-bold text-slate-800 dark:text-white mb-2">{tip.title}</h4>
                      <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{tip.desc}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

          </div>
          
          <div className="bg-slate-50 dark:bg-slate-900/50 p-8 md:p-12 border-t border-slate-100 dark:border-slate-800 flex justify-center transition-colors duration-300">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onRestart}
              className="group relative flex items-center gap-4 px-12 py-6 bg-slate-900 dark:bg-indigo-600 hover:bg-slate-800 dark:hover:bg-indigo-500 text-white rounded-full font-black text-xl transition-all shadow-xl hover:shadow-2xl hover:shadow-indigo-500/30 overflow-hidden"
            >
              <div className="absolute inset-0 bg-white/20 w-full h-full animate-[shimmer_2s_infinite]" style={{ transform: 'skewX(-20deg)' }}></div>
              <RefreshCw className="w-6 h-6 group-hover:rotate-180 transition-transform duration-700 ease-in-out relative z-10" />
              <span className="relative z-10">Retake Assessment</span>
            </motion.button>
          </div>
        </motion.div>

        <AnimatePresence>
          {showScrollTop && (
            <motion.button
              initial={{ opacity: 0, scale: 0.5, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.5, y: 20 }}
              onClick={scrollToTop}
              className="fixed bottom-8 right-8 p-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full shadow-2xl z-50 transition-colors group"
              aria-label="Go to top"
            >
              <ArrowUp className="w-6 h-6 group-hover:-translate-y-1 transition-transform" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
