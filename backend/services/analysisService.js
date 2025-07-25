const pdfParse = require('pdf-parse');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { jsonrepair } = require('jsonrepair');
require('dotenv').config();

const gemini = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

exports.analyzeResume = async (fileBuffer, fileName) => {
  try {
    // 1. Extract text from PDF
    const pdfData = await pdfParse(fileBuffer);
    const resumeText = pdfData.text;

    // 2. Prompt for Gemini
    const prompt = `
You are an expert technical recruiter and career coach.

Strictly return only a valid JSON object and nothing else. Do NOT include markdown, explanation, or formatting. Do NOT use triple backticks.

Analyze the following resume text and convert it into this JSON structure.

Resume Text:
"""
${resumeText}
"""

JSON Structure:
{
  "name": "string | null",
  "email": "string | null",
  "phone": "string | null",
  "linkedin_url": "string | null",
  "portfolio_url": "string | null",
  "summary": "string | null",
  "work_experience": [{ "role": "string", "company": "string", "duration": "string", "description": ["string"] }],
  "education": [{ "degree": "string", "institution": "string", "graduation_year": "string" }],
  "technical_skills": ["string"],
  "soft_skills": ["string"],
  "projects": ["string"],
  "certifications": ["string"],
  "resume_rating": "number (1-10)",
  "improvement_areas": "string",
  "upskill_suggestions": ["string"]
}
    `;

    // 3. Call Gemini API
    const model = gemini.getGenerativeModel({ model: 'models/gemini-2.5-flash' });

    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
    });

    const response = result.response;
    const rawText = response.text();

    // 4. Extract and repair JSON
    let analysis;
    try {
      const jsonMatch = rawText.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
      const rawJson = jsonMatch ? jsonMatch[1] : rawText.trim();

      const repairedJson = jsonrepair(rawJson); // 🔧 Fix syntax issues
      analysis = JSON.parse(repairedJson);
    } catch (err) {
      console.error('❌ Failed to parse/repair Gemini response:\n', rawText);
      throw new Error('Invalid JSON format returned by Gemini');
    }

    // 5. Add file_name
    analysis.file_name = fileName;
    return analysis;
  } catch (error) {
    console.error('❌ Resume analysis failed:', error.message);
    throw error;
  }
};
