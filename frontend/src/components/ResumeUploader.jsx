import React, { useState } from 'react';
import axios from 'axios';

const ResumeUploader = ({ onUploadSuccess }) => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    // Only accept PDF files
    if (e.target.files[0] && e.target.files[0].type === "application/pdf") {
      setFile(e.target.files[0]);
      setError('');
    } else {
      setFile(null); // Clear file if not a PDF
      setError('Please select a PDF file.');
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a PDF file to upload.');
      return;
    }

    setLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('resume', file);

    try {
      const res = await axios.post('https://resume-analyzer-posk.onrender.com/api/resumes/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      onUploadSuccess(res.data);
      setFile(null); // Clear the file input after successful upload
      // Optional: Clear the input visually if desired by resetting the input element's value
      // document.getElementById('resume-file-input').value = '';
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="
      border border-gray-200 p-6 rounded-xl shadow-md
      bg-gray-50 max-w-lg mx-auto mt-8
      font-sans text-gray-800
    ">
      <label htmlFor="resume-file-input" className="
        block mb-2 font-semibold text-gray-700
      ">
        Upload Resume (PDF only):
      </label>
      <input
        id="resume-file-input" // Added ID for htmlFor
        type="file"
        accept="application/pdf"
        onChange={handleFileChange}
        className="
          mb-4 w-full p-2 text-sm
          border border-gray-300 rounded-md
          file:mr-4 file:py-2 file:px-4
          file:rounded-md file:border-0
          file:text-sm file:font-semibold
          file:bg-indigo-50 file:text-indigo-700
          hover:file:bg-indigo-100
        "
      />
      <button
        onClick={handleUpload}
        disabled={loading || !file} // Button is disabled if no file is selected
        className={`
          w-full py-2 px-4 bg-indigo-600 text-white
          rounded-md font-bold text-base
          hover:bg-indigo-700 transition-colors duration-200
          focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-75
          ${loading || !file ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        {loading ? 'Uploading...' : 'Upload Resume'}
      </button>
      {error && (
        <div className="text-red-600 mt-3 text-sm text-center">
          {error}
        </div>
      )}
    </div>
  );
};

export default ResumeUploader;