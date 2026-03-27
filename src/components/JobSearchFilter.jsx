import React from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin, Filter, Briefcase, Globe, Building2, X } from 'lucide-react';

export const JobSearchFilter = ({ 
  searchParams, 
  onSearchParamsChange, 
  onSearch, 
  isLoading,
  showSaveFilter = false,
  showSavedOnly = false,
  onToggleSavedOnly 
}) => {
  const handleChange = (field, value) => {
    onSearchParamsChange({
      ...searchParams,
      [field]: value,
    });
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      onSearch();
    }
  };

  const clearFilters = () => {
    onSearchParamsChange({
      keyword: '',
      location: '',
      jobType: '',
      remote: false,
    });
  };

  const hasFilters = searchParams.keyword || searchParams.location || searchParams.jobType;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-morphism p-6 rounded-2xl space-y-6"
    >
      {/* Search Bar */}
      <div className="flex flex-col md:flex-row gap-4">
        {/* Keyword Search */}
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input
            type="text"
            value={searchParams.keyword}
            onChange={(e) => handleChange('keyword', e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Job title, keywords, or company..."
            className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-primary-500/50 focus:ring-2 focus:ring-primary-500/20 transition-all"
          />
        </div>

        {/* Location Search */}
        <div className="flex-1 relative">
          <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input
            type="text"
            value={searchParams.location}
            onChange={(e) => handleChange('location', e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Location (e.g., Berlin, Remote)..."
            className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-primary-500/50 focus:ring-2 focus:ring-primary-500/20 transition-all"
          />
        </div>

        {/* Search Button */}
        <button
          onClick={onSearch}
          disabled={isLoading}
          className="px-8 py-3.5 rounded-2xl premium-gradient text-white font-bold hover:shadow-[0_0_20px_rgba(14,165,233,0.4)] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
        >
          <Search className="w-5 h-5" />
          {isLoading ? 'Searching...' : 'Search'}
        </button>
      </div>

      {/* Filters Row */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2 text-gray-400">
          <Filter className="w-4 h-4" />
          <span className="text-sm font-medium">Filters:</span>
        </div>

        {/* Job Type Filter */}
        <select
          value={searchParams.jobType}
          onChange={(e) => handleChange('jobType', e.target.value)}
          className="px-4 py-2 rounded-xl bg-[#0f172a] border border-white/10 text-white text-sm focus:outline-none focus:border-primary-500/50 transition-all cursor-pointer hover:bg-[#1a2332]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
            backgroundPosition: `right 0.5rem center`,
            backgroundRepeat: `no-repeat`,
            backgroundSize: `1.5em 1.5em`,
            paddingRight: `2.5rem`,
          }}
        >
          <option value="" className="bg-[#0f172a] text-white">All Types</option>
          <option value="Full-time" className="bg-[#0f172a] text-white">Full-time</option>
          <option value="Part-time" className="bg-[#0f172a] text-white">Part-time</option>
          <option value="Contract" className="bg-[#0f172a] text-white">Contract</option>
          <option value="Internship" className="bg-[#0f172a] text-white">Internship</option>
          <option value="Remote" className="bg-[#0f172a] text-white">Remote</option>
        </select>

        {/* Remote Toggle */}
        <label className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 cursor-pointer hover:bg-white/10 transition-colors">
          <input
            type="checkbox"
            checked={searchParams.remote}
            onChange={(e) => handleChange('remote', e.target.checked)}
            className="w-4 h-4 rounded border-gray-600 text-primary-500 focus:ring-primary-500/20 bg-transparent"
          />
          <Globe className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-400">Remote Only</span>
        </label>

        {/* Show Saved Toggle */}
        {showSaveFilter && (
          <label className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 cursor-pointer hover:bg-primary-500/20 transition-colors">
            <input
              type="checkbox"
              checked={showSavedOnly}
              onChange={(e) => onToggleSavedOnly(e.target.checked)}
              className="w-4 h-4 rounded border-gray-600 text-primary-500 focus:ring-primary-500/20 bg-transparent"
            />
            <Briefcase className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-400">Saved Jobs Only</span>
          </label>
        )}

        {/* Clear Filters */}
        {hasFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm hover:bg-red-500/20 transition-colors"
          >
            <X className="w-4 h-4" />
            Clear Filters
          </button>
        )}

        {/* Results Count */}
        <div className="ml-auto text-sm text-gray-400">
          {searchParams.keyword && (
            <span>Searching for "{searchParams.keyword}"</span>
          )}
        </div>
      </div>
    </motion.div>
  );
};
