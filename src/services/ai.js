import axios from 'axios';
import { z } from 'zod';

const OPENROUTER_API_KEY = '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';

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

export const analyzeResume = async (resumeText) => {
  if (!resumeText || resumeText.trim().length < 50) {
    throw new Error("Resume text is too short or could not be extracted.");
  }

  const prompt = `
    Analyze the following resume text and provide a non-fraudulent ATS score (0-100) and professional improvement suggestions.
    Return ONLY valid JSON.
    
    RULES:
    - Do NOT include any introductory or concluding text.
    - Use ONLY JSON format.
    - Use "\\\\n" for internal line breaks if needed.
    - Use "• " for bullet points in the experience section.
    - Ensure all fields listed in the FORMAT are present.
    - The 'points' array should contain clear bullet points.
    - Score must be a number between 0 and 100 based on actual ATS readability and keywords.

    FORMAT:
    {
      "name": "Full Name",
      "summary": "Short professional summary",
      "ats_score": 85,
      "suggestions": [
        "Add more action verbs in the experience section",
        "Include more industry-specific keywords like 'React', 'Agile', etc."
      ],
      "skills": ["Skill 1", "Skill 2"],
      "experience": [
        {
          "role": "Job Title",
          "company": "Company Name",
          "points": [
            "• Led a team of 5 developers",
            "• Improved application performance by 30%"
          ]
        }
      ],
      "education": ["Degree in Subject, University Name"]
    }

    Resume Text:
    ${resumeText}
  `;

  try {
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'google/gemini-2.0-flash-001',
        messages: [{ role: 'user', content: prompt }],
        response_format: { type: "json_object" }
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://resumate.ai',
          'X-Title': 'Resumate',
        },
      }
    );

    let content = response.data.choices[0].message.content;
    if (!content) throw new Error("The AI returned an empty response. Please try again.");
    const cleanedContent = cleanJSON(content);
    
    try {
      const data = JSON.parse(cleanedContent);
      return ResumeSchema.parse(data);
    } catch (parseError) {
      console.error("JSON Parsing/Validation Error:", parseError, "Content:", cleanedContent);
      const match = cleanedContent.match(/\{[\s\S]*\}/);
      if (match) {
        try {
          const repairedData = JSON.parse(match[0]);
          return ResumeSchema.parse(repairedData);
        } catch (e) {}
      }
      throw new Error("Failed to process the AI analysis. Please try again.");
    }
  } catch (error) {
    console.error("AI Analysis Error:", error);
    if (error.response?.status === 401) throw new Error("API Key configuration error.");
    if (error.response?.status === 429) throw new Error("Too many requests.");
    throw error;
  }
};

export const improveResume = async (originalData) => {
  const prompt = `
    Improve the following resume content to achieve a better ATS score and professional impact.
    Return ONLY valid JSON.
    
    RULES:
    - Do NOT include any introductory or concluding text.
    - Use ONLY JSON format.
    - Use "\\\\n" for internal line breaks.
    - Use "• " for bullet points in the experience section.
    - Optimize the summary and experience points with strong action verbs and relevant industry keywords.
    - The improved version must have a significantly higher ATS score (90-100).

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
          "points": [
            "• Improved bullet point 1",
            "• Improved bullet point 2"
          ]
        }
      ],
      "education": ["Education details"]
    }
  `;

  try {
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'google/gemini-2.0-flash-001',
        messages: [{ role: 'user', content: prompt }],
        response_format: { type: "json_object" }
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://resumate.ai',
          'X-Title': 'Resumate Improvement',
        },
      }
    );

    let content = response.data.choices[0].message.content;
    if (!content) throw new Error("AI returned an empty improvement response.");
    const cleanedContent = cleanJSON(content);
    
    try {
      const data = JSON.parse(cleanedContent);
      return ResumeSchema.parse(data);
    } catch (parseError) {
      console.error("Improvement JSON Error:", parseError, "Content:", cleanedContent);
      const match = cleanedContent.match(/\{[\s\S]*\}/);
      if (match) {
        try {
          const repairedData = JSON.parse(match[0]);
          return ResumeSchema.parse(repairedData);
        } catch (e) {}
      }
      throw new Error("Failed to process the improved resume. Please try again.");
    }
  } catch (error) {
    console.error("AI Improvement Error:", error);
    throw error;
  }
};

