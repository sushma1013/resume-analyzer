const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const resumeRoutes = require('./routes/resumeRoutes');

const app = express();
app.use(cors());
app.use(express.json());



// Serve static files from the React app


app.use('/api/resumes', resumeRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 