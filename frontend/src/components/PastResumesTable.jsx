import React from 'react';

class PastResumesTable extends React.Component {
  state = {
    hoveredRow: null,
  };

  handleMouseEnter = (index) => {
    this.setState({ hoveredRow: index });
  };

  handleMouseLeave = () => {
    this.setState({ hoveredRow: null });
  };

  render() {
    const { resumes, onShowDetails } = this.props;
    const { hoveredRow } = this.state;

    return (
      <div className="overflow-x-auto"> {/* Added for responsive table scrolling */}
        <table className="
          w-full border-collapse mt-5
          font-sans rounded-lg overflow-hidden
          shadow-md
        ">
          <thead>
            <tr>
              <th className="
                bg-indigo-700 text-white p-3
                text-left uppercase tracking-wider
              ">Name</th>
              <th className="
                bg-indigo-700 text-white p-3
                text-left uppercase tracking-wider
              ">Email</th>
              <th className="
                bg-indigo-700 text-white p-3
                text-left uppercase tracking-wider
              ">Uploaded At</th>
              <th className="
                bg-indigo-700 text-white p-3
                text-left uppercase tracking-wider
              ">Actions</th>
            </tr>
          </thead>
          <tbody>
            {resumes.map((resume, index) => (
              <tr
                key={resume.id}
                onMouseEnter={() => this.handleMouseEnter(index)}
                onMouseLeave={this.handleMouseLeave}
                className={`
                  ${hoveredRow === index ? 'bg-gray-100' : 'bg-white'}
                  hover:bg-gray-100 transition-colors duration-200 ease-in-out
                `}
              >
                <td className="p-3 border-b border-gray-200">{resume.name}</td>
                <td className="p-3 border-b border-gray-200">{resume.email}</td>
                <td className="p-3 border-b border-gray-200">
                  {new Date(resume.uploaded_at).toLocaleString()}
                </td>
                <td className="p-3 border-b border-gray-200">
                  <button
                    className="
                      px-4 py-2 bg-green-600 text-white
                      rounded-md shadow-sm hover:bg-green-700
                      focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-75
                      transition-colors duration-200
                    "
                    onClick={() => onShowDetails(resume.id)}
                  >
                    Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}

export default PastResumesTable;