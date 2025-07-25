import React from 'react';

const ResumeDetails = ({ data }) => {
  if (!data) return null;

  const parseCertificationString = (certString) => {
    // Regex to capture: Name, Issuing Organization, Issue Date
    const regex = /(.*?) — Issued by (.*?) \((.*?)\)/;
    const match = certString.match(regex);

    if (match) {
      return {
        name: match[1].trim(),
        issuing_organization: match[2].trim(),
        issue_date: match[3].trim(),
      };
    }
    // Fallback if regex doesn't match (e.g., just return the original string as name)
    return {
      name: certString.trim(),
      issuing_organization: 'N/A',
      issue_date: 'N/A',
    };
  };

  const parseProjectString = (projectString) => {
    let title = projectString;
    let url = null;
    let description = projectString;

    // Attempt to extract title by looking for a common separator (e.g., ":")
    const titleSeparatorIndex = projectString.indexOf(':');
    if (titleSeparatorIndex !== -1) {
      title = projectString.substring(0, titleSeparatorIndex).trim();
      description = projectString.substring(titleSeparatorIndex + 1).trim();
    }

    // Attempt to extract a URL (a very simple regex)
    const urlMatch = description.match(/(https?:\/\/[^\s]+)/);
    if (urlMatch) {
      url = urlMatch[0];
      // Remove URL from description if found
      description = description.replace(url, '').trim();
    }

    return { title, url, description };
  };

  return (
    <div className="
      border border-gray-300 p-6 rounded-xl mt-6
      shadow-lg bg-white
      font-sans leading-relaxed text-gray-800
      max-w-3xl mx-auto
    ">
      <h2 className="text-gray-900 mb-3 text-3xl font-bold text-center">
        {data.name || 'No Name'}
      </h2>

      <div className="text-sm md:text-base"> {/* Adjust font size for responsiveness */}
        <p className="mb-2"><span className="font-semibold text-gray-700">Email:</span> {data.email}</p>
        <p className="mb-2"><span className="font-semibold text-gray-700">Phone:</span> {data.phone}</p>
        {data.linkedin_url && (
          <p className="mb-2">
            <span className="font-semibold text-gray-700">LinkedIn:</span>{' '}
            <a href={data.linkedin_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
              {data.linkedin_url}
            </a>
          </p>
        )}
        {data.portfolio_url && (
          <p className="mb-2">
            <span className="font-semibold text-gray-700">Portfolio:</span>{' '}
            <a href={data.portfolio_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
              {data.portfolio_url}
            </a>
          </p>
        )}
      </div>
      
      {data.summary && (
        <div>
          <div className="mt-6 text-xl font-bold border-b-2 border-indigo-100 pb-1 mb-3 text-indigo-700">Summary</div>
          <p className="text-gray-700">{data.summary}</p>
        </div>
      )}

      {data.work_experience && data.work_experience.length > 0 && (
        <div>
          <div className="mt-6 text-xl font-bold border-b-2 border-indigo-100 pb-1 mb-3 text-indigo-700">Work Experience</div>
          <ul className="list-none pl-0">
            {(data.work_experience || []).map((exp, idx) => (
              <li key={idx} className="mb-4 p-3 border border-gray-200 rounded-md bg-gray-50">
                <p className="font-semibold text-lg text-gray-900">{exp.title} at {exp.company}</p>
                <p className="text-gray-600 text-sm">{exp.start_date} - {exp.end_date || 'Present'}</p>
                <p className="text-gray-700 mt-1">{exp.description}</p>
              </li>
            ))}
          </ul>
        </div>
      )}

      {data.education && data.education.length > 0 && (
        <div>
          <div className="mt-6 text-xl font-bold border-b-2 border-indigo-100 pb-1 mb-3 text-indigo-700">Education</div>
          <ul className="list-none pl-0">
            {(data.education || []).map((edu, idx) => (
              <li key={idx} className="mb-4 p-3 border border-gray-200 rounded-md bg-gray-50">
                <p className="font-semibold text-lg text-gray-900">{edu.degree} from {edu.institution}</p>
                <p className="text-gray-600 text-sm">{edu.start_date} - {edu.end_date || 'Present'}</p>
                {edu.gpa && <p className="text-gray-700 mt-1">GPA: {edu.gpa}</p>}
              </li>
            ))}
          </ul>
        </div>
      )}

      {data.technical_skills && data.technical_skills.length > 0 && (
        <div>
          <div className="mt-6 text-xl font-bold border-b-2 border-indigo-100 pb-1 mb-3 text-indigo-700">Technical Skills</div>
          <ul className="list-disc pl-6 mt-2 text-gray-700">
            {(data.technical_skills || []).map((skill, idx) => (
              <li key={idx} className="mb-1">{skill}</li>
            ))}
          </ul>
        </div>
      )}

      {data.soft_skills && data.soft_skills.length > 0 && (
        <div>
          <div className="mt-6 text-xl font-bold border-b-2 border-indigo-100 pb-1 mb-3 text-indigo-700">Soft Skills</div>
          <ul className="list-disc pl-6 mt-2 text-gray-700">
            {(data.soft_skills || []).map((skill, idx) => (
              <li key={idx} className="mb-1">{skill}</li>
            ))}
          </ul>
        </div>
      )}

{data.projects && data.projects.length > 0 && (
        <div>
          <div className="mt-6 text-xl font-bold border-b-2 border-indigo-100 pb-1 mb-3 text-indigo-700">Projects</div>
          <ul className="list-none pl-0">
            {(data.projects || []).map((projectString, idx) => { // project is now projectString
              const project = parseProjectString(projectString); // Parse it here
              return (
                <li key={idx} className="mb-4 p-3 border border-gray-200 rounded-md bg-gray-50">
                  <p className="font-semibold text-lg text-gray-900">{project.title}</p>
                  {project.url && (
                    <p className="text-gray-600 text-sm mb-1">
                      <a href={project.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                        {project.url}
                      </a>
                    </p>
                  )}
                  <p className="text-gray-700 mt-1">{project.description}</p>
                </li>
              );
            })}
          </ul>
        </div>
      )}

{data.certifications && data.certifications.length > 0 && (
        <div>
          <div className="mt-6 text-xl font-bold border-b-2 border-indigo-100 pb-1 mb-3 text-indigo-700">Certifications</div>
          <ul className="list-disc pl-6 mt-2 text-gray-700">
            {(data.certifications || []).map((certString, idx) => {
              const cert = parseCertificationString(certString);
              return (
                <li key={idx} className="mb-1">
                  <span className="font-medium">{cert.name}</span> - {cert.issuing_organization} ({cert.issue_date})
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {data.resume_rating !== null && data.resume_rating !== undefined && (
        <div>
          <div className="mt-6 text-xl font-bold border-b-2 border-indigo-100 pb-1 mb-3 text-indigo-700">Resume Rating</div>
          <p className="text-lg font-semibold text-green-600">{data.resume_rating} / 10</p>
        </div>
      )}

      {data.improvement_areas && (
        <div>
          <div className="mt-6 text-xl font-bold border-b-2 border-indigo-100 pb-1 mb-3 text-indigo-700">Improvement Areas</div>
          <p className="text-gray-700">{data.improvement_areas}</p>
        </div>
      )}

      {data.upskill_suggestions && data.upskill_suggestions.length > 0 && (
        <div>
          <div className="mt-6 text-xl font-bold border-b-2 border-indigo-100 pb-1 mb-3 text-indigo-700">Upskill Suggestions</div>
          <ul className="list-disc pl-6 mt-2 text-gray-700">
            {(data.upskill_suggestions || []).map((item, idx) => (
              <li key={idx} className="mb-1">{item}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ResumeDetails;