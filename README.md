1. Introduction
The Resume Analyzer is a full-stack web application designed to streamline the process of resume evaluation. Users can upload their resumes in PDF format, and the application will automatically extract key information, store it, and leverage Google's Gemini LLM to provide intelligent feedback for improvement.

1.1. Objective
To design, build, and deploy a robust web application that extracts structured data from uploaded resumes, stores it in a database, and generates AI-driven analysis, including a resume rating, areas for improvement, and upskill suggestions.

1.2. Scope
The project is organized into two primary functional areas, accessible via distinct tabs in the user interface:

Resume Analysis (Tab 1): Users can upload a PDF resume. The backend processes this resume by extracting structured data (e.g., contact information, skills, work experience), saving it to a PostgreSQL database. The powerful Gemini LLM is then utilized to generate a comprehensive resume rating, identify key areas for improvement, and suggest relevant skills for upskilling. The detailed analysis is presented in a clean, user-friendly interface.

Historical Viewer (Tab 2): This section provides a historical record of all previously uploaded resumes. It displays a table with essential details for each resume. A "Details" button associated with each entry allows users to open a modal window, which reuses the ResumeDetails UI component from the first tab to show the full analysis of that specific resume.

1.3. Technology Stack
Frontend: React.js

Backend: Node.js with Express.js

Database: PostgreSQL

API Style: REST API

LLM Integration: Google Gemini API via @google/generative-ai SDK

PDF Parsing: pdf-parse (or similar Node.js library)

2. High-Level Architecture
The application follows a standard client-server architecture, illustrating a clear data flow and component interaction.

Code snippet

graph TD
    subgraph User's Browser
        A[Frontend UI - React]
    end

    subgraph Server
        B[Backend API - Node.js/Express.js]
        C[Database - PostgreSQL]
        D[PDF Text Extractor]
        E[LLM Service - Google AI SDK + Gemini]
    end

    A -- 1. Upload Resume (PDF) --> B
    B -- 2. Pass PDF to Extractor --> D
    D -- 3. Return Raw Text --> B
    B -- 4. Send Text in Prompt --> E
    E -- 5. Return Structured JSON --> B
    B -- 6. Save Data to DB --> C
    B -- 7. Return JSON to Frontend --> A
    A -- 8. Display Analysis --> A

    subgraph History View
        A -- a. Request Past Resumes --> B
        B -- b. Query DB --> C
        C -- c. Return Records --> B
        B -- d. Send Records to Frontend --> A
    end

    style A fill:#cde4ff
    style B fill:#d5e8d4
    style C fill:#ffe6cc
    style D fill:#f8cecc
    style E fill:#dae8fc
Data Flow Explanation:
User Uploads Resume: The user initiates the process by uploading a PDF resume through the React frontend.

Frontend to Backend: The frontend sends the PDF file to a dedicated upload endpoint on the Node.js backend.

PDF Text Extraction: The backend utilizes a PDF parsing library (pdf-parse) to extract the raw text content from the uploaded document.

LLM Prompt Engineering: The extracted raw text is meticulously embedded into a carefully crafted prompt, which is then sent to the Gemini LLM via the Google AI SDK.

Gemini Analysis: Gemini processes the prompt, analyzes the resume text, and returns a structured JSON object containing the extracted information and the AI-generated analysis (rating, improvement areas, upskill suggestions).

Data Persistence: The backend validates the received JSON data and saves it into the PostgreSQL database.

Backend to Frontend Response: The full JSON object (including the saved data and analysis) is sent back to the frontend as the API response.

Display Analysis: The frontend then renders this structured data in a user-friendly and organized layout for the user to review.

Historical Data Request: For the "Historical Viewer" tab, the frontend requests a list of all previously uploaded resumes from the backend.

Database Query: The backend queries the PostgreSQL database for the stored resume records.

Records to Frontend: The database returns the records to the backend, which then sends them to the frontend.

Display History: The frontend displays these records in a table format, allowing users to view details for each.

3. Database Design
A single resumes table in PostgreSQL is used to store all extracted and generated information from the uploaded resumes. The JSONB data type is extensively used to efficiently store nested and semi-structured data like work experience, education, and skills.

SQL CREATE TABLE Statement:
SQL

CREATE TABLE resumes (
    id SERIAL PRIMARY KEY,
    file_name VARCHAR(255) NOT NULL,
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    name VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(50),
    linkedin_url VARCHAR(255),
    portfolio_url VARCHAR(255),
    summary TEXT,
    work_experience JSONB,      -- Stores an array of work experience objects
    education JSONB,            -- Stores an array of education objects
    technical_skills JSONB,     -- Stores an array of strings
    soft_skills JSONB,          -- Stores an array of strings
    projects JSONB,             -- Stores an array of project objects
    certifications JSONB,       -- Stores an array of certification objects
    resume_rating INTEGER,      -- AI-generated rating (1-10)
    improvement_areas TEXT,     -- AI-generated text for improvement
    upskill_suggestions JSONB   -- Stores an array of strings for upskilling
);
4. Getting Started (Local Setup)
Follow these steps to set up and run the Resume Analyzer application on your local machine.

4.1. Prerequisites
Before you begin, ensure you have the following installed:

Node.js (LTS version recommended)

npm (comes with Node.js)

PostgreSQL database server

A Google API Key with access to the Gemini API (Google AI Studio)

4.2. Directory Structure
Clone the repository and navigate into the project root:

