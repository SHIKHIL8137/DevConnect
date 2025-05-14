import { useEffect, useState } from "react";
import { Download, CheckCircle, X, Loader2, Check, ChevronDown } from "lucide-react";
import { projectDetails } from "../../apis/projectApi";
import { toast } from "sonner";
import Navbar from "../../components/user/navbar/navbar";
import Footer from "../../components/user/footer/Footer";
import { useNavigate } from "react-router-dom";

const ProjectDetails = () => {
  const [loading, setLoading] = useState(true);
  const [project, setProject] = useState(null);
  const navigate = useNavigate()
    const [statusLoading, setStatusLoading] = useState(null);
  const [expandedRow, setExpandedRow] = useState(null);
  const [appliedUser,setAppliedUsers] = useState(null);
  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get("id");
  const getProjectDetails = async () => {
    try {
      setLoading(true);

      const response = await projectDetails(id);
      if (!response.status) {
        toast.error(
          response.data?.message || "Failed to fetch project",
          "error"
        );
        return;
      }
      setProject(response.data.projectData);
      setAppliedUsers(response.data.appliedUsers)

    } catch (error) {
      toast.error(error.message || "An error occurred", "error");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      getProjectDetails();
    }
  }, []);

  const handleStatusChange = async (applicationId, freelancerId, newStatus) => {
    try {
      // Set loading state for this specific action
      setStatusLoading(`${applicationId}-${newStatus}`);
      
      // Call the provided callback
      await onStatusChange(applicationId, freelancerId, newStatus);
      
      // Reset loading state
      setStatusLoading(null);
    } catch (error) {
      console.error("Error changing status:", error);
      setStatusLoading(null);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'applied':
        return "bg-blue-100 text-blue-800";
      case 'hired':
        return "bg-green-100 text-green-800";
      case 'rejected':
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };
 const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-800">
            Project not found
          </h2>
          <p className="text-gray-600 mt-2">
            The project you're looking for doesn't exist or has been removed.
          </p>
        </div>
      </div>
    );
  }

  const featuresList = project.features
    ? project.features.split("\n").filter(Boolean)
    : [];
  const preferencesList = project.preferences
    ? project.preferences.split("\n").filter(Boolean)
    : [];

  const formattedBudget = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(project.budget);

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      <Navbar/>
      <div className="max-w-6xl mt-5 mb-5 mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-8">
          <h1 className="text-2xl font-bold text-center text-gray-800 mb-8">
            {project.title}
          </h1>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div>
              <h2 className="text-xl font-bold mb-4 text-gray-800">
                Description
              </h2>
              <div className="space-y-2 text-gray-600">
                {project.description.split("\n").map((line, index) => (
                  <p key={index}>{line}</p>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-xl font-bold mb-4 text-gray-800">
                Required Features / Pages
              </h2>
              <div className="space-y-1 text-gray-600">
                {featuresList.length > 0 ? (
                  featuresList.map((feature, index) => (
                    <p key={index}>{feature}</p>
                  ))
                ) : (
                  <p>No features specified</p>
                )}
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div>
              <h2 className="text-xl font-bold mb-4 text-gray-800">
                Tech Preferences
              </h2>
              <div className="space-y-2 text-gray-600">
                {preferencesList.length > 0 ? (
                  preferencesList.map((preference, index) => (
                    <p key={index}>{preference}</p>
                  ))
                ) : (
                  <p>No preferences specified</p>
                )}
              </div>
            </div>

            <div>
              <h2 className="text-xl font-bold mb-4 text-gray-800">
                Additional Information
              </h2>
              <div className="space-y-2 text-gray-600">
                <p>
                  Status:{" "}
                  <span className="font-medium capitalize">
                    {project.completionStatus}
                  </span>
                </p>
                <p>
                  Client ID:{" "}
                  <span className="font-medium">{project.clientId}</span>
                </p>
                {project.freelancerId && (
                  <p>
                    Freelancer ID:{" "}
                    <span className="font-medium">{project.freelancerId}</span>
                  </p>
                )}
                <p>
                  Created:{" "}
                  <span className="font-medium">
                    {new Date(project.createdAt).toLocaleDateString()}
                  </span>
                </p>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div>
              <h2 className="text-xl font-bold mb-4 text-gray-800">Timeline</h2>
              <p className="text-gray-600">
                {project.timeline
                  ? `${project.timeline} days`
                  : "No timeline specified"}
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold mb-4 text-gray-800">Budget</h2>
              <p className="text-gray-600">Fixed: {formattedBudget}</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div>
              <h2 className="text-xl font-bold mb-4 text-gray-800">
                Reference Links
              </h2>
              {project.referralLink ? (
                <a
                  href={project.referralLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  {project.referralLink}
                </a>
              ) : (
                <p className="text-gray-600">No reference links provided</p>
              )}
            </div>

            <div>
              <h2 className="text-xl font-bold mb-4 text-gray-800">
                Attachments
              </h2>
              {project.attachments && project.attachments.length > 0 ? (
                <div className="space-y-2">
                  {project.attachments.map((attachment, index) => {
                    const fileName = attachment.split("/").pop();

                    // Modify the URL to force download using fl_attachment
                    const downloadUrl = attachment.replace(
                      "/upload/",
                      "/upload/"
                    );

                    return (
                      <div
                        key={index}
                        className="bg-gray-100 rounded-lg p-3 flex items-center space-x-2 w-fit"
                      >
                        <a
                          href={downloadUrl}
                          download={fileName}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Download size={18} className="text-gray-600" />
                        </a>
                        <span className="text-gray-700">
                          {`Attachment ${index + 1}`} - {fileName}
                        </span>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-gray-600">No attachments</p>
              )}
            </div>
          </div>

<div className="overflow-x-auto bg-white rounded-lg shadow">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              No.
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Freelancer Name
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Applied Date
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Details
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {appliedUser.length > 0 ? (
            appliedUser.map((application, index) => (
              <>
                <tr key={index} className={expandedRow === index ? "bg-blue-50" : "hover:bg-gray-50"}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {index + 1}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 cursor-pointer" onClick={()=>navigate(`/client/freelancerProfile?id=${application.freelancerId}`)}>
                    {application.freelancerName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(application.appliedAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadge(application.status)}`}>
                      {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex space-x-2">
                      {application.status === 'applied' && (
                        <>
                          <button
                            onClick={() => handleStatusChange(application._id, application.freelancerId, 'hired')}
                            disabled={statusLoading === `${application._id}-hired`}
                            className="px-3 py-1 bg-green-100 text-green-800 rounded-md hover:bg-green-200 transition-colors flex items-center"
                          >
                            <Check size={14} className="mr-1" />
                            {statusLoading === `${application._id}-hired` ? 'Hiring...' : 'Hire'}
                          </button>
                          <button
                            onClick={() => handleStatusChange(application._id, application.freelancerId, 'rejected')}
                            disabled={statusLoading === `${application._id}-rejected`}
                            className="px-3 py-1 bg-red-100 text-red-800 rounded-md hover:bg-red-200 transition-colors flex items-center"
                          >
                            <X size={14} className="mr-1" />
                            {statusLoading === `${application._id}-rejected` ? 'Rejecting...' : 'Reject'}
                          </button>
                        </>
                      )}
                      {application.status !== 'applied' && (
                        <span className="text-sm text-gray-500 italic">Status already updated</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button 
                      onClick={() => setExpandedRow(expandedRow === index ? null : index)}
                      className="text-blue-600 hover:text-blue-900 flex items-center"
                    >
                      Details
                      <ChevronDown 
                        className={`ml-1 transition-transform duration-200 ${expandedRow === index ? 'transform rotate-180' : ''}`} 
                        size={16} 
                      />
                    </button>
                  </td>
                </tr>
                {expandedRow === index && (
                  <tr className="bg-blue-50">
                    <td colSpan={6} className="px-6 py-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="text-sm font-medium text-gray-900">Freelancer ID</h4>
                          <p className="text-sm text-gray-500">{application.freelancerId}</p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-900">Application ID</h4>
                          <p className="text-sm text-gray-500">{application._id}</p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-900">Current Status</h4>
                          <p className="text-sm text-gray-500">{application.status}</p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-900">Applied On</h4>
                          <p className="text-sm text-gray-500">{formatDate(application.appliedAt)}</p>
                        </div>
                        {/* Add additional fields here if needed */}
                      </div>
                    </td>
                  </tr>
                )}
              </>
            ))
          ) : (
            <tr>
              <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                No applications found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>

          <div className="flex mt-10 flex-col items-center space-y-4">
            <p className="text-lg font-semibold">Project completion status:</p>
            <div className="flex space-x-4">
              <button
                className={`px-6 py-2 rounded-md ${
                  project.completionStatus === "completed"
                    ? "bg-green-600 text-white"
                    : "bg-gray-200 text-gray-600"
                }`}
                onClick={() => {
                  setProject((prev) => ({
                    ...prev,
                    completionStatus: "completed",
                  }));
                  showToast("Project status updated to completed");
                }}
              >
                Completed
              </button>
              <button
                className={`px-6 py-2 rounded-md ${
                  project.completionStatus !== "completed"
                    ? "bg-red-600 text-white"
                    : "bg-gray-200 text-gray-600"
                }`}
                onClick={() => {
                  setProject((prev) => ({ ...prev, completionStatus: "open" }));
                  showToast("Project status updated to not completed");
                }}
              >
                Not Completed
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer/>
    </div>
  );
};

export default ProjectDetails;
