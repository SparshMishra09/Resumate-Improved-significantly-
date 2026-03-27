import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, AlertCircle, TrendingUp, Award, Briefcase, GraduationCap, Zap, Star } from 'lucide-react';

const ScoreRing = ({ score }) => {
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="relative w-40 h-40 flex items-center justify-center">
      <svg className="w-full h-full -rotate-90">
        <circle
          cx="80"
          cy="80"
          r={radius}
          fill="transparent"
          stroke="rgba(255, 255, 255, 0.05)"
          strokeWidth="12"
        />
        <motion.circle
          cx="80"
          cy="80"
          r={radius}
          fill="transparent"
          stroke="url(#gradient)"
          strokeWidth="12"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          strokeLinecap="round"
        />
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="100%" stopColor="#818cf8" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="text-4xl font-bold text-white leading-none">{score}</span>
        <span className="text-gray-400 text-xs mt-1 uppercase tracking-wider font-semibold">ATS Score</span>
      </div>
    </div>
  );
};

export const ATSAnalysis = ({ data, onImprove, isImproving }) => {
  if (!data) return null;

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8 mt-12 pb-20">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <h2 className="text-3xl font-bold text-white">ATS Analysis Results</h2>
        <button
          onClick={onImprove}
          disabled={isImproving}
          className="flex items-center gap-2 px-8 py-4 rounded-2xl premium-gradient text-white font-bold hover:shadow-[0_0_20px_rgba(14,165,233,0.4)] transition-all group disabled:opacity-50"
        >
          {isImproving ? (
            <>
              <Zap className="w-5 h-5 animate-pulse" />
              Improving...
            </>
          ) : (
            <>
              <Star className="w-5 h-5 group-hover:scale-110 transition-transform" />
              Improve My Resume
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Score Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="col-span-1 glass-morphism p-8 rounded-3xl flex flex-col items-center justify-center gap-6"
        >
          <ScoreRing score={data.ats_score} />
          <div className="text-center space-y-2">
            <h3 className="text-xl font-bold text-white">Analysis Result</h3>
            <p className="text-gray-400 text-sm">Your resume has been evaluated against industry standards.</p>
          </div>
        </motion.div>

        {/* Suggestions Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="col-span-1 md:col-span-2 glass-morphism p-8 rounded-3xl space-y-6"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-primary-500/20">
              <Zap className="w-6 h-6 text-primary-400" />
            </div>
            <h3 className="text-xl font-bold text-white">Improvement Suggestions</h3>
          </div>
          <ul className="space-y-4">
            {data.suggestions.map((suggestion, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
                className="flex items-start gap-3 p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors"
              >
                <AlertCircle className="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" />
                <span className="text-gray-300 text-sm leading-relaxed">{suggestion}</span>
              </motion.li>
            ))}
          </ul>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Skills Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-morphism p-8 rounded-3xl space-y-6"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-primary-500/20">
              <Award className="w-6 h-6 text-primary-400" />
            </div>
            <h3 className="text-xl font-bold text-white">Extracted Skills</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {data.skills.map((skill, index) => (
              <span
                key={index}
                className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-primary-300 text-sm font-medium hover:bg-white/10 transition-colors"
              >
                {skill}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Experience Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-morphism p-8 rounded-3xl space-y-6"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-primary-500/20">
              <Briefcase className="w-6 h-6 text-primary-400" />
            </div>
            <h3 className="text-xl font-bold text-white">Experience Highlights</h3>
          </div>
          <div className="space-y-6">
            {data.experience.map((exp, index) => (
              <div key={index} className="space-y-3 relative pl-6 border-l border-white/10">
                <div className="absolute left-[-5px] top-1.5 w-2 h-2 rounded-full bg-primary-500" />
                <div>
                  <h4 className="text-white font-bold">{exp.role}</h4>
                  <p className="text-primary-400 text-sm">{exp.company}</p>
                </div>
                <ul className="space-y-2">
                  {exp.points.map((point, idx) => (
                    <li key={idx} className="text-gray-400 text-sm flex items-start gap-2">
                      <span className="text-primary-500 shrink-0">•</span>
                      <span>{point.replace("• ", "")}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};
