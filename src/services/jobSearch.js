import axios from 'axios';
import { getJobListings, getInternshipListings } from './firestore';

const ADZUNA_APP_ID = '43976527';
const ADZUNA_API_KEY = 'e2a41743be0e27cfdc0d830e';

/**
 * Fetch jobs from Arbeitnow API (Free, no key required)
 * @param {Object} params - Search parameters
 * @returns {Promise<Array>} - Array of jobs
 */
export const fetchJobsFromArbeitnow = async (params = {}) => {
  try {
    const { keyword = '', location = '', page = 1 } = params;

    let url = `https://www.arbeitnow.com/api/job-board-api?page=${page}`;

    const response = await axios.get(url);

    if (response.data && response.data.data) {
      let jobs = response.data.data;

      // Filter by keyword if provided
      if (keyword && keyword.trim()) {
        const keywordLower = keyword.toLowerCase();
        jobs = jobs.filter(job =>
          job.title.toLowerCase().includes(keywordLower) ||
          job.company_name.toLowerCase().includes(keywordLower) ||
          (job.description && job.description.toLowerCase().includes(keywordLower))
        );
      }

      // Filter by location if provided
      if (location && location.trim()) {
        const locationLower = location.toLowerCase();
        jobs = jobs.filter(job =>
          job.location && job.location.toLowerCase().includes(locationLower)
        );
      }

      // Filter by remote if provided
      if (params.remote) {
        jobs = jobs.filter(job => job.remote === true);
      }

      // Transform to our standard format
      return {
        success: true,
        data: jobs.map(job => ({
          id: job.slug || `arbeitnow-${job.title}-${job.company_name}`,
          title: job.title,
          company: job.company_name,
          description: job.description || '',
          location: job.location || 'Remote',
          jobTypes: job.job_types || [],
          tags: job.tags || [],
          url: job.url,
          source: 'Arbeitnow',
          createdAt: job.created_at ? new Date(job.created_at * 1000).toISOString() : new Date().toISOString(),
          remote: job.remote || false,
        })),
        meta: response.data.meta,
        links: response.data.links,
      };
    }

    return { success: false, data: [], error: 'No data received' };
  } catch (error) {
    console.error('Arbeitnow API Error:', error);
    return { success: false, data: [], error: error.message };
  }
};

/**
 * Fetch jobs from Adzuna API
 * @param {Object} params - Search parameters
 * @returns {Promise<Array>} - Array of jobs
 */
export const fetchJobsFromAdzuna = async (params = {}) => {
  try {
    const { keyword = '', location = '', page = 1, country = 'us' } = params;
    
    const url = `https://api.adzuna.com/v1/api/jobs/${country}/search/${page}`;
    
    const response = await axios.get(url, {
      params: {
        app_id: ADZUNA_APP_ID,
        app_key: ADZUNA_API_KEY,
        what: keyword,
        where: location,
        results_per_page: 50,
      },
    });
    
    if (response.data && response.data.results) {
      return {
        success: true,
        data: response.data.results.map(job => ({
          id: job.id || `adzuna-${job.id}`,
          title: job.title,
          company: job.company?.display_name || 'Unknown Company',
          description: job.description || '',
          location: job.location?.display_name || 'Unknown',
          jobTypes: job.contract_type ? [job.contract_type] : [],
          tags: job.category?.tag ? [job.category.tag] : [],
          url: job.redirect_url,
          source: 'Adzuna',
          createdAt: job.created ? new Date(job.created).toISOString() : new Date().toISOString(),
          salaryMin: job.salary_min,
          salaryMax: job.salary_max,
          salaryIsPredicted: job.salary_is_predicted,
        })),
        count: response.data.count,
        mean: response.data.mean,
      };
    }
    
    return { success: false, data: [], error: 'No data received' };
  } catch (error) {
    console.error('Adzuna API Error:', error);
    return { success: false, data: [], error: error.message };
  }
};

/**
 * Fetch internships from Arbeitnow API
 * @param {Object} params - Search parameters
 * @returns {Promise<Array>} - Array of internships
 */
export const fetchInternshipsFromArbeitnow = async (params = {}) => {
  try {
    const result = await fetchJobsFromArbeitnow(params);
    
    if (result.success) {
      // Filter for internships only
      const internships = result.data.filter(job => 
        job.jobTypes.some(type => 
          type.toLowerCase().includes('intern') ||
          type.toLowerCase().includes('praktikum') ||
          type.toLowerCase().includes('stage')
        )
      );
      
      return {
        success: true,
        data: internships,
        meta: result.meta,
      };
    }
    
    return result;
  } catch (error) {
    console.error('Internship Fetch Error:', error);
    return { success: false, data: [], error: error.message };
  }
};

/**
 * Search jobs from multiple sources (Arbeitnow, Adzuna, and Firestore)
 * @param {Object} params - Search parameters
 * @returns {Promise<Object>} - Combined results
 */
