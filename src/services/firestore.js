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
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../config/firebase';

const JOBS_COLLECTION = 'job_listings';
const INTERNSHIPS_COLLECTION = 'internship_listings';

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