Bash

git clone <your-repository-url> resume-analyzer
cd resume-analyzer
The project is structured into backend and frontend directories:

resume-analyzer/
├── backend/                  # Node.js/Express.js server
│   ├── controllers/
│   ├── db/
│   ├── routes/
│   ├── services/
│   ├── .env                  # Environment variables for backend
│   └── server.js
├── frontend/                 # React.js application
│   └── src/
│       └── components/
├── sample_data/              # Folder for sample PDF resumes
├── screenshots/              # Folder for application screenshots
└── README.md                 # This file
4.3. Backend Setup
Navigate to the backend directory:

Bash

cd backend
Initialize Node.js project and install dependencies:

Bash

npm init -y
npm install express pg multer pdf-parse @google/generative-ai dotenv cors
Create a .env file:
In the backend/ directory, create a file named .env and populate it with your database credentials and Google API Key:

Code snippet

# PostgreSQL Database Configuration
DB_USER=your_postgres_user
DB_HOST=localhost
DB_DATABASE=your_db_name
DB_PASSWORD=your_postgres_password
DB_PORT=5432

# Google Gemini API Key
GOOGLE_API_KEY="YOUR_GEMINI_API_KEY"
Replace placeholders with your actual credentials.

Set up the PostgreSQL Database:

Ensure your PostgreSQL server is running.

Connect to your PostgreSQL server (e.g., using psql or pgAdmin).

Create a new database (e.g., resume_analyzer_db).

Run the SQL CREATE TABLE statement provided in the Database Design section to set up the resumes table.

Start the Backend Server:

Bash

node server.js
The backend server will typically run on http://localhost:5000.

4.4. Frontend Setup
Open a new terminal or tab and navigate to the frontend directory:

Bash

cd frontend
Initialize React application and install dependencies:

Bash

# If you haven't already created the React app in this folder
# npx create-react-app .

npm install axios tailwindcss postcss autoprefixer
npx tailwindcss init -p
Configure Tailwind CSS:
Update your tailwind.config.js file to include paths to your React components:

JavaScript

// tailwind.config.js
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // Crucial for React components
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
Add Tailwind directives to your main CSS file (src/index.css or src/App.css):

CSS

/* src/index.css */
@tailwind base;
@tailwind components;
@tailwind utilities;
Ensure this CSS file is imported into your main React entry point (e.g., src/index.js):

JavaScript

// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; // Make sure this is present
import App from './App';

// ... rest of your code
Start the Frontend Development Server:

Bash

npm start
The React application will typically open in your browser at http://localhost:3000.

5. Usage
Once both the backend and frontend servers are running, you can interact with the Resume Analyzer.

5.1. Resume Analysis Tab
Select the "Resume Analysis" tab.

Click "Choose File" and select a PDF resume from your computer.

Click "Upload Resume".

The application will process the resume, send it to the backend for AI analysis, and then display a detailed breakdown of the extracted information, a resume rating, areas for improvement, and upskill suggestions.

5.2. Historical Viewer Tab
Select the "Historical Viewer" tab.

A table will populate with all resumes previously uploaded. Each row shows the name, email, and upload timestamp.

Click the "Details" button next to any resume entry to open a modal window displaying the full analysis for that specific resume.

Click the "Close" button or outside the modal to dismiss it.

6. Testing and Error Handling
The application is designed with basic error handling.

Diverse Resumes: It's highly recommended to test the application with a variety of resume formats (e.g., single-column, multi-column, resumes with varying structures or sections) to evaluate the LLM's parsing capabilities. Store these in the sample_data/ folder.

Edge Cases:

Test scenarios where specific sections (e.g., "Work Experience" or "Education") might be missing in the resume. The LLM prompt is engineered to handle these by returning null or empty arrays [].

Attempt to upload encrypted, corrupted, or non-PDF files. The pdf-parse library will likely throw an error, which the backend will catch and report.

A file size limit should be considered in the multer configuration to prevent excessively large file uploads.

Error Reporting:

Frontend: If API calls fail (e.g., backend is down, server error), the UI will display an informative error message to the user.

Backend: try...catch blocks are implemented in controller functions and services to gracefully handle errors and return appropriate HTTP status codes (e.g., 400 Bad Request for invalid input, 500 Internal Server Error for unexpected server issues).

7. Submission Checklist
Before submitting your project, please ensure the following:

[ ] The entire project code is available in a public GitHub repository.

[ ] The repository root contains a sample_data/ folder with PDFs used for testing.

[ ] The repository root contains a screenshots/ folder with images of all key UI pages (e.g., Analysis tab with results, History tab, Details modal).

[ ] The README.md file (this file) is comprehensive, explaining the project, and provides clear, step-by-step instructions on how to set up and run it locally.

8. Evaluation Criteria
Your project will be evaluated based on the following aspects:

Code Quality: Modularity, readability, adherence to Node.js and React best practices, and appropriate documentation.

Data Extraction Accuracy: How precise and complete is the information extracted from the resumes?

AI-Powered Analysis: Are the AI-generated resume ratings, improvement areas, and upskill suggestions relevant, insightful, and actionable?

UI/UX: Is the user interface clean, intuitive, responsive, and visually appealing (thanks to Tailwind CSS!)?

Robustness: How effectively does the application handle edge cases, unexpected inputs, and errors?

9. Contributing
Feel free to fork this repository, submit issues, or propose pull requests. Contributions are welcome!