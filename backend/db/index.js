// backend/db.js
const { Pool } = require('pg');
require('dotenv').config();

// Create PostgreSQL connection pool using DATABASE_URL with SSL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // Required for Neon and other hosted DBs
  },
});

// Save resume data to database
exports.saveResume = async (resumeData, fileName) => {
  const query = `
    INSERT INTO resumes (
      file_name, name, email, phone, linkedin_url, portfolio_url, summary,
      work_experience, education, technical_skills, soft_skills, projects, certifications,
      resume_rating, improvement_areas, upskill_suggestions
    ) VALUES (
      $1, $2, $3, $4, $5, $6, $7,
      $8, $9, $10, $11, $12, $13,
      $14, $15, $16
    ) RETURNING *;
  `;

  const values = [
    fileName,
    resumeData.name,
    resumeData.email,
    resumeData.phone,
    resumeData.linkedin_url,
    resumeData.portfolio_url,
    resumeData.summary,
    JSON.stringify(resumeData.work_experience),
    JSON.stringify(resumeData.education),
    JSON.stringify(resumeData.technical_skills),
    JSON.stringify(resumeData.soft_skills),
    JSON.stringify(resumeData.projects),
    JSON.stringify(resumeData.certifications),
    resumeData.resume_rating,
    resumeData.improvement_areas,
    JSON.stringify(resumeData.upskill_suggestions),
  ];

  const { rows } = await pool.query(query, values);
  return rows[0];
};

// Fetch basic list of all resumes
exports.getAllResumes = async () => {
  const { rows } = await pool.query(
    'SELECT id, name, email, uploaded_at FROM resumes ORDER BY uploaded_at DESC;'
  );
  return rows;
};

// Get full resume by ID
exports.getResumeById = async (id) => {
  const { rows } = await pool.query('SELECT * FROM resumes WHERE id = $1;', [id]);
  return rows[0] || null;
};
