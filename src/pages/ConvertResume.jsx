import React, { useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Download, Copy, Check, Sparkles, AlertCircle, TrendingUp, Target, FileText, Coins } from 'lucide-react';
import { tailorResumeForJob } from '../services/ai';
import { analyzeResume, improveResume } from '../services/ai';
import { extractTextFromPdf } from '../utils/pdfParser';
import { FileUpload } from '../components/FileUpload';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { useAuth } from '../context/AuthContext';
import { checkUserCredits, useCredit } from '../services/firestore';

const ConvertResume = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser } = useAuth();
  const resumeRef = useRef(null);
  
  const [selectedJob, setSelectedJob] = useState(location.state?.job || null);
  const [originalResume, setOriginalResume] = useState(null);
  const [tailoredResume, setTailoredResume] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  const [step, setStep] = useState(1); // 1: Upload, 2: Processing, 3: Result
  const [credits, setCredits] = useState(null);

  // Check authentication and credits on mount
  React.useEffect(() => {
    if (!currentUser) {
      navigate('/login');
      return;
    }
    checkUserCredits(currentUser.uid).then(result => {
      setCredits(result.credits);
    });
  }, [currentUser, navigate]);

  const handleFileSelect = async (file) => {
    // Check credits
    const creditCheck = await checkUserCredits(currentUser.uid);
    if (!creditCheck.hasCredits) {
      setError('No credits remaining. Resume tailoring requires 1 credit.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setStep(2);
    
    try {
      let text = '';
      const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');

      if (isPdf) {
        text = await extractTextFromPdf(file);
      } else {
        text = await file.text();
      }

      if (!text || text.trim().length < 50) {
        throw new Error("The resume seems too short or empty.");
      }

      // Analyze the original resume first
      const analysis = await analyzeResume(text);
      setOriginalResume({
        file,
        text,
        analysis,
      });

      // Now tailor it for the job
      if (selectedJob) {
        // Use 1 credit for tailoring
        const creditResult = await useCredit(currentUser.uid, 'tailor_resume');
        if (!creditResult.success) {
          throw new Error(creditResult.error);
        }
        setCredits(creditResult.credits);
        
        const tailored = await tailorResumeForJob(analysis, selectedJob);
        setTailoredResume(tailored);
        setStep(3);
      } else {
        setError('No job selected. Please go back and select a job first.');
        setStep(1);
      }
    } catch (err) {
      console.error("Conversion Error:", err);
      setError(err.message || "Failed to convert resume. Please try again.");
      setStep(1);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (!tailoredResume) return;

    const text = `
${tailoredResume.name}

SUMMARY
${tailoredResume.summary}

SKILLS
${tailoredResume.skills.join(', ')}

EXPERIENCE
${tailoredResume.experience.map(exp => `
${exp.role} | ${exp.company}
${exp.points.join('\n')}
`).join('\n')}

EDUCATION
${tailoredResume.education.join('\n')}

TAILORED FOR: ${selectedJob?.title} at ${selectedJob?.company}
MATCH: ${tailoredResume.matchPercentage || tailoredResume.ats_score}%
    `.trim();

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = async () => {
    const element = resumeRef.current;
    if (!element) return;

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#ffffff',
    });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`${tailoredResume.name.replace(/\s+/g, '_')}_Resume_${selectedJob?.company || 'Tailored'}.pdf`);
  };

  if (!selectedJob) {
    return (
      <div className="min-h-screen bg-[#0f172a] pt-24 pb-12">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-6"
          >
            <button
              onClick={() => navigate('/jobs')}
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mx-auto"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Jobs
            </button>
            
            <div className="p-8 rounded-3xl glass-morphism max-w-2xl mx-auto space-y-4">
              <AlertCircle className="w-16 h-16 text-yellow-500 mx-auto" />
              <h2 className="text-2xl font-bold text-white">No Job Selected</h2>
              <p className="text-gray-400">
                Please select a job from the jobs page first, then come back to tailor your resume.
              </p>
              <button
                onClick={() => navigate('/jobs')}
                className="px-8 py-3 rounded-2xl premium-gradient text-white font-bold hover:shadow-[0_0_20px_rgba(14,165,233,0.4)] transition-all"
              >
                Browse Jobs
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f172a] pt-24 pb-12">
      <div className="container mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 space-y-4"
        >
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>

          <div className="flex items-center gap-3 flex-wrap">
            <div className="p-3 rounded-2xl bg-primary-500/20">
              <Sparkles className="w-8 h-8 text-primary-400" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white">Tailor Your Resume</h1>
              <p className="text-gray-400">
                Optimize your resume for <span className="text-primary-400 font-medium">{selectedJob.title}</span> at <span className="text-primary-400 font-medium">{selectedJob.company}</span>
              </p>
            </div>
          </div>
        </motion.div>

        {/* Progress Steps */}
        <div className="mb-12">
          <div className="flex items-center justify-center gap-4">
            {[
              { num: 1, label: 'Upload Resume' },
              { num: 2, label: 'AI Processing' },
              { num: 3, label: 'Get Tailored Resume' },
            ].map((s, idx) => (
              <React.Fragment key={s.num}>
                <div className={`flex items-center gap-2 ${step >= s.num ? 'text-primary-400' : 'text-gray-500'}`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                    step >= s.num ? 'bg-primary-500/20 border-2 border-primary-500' : 'bg-white/5 border-2 border-white/10'
                  }`}>
                    {step > s.num ? <Check className="w-5 h-5" /> : s.num}
                  </div>
                  <span className="font-medium hidden md:block">{s.label}</span>
                </div>
                {idx < 2 && <div className={`w-12 h-1 rounded ${step > s.num ? 'bg-primary-500' : 'bg-white/10'}`} />}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 max-w-2xl mx-auto mb-8"
          >
            <AlertCircle className="w-6 h-6 mb-2" />
            <p className="font-medium">{error}</p>
          </motion.div>
        )}

        {/* Step 1: Upload */}
        {step === 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto space-y-6"
          >
            <div className="glass-morphism p-8 rounded-3xl space-y-6">
              <div className="text-center space-y-2">
                <Target className="w-12 h-12 text-primary-400 mx-auto" />
                <h3 className="text-2xl font-bold text-white">Upload Your Current Resume</h3>
                <p className="text-gray-400">
                  We'll analyze it and tailor it specifically for this job posting
                </p>
              </div>

              <FileUpload onFileSelect={handleFileSelect} isLoading={isLoading} />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6">
                <div className="text-center space-y-2">
                  <FileText className="w-8 h-8 text-primary-400 mx-auto" />
                  <p className="text-sm text-gray-400">PDF or TXT</p>
                </div>
                <div className="text-center space-y-2">
                  <Sparkles className="w-8 h-8 text-primary-400 mx-auto" />
                  <p className="text-sm text-gray-400">AI-Powered</p>
                </div>
                <div className="text-center space-y-2">
                  <TrendingUp className="w-8 h-8 text-primary-400 mx-auto" />
                  <p className="text-sm text-gray-400">Higher ATS Score</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Step 2: Loading */}
        {step === 2 && (
          <div className="flex flex-col items-center justify-center py-20 space-y-6">
            <div className="relative">
              <div className="w-24 h-24 border-4 border-primary-500/20 border-t-primary-500 rounded-full animate-spin" />
              <Sparkles className="w-8 h-8 text-primary-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-2xl font-bold text-white">AI is Tailoring Your Resume</h3>
              <p className="text-gray-400">Analyzing job requirements and optimizing your content...</p>
            </div>
          </div>
        )}

        {/* Step 3: Results */}
        {step === 3 && tailoredResume && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* Important Disclaimer */}
            <div className="p-6 rounded-2xl bg-blue-500/10 border border-blue-500/20">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-6 h-6 text-blue-400 shrink-0 mt-0.5" />
                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-blue-400">Important Notice</h3>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    This is an <strong className="text-white">AI-powered improvement suggestion</strong> tailored for the specific job posting. 
                    This is <strong className="text-white">NOT a final resume</strong>. You should personally review and add your actual achievements, 
                    experiences, and skills to make it authentic and accurate. 
                    <br /><br />
                    <strong className="text-white">⚠️ Do not submit this as-is</strong> - we cannot add fake achievements to your resume. 
                    Use this as a guide to optimize your real experience for this specific job.
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-4">
                <div className="px-6 py-3 rounded-2xl bg-green-500/10 border border-green-500/20">
                  <div className="text-sm text-gray-400">Match Score</div>
                  <div className="text-3xl font-bold text-green-400">{tailoredResume.matchPercentage || tailoredResume.ats_score}%</div>
                </div>
                {tailoredResume.hasRequiredExperience === false && (
                  <div className="px-6 py-3 rounded-2xl bg-yellow-500/10 border border-yellow-500/20 text-yellow-400">
                    <AlertCircle className="w-5 h-5 mb-1" />
                    <div className="text-sm">May lack some required experience</div>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-4">
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-sm font-medium"
                >
                  {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                  {copied ? 'Copied!' : 'Copy Text'}
                </button>
                <button
                  onClick={handleDownload}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl premium-gradient text-white font-medium hover:shadow-[0_0_15px_rgba(14,165,233,0.3)] transition-all"
                >
                  <Download className="w-4 h-4" />
                  Download PDF
                </button>
              </div>
            </div>

            {/* Missing Skills Alert */}
            {tailoredResume.missingSkills && tailoredResume.missingSkills.length > 0 && (
              <div className="p-6 rounded-2xl bg-yellow-500/10 border border-yellow-500/20">
                <div className="flex items-center gap-3 mb-3">
                  <AlertCircle className="w-6 h-6 text-yellow-400" />
                  <h3 className="text-lg font-bold text-yellow-400">Skills to Consider Adding</h3>
                </div>
                <p className="text-gray-400 mb-3">
                  These skills are mentioned in the job posting but not found in your resume:
                </p>
                <div className="flex flex-wrap gap-2">
                  {tailoredResume.missingSkills.map((skill, idx) => (
                    <span key={idx} className="px-4 py-2 rounded-full bg-yellow-500/20 border border-yellow-500/30 text-yellow-300 text-sm font-medium">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Resume Preview */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left: Improvements */}
              <div className="lg:col-span-1 space-y-6">
                <div className="glass-morphism p-6 rounded-3xl space-y-4">
                  <h3 className="text-xl font-bold text-white">Tailoring Summary</h3>
                  <ul className="space-y-3">
                    {tailoredResume.suggestions?.map((suggestion, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-sm text-gray-300">
                        <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-green-500 shrink-0" />
                        {suggestion}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="glass-morphism p-6 rounded-3xl space-y-4">
                  <h3 className="text-xl font-bold text-white">Key Keywords</h3>
                  <div className="flex flex-wrap gap-2">
                    {tailoredResume.tailoredFor?.keyKeywords?.map((keyword, idx) => (
                      <span key={idx} className="px-3 py-1.5 rounded-lg bg-primary-500/20 border border-primary-500/30 text-primary-300 text-sm">
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right: Resume Preview */}
              <div className="lg:col-span-2">
                <div
                  ref={resumeRef}
                  className="bg-white text-slate-900 p-12 shadow-2xl rounded-sm min-h-[1000px] font-serif"
                >
                  <header className="border-b-2 border-slate-900 pb-6 mb-8 text-center">
                    <h1 className="text-4xl font-bold uppercase tracking-tight mb-2">{tailoredResume.name}</h1>
                    <p className="text-slate-600 italic">{tailoredResume.summary}</p>
                  </header>

                  <section className="mb-8">
                    <h2 className="text-lg font-bold uppercase border-b border-slate-300 mb-4 tracking-wider">Skills</h2>
                    <div className="flex flex-wrap gap-x-6 gap-y-2">
                      {tailoredResume.skills.map((skill, i) => (
                        <span key={i} className="text-sm font-medium">• {skill}</span>
                      ))}
                    </div>
                  </section>

                  <section className="mb-8">
                    <h2 className="text-lg font-bold uppercase border-b border-slate-300 mb-4 tracking-wider">Experience</h2>
                    <div className="space-y-6">
                      {tailoredResume.experience.map((exp, i) => (
                        <div key={i}>
                          <div className="flex justify-between items-baseline mb-2">
                            <h3 className="font-bold text-md">{exp.role}</h3>
                            <span className="text-sm font-semibold">{exp.company}</span>
                          </div>
                          <ul className="list-none space-y-1">
                            {exp.points.map((point, idx) => (
                              <li key={idx} className="text-sm text-slate-700 leading-relaxed pl-4 relative">
                                <span className="absolute left-0">•</span>
                                {point.replace('• ', '')}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </section>

                  <section>
                    <h2 className="text-lg font-bold uppercase border-b border-slate-300 mb-4 tracking-wider">Education</h2>
                    <div className="space-y-2">
                      {tailoredResume.education.map((edu, i) => (
                        <p key={i} className="text-sm text-slate-700">{edu}</p>
                      ))}
                    </div>
                  </section>

                  <footer className="mt-12 pt-6 border-t border-slate-300 text-center text-slate-500 text-sm">
                    <p>Tailored for {selectedJob.title} at {selectedJob.company}</p>
                    <p>Match Score: {tailoredResume.matchPercentage || tailoredResume.ats_score}%</p>
                  </footer>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ConvertResume;
