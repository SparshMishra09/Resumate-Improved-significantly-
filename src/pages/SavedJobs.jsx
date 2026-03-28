import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Briefcase, Loader2, AlertCircle, Star, Trash2, ExternalLink } from 'lucide-react';
import { JobCard } from '../components/JobCard';
import { JobDetailsModal } from '../components/JobDetailsModal';
import { getSavedJobs, unsaveJob } from '../services/firestore';
import { useAuth } from '../context/AuthContext';

const SavedJobs = () => {
  const navigate = useNavigate();
  const { currentUser, loading: authLoading } = useAuth();
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);

  useEffect(() => {
    if (!authLoading && !currentUser) {
      navigate('/login');
      return;
    }
    if (currentUser) {
      loadSavedJobs();
    }
  }, [currentUser, authLoading, navigate]);

  const loadSavedJobs = async () => {
    if (!currentUser) return;
    
    setLoading(true);
    setError(null);
    try {
      const result = await getSavedJobs(currentUser.uid);
      if (result.success && result.data) {
        // Transform saved jobs to match JobCard format
        const jobs = result.data.map(saved => ({
          id: saved.jobData.jobId || saved.id,
          title: saved.jobData.title,
          company: saved.jobData.company,
          location: saved.jobData.location,
          description: saved.jobData.description,
          tags: saved.jobData.tags,
          jobTypes: saved.jobData.jobTypes,
          url: saved.jobData.url,
          source: saved.jobData.source,
          savedId: saved.id,
          savedAt: saved.savedAt,
        }));
        setSavedJobs(jobs);
      } else {
        setError(result.error || 'Failed to load saved jobs');
      }
    } catch (err) {
      console.error('Load Saved Jobs Error:', err);
      setError('Failed to load saved jobs');
    } finally {
      setLoading(false);
    }
  };

  const handleUnsave = async (job) => {
    if (!currentUser) return;
    
    try {
      const jobId = job.savedId || job.id;
      const result = await unsaveJob(currentUser.uid, jobId);
      
      if (result.success) {
        setSavedJobs(prev => prev.filter(j => j.id !== job.id));
      } else {
        alert('Failed to remove job: ' + result.error);
      }
    } catch (err) {
      console.error('Unsave Error:', err);
      alert('Failed to remove job');
    }
  };

  const handleTailorClick = (job) => {
    navigate('/convert-resume', { state: { job } });
  };

  if (authLoading || !currentUser) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-primary-400 animate-spin" />
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
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-primary-500/20">
                <Star className="w-8 h-8 text-primary-400" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-white">Saved Jobs</h1>
                <p className="text-gray-400">Your bookmarked opportunities</p>
              </div>
            </div>
            
            <Link
              to="/jobs"
              className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-white font-medium flex items-center gap-2"
            >
              <Briefcase className="w-4 h-4" />
              Browse More Jobs
            </Link>
          </div>
        </motion.div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <Loader2 className="w-12 h-12 text-primary-400 animate-spin" />
            <p className="text-gray-400">Loading saved jobs...</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-center max-w-2xl mx-auto"
          >
            <AlertCircle className="w-8 h-8 mx-auto mb-3" />
            <p className="font-medium">{error}</p>
          </motion.div>
        )}

        {/* No Saved Jobs */}
        {!loading && !error && savedJobs.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20 space-y-6"
          >
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-white/5">
              <Star className="w-12 h-12 text-gray-500" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-white">No Saved Jobs Yet</h3>
              <p className="text-gray-400">Start saving jobs you're interested in to track them here</p>
            </div>
            <Link
              to="/jobs"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl premium-gradient text-white font-bold hover:shadow-[0_0_20px_rgba(14,165,233,0.4)] transition-all"
            >
              <Briefcase className="w-5 h-5" />
              Browse Jobs
            </Link>
          </motion.div>
        )}

        {/* Saved Jobs Grid */}
        {!loading && !error && savedJobs.length > 0 && (
          <>
            <div className="mb-8 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Briefcase className="w-6 h-6 text-primary-400" />
                <h2 className="text-2xl font-bold text-white">Your Collection</h2>
              </div>
              <span className="text-gray-400 text-sm">{savedJobs.length} jobs saved</span>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {savedJobs.map((job, index) => (
                <div key={job.savedId || job.id} className="relative group">
                  <JobCard
                    job={job}
                    onSelect={setSelectedJob}
                    isSaved={true}
                    onToggleSave={handleUnsave}
                    showTailorButton={true}
                    onTailorClick={handleTailorClick}
                  />
                </div>
              ))}
            </div>
          </>
        )}

        {/* Job Details Modal */}
        <JobDetailsModal
          job={selectedJob}
          isOpen={!!selectedJob}
          onClose={() => setSelectedJob(null)}
        />
      </div>
    </div>
  );
};

export default SavedJobs;
