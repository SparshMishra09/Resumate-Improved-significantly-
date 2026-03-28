import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ShieldCheck, Zap, Globe, Target, Award, FileText, Briefcase, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const FeatureCard = ({ icon: Icon, title, description }) => (
  <div className="glass-morphism p-8 rounded-3xl space-y-4">
    <div className="p-3 rounded-2xl bg-primary-500/20 w-fit">
      <Icon className="w-6 h-6 text-primary-400" />
    </div>
    <h3 className="text-xl font-bold text-white">{title}</h3>
    <p className="text-gray-400 text-sm leading-relaxed">{description}</p>
  </div>
);

const About = () => {
  return (
    <div className="min-h-screen bg-[#0f172a] pt-24 pb-12">
      <div className="container mx-auto px-6">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16 space-y-6"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-500/20 text-primary-300 text-sm font-medium">
            <Sparkles className="w-4 h-4" />
            <span>About Resumate</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-white">
            Empowering Your <span className="premium-text-gradient">Career Journey</span>
          </h1>
          
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Resumate uses advanced AI to help you create ATS-optimized resumes and find your dream job.
          </p>
        </motion.div>

        {/* What We Do */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-20"
        >
          <h2 className="text-3xl font-bold text-white text-center mb-12">What We Do</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon={FileText}
              title="ATS Resume Analysis"
              description="Get instant, data-driven ATS scores for your resume with professional suggestions to optimize it for top-tier companies."
            />
            <FeatureCard
              icon={Target}
              title="Job-Tailored Resumes"
              description="Convert your resume to perfectly match specific job postings, increasing your chances of getting noticed by recruiters."
            />
            <FeatureCard
              icon={Briefcase}
              title="Job Discovery"
              description="Find relevant jobs and internships from multiple sources, all in one place with smart filtering and search."
            />
          </div>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-20"
        >
          <h2 className="text-3xl font-bold text-white text-center mb-12">Our Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <FeatureCard
              icon={ShieldCheck}
              title="ATS Scoring"
              description="Get accurate ATS scores based on real recruitment algorithms."
            />
            <FeatureCard
              icon={Zap}
              title="Instant Feedback"
              description="Receive actionable suggestions to improve your resume immediately."
            />
            <FeatureCard
              icon={Award}
              title="Resume Improvement"
              description="AI-powered resume enhancement for better ATS performance."
            />
            <FeatureCard
              icon={Globe}
              title="Job Matching"
              description="Find jobs that match your skills and experience."
            />
          </div>
        </motion.div>

        {/* How It Works */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-20"
        >
          <h2 className="text-3xl font-bold text-white text-center mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: '1', title: 'Sign Up', desc: 'Create a free account and get 1 credit to start' },
              { step: '2', title: 'Upload Resume', desc: 'Upload your current resume in PDF or text format' },
              { step: '3', title: 'Get Analysis', desc: 'Receive ATS score and improvement suggestions' },
              { step: '4', title: 'Apply & Succeed', desc: 'Use optimized resume to land your dream job' },
            ].map((item) => (
              <div key={item.step} className="text-center space-y-4">
                <div className="w-16 h-16 rounded-full premium-gradient flex items-center justify-center text-2xl font-bold text-white mx-auto">
                  {item.step}
                </div>
                <h3 className="text-xl font-bold text-white">{item.title}</h3>
                <p className="text-gray-400 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Why Choose Us */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-20"
        >
          <h2 className="text-3xl font-bold text-white text-center mb-12">Why Choose Resumate</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {[
              { title: 'AI-Powered', desc: 'Advanced AI algorithms for accurate resume analysis' },
              { title: 'Real ATS Scoring', desc: 'Scores based on actual recruitment software' },
              { title: 'Job-Specific', desc: 'Tailor your resume for each job application' },
              { title: 'Easy to Use', desc: 'Simple interface with instant results' },
            ].map((item, idx) => (
              <div key={idx} className="flex items-start gap-4 p-6 rounded-2xl bg-white/5 border border-white/10">
                <CheckCircle className="w-6 h-6 text-green-400 shrink-0" />
                <div>
                  <h3 className="text-lg font-bold text-white mb-1">{item.title}</h3>
                  <p className="text-gray-400 text-sm">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-center space-y-6"
        >
          <h2 className="text-3xl font-bold text-white">Ready to Optimize Your Resume?</h2>
          <p className="text-gray-400">Join thousands of users who landed their dream jobs with Resumate</p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Link
              to="/signup"
              className="px-8 py-4 rounded-2xl premium-gradient text-white font-bold hover:shadow-[0_0_20px_rgba(14,165,233,0.4)] transition-all flex items-center gap-2"
            >
              Get Started Free
              <Sparkles className="w-5 h-5" />
            </Link>
            <Link
              to="/jobs"
              className="px-8 py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-bold hover:bg-white/10 transition-all"
            >
              Browse Jobs
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default About;
