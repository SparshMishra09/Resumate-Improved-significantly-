import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Loader2, AlertCircle, TrendingUp, GraduationCap } from 'lucide-react';
import { JobCard } from '../components/JobCard';
import { JobSearchFilter } from '../components/JobSearchFilter';
import { JobDetailsModal } from '../components/JobDetailsModal';
import { searchInternships } from '../services/jobSearch';
import { useAuth } from '../context/AuthContext';

const Internships = () => {
  const { currentUser } = useAuth();
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedInternship, setSelectedInternship] = useState(null);
  const [searchParams, setSearchParams] = useState({
    keyword: '',
    location: '',
    jobType: 'Internship',
    remote: false,
  });
  const [hasSearched, setHasSearched] = useState(false);

  // Load internships on mount
  useEffect(() => {
    loadInternships();
  }, []);

  const loadInternships = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await searchInternships({ page: 1 });
      if (result.success) {
        setInternships(result.data);
      } else {
        setError(result.error || 'Failed to load internships');
      }
    } catch (err) {
      console.error('Load Internships Error:', err);
      setError('Failed to load internships. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    setLoading(true);
    setError(null);
    setHasSearched(true);
    try {
      console.log('Searching internships with params:', searchParams);
      const result = await searchInternships(searchParams);
      console.log('Internship search result:', result);
      if (result.success) {
        setInternships(result.data || []);
        if (result.message) {
          setError(result.message);
        }
      } else {
        setError(result.error || 'No internships found');
        setInternships([]);
      }
    } catch (err) {
      console.error('Search Error:', err);
      setError('Failed to search internships. Please try again.');
      setInternships([]);
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
            <GraduationCap className="w-4 h-4" />
            <span>Start Your Career Journey</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-white">
            Find <span className="premium-text-gradient">Internships</span>
          </h1>
          
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Discover internship opportunities to kickstart your professional career
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
            <p className="text-gray-400">Searching for internships...</p>
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
              onClick={loadInternships}
              className="mt-4 px-6 py-2 rounded-xl bg-red-500/20 hover:bg-red-500/30 transition-colors"
            >
              Try Again
            </button>
          </motion.div>
        )}

        {/* No Results */}
        {!loading && !error && internships.length === 0 && hasSearched && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20 space-y-4"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/5">
              <GraduationCap className="w-10 h-10 text-gray-500" />
            </div>
            <h3 className="text-2xl font-bold text-white">No internships found</h3>
            <p className="text-gray-400">Try adjusting your search criteria</p>
            <button
              onClick={loadInternships}
              className="px-8 py-3 rounded-2xl premium-gradient text-white font-bold hover:shadow-[0_0_20px_rgba(14,165,233,0.4)] transition-all"
            >
              View All Internships
            </button>
          </motion.div>
        )}

        {/* Internships Grid */}
        {!loading && !error && internships.length > 0 && (
          <>
            {!hasSearched && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <TrendingUp className="w-6 h-6 text-primary-400" />
                  <h2 className="text-2xl font-bold text-white">Available Internships</h2>
                </div>
                <span className="text-gray-400 text-sm">{internships.length} internships available</span>
              </motion.div>
            )}
            
            {hasSearched && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <GraduationCap className="w-6 h-6 text-primary-400" />
                  <h2 className="text-2xl font-bold text-white">Search Results</h2>
                </div>
                <span className="text-gray-400 text-sm">{internships.length} internships found</span>
              </motion.div>
            )}
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {internships.map((internship, index) => (
                <JobCard
                  key={internship.id || index}
                  job={internship}
                  onSelect={setSelectedInternship}
                />
              ))}
            </div>
          </>
        )}

        {/* Internship Details Modal */}
        <JobDetailsModal
          job={selectedInternship}
          isOpen={!!selectedInternship}
          onClose={() => setSelectedInternship(null)}
        />
      </div>
    </div>
  );
};

export default Internships;
