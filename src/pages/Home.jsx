import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FileUpload } from '../components/FileUpload';
import { ATSAnalysis } from '../components/ATSAnalysis';
import { analyzeResume, improveResume } from '../services/ai';
import { extractTextFromPdf } from '../utils/pdfParser';
import { ImprovedResume } from '../components/ImprovedResume';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowRight, ShieldCheck, Zap, Globe, Star, LogIn } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const FeatureCard = ({ icon: Icon, title, description }) => (
  <div className="glass-morphism p-8 rounded-3xl space-y-4 hover:scale-105 transition-transform duration-300">
    <div className="p-3 rounded-2xl bg-primary-500/20 w-fit">
      <Icon className="w-6 h-6 text-primary-400" />
    </div>
    <h3 className="text-xl font-bold text-white">{title}</h3>
    <p className="text-gray-400 text-sm leading-relaxed">{description}</p>
  </div>
);

const Home = () => {
  const { currentUser } = useAuth();
  const [analysisData, setAnalysisData] = useState(null);
  const [improvedData, setImprovedData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isImproving, setIsImproving] = useState(false);
  const [error, setError] = useState(null);

  const handleFileSelect = async (file) => {
    setIsLoading(true);
    setError(null);
    setAnalysisData(null);
    setImprovedData(null);
    try {
      let text = '';
      const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
      
      if (isPdf) {
        try {
          text = await extractTextFromPdf(file);
        } catch (pdfErr) {
          console.error("PDF Parsing Error:", pdfErr);
          throw new Error(`Could not read the PDF file: ${pdfErr.message}`);
        }
      } else {
        text = await file.text();
      }
      
      if (!text || text.trim().length < 50) {
        throw new Error("The resume seems too short or empty. Please check the file content.");
      }

      try {
        const analysis = await analyzeResume(text);
        setAnalysisData(analysis);
      } catch (aiErr) {
        console.error("AI Analysis Error:", aiErr);
        throw new Error(aiErr.message || "AI Analysis failed. Please try again.");
      }
    } catch (err) {
      console.error("Overall Error:", err);
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleImprove = async () => {
    if (!analysisData) return;
    setIsImproving(true);
    setError(null);
    try {
      const improved = await improveResume(analysisData);
      setImprovedData(improved);
      // Scroll to top to see the improved resume
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error("Improvement Error:", err);
      setError(err.message || "Failed to improve resume. Please try again.");
    } finally {
      setIsImproving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-white">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary-500/20 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-500/20 rounded-full blur-[120px]" />
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <AnimatePresence mode="wait">
            {improvedData ? (
              <motion.div
                key="improved"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <div className="text-center mb-12 space-y-4">
                  <h2 className="text-4xl font-bold tracking-tight">
                    Your <span className="premium-text-gradient">Optimized</span> Resume
                  </h2>
                  <p className="text-gray-400">Better keywords, stronger impact, higher ATS score.</p>
                </div>
                <ImprovedResume 
                  data={improvedData} 
                  onBack={() => setImprovedData(null)} 
                />
              </motion.div>
            ) : (
              <motion.div
                key="home"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center max-w-4xl mx-auto space-y-8"
                >
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-primary-300 text-sm font-medium">
                    <Sparkles className="w-4 h-4" />
                    <span>Next-Gen Resume Analysis</span>
                  </div>
                  
                  <h1 className="text-6xl md:text-7xl font-bold tracking-tight">
                    Master Your Career with <span className="premium-text-gradient">Resumate</span>
                  </h1>
                  
                  <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
                    Get an instant, data-driven ATS score and professional suggestions to optimize your resume for top-tier companies.
                  </p>

                  <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
                    {currentUser ? (
                      <button className="px-8 py-4 rounded-2xl premium-gradient text-white font-bold hover:shadow-[0_0_20px_rgba(14,165,233,0.4)] transition-all flex items-center gap-2 group">
                        Get Started Free
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </button>
                    ) : (
                      <Link
                        to="/signup"
                        className="px-8 py-4 rounded-2xl premium-gradient text-white font-bold hover:shadow-[0_0_20px_rgba(14,165,233,0.4)] transition-all flex items-center gap-2 group"
                      >
                        Get Started Free
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    )}
                    <button className="px-8 py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-bold hover:bg-white/10 transition-all">
                      Learn More
                    </button>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="mt-20"
                >
                  <FileUpload onFileSelect={handleFileSelect} isLoading={isLoading} />
                </motion.div>

                {error && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-center max-w-2xl mx-auto"
                  >
                    {error}
                  </motion.div>
                )}

                <AnimatePresence>
                  {analysisData && (
                    <ATSAnalysis 
                      data={analysisData} 
                      onImprove={handleImprove}
                      isImproving={isImproving}
                    />
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-white/[0.02]">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon={ShieldCheck}
              title="Real ATS Scoring"
              description="Our AI uses actual recruitment algorithms to give you an authentic score that matches industry standards."
            />
            <FeatureCard
              icon={Zap}
              title="Instant Suggestions"
              description="Receive actionable, high-impact feedback on how to improve your resume structure and content."
            />
            <FeatureCard
              icon={Globe}
              title="Job Matching"
              description="Find perfect roles based on your experience and get customized resume versions for each job posting."
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/5">
        <div className="container mx-auto px-6 text-center text-gray-500 text-sm">
          <p>© 2026 Resumate AI. Built for the future of work.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
