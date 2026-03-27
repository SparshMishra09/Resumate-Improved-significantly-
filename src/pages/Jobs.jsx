import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Loader2, AlertCircle, TrendingUp } from 'lucide-react';
import { JobCard } from '../components/JobCard';
import { JobSearchFilter } from '../components/JobSearchFilter';
import { JobDetailsModal } from '../components/JobDetailsModal';
import { searchJobs, getFeaturedJobs } from '../services/jobSearch';
import { useAuth } from '../context/AuthContext';

const Jobs = () => {
  const { currentUser } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);
  const [searchParams, setSearchParams] = useState({
    keyword: '',
    location: '',
    jobType: '',
    remote: false,
  });
  const [hasSearched, setHasSearched] = useState(false);

  // Load featured jobs on mount
  useEffect(() => {
    loadFeaturedJobs();
  }, []);

  const loadFeaturedJobs = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getFeaturedJobs();
      if (result.success) {
        setJobs(result.data);
      } else {
        setError(result.error || 'Failed to load jobs');
      }
    } catch (err) {
      console.error('Load Featured Jobs Error:', err);
      setError('Failed to load featured jobs. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    setLoading(true);
    setError(null);
    setHasSearched(true);
    try {
      console.log('Searching with params:', searchParams);
      const result = await searchJobs(searchParams);
      console.log('Search result:', result);
      if (result.success) {
        setJobs(result.data || []);
        if (result.message) {
          setError(result.message);
        }
      } else {
        setError(result.error || 'No jobs found');
        setJobs([]);
      }
    } catch (err) {
      console.error('Search Error:', err);
      setError('Failed to search jobs. Please try again.');
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchParamsChange = (newParams) => {
    setSearchParams(newParams);
  };

  return (
    <div className="min-h-screen bg-[#0f172a] pt-24 pb-12">
      <div className="container mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 text-center space-y-4"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-500/20 text-primary-300 text-sm font-medium mb-4">
            <Briefcase className="w-4 h-4" />
            <span>Find Your Dream Job</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-white">
            Browse <span className="premium-text-gradient">Jobs</span> & Careers
          </h1>
          
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Discover thousands of job opportunities from top companies worldwide
          </p>
        </motion.div>

        {/* Search & Filter */}
        <JobSearchFilter
          searchParams={searchParams}
          onSearchParamsChange={handleSearchParamsChange}
          onSearch={handleSearch}
          isLoading={loading}
        />

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <Loader2 className="w-12 h-12 text-primary-400 animate-spin" />
            <p className="text-gray-400">Searching for jobs...</p>
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
            <button
              onClick={loadFeaturedJobs}
              className="mt-4 px-6 py-2 rounded-xl bg-red-500/20 hover:bg-red-500/30 transition-colors"
            >
              Try Again
            </button>
          </motion.div>
        )}

        {/* No Results */}
        {!loading && !error && jobs.length === 0 && hasSearched && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20 space-y-4"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/5">
              <Briefcase className="w-10 h-10 text-gray-500" />
            </div>
            <h3 className="text-2xl font-bold text-white">No jobs found</h3>
            <p className="text-gray-400">Try adjusting your search criteria</p>
            <button
              onClick={loadFeaturedJobs}
              className="px-8 py-3 rounded-2xl premium-gradient text-white font-bold hover:shadow-[0_0_20px_rgba(14,165,233,0.4)] transition-all"
            >
              View Featured Jobs
            </button>
          </motion.div>
        )}

        {/* Jobs Grid */}
        {!loading && !error && jobs.length > 0 && (
          <>
            {!hasSearched && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <TrendingUp className="w-6 h-6 text-primary-400" />
                  <h2 className="text-2xl font-bold text-white">Featured Jobs</h2>
                </div>
                <span className="text-gray-400 text-sm">{jobs.length} jobs available</span>
              </motion.div>
            )}
            
            {hasSearched && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <Briefcase className="w-6 h-6 text-primary-400" />
                  <h2 className="text-2xl font-bold text-white">Search Results</h2>
                </div>
                <span className="text-gray-400 text-sm">{jobs.length} jobs found</span>
              </motion.div>
            )}
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {jobs.map((job, index) => (
                <JobCard
                  key={job.id || index}
                  job={job}
                  onSelect={setSelectedJob}
                />
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

export default Jobs;
