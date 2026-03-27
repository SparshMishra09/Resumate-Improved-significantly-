import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Briefcase, Clock, Building2, ExternalLink, Star, DollarSign } from 'lucide-react';

export const JobCard = ({ job, onSelect, isSaved = false, onToggleSave }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Today';
    if (diffDays === 2) return 'Yesterday';
    if (diffDays <= 7) return `${diffDays - 1} days ago`;
    if (diffDays <= 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString();
  };

  const stripHtml = (html) => {
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  };

  const descriptionPreview = stripHtml(job.description).substring(0, 150) + '...';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="glass-morphism p-6 rounded-2xl border border-white/10 hover:border-primary-500/30 transition-all cursor-pointer group"
      onClick={() => onSelect(job)}
    >
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 space-y-2">
            <h3 className="text-xl font-bold text-white group-hover:text-primary-400 transition-colors line-clamp-2">
              {job.title}
            </h3>
            <div className="flex items-center gap-2 text-gray-400">
              <Building2 className="w-4 h-4" />
              <span className="text-sm">{job.company}</span>
            </div>
          </div>
          
          {onToggleSave && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleSave(job);
              }}
              className="p-2 rounded-xl bg-white/5 hover:bg-primary-500/20 transition-colors"
            >
              <Star 
                className={`w-5 h-5 ${isSaved ? 'fill-primary-400 text-primary-400' : 'text-gray-400'}`} 
              />
            </button>
          )}
        </div>

        {/* Location & Type */}
        <div className="flex flex-wrap gap-3">
          {job.location && (
            <div className="flex items-center gap-1.5 text-sm text-gray-400">
              <MapPin className="w-4 h-4" />
              <span>{job.location}</span>
            </div>
          )}
          
          {job.jobTypes && job.jobTypes.length > 0 && (
            <div className="flex items-center gap-1.5 text-sm text-gray-400">
              <Briefcase className="w-4 h-4" />
              <span>{job.jobTypes[0]}</span>
            </div>
          )}
          
          {job.createdAt && (
            <div className="flex items-center gap-1.5 text-sm text-gray-400">
              <Clock className="w-4 h-4" />
              <span>{formatDate(job.createdAt)}</span>
            </div>
          )}
        </div>

        {/* Description Preview */}
        <p className="text-gray-400 text-sm leading-relaxed line-clamp-2">
          {descriptionPreview}
        </p>

        {/* Tags */}
        {job.tags && job.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {job.tags.slice(0, 5).map((tag, index) => (
              <span
                key={index}
                className="px-3 py-1 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-300 text-xs font-medium"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-white/5">
          <div className="flex items-center gap-4">
            <span className="text-xs text-gray-500">
              Source: {job.source || 'External'}
            </span>
            {job.salaryMin && (
              <div className="flex items-center gap-1 text-sm text-green-400">
                <DollarSign className="w-4 h-4" />
                <span>
                  ${job.salaryMin.toLocaleString()} - ${job.salaryMax?.toLocaleString()}
                  {job.salaryIsPredicted && <span className="text-xs text-gray-500"> (est.)</span>}
                </span>
              </div>
            )}
          </div>
          
          <a
            href={job.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary-500/20 hover:bg-primary-500/30 text-primary-300 text-sm font-medium transition-colors"
          >
            Apply Now
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
    </motion.div>
  );
};
