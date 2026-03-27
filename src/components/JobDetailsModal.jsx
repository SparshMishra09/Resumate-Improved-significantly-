import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, Briefcase, Clock, Building2, ExternalLink, DollarSign, Globe } from 'lucide-react';

export const JobDetailsModal = ({ job, isOpen, onClose }) => {
  if (!job || !isOpen) return null;

  const formatDate = (dateString) => {
    if (!dateString) return 'Recently posted';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8"
          >
            <div className="bg-[#0f172a] border border-white/10 rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl">
              {/* Header */}
              <div className="sticky top-0 z-10 bg-[#0f172a]/95 backdrop-blur-xl border-b border-white/10 p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-3">
                      <h2 className="text-2xl md:text-3xl font-bold text-white">
                        {job.title}
                      </h2>
                      {job.remote && (
                        <span className="px-3 py-1 rounded-full bg-green-500/20 border border-green-500/20 text-green-400 text-xs font-medium">
                          Remote
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-gray-400">
                      <Building2 className="w-5 h-5" />
                      <span className="text-lg">{job.company}</span>
                    </div>
                  </div>
                  
                  <button
                    onClick={onClose}
                    className="p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
                  >
                    <X className="w-6 h-6 text-gray-400" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
                {/* Job Meta */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  {job.location && (
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                      <div className="flex items-center gap-2 text-gray-400 mb-1">
                        <MapPin className="w-4 h-4" />
                        <span className="text-xs">Location</span>
                      </div>
                      <p className="text-white font-medium">{job.location}</p>
                    </div>
                  )}
                  
                  {job.jobTypes && job.jobTypes.length > 0 && (
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                      <div className="flex items-center gap-2 text-gray-400 mb-1">
                        <Briefcase className="w-4 h-4" />
                        <span className="text-xs">Type</span>
                      </div>
                      <p className="text-white font-medium">{job.jobTypes[0]}</p>
                    </div>
                  )}
                  
                  {job.createdAt && (
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                      <div className="flex items-center gap-2 text-gray-400 mb-1">
                        <Clock className="w-4 h-4" />
                        <span className="text-xs">Posted</span>
                      </div>
                      <p className="text-white font-medium">{formatDate(job.createdAt)}</p>
                    </div>
                  )}
                  
                  {job.source && (
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                      <div className="flex items-center gap-2 text-gray-400 mb-1">
                        <Globe className="w-4 h-4" />
                        <span className="text-xs">Source</span>
                      </div>
                      <p className="text-white font-medium">{job.source}</p>
                    </div>
                  )}
                </div>

                {/* Salary Info */}
                {(job.salaryMin || job.salaryMax) && (
                  <div className="p-4 rounded-2xl bg-green-500/10 border border-green-500/20 mb-6">
                    <div className="flex items-center gap-2 text-green-400 mb-2">
                      <DollarSign className="w-5 h-5" />
                      <span className="font-medium">Salary Range</span>
                    </div>
                    <p className="text-white text-lg font-bold">
                      ${job.salaryMin?.toLocaleString()} - ${job.salaryMax?.toLocaleString()}
                      {job.salaryIsPredicted && (
                        <span className="text-sm text-gray-400 font-normal ml-2">(Estimated)</span>
                      )}
                    </p>
                  </div>
                )}

                {/* Tags */}
                {job.tags && job.tags.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-bold text-white mb-3">Skills & Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {job.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-4 py-2 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-300 text-sm font-medium"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Description */}
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-white mb-3">Job Description</h3>
                  <div 
                    className="prose prose-invert max-w-none"
                    dangerouslySetInnerHTML={{ __html: job.description }}
                  />
                </div>
              </div>

              {/* Footer */}
              <div className="sticky bottom-0 bg-[#0f172a]/95 backdrop-blur-xl border-t border-white/10 p-6">
                <div className="flex items-center justify-between gap-4">
                  <div className="text-sm text-gray-400">
                    This job is hosted on {job.source || 'an external platform'}
                  </div>
                  <a
                    href={job.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-8 py-4 rounded-2xl premium-gradient text-white font-bold hover:shadow-[0_0_20px_rgba(14,165,233,0.4)] transition-all"
                  >
                    Apply on {job.source || 'Company Website'}
                    <ExternalLink className="w-5 h-5" />
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
