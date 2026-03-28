import axios from 'axios';
import { z } from 'zod';

// Backend API URL - Update this after deploying backend to Render/Railway
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';

const ResumeSchema = z.object({
  name: z.string(),
  summary: z.string(),
  ats_score: z.number().min(0).max(100),
  suggestions: z.array(z.string()),
  skills: z.array(z.string()),
  experience: z.array(
    z.object({
      role: z.string(),
      company: z.string(),
      points: z.array(z.string())
    })
  ),
  education: z.array(z.string())
});

const cleanJSON = (text) => {
  return text
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();
};

// ============================================================================
// ANALYZE RESUME - Uses backend smart router
// ============================================================================
export const analyzeResume = async (resumeText) => {
  if (!resumeText || resumeText.trim().length < 50) {
    throw new Error("Resume text is too short or could not be extracted.");
  }

  const prompt = `
    Analyze the following resume text and provide a non-fraudulent ATS score (0-100) and professional improvement suggestions.
    Return ONLY valid JSON.

    FORMAT:
    {
      "name": "Full Name",
      "summary": "Short professional summary",
      "ats_score": 85,
      "suggestions": ["Suggestion 1", "Suggestion 2"],
      "skills": ["Skill 1", "Skill 2"],
      "experience": [
        {
          "role": "Job Title",
          "company": "Company Name",
          "points": ["• Bullet point 1", "• Bullet point 2"]
        }
      ],
      "education": ["Degree in Subject, University Name"]
    }

    Resume Text:
    ${resumeText}
  `;

  try {
    console.log('[Frontend] Sending to backend for analysis...');

    const response = await axios.post(`${BACKEND_URL}/analyze`, {
      prompt,
      type: 'resume'
    });

    console.log('[Frontend] Backend response:', response.data);

    if (!response.data.success) {
      throw new Error(response.data.error || 'Analysis failed');
    }

    console.log(`[Frontend] Success via ${response.data.provider}!`);
    
    const data = response.data.data;
    return ResumeSchema.parse(data);

  } catch (error) {
    console.error('[Frontend] Analysis error:', error);
    
    if (error.code === 'ERR_NETWORK') {
      throw new Error(
        'Cannot connect to backend server. Please make sure the backend is running:\n\n' +
        '1. Open a new terminal\n' +
        '2. cd server\n' +
        '3. npm install\n' +
        '4. npm run dev\n\n' +
        'Then try again.'
      );
    }
    
    throw error;
  }
};

// ============================================================================
// IMPROVE RESUME
// ============================================================================
export const improveResume = async (originalData) => {
  const prompt = `
    Improve the following resume content to achieve a better ATS score and professional impact.
    Return ONLY valid JSON.

    ORIGINAL DATA:
    ${JSON.stringify(originalData, null, 2)}

    FORMAT:
    {
      "name": "Same Name",
      "summary": "Optimized professional summary",
      "ats_score": 98,
      "suggestions": ["List of improvements made"],
      "skills": ["Enhanced list of skills"],
      "experience": [
        {
          "role": "Job Title",
          "company": "Company Name",
          "points": ["• Improved bullet point 1", "• Improved bullet point 2"]
        }
      ],
      "education": ["Education details"]
    }
  `;

  try {
    const response = await axios.post(`${BACKEND_URL}/analyze`, {
      prompt,
      type: 'improve'
    });

    if (!response.data.success) {
      throw new Error(response.data.error || 'Improvement failed');
    }

    const data = response.data.data;
    return ResumeSchema.parse(data);

  } catch (error) {
    console.error('[Frontend] Improvement error:', error);
    if (error.code === 'ERR_NETWORK') {
      throw new Error('Cannot connect to backend server. Please start it first.');
    }
    throw error;
  }
};

// ============================================================================
// TAILOR RESUME FOR JOB
// ============================================================================
export const tailorResumeForJob = async (originalData, jobData) => {
  const prompt = `
    Tailor the following resume specifically for this job posting.
    Return ONLY valid JSON.

    JOB POSTING:
    Title: ${jobData.title}
    Company: ${jobData.company}
    Description: ${jobData.description?.substring(0, 2000) || 'Not provided'}
    Required Skills: ${jobData.tags?.join(', ') || 'Not specified'}

    ORIGINAL RESUME:
    ${JSON.stringify(originalData, null, 2)}

    INSTRUCTIONS:
    1. Analyze job description for keywords
    2. Optimize resume to match job requirements
    3. Use keywords from job description naturally
    4. Rewrite summary to match job requirements
    5. If candidate lacks experience, set hasRequiredExperience to false
    6. List missing skills in missingSkills array

    FORMAT:
    {
      "name": "Candidate Name",
      "summary": "Tailored professional summary (2-3 sentences)",
      "ats_score": 90,
      "matchPercentage": 85,
      "hasRequiredExperience": true,
      "missingSkills": ["skill1", "skill2"],
      "suggestions": ["What was tailored"],
      "skills": ["Prioritized skills matching job"],
      "experience": [
        {
          "role": "Job Title",
          "company": "Company Name",
          "points": ["• Tailored bullet point 1", "• Tailored bullet point 2"]
        }
      ],
      "education": ["Education details"],
      "tailoredFor": {
        "jobTitle": "${jobData.title}",
        "company": "${jobData.company}",
        "keyKeywords": ["keyword1", "keyword2"]
      }
    }
  `;

  try {
    const response = await axios.post(`${BACKEND_URL}/analyze`, {
      prompt,
      type: 'tailor'
    });

    if (!response.data.success) {
      throw new Error(response.data.error || 'Tailoring failed');
    }

    const data = response.data.data;
    
    if (!data.name || !data.summary) {
      throw new Error("Invalid resume data structure");
    }
    
    return data;

  } catch (error) {
    console.error('[Frontend] Tailoring error:', error);
    if (error.code === 'ERR_NETWORK') {
      throw new Error('Cannot connect to backend server. Please start it first.');
    }
    throw error;
  }
};
