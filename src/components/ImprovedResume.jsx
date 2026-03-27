import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { Download, Copy, Check, FileText, ArrowLeft, Star } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export const ImprovedResume = ({ data, onBack }) => {
  const resumeRef = useRef(null);
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    const text = `
${data.name}

SUMMARY
${data.summary}

SKILLS
${data.skills.join(', ')}

EXPERIENCE
${data.experience.map(exp => `
${exp.role} | ${exp.company}
${exp.points.join('\n')}
`).join('\n')}

EDUCATION
${data.education.join('\n')}
    `.trim();

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = async () => {
    const element = resumeRef.current;
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
    pdf.save(`${data.name.replace(/\s+/g, '_')}_Resume.pdf`);
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8 mt-12 pb-20">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Analysis
        </button>

        <div className="flex items-center gap-4">
          <button
            onClick={handleCopy}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-sm font-medium"
          >
            {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copied!' : 'Copy Text Template'}
          </button>
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 px-6 py-3 rounded-xl premium-gradient text-white font-medium hover:shadow-[0_0_15px_rgba(14,165,233,0.3)] transition-all text-sm"
          >
            <Download className="w-4 h-4" />
            Download PDF
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Sidebar: Improvements Summary */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-1 space-y-6"
        >
          <div className="glass-morphism p-8 rounded-3xl space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-green-500/20">
                <Star className="w-6 h-6 text-green-400" />
              </div>
              <h3 className="text-xl font-bold text-white">Improvements</h3>
            </div>
            <ul className="space-y-4">
              {data.suggestions.map((s, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-gray-400">
                  <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-green-500 shrink-0" />
                  {s}
                </li>
              ))}
            </ul>
            <div className="pt-6 border-t border-white/5">
              <div className="text-sm text-gray-400 mb-2">Target ATS Score</div>
              <div className="text-4xl font-bold premium-text-gradient">{data.ats_score}%</div>
            </div>
          </div>
        </motion.div>

        {/* Right Content: Resume Preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-2"
        >
          <div
            ref={resumeRef}
            className="bg-white text-slate-900 p-12 shadow-2xl rounded-sm min-h-[1000px] font-serif"
          >
            <header className="border-b-2 border-slate-900 pb-6 mb-8 text-center">
              <h1 className="text-4xl font-bold uppercase tracking-tight mb-2">{data.name}</h1>
              <p className="text-slate-600 italic">{data.summary}</p>
            </header>

            <section className="mb-8">
              <h2 className="text-lg font-bold uppercase border-b border-slate-300 mb-4 tracking-wider">Skills</h2>
              <div className="flex flex-wrap gap-x-6 gap-y-2">
                {data.skills.map((skill, i) => (
                  <span key={i} className="text-sm font-medium">• {skill}</span>
                ))}
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-lg font-bold uppercase border-b border-slate-300 mb-4 tracking-wider">Experience</h2>
              <div className="space-y-6">
                {data.experience.map((exp, i) => (
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
                {data.education.map((edu, i) => (
                  <p key={i} className="text-sm text-slate-700">{edu}</p>
                ))}
              </div>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
