const analysisService = require('../services/analysisService');
const db = require('../db');

exports.uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded.' });
    }
    // Call analysis service to extract and analyze resume
    const analysisResult = await analysisService.analyzeResume(req.file.buffer, req.file.originalname);
    // Save to DB (placeholder)
    const savedResume = await db.saveResume(analysisResult, req.file.originalname);
    res.status(201).json(savedResume);
  } catch (err) {
    res.status(500).json({ message: err.message || 'Server error.' });
  }
};

exports.getAllResumes = async (req, res) => {
  try {
    const resumes = await db.getAllResumes();
    res.json(resumes);
  } catch (err) {
    res.status(500).json({ message: err.message || 'Server error.' });
  }
};

exports.getResumeById = async (req, res) => {
  try {
    const resume = await db.getResumeById(req.params.id);
    if (!resume) return res.status(404).json({ message: 'Resume not found.' });
    res.json(resume);
  } catch (err) {
    res.status(500).json({ message: err.message || 'Server error.' });
  }
}; 