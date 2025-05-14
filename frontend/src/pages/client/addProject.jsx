import { useState } from 'react';
import { Calendar, Paperclip, DollarSign, Clock, Link2, AlertCircle } from 'lucide-react';
import Navbar from '../../components/user/navbar/navbar';
import Footer from '../../components/user/footer/Footer';
import axios from 'axios';
import { addProject } from '../../apis/projectApi';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';


const AddProjectForm = () => {
const navigate = useNavigate()
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    features: '',
    preferences: '',
    timeline: '',
    budget: '',
    referralLink: '',
    attachments: []
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) newErrors.title = 'Project title is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.features.trim()) newErrors.features = 'Features are required';
    
    if (!formData.timeline) {
      newErrors.timeline = 'Timeline is required';
    } else if (parseInt(formData.timeline) <= 0) {
      newErrors.timeline = 'Timeline must be greater than 0';
    }
    
    if (!formData.budget) {
      newErrors.budget = 'Budget is required';
    } else if (parseInt(formData.budget) <= 0) {
      newErrors.budget = 'Budget must be greater than 0';
    }
    
    // URL validation for referral link if provided
    if (formData.referralLink && !isValidUrl(formData.referralLink)) {
      newErrors.referralLink = 'Please enter a valid URL';
    }
    
    // File validation
    if (formData.attachments.length > 0) {
      const invalidFiles = formData.attachments.filter(file => {
        const fileSize = file.size / 1024 / 1024; // Convert to MB
        const validExtensions = ['jpg', 'jpeg', 'png', 'pdf', 'doc', 'docx'];
        const fileExt = file.name.split('.').pop().toLowerCase();
        
        return fileSize > 10 || !validExtensions.includes(fileExt);
      });
      
      if (invalidFiles.length > 0) {
        newErrors.attachments = 'Only JPG, PDF, DOCX files up to 10MB are allowed';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData(prev => ({ ...prev, attachments: [...prev.attachments, ...files] }));
    
    // Clear attachments error when new files are selected
    if (errors.attachments) {
      setErrors(prev => ({ ...prev, attachments: '' }));
    }
  };

  const removeAttachment = (index) => {
    setFormData(prev => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('features', formData.features);
      formDataToSend.append('preferences', formData.preferences);
      formDataToSend.append('timeline', formData.timeline);
      formDataToSend.append('budget', formData.budget);
      formDataToSend.append('referralLink', formData.referralLink);
    
      formData.attachments.forEach(file => {
        formDataToSend.append('attachments', file);
      });
      
      const response = await addProject(formDataToSend);

      if(!response.data.status){
        return toast.error(response.data.message);
      }
      
      setFormData({
      title: '',
      description: '',
      features: '',
      preferences: '',
      timeline: '',
      budget: '',
      referralLink: '',
      attachments: []
    });
    navigate('/client/profile');
     toast.success(response.data.message)
    } catch (error) {
      console.error('Error submitting project:', error);
     toast.error(error.response?.data?.message || 'Failed to submit project. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getBorderClass = (fieldName) => {
    return errors[fieldName] 
      ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
      : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500';
  };

  return (
    <div className="pt-8 w-full min-h-screen bg-gray-100">
      <Navbar />
      <div className="flex flex-col py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-xl shadow-xl overflow-hidden">
            <div className="px-6 py-4">
              <h2 className="text-2xl font-medium text-black text-center">New Project</h2>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                  Project Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  id="title"
                  value={formData.title}
                  onChange={handleChange}
                  className={`mt-1 block w-full px-4 py-3 bg-gray-50 border rounded-lg transition duration-200 ${getBorderClass('title')}`}
                  placeholder="Enter project title"
                />
                {errors.title && (
                  <p className="mt-1 text-xs text-red-500">{errors.title}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="description"
                  id="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  className={`mt-1 block w-full px-4 py-3 bg-gray-50 border rounded-lg transition duration-200 ${getBorderClass('description')}`}
                  placeholder="Describe your project in detail"
                />
                {errors.description && (
                  <p className="mt-1 text-xs text-red-500">{errors.description}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="features" className="block text-sm font-medium text-gray-700">
                  Required Features / Pages <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="features"
                  id="features"
                  value={formData.features}
                  onChange={handleChange}
                  rows={3}
                  className={`mt-1 block w-full px-4 py-3 bg-gray-50 border rounded-lg transition duration-200 ${getBorderClass('features')}`}
                  placeholder="List the key features or pages needed"
                />
                {errors.features && (
                  <p className="mt-1 text-xs text-red-500">{errors.features}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="preferences" className="block text-sm font-medium text-gray-700">
                  Tech Preferences
                </label>
                <textarea
                  name="preferences"
                  id="preferences"
                  value={formData.preferences}
                  onChange={handleChange}
                  rows={3}
                  className={`mt-1 block w-full px-4 py-3 bg-gray-50 border rounded-lg transition duration-200 ${getBorderClass('preferences')}`}
                  placeholder="Specify technologies, frameworks, or platforms"
                />
                {errors.preferences && (
                  <p className="mt-1 text-xs text-red-500">{errors.preferences}</p>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="timeline" className="block text-sm font-medium text-gray-700">
                    Timeline (days) <span className="text-red-500">*</span>
                  </label>
                  <div className="mt-1 relative rounded-lg shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Clock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="number"
                      name="timeline"
                      id="timeline"
                      value={formData.timeline}
                      onChange={handleChange}
                      className={`block w-full pl-10 px-4 py-3 bg-gray-50 border rounded-lg transition duration-200 ${getBorderClass('timeline')}`}
                      placeholder="30"
                    />
                  </div>
                  {errors.timeline && (
                    <p className="mt-1 text-xs text-red-500">{errors.timeline}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="budget" className="block text-sm font-medium text-gray-700">
                    Budget ($) <span className="text-red-500">*</span>
                  </label>
                  <div className="mt-1 relative rounded-lg shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <DollarSign className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="number"
                      name="budget"
                      id="budget"
                      value={formData.budget}
                      onChange={handleChange}
                      className={`block w-full pl-10 px-4 py-3 bg-gray-50 border rounded-lg transition duration-200 ${getBorderClass('budget')}`}
                      placeholder="1000"
                    />
                  </div>
                  {errors.budget && (
                    <p className="mt-1 text-xs text-red-500">{errors.budget}</p>
                  )}
                </div>
              </div>
              
              <div>
                <label htmlFor="referralLink" className="block text-sm font-medium text-gray-700">
                  Referral Link (optional)
                </label>
                <div className="mt-1 relative rounded-lg shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Link2 className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="url"
                    name="referralLink"
                    id="referralLink"
                    value={formData.referralLink}
                    onChange={handleChange}
                    className={`block w-full pl-10 px-4 py-3 bg-gray-50 border rounded-lg transition duration-200 ${getBorderClass('referralLink')}`}
                    placeholder="https://example.com"
                  />
                </div>
                {errors.referralLink && (
                  <p className="mt-1 text-xs text-red-500">{errors.referralLink}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Attachments
                </label>
                <div className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-lg ${errors.attachments ? 'border-red-300' : 'border-gray-300'}`}>
                  <div className="space-y-1 text-center">
                    <Paperclip className={`mx-auto h-12 w-12 ${errors.attachments ? 'text-red-400' : 'text-gray-400'}`} />
                    <div className="flex text-sm text-gray-600">
                      <label htmlFor="file-upload" className={`relative cursor-pointer bg-white rounded-md font-medium ${errors.attachments ? 'text-red-600 hover:text-red-500' : 'text-blue-600 hover:text-blue-500'} focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500`}>
                        <span>Upload files</span>
                        <input 
                          id="file-upload" 
                          name="file-upload" 
                          type="file" 
                          multiple 
                          className="sr-only cursor-pointer" 
                          onChange={handleFileChange}
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">
                      JPG, PDF, DOCX up to 10MB
                    </p>
                  </div>
                </div>
                
                {errors.attachments && (
                  <p className="mt-1 text-xs text-red-500">{errors.attachments}</p>
                )}
                
                {formData.attachments.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {formData.attachments.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                        <div className="flex items-center">
                          <Paperclip className="h-4 w-4 text-gray-500 mr-2" />
                          <span className="text-sm text-gray-700 truncate max-w-xs">
                            {file.name}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeAttachment(index)}
                          className="text-red-500 cursor-pointer hover:text-red-700"
                        >
                          &times;
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="flex justify-end space-x-3 mt-8">
                <button
                  type="button"
                  onClick={()=>navigate('/client/profile')}
                  className="px-6 cursor-pointer py-2 border border-gray-300 shadow-sm text-base font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`px-6 py-2 cursor-pointer border-transparent text-base font-medium rounded-lg text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-md transition duration-200 ${
                    isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                >
                  {isSubmitting ? (<div className="h-5 w-5 rounded-full border-2 border-white border-t-transparent animate-spin"></div>): 'Post Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default AddProjectForm;