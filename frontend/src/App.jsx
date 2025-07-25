import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ResumeUploader from './components/ResumeUploader';
import ResumeDetails from './components/ResumeDetails';
import PastResumesTable from './components/PastResumesTable';
// import './App.css'; // No longer needed as we're using Tailwind CSS

const App = () => {
  const [tab, setTab] = useState('analyze');
  const [analysisData, setAnalysisData] = useState(null);
  const [resumes, setResumes] = useState([]);
  const [selectedResume, setSelectedResume] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    // Fetch historical resumes only when the 'history' tab is active
    if (tab === 'history') {
      // Added a try-catch for error handling during API call
      const fetchResumes = async () => {
        try {
          const res = await axios.get('https://resume-analyzer-posk.onrender.com/api/resumes');
          setResumes(res.data);
        } catch (error) {
          console.error('Failed to fetch historical resumes:', error);
          // Optionally, display an error message to the user
        }
      };
      fetchResumes();
    }
  }, [tab]);

  const handleUploadSuccess = (data) => {
    setAnalysisData(data);
    setTab('analyze'); // Ensure we are on the analysis tab after upload
    setShowDetails(false); // Hide any previous details view
  };

  const handleShowDetails = async (id) => {
    try {
      const res = await axios.get(`https://resume-analyzer-posk.onrender.com/api/resumes/${id}`);
      setSelectedResume(res.data);
      setShowDetails(true);
    } catch (error) {
      console.error('Failed to fetch resume details:', error);
      // Optionally, display an error message to the user
    }
  };

  return (
    // Main application container
    <div className="
      max-w-7xl mx-auto p-4 md:p-8 lg:p-10
      text-center font-sans bg-gray-50 min-h-screen
    ">
      <h1 className="
        text-4xl md:text-5xl font-extrabold text-gray-900 mb-8
        tracking-tight leading-tight
      ">
        Resume Analyzer
      </h1>

      {/* Tabs for navigation */}
      <div className="
        flex justify-center mb-8 bg-white rounded-lg shadow-sm
        p-1 space-x-2
      ">
        <button
          className={`
            px-6 py-3 text-lg font-medium rounded-md
            transition-all duration-300 ease-in-out
            ${tab === 'analyze'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-gray-700 hover:bg-gray-100'
            }
          `}
          onClick={() => setTab('analyze')}
        >
          Resume Analysis
        </button>
        <button
          className={`
            px-6 py-3 text-lg font-medium rounded-md
            transition-all duration-300 ease-in-out
            ${tab === 'history'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-gray-700 hover:bg-gray-100'
            }
          `}
          onClick={() => setTab('history')}
        >
          Historical Viewer
        </button>
      </div>

      {/* Content for 'Resume Analysis' tab */}
      {tab === 'analyze' && (
        <div className="space-y-8"> {/* Added space between uploader and details */}
          <ResumeUploader onUploadSuccess={handleUploadSuccess} />
          {/* Only show ResumeDetails if analysisData is available */}
          {analysisData && (
            <div className="mt-8"> {/* Margin top for separation */}
              <ResumeDetails data={analysisData} />
            </div>
          )}
        </div>
      )}

      {/* Content for 'Historical Viewer' tab */}
      {tab === 'history' && (
        <div className="relative"> {/* Relative for modal positioning */}
          <PastResumesTable resumes={resumes} onShowDetails={handleShowDetails} />
          
          {/* Modal for displaying resume details */}
          {showDetails && (
            <div className="
              fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50
              p-4
            " onClick={() => setShowDetails(false)}>
              <div
                className="
                  bg-white rounded-lg shadow-xl p-6 max-w-2xl w-full
                  max-h-[90vh] overflow-y-auto relative
                "
                onClick={e => e.stopPropagation()} // Prevent modal from closing when clicking inside
              >
                <button
                  className="
                    absolute top-3 right-3 text-gray-500 hover:text-gray-800
                    text-2xl font-bold transition-colors duration-200
                  "
                  onClick={() => setShowDetails(false)}
                >
                  &times; {/* HTML entity for multiplication sign / close icon */}
                </button>
                <ResumeDetails data={selectedResume} />
                <button
                  className="
                    mt-6 px-6 py-3 bg-indigo-600 text-white rounded-md
                    font-semibold hover:bg-indigo-700 transition-colors duration-200
                    focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-75
                  "
                  onClick={() => setShowDetails(false)}
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default App;