export const searchJobs = async (params = {}) => {
  try {
    const { keyword = '', location = '', jobType = '', remote = false, source = 'all' } = params;

    let results = [];
    const sourcesUsed = [];

    // 1. First get jobs from Firestore (your own database)
    try {
      const firestoreJobs = await getJobListings(50);
      if (firestoreJobs.success && firestoreJobs.data && firestoreJobs.data.length > 0) {
        let firestoreJobsFiltered = firestoreJobs.data;
        
        // Apply filters
        if (keyword && keyword.trim()) {
          const keywordLower = keyword.toLowerCase();
          firestoreJobsFiltered = firestoreJobsFiltered.filter(job =>
            job.title.toLowerCase().includes(keywordLower) ||
            job.company.toLowerCase().includes(keywordLower) ||
            (job.description && job.description.toLowerCase().includes(keywordLower))
          );
        }
        
        if (location && location.trim()) {
          const locationLower = location.toLowerCase();
          firestoreJobsFiltered = firestoreJobsFiltered.filter(job =>
            job.location && job.location.toLowerCase().includes(locationLower)
          );
        }
        
        if (jobType) {
          firestoreJobsFiltered = firestoreJobsFiltered.filter(job =>
            job.job_types && job.job_types.some(type => type.toLowerCase().includes(jobType.toLowerCase()))
          );
        }
        
        if (remote) {
          firestoreJobsFiltered = firestoreJobsFiltered.filter(job =>
            job.remote === true || (job.job_types && job.job_types.some(type => type.toLowerCase().includes('remote')))
          );
        }
        
        results = [...results, ...firestoreJobsFiltered.map(job => ({
          ...job,
          source: 'Firestore',
        }))];
        sourcesUsed.push(`Firestore: ${firestoreJobsFiltered.length} jobs`);
      }
    } catch (firestoreErr) {
      console.log('Firestore not available, using external APIs only');
    }

    // 2. Get jobs from Arbeitnow (PRIMARY - most reliable)
    if (source === 'all' || source === 'arbeitnow') {
      try {
        // Fetch multiple pages for more results
        const pages = [1, 2, 3]; // Fetch 3 pages
        const arbeitnowPromises = pages.map(page => 
          fetchJobsFromArbeitnow({ keyword, location, remote, page })
        );
        
        const arbeitnowResults = await Promise.all(arbeitnowPromises);
        
        for (const result of arbeitnowResults) {
          if (result.success && result.data) {
            let arbeitnowJobs = result.data;
            
            // Apply job type filter
            if (jobType) {
              arbeitnowJobs = arbeitnowJobs.filter(job =>
                job.jobTypes && job.jobTypes.some(type => type.toLowerCase().includes(jobType.toLowerCase()))
              );
            }
            
            results = [...results, ...arbeitnowJobs];
          }
        }
        
        const arbeitnowCount = results.filter(j => j.source === 'Arbeitnow').length;
        sourcesUsed.push(`Arbeitnow: ${arbeitnowCount} jobs`);
      } catch (arbeitnowErr) {
        console.error('Arbeitnow Error:', arbeitnowErr.message);
      }
    }

    // 3. Get jobs from Adzuna (OPTIONAL - may fail due to API limits)
    if (source === 'all' || source === 'adzuna') {
      try {
        const adzunaResult = await fetchJobsFromAdzuna({ keyword, location, page: 1 });
        if (adzunaResult.success && adzunaResult.data && adzunaResult.data.length > 0) {
          let adzunaJobs = adzunaResult.data;
          
          // Apply filters
          if (jobType) {
            adzunaJobs = adzunaJobs.filter(job =>
              job.jobTypes && job.jobTypes.some(type => type.toLowerCase().includes(jobType.toLowerCase()))
            );
          }
          
          results = [...results, ...adzunaJobs];
          sourcesUsed.push(`Adzuna: ${adzunaJobs.length} jobs`);
        } else {
          console.log('Adzuna: No results or API unavailable');
        }
      } catch (adzunaErr) {
        console.log('Adzuna API unavailable (this is normal - using Arbeitnow only)');
        console.log('Adzuna Error:', adzunaErr.message);
      }
    }

    console.log('Sources used:', sourcesUsed);

    // Remove duplicates based on title + company
    const uniqueJobs = results.filter((job, index, self) =>
      index === self.findIndex(j =>
        j.title === job.title && j.company === job.company
      )
    );

    console.log('Total jobs after deduplication:', uniqueJobs.length);

    return {
      success: true,
      data: uniqueJobs,
      total: uniqueJobs.length,
      sources: sourcesUsed,
      message: uniqueJobs.length === 0 ? 'No jobs found matching your criteria' : undefined,
    };
  } catch (error) {
    console.error('Search Jobs Error:', error);
    return { success: false, data: [], error: error.message };
  }
};

