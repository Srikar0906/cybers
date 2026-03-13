import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, ShieldAlert, ShieldCheck, Loader2, ExternalLink, AlertTriangle } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

export default function UrlSafetyChecker() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    safe: boolean;
    riskLevel: 'low' | 'medium' | 'high';
    analysis: string;
    warnings: string[];
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const isValidUrl = (string: string) => {
    try {
      // Check if it's a valid URL format
      const pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
        '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
      return !!pattern.test(string);
    } catch (e) {
      return false;
    }
  };

  const analyzeUrl = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedUrl = url.trim();
    
    if (!trimmedUrl) return;

    if (!isValidUrl(trimmedUrl)) {
      setError('Please enter a valid URL (e.g., https://example.com)');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [
          {
            role: "user",
            parts: [{
              text: `Analyze the following URL for potential security risks, viruses, or phishing attempts. 
              URL: ${trimmedUrl}
              
              Provide a JSON response with the following structure:
              {
                "safe": boolean,
                "riskLevel": "low" | "medium" | "high",
                "analysis": "A brief 2-3 sentence explanation of the potential risks or safety features",
                "warnings": ["warning 1", "warning 2"]
              }
              
              Note: If the URL is obviously fake or malicious (like phishing-bank.com), mark it as high risk. If it's a well-known safe site (like google.com), mark it as low risk. If you are unsure, provide a balanced analysis.`
            }]
          }
        ],
        config: {
          responseMimeType: "application/json"
        }
      });

      const data = JSON.parse(response.text || '{}');
      setResult(data);
    } catch (err) {
      console.error('Error analyzing URL:', err);
      setError('Failed to analyze the URL. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-16 p-8 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-slate-200 dark:border-slate-700">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 rounded-lg">
          <Search className="w-5 h-5" />
        </div>
        <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100">URL Safety Scanner</h3>
      </div>
      
      <p className="text-slate-600 dark:text-slate-400 mb-8 max-w-2xl">
        Not sure about a link? Paste it here and our AI will analyze it for common phishing patterns and security risks.
      </p>

      <form onSubmit={analyzeUrl} className="relative mb-8">
        <input
          type="text"
          value={url}
          onChange={(e) => {
            setUrl(e.target.value);
            if (error) setError(null);
          }}
          placeholder="https://example.com/suspicious-link"
          className="w-full px-6 py-4 bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 rounded-2xl focus:border-indigo-500 dark:focus:border-indigo-400 outline-none transition-all pr-32 text-slate-800 dark:text-slate-100"
        />
        <button
          type="submit"
          disabled={loading || !url.trim()}
          className="absolute right-2 top-2 bottom-2 px-6 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-400 text-white rounded-xl font-bold transition-all flex items-center gap-2"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Check'}
        </button>
      </form>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="p-4 bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 rounded-xl border border-rose-100 dark:border-rose-500/20 flex items-center gap-3"
          >
            <AlertTriangle className="w-5 h-5" />
            {error}
          </motion.div>
        )}

        {result && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`p-6 rounded-2xl border ${
              result.riskLevel === 'high' 
                ? 'bg-rose-50 dark:bg-rose-500/10 border-rose-200 dark:border-rose-500/30' 
                : result.riskLevel === 'medium'
                ? 'bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/30'
                : 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/30'
            }`}
          >
            <div className="flex items-start gap-4">
              <div className={`p-3 rounded-xl ${
                result.riskLevel === 'high' ? 'bg-rose-100 text-rose-600' : 
                result.riskLevel === 'medium' ? 'bg-amber-100 text-amber-600' : 
                'bg-emerald-100 text-emerald-600'
              }`}>
                {result.safe ? <ShieldCheck className="w-6 h-6" /> : <ShieldAlert className="w-6 h-6" />}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h4 className={`text-xl font-bold ${
                    result.riskLevel === 'high' ? 'text-rose-700 dark:text-rose-400' : 
                    result.riskLevel === 'medium' ? 'text-amber-700 dark:text-amber-400' : 
                    'text-emerald-700 dark:text-emerald-400'
                  }`}>
                    Risk Level: {result.riskLevel.toUpperCase()}
                  </h4>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                    result.riskLevel === 'high' ? 'bg-rose-200 text-rose-800' : 
                    result.riskLevel === 'medium' ? 'bg-amber-200 text-amber-800' : 
                    'bg-emerald-200 text-emerald-800'
                  }`}>
                    {result.safe ? 'Likely Safe' : 'Potentially Dangerous'}
                  </span>
                </div>
                <p className="text-slate-700 dark:text-slate-300 mb-4 leading-relaxed">
                  {result.analysis}
                </p>
                {result.warnings.length > 0 && (
                  <div className="space-y-2">
                    {result.warnings.map((warning, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                        <div className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                        {warning}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <div className="mt-8 pt-8 border-t border-slate-200 dark:border-slate-700 flex flex-wrap gap-4">
        <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">External Resources:</span>
        <a 
          href="https://www.virustotal.com" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
        >
          VirusTotal <ExternalLink className="w-3 h-3" />
        </a>
        <a 
          href="https://sitecheck.sucuri.net" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
        >
          Sucuri SiteCheck <ExternalLink className="w-3 h-3" />
        </a>
        <a 
          href="https://safebrowsing.google.com/safebrowsing/report_phish/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
        >
          Google Safe Browsing <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
}
