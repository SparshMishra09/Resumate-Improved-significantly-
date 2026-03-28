import { 
  collection, 
  addDoc, 
  getDocs, 
  getDoc, 
  doc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  Timestamp,
  serverTimestamp,
  increment,
  setDoc
} from 'firebase/firestore';
import { db } from '../config/firebase';

const JOBS_COLLECTION = 'job_listings';
const INTERNSHIPS_COLLECTION = 'internship_listings';
const SAVED_JOBS_COLLECTION = 'saved_jobs';
const USERS_COLLECTION = 'users';

/**
 * Add a new job listing to Firestore
 * @param {Object} jobData - Job data
 * @returns {Promise<Object>} - Result with job ID
 */
export const addJobListing = async (jobData) => {
  try {
    const docRef = await addDoc(collection(db, JOBS_COLLECTION), {
      ...jobData,
      createdAt: serverTimestamp(),
      isActive: true,
    });
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('Error adding job listing:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Add a new internship listing to Firestore
 * @param {Object} internshipData - Internship data
 * @returns {Promise<Object>} - Result with internship ID
 */
export const addInternshipListing = async (internshipData) => {
  try {
    const docRef = await addDoc(collection(db, INTERNSHIPS_COLLECTION), {
      ...internshipData,
      createdAt: serverTimestamp(),
      isActive: true,
    });
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('Error adding internship listing:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Get all active job listings
 * @param {number} limitCount - Maximum number of results
 * @returns {Promise<Array>} - Array of job listings
 */
export const getJobListings = async (limitCount = 50) => {
  try {
    const q = query(
      collection(db, JOBS_COLLECTION),
      where('isActive', '==', true),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );
    
    const querySnapshot = await getDocs(q);
    const jobs = [];
    
    querySnapshot.forEach((doc) => {
      jobs.push({
        id: doc.id,
        ...doc.data(),
      });
    });
    
    return { success: true, data: jobs };
  } catch (error) {
    console.error('Error getting job listings:', error);
    return { success: false, error: error.message, data: [] };
  }
};

/**
 * Get all active internship listings
 * @param {number} limitCount - Maximum number of results
 * @returns {Promise<Array>} - Array of internship listings
 */
export const getInternshipListings = async (limitCount = 50) => {
  try {
    const q = query(
      collection(db, INTERNSHIPS_COLLECTION),
      where('isActive', '==', true),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );
    
    const querySnapshot = await getDocs(q);
    const internships = [];
    
    querySnapshot.forEach((doc) => {
      internships.push({
        id: doc.id,
        ...doc.data(),
      });
    });
    
    return { success: true, data: internships };
  } catch (error) {
    console.error('Error getting internship listings:', error);
    return { success: false, error: error.message, data: [] };
  }
};

/**
 * Get a single job listing by ID
 * @param {string} jobId - Job ID
 * @returns {Promise<Object>} - Job data
 */
export const getJobById = async (jobId) => {
  try {
    const docRef = doc(db, JOBS_COLLECTION, jobId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { success: true, data: { id: docSnap.id, ...docSnap.data() } };
    } else {
      return { success: false, error: 'Job not found' };
    }
  } catch (error) {
    console.error('Error getting job:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Get a single internship listing by ID
 * @param {string} internshipId - Internship ID
 * @returns {Promise<Object>} - Internship data
 */
export const getInternshipById = async (internshipId) => {
  try {
    const docRef = doc(db, INTERNSHIPS_COLLECTION, internshipId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { success: true, data: { id: docSnap.id, ...docSnap.data() } };
    } else {
      return { success: false, error: 'Internship not found' };
    }
  } catch (error) {
    console.error('Error getting internship:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Update a job listing
 * @param {string} jobId - Job ID
 * @param {Object} updateData - Data to update
 * @returns {Promise<Object>} - Result
 */
export const updateJobListing = async (jobId, updateData) => {
  try {
    const docRef = doc(db, JOBS_COLLECTION, jobId);
    await updateDoc(docRef, {
      ...updateData,
      updatedAt: serverTimestamp(),
    });
    return { success: true };
  } catch (error) {
    console.error('Error updating job listing:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Update an internship listing
 * @param {string} internshipId - Internship ID
 * @param {Object} updateData - Data to update
 * @returns {Promise<Object>} - Result
 */
export const updateInternshipListing = async (internshipId, updateData) => {
  try {
    const docRef = doc(db, INTERNSHIPS_COLLECTION, internshipId);
    await updateDoc(docRef, {
      ...updateData,
      updatedAt: serverTimestamp(),
    });
    return { success: true };
  } catch (error) {
    console.error('Error updating internship listing:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Delete a job listing (soft delete by setting isActive to false)
 * @param {string} jobId - Job ID
 * @returns {Promise<Object>} - Result
 */
export const deleteJobListing = async (jobId) => {
  try {
    const docRef = doc(db, JOBS_COLLECTION, jobId);
    await updateDoc(docRef, {
      isActive: false,
      deletedAt: serverTimestamp(),
    });
    return { success: true, message: 'Job listing deactivated' };
  } catch (error) {
    console.error('Error deleting job listing:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Delete an internship listing (soft delete by setting isActive to false)
 * @param {string} internshipId - Internship ID
 * @returns {Promise<Object>} - Result
 */
export const deleteInternshipListing = async (internshipId) => {
  try {
    const docRef = doc(db, INTERNSHIPS_COLLECTION, internshipId);
    await updateDoc(docRef, {
      isActive: false,
      deletedAt: serverTimestamp(),
    });
    return { success: true, message: 'Internship listing deactivated' };
  } catch (error) {
    console.error('Error deleting internship listing:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Search job listings by keyword
 * @param {string} keyword - Search keyword
 * @param {number} limitCount - Maximum number of results
 * @returns {Promise<Array>} - Array of matching jobs
 */
export const searchJobs = async (keyword, limitCount = 20) => {
  try {
    const q = query(
      collection(db, JOBS_COLLECTION),
      where('isActive', '==', true),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );
    
    const querySnapshot = await getDocs(q);
    const jobs = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const searchText = `${data.title} ${data.company} ${data.description}`.toLowerCase();
      
      if (searchText.includes(keyword.toLowerCase())) {
        jobs.push({
          id: doc.id,
          ...data,
        });
      }
    });
    
    return { success: true, data: jobs };
  } catch (error) {
    console.error('Error searching jobs:', error);
    return { success: false, error: error.message, data: [] };
  }
};

/**
 * Search internship listings by keyword
 * @param {string} keyword - Search keyword
 * @param {number} limitCount - Maximum number of results
 * @returns {Promise<Array>} - Array of matching internships
 */
export const searchInternships = async (keyword, limitCount = 20) => {
  try {
    const q = query(
      collection(db, INTERNSHIPS_COLLECTION),
      where('isActive', '==', true),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );
    
    const querySnapshot = await getDocs(q);
    const internships = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const searchText = `${data.title} ${data.company} ${data.description}`.toLowerCase();
      
      if (searchText.includes(keyword.toLowerCase())) {
        internships.push({
          id: doc.id,
          ...data,
        });
      }
    });
    
    return { success: true, data: internships };
  } catch (error) {
    console.error('Error searching internships:', error);
    return { success: false, error: error.message, data: [] };
  }
};

/**
 * Get listings by category/tags
 * @param {string} collectionName - Collection name ('jobs' or 'internships')
 * @param {string} tag - Tag to filter by
 * @returns {Promise<Array>} - Array of matching listings
 */
export const getListingsByTag = async (collectionName, tag) => {
  try {
    const q = query(
      collection(db, collectionName === 'jobs' ? JOBS_COLLECTION : INTERNSHIPS_COLLECTION),
      where('isActive', '==', true),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const listings = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      if (data.tags && data.tags.includes(tag)) {
        listings.push({
          id: doc.id,
          ...data,
        });
      }
    });
    
    return { success: true, data: listings };
  } catch (error) {
    console.error('Error getting listings by tag:', error);
    return { success: false, error: error.message, data: [] };
  }
};

/**
 * Clean up expired listings (set isActive to false)
 * This should be called periodically or via a Cloud Function
 * @param {string} collectionName - Collection name
 * @returns {Promise<Object>} - Result with count of expired listings
 */
export const cleanupExpiredListings = async (collectionName) => {
  try {
    const q = query(
      collection(db, collectionName === 'jobs' ? JOBS_COLLECTION : INTERNSHIPS_COLLECTION),
      where('isActive', '==', true),
      where('expiresAt', '<', Timestamp.now())
    );
    
    const querySnapshot = await getDocs(q);
    const batchPromises = [];
    
    querySnapshot.forEach((doc) => {
      const docRef = doc.ref;
      batchPromises.push(
        updateDoc(docRef, {
          isActive: false,
          expiredAt: serverTimestamp(),
        })
      );
    });
    
    await Promise.all(batchPromises);
    
    return { 
      success: true, 
      message: `Cleaned up ${batchPromises.length} expired listings` 
    };
  } catch (error) {
    console.error('Error cleaning up expired listings:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Save a job to user's saved jobs
 * @param {string} userId - User ID
 * @param {Object} jobData - Job data to save
 * @returns {Promise<Object>} - Result with saved job ID
 */
export const saveJob = async (userId, jobData) => {
  try {
    // Check if already saved
    const q = query(
      collection(db, SAVED_JOBS_COLLECTION),
      where('userId', '==', userId),
      where('jobId', '==', jobData.id)
    );
    
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      return { success: false, error: 'Job already saved', exists: true };
    }
    
    const docRef = await addDoc(collection(db, SAVED_JOBS_COLLECTION), {
      userId,
      jobId: jobData.id,
      jobData: {
        title: jobData.title,
        company: jobData.company,
        location: jobData.location,
        url: jobData.url,
        tags: jobData.tags || [],
        jobTypes: jobData.jobTypes || [],
        description: jobData.description,
        source: jobData.source,
      },
      savedAt: serverTimestamp(),
    });
    
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('Save job error:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Remove a saved job
 * @param {string} userId - User ID
 * @param {string} jobId - Job ID to remove
 * @returns {Promise<Object>} - Result
 */
export const unsaveJob = async (userId, jobId) => {
  try {
    const q = query(
      collection(db, SAVED_JOBS_COLLECTION),
      where('userId', '==', userId),
      where('jobId', '==', jobId)
    );
    
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      return { success: false, error: 'Job not found in saved jobs' };
    }
    
    const deletePromises = [];
    querySnapshot.forEach((doc) => {
      deletePromises.push(deleteDoc(doc.ref));
    });
    
    await Promise.all(deletePromises);
    
    return { success: true, message: 'Job removed from saved jobs' };
  } catch (error) {
    console.error('Unsave job error:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Get user's saved jobs
 * @param {string} userId - User ID
 * @returns {Promise<Array>} - Array of saved jobs
 */
export const getSavedJobs = async (userId) => {
  try {
    // Query without orderBy to avoid index requirement
    const q = query(
      collection(db, SAVED_JOBS_COLLECTION),
      where('userId', '==', userId)
    );
    
    const querySnapshot = await getDocs(q);
    const savedJobs = [];
    
    querySnapshot.forEach((doc) => {
      savedJobs.push({
        id: doc.id,
        ...doc.data(),
      });
    });
    
    // Sort by savedAt manually (newest first)
    savedJobs.sort((a, b) => {
      const aTime = a.savedAt?.seconds || 0;
      const bTime = b.savedAt?.seconds || 0;
      return bTime - aTime;
    });
    
    return { success: true, data: savedJobs };
  } catch (error) {
    console.error('Get saved jobs error:', error);
    return { success: false, error: error.message, data: [] };
  }
};

/**
 * Check if a job is saved by user
 * @param {string} userId - User ID
 * @param {string} jobId - Job ID
 * @returns {Promise<boolean>} - True if saved
 */
export const isJobSaved = async (userId, jobId) => {
  try {
    const q = query(
      collection(db, SAVED_JOBS_COLLECTION),
      where('userId', '==', userId),
      where('jobId', '==', jobId)
    );
    
    const querySnapshot = await getDocs(q);
    
    return !querySnapshot.empty;
  } catch (error) {
    console.error('Check saved job error:', error);
    return false;
  }
};

// ============================================================================
// CREDIT SYSTEM
// ============================================================================

/**
 * Initialize user with 1 free credit on signup
 * @param {string} userId - User ID
 * @param {string} email - User email
 * @param {string} displayName - User display name
 * @returns {Promise<Object>} - Result
 */
export const initializeUserCredits = async (userId, email, displayName) => {
  try {
    const userRef = doc(db, USERS_COLLECTION, userId);
    await setDoc(userRef, {
      email,
      displayName: displayName || email.split('@')[0],
      credits: 1, // Start with 1 free credit
      createdAt: serverTimestamp(),
      totalCreditsUsed: 0,
    });
    return { success: true, credits: 1 };
  } catch (error) {
    console.error('Initialize user credits error:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Get user's current credits
 * @param {string} userId - User ID
 * @returns {Promise<number>} - Credit count
 */
export const getUserCredits = async (userId) => {
  try {
    const userRef = doc(db, USERS_COLLECTION, userId);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      const credits = userSnap.data().credits || 0;
      return { success: true, credits };
    } else {
      // User doesn't exist, initialize with 1 credit
      const initResult = await initializeUserCredits(userId, '', '');
      if (initResult.success) {
        return { success: true, credits: 1 };
      }
      return { success: false, credits: 0, error: initResult.error };
    }
  } catch (error) {
    return { success: false, error: error.message, credits: 0 };
  }
};

/**
 * Use a credit for a feature
 * @param {string} userId - User ID
 * @param {string} feature - Feature name (ats_score, improve_resume, tailor_resume)
 * @returns {Promise<Object>} - Result with remaining credits
 */
export const useCredit = async (userId, feature) => {
  try {
    const userRef = doc(db, USERS_COLLECTION, userId);
    const userSnap = await getDoc(userRef);
    
    if (!userSnap.exists()) {
      // Initialize user if doesn't exist
      await initializeUserCredits(userId, '', '');
      return { success: true, credits: 0, message: 'Used your free credit!' };
    }
    
    const currentCredits = userSnap.data().credits || 0;
    
    if (currentCredits <= 0) {
      return { 
        success: false, 
        credits: 0, 
        error: 'No credits remaining. Please contact support for more credits.' 
      };
    }
    
    // Deduct 1 credit and increment total used
    await updateDoc(userRef, {
      credits: increment(-1),
      totalCreditsUsed: increment(1),
      lastUsedFeature: feature,
      lastUsedAt: serverTimestamp(),
    });
    
    return { 
      success: true, 
      credits: currentCredits - 1,
      message: 'Credit used successfully!'
    };
  } catch (error) {
    console.error('Use credit error:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Check if user has credits (without using one)
 * @param {string} userId - User ID
 * @returns {Promise<Object>} - Has credits and count
 */
export const checkUserCredits = async (userId) => {
  try {
    const result = await getUserCredits(userId);
    return {
      success: true,
      hasCredits: result.credits > 0,
      credits: result.credits,
    };
  } catch (error) {
    return { success: false, hasCredits: false, credits: 0, error: error.message };
  }
};

/**
 * Add credits to user (for admin/purchase)
 * @param {string} userId - User ID
 * @param {number} amount - Credits to add
 * @returns {Promise<Object>} - Result with new total
 */
export const addCredits = async (userId, amount) => {
  try {
    const userRef = doc(db, USERS_COLLECTION, userId);
    await updateDoc(userRef, {
      credits: increment(amount),
    });
    
    const userSnap = await getDoc(userRef);
    return { success: true, credits: userSnap.data().credits || amount };
  } catch (error) {
    console.error('Add credits error:', error);
    return { success: false, error: error.message };
  }
};