/**
 * Search internships from multiple sources
 * @param {Object} params - Search parameters
 * @returns {Promise<Object>} - Combined results
 */
export const searchInternships = async (params = {}) => {
  try {
    const { keyword = '', location = '', jobType = '', remote = false, source = 'all' } = params;

    let results = [];

    // 1. Get internships from Firestore
    try {
      const firestoreInternships = await getInternshipListings(50);
      if (firestoreInternships.success && firestoreInternships.data) {
        let firestoreInternshipsFiltered = firestoreInternships.data;
        
        // Apply filters
        if (keyword && keyword.trim()) {
          const keywordLower = keyword.toLowerCase();
          firestoreInternshipsFiltered = firestoreInternshipsFiltered.filter(job =>
            job.title.toLowerCase().includes(keywordLower) ||
            job.company.toLowerCase().includes(keywordLower) ||
            (job.description && job.description.toLowerCase().includes(keywordLower))
          );
        }
        
        if (location && location.trim()) {
          const locationLower = location.toLowerCase();
          firestoreInternshipsFiltered = firestoreInternshipsFiltered.filter(job =>
            job.location && job.location.toLowerCase().includes(locationLower)
          );
        }
        
        if (remote) {
          firestoreInternshipsFiltered = firestoreInternshipsFiltered.filter(job =>
            job.remote === true || (job.job_types && job.job_types.some(type => type.toLowerCase().includes('remote')))
          );
        }
        
        results = [...results, ...firestoreInternshipsFiltered.map(job => ({
          ...job,
          source: 'Firestore',
        }))];
      }
    } catch (firestoreErr) {
      console.log('Firestore not available, using external APIs only');
    }

    // 2. Get internships from Arbeitnow
    const arbeitnowResult = await fetchInternshipsFromArbeitnow({ keyword, location, page: 1 });
    if (arbeitnowResult.success && arbeitnowResult.data) {
      let internships = arbeitnowResult.data;
      
      // Apply remote filter
      if (remote) {
        internships = internships.filter(job => job.remote === true);
      }
      
      results = [...results, ...internships];
    }

    // 3. Also search regular jobs with "intern" keyword
    const generalResult = await searchJobs({ keyword: keyword || 'intern', location, jobType, remote, source });
    if (generalResult.success && generalResult.data) {
      const internships = generalResult.data.filter(job =>
        job.title.toLowerCase().includes('intern') ||
        job.description.toLowerCase().includes('intern') ||
        (job.jobTypes && job.jobTypes.some(type => type.toLowerCase().includes('intern')))
      );
      results = [...results, ...internships];
    }

    // Remove duplicates
    const uniqueInternships = results.filter((job, index, self) =>
      index === self.findIndex(j =>
        j.title === job.title && j.company === job.company
      )
    );

    return {
      success: true,
      data: uniqueInternships,
      total: uniqueInternships.length,
      message: uniqueInternships.length === 0 ? 'No internships found matching your criteria' : undefined,
    };
  } catch (error) {
    console.error('Search Internships Error:', error);
    return { success: false, data: [], error: error.message };
  }
};

/**
 * Get job details by ID (for external APIs, just return the job)
 * @param {string} jobId - Job ID
 * @param {string} source - Job source
 * @returns {Promise<Object>} - Job details
 */
export const getJobDetails = async (jobId, source) => {
  try {
    // For external APIs, we don't have a way to fetch by ID
    // This is mainly for Firestore jobs
    return { success: false, error: 'Job details not available for external jobs' };
  } catch (error) {
    console.error('Get Job Details Error:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Fetch trending/featured jobs (from Firestore + Arbeitnow)
 * @returns {Promise<Object>} - Featured jobs
 */
export const getFeaturedJobs = async () => {
  try {
    let allJobs = [];

    // 1. First try to get jobs from Firestore (your own database - auto-updating)
    try {
      const firestoreJobs = await getJobListings(20);
      if (firestoreJobs.success && firestoreJobs.data) {
        allJobs = [...firestoreJobs.data.map(job => ({
          ...job,
          source: 'Firestore',
        }))];
      }
    } catch (firestoreErr) {
      console.log('Firestore not available, using external APIs only');
    }

    // 2. Get fresh jobs from Arbeitnow
    const arbeitnowResult = await fetchJobsFromArbeitnow({ page: 1 });
    if (arbeitnowResult.success && arbeitnowResult.data) {
      allJobs = [...allJobs, ...arbeitnowResult.data];
    }

    // Remove duplicates and return first 20
    const uniqueJobs = allJobs.filter((job, index, self) =>
      index === self.findIndex(j =>
        j.title === job.title && j.company === job.company
      )
    );

    return {
      success: true,
      data: uniqueJobs.slice(0, 20),
      total: uniqueJobs.length,
    };
  } catch (error) {
    console.error('Get Featured Jobs Error:', error);
    return { success: false, data: [], error: error.message };
  }
};
