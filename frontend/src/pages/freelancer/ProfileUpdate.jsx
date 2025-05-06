import React, {useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Cropper from 'react-easy-crop';
import { validateProfileForm, formatProfileData } from '../../util/formValidate';
import { Camera, X } from 'lucide-react';
import { ProfileImgUpdate, updateProfile } from '../../apis/userApi';
import { toast } from 'sonner';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserData } from '../../redux/thunk/userThunk';

const ProfileUpdate = () => {
  const user = useSelector((state)=>state.user.user);
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    userName: '',
    email: '',
    position:"",
    phoneNumber: 0,
    skills: '',
    about: '',
    pricePerHour: 0,
    gitHub: '',
    linkedIn: '',
    twitter: '',
    web: '',
    address: ''
  });
  
  const [errors, setErrors] = useState({});
  const [image, setImage] = useState(null);
  const [croppedImage, setCroppedImage] = useState('');
  const [showCropper, setShowCropper] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [loading,setLoading] = useState({crop:false,update:false})
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      setFormData({
        userName: user?.userName || '',
        email: user?.email || '',
        phoneNumber: user?.phoneNumber || '',
        position : user?.position || "",
        skills: Array.isArray(user?.skills) ? user?.skills.join(', ') : user?.skills || '',
        about: user?.about || '',
        pricePerHour: user?.pricePerHour || '',
        gitHub: user?.gitHub || '',
        linkedIn: user?.linkedIn || '',
        twitter: user?.twitter || '',
        web: user?.web || '',
        address: user?.address || ''
      });
      
      if (user.profileImage) {
        setCroppedImage(user.profileImage);
      }
    }
  }, [user]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };


  const handleImageSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const validTypes = ['image/jpeg', 'image/png'];
        if (!validTypes.includes(file.type)) {
          toast.error('Only JPG and PNG files are allowed');
          return;
        }
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result);
        setShowCropper(true);
      };
      reader.readAsDataURL(file);
    }
  };


  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);


  
     const createCroppedImage = async () => {
      try {
        
        const canvas = document.createElement('canvas');
        const imageObj = new Image();
        imageObj.src = image;
    
        imageObj.onload = () => {
          const scaleX = imageObj.naturalWidth / imageObj.width;
          const scaleY = imageObj.naturalHeight / imageObj.height;
          canvas.width = croppedAreaPixels.width;
          canvas.height = croppedAreaPixels.height;
    
          const ctx = canvas.getContext('2d');
          ctx.drawImage(
            imageObj,
            croppedAreaPixels.x * scaleX,
            croppedAreaPixels.y * scaleY,
            croppedAreaPixels.width * scaleX,
            croppedAreaPixels.height * scaleY,
            0,
            0,
            croppedAreaPixels.width,
            croppedAreaPixels.height
          );
    
          canvas.toBlob(async (blob) => {
            const formData = new FormData();
            formData.append('croppedImage', blob, 'cropped.jpg');
    
            try {
              setLoading((val)=>({...val,crop:true}));
              const response = await ProfileImgUpdate(formData,'profile');
              if(!response.data.status) return toast.error(response.data.message);
              const result = await dispatch(fetchUserData());
                    
              if (fetchUserData.fulfilled.match(result)) {
                setShowCropper(false)
                toast.success(response.data.message);
              } 
            } catch (error) {
              console.log(error)
              toast.error(error.response?.data?.message || "Something went wrong");
            }finally{
              setLoading((val)=>({...val,crop:false}));
            }
          }, 'image/jpeg');
        };
      } catch (error) {
        console.error('Error cropping image:', error);
        console.log(error)
        toast.error(error.response?.data?.message || "Something went wrong");
      }
    };


  const handleSubmit = async () => {
  
    const { errors, isValid } = validateProfileForm(formData);
    if (!isValid) {
      setErrors(errors);
  
      const firstError = Object.keys(errors)[0];
      const errorElement = document.getElementById(firstError);
      if (errorElement) {
        errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }
  
    const formattedData = formatProfileData(formData);
  

    try {
      setLoading((val)=>({...val,update:true}));
      const response = await updateProfile(formattedData);
      if (!response.data.status) return toast.error(response.data.message);


      const result = await dispatch(fetchUserData());
      
          if (fetchUserData.fulfilled.match(result)) {
            toast.success(response.data.message);
          navigate('/freelancer/profile');
          }  
    } catch (error) {
      console.log(error)
      toast.error(error.response?.data?.message || "Something went wrong");
    }finally{
      setLoading((val)=>({...val,update:false}));
    }
  };
  

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold text-center mb-8">Profile Update</h1>
      

      <div className="flex justify-center mb-8">
        <div className="relative">
          <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden border-4 border-blue-100 shadow-md">
            {croppedImage ? (
              <img src={croppedImage} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <span className="text-gray-400">Photo</span>
            )}
          </div>
          <label 
            htmlFor="profile-image"
            className="absolute bottom-0 right-0 bg-blue-500 text-white p-2 rounded-full shadow-md hover:bg-blue-600 cursor-pointer"
          >
            <Camera size={16} />
            <input 
              type="file" 
              id="profile-image" 
              accept="image/jpeg, image/png" 
              className="hidden" 
              onChange={handleImageSelect}
            />
          </label>
        </div>
      </div>
      
      {showCropper && (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-xl w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Crop Image</h3>
              <button 
                onClick={() => {
                  setShowCropper(false);
                  setImage(null);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="relative h-60 w-full mb-6">
              <Cropper
                image={image}
                crop={crop}
                zoom={zoom}
                aspect={1}
                cropShape="round"
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
              />
            </div>
            
            <div className="mb-6">
              <label htmlFor="zoom" className="block text-sm font-medium text-gray-700 mb-1">
                Zoom: {zoom.toFixed(1)}x
              </label>
              <input
                type="range"
                id="zoom"
                min={1}
                max={3}
                step={0.1}
                value={zoom}
                onChange={(e) => setZoom(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>
            
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => {
                  setShowCropper(false); 
                  setImage(null);
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={createCroppedImage}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 cursor-pointer flex justify-center items-center"
              disabled={loading.crop}>
                 {loading.crop?(
                <div className="h-5 w-5 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
              ):(
                "Apply"
              )}                         
              </button>
            </div>
          </div>
        </div>
      )}
      
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex-1 space-y-6">
            <div>
              <label htmlFor="userName" className="block text-sm font-medium text-gray-700 mb-1">Name:</label>
              <input
                type="text"
                id="userName"
                name="userName"
                value={formData?.userName}
                onChange={handleChange}
                className={`w-full p-3 bg-gray-50 border ${errors.userName ? 'border-red-500' : 'border-gray-200'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition`}
                placeholder="Enter your full name"
              disabled/>
              {errors.userName && (
                <p className="mt-1 text-sm text-red-500">{errors.userName}</p>
              )}
            </div>

            <div>
              <label htmlFor="position" className="block text-sm font-medium text-gray-700 mb-1">Position:</label>
              <input
                type="text"
                id="position"
                name="position"
                value={formData?.position}
                onChange={handleChange}
                className={`w-full p-3 bg-gray-50 border ${errors.position ? 'border-red-500' : 'border-gray-200'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition`}
                placeholder="Enter your Position"
              />
              {errors.position && (
                <p className="mt-1 text-sm text-red-500">{errors.position}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email:</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData?.email}
                onChange={handleChange}
                className={`w-full p-3 bg-gray-50 border ${errors.email ? 'border-red-500' : 'border-gray-200'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition`}
                placeholder="your@email.com"
              disabled/>
              {errors.email && (
                <p className="mt-1 text-sm text-red-500">{errors.email}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone:</label>
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                value={formData?.phoneNumber}
                onChange={handleChange}
                className={`w-full p-3 bg-gray-50 border ${errors.phoneNumber ? 'border-red-500' : 'border-gray-200'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition`}
                placeholder="+91 2548615486"
              maxLength={10}/>
              {errors.phoneNumber && (
                <p className="mt-1 text-sm text-red-500">{errors.phoneNumber}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="skills" className="block text-sm font-medium text-gray-700 mb-1">Skills:</label>
              <textarea
                id="skills"
                name="skills"
                value={formData?.skills}
                onChange={handleChange}
                rows="4"
                className={`w-full p-3 bg-gray-50 border ${errors.skills ? 'border-red-500' : 'border-gray-200'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition`}
                placeholder="List your key skills (comma separated)"
              />
              <p className="mt-1 text-xs text-gray-500">Enter skills separated by commas (e.g., React, JavaScript, UI Design)</p>
              {errors.skills && (
                <p className="mt-1 text-sm text-red-500">{errors.skills}</p>
              )}
            </div>
          </div>
          
          <div className="flex-1 space-y-6">
            <div>
              <label htmlFor="about" className="block text-sm font-medium text-gray-700 mb-1">About:</label>
              <textarea
                id="about"
                name="about"
                value={formData?.about}
                onChange={handleChange}
                rows="4"
                className={`w-full p-3 bg-gray-50 border ${errors.about ? 'border-red-500' : 'border-gray-200'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition`}
                placeholder="Tell us about yourself..."
              />
              {errors.about && (
                <p className="mt-1 text-sm text-red-500">{errors.about}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="pricePerHour" className="block text-sm font-medium text-gray-700 mb-1">Price(/hr):</label>
              <input
                type="text"
                id="pricePerHour"
                name="pricePerHour"
                value={formData?.pricePerHour}
                onChange={handleChange}
                className={`w-full p-3 bg-gray-50 border ${errors.pricePerHour ? 'border-red-500' : 'border-gray-200'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition`}
                placeholder="$0.00"
              />
              {errors.pricePerHour && (
                <p className="mt-1 text-sm text-red-500">{errors.pricePerHour}</p>
              )}
            </div>

            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">Address:</label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData?.address}
                onChange={handleChange}
                className={`w-full p-3 bg-gray-50 border ${errors.address ? 'border-red-500' : 'border-gray-200'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition`}
                placeholder="Your location"
              />
              {errors.address && (
                <p className="mt-1 text-sm text-red-500">{errors.address}</p>
              )}
            </div>
          </div>
        </div>
        
        <div className="pt-4">
          <h2 className="text-lg font-medium text-gray-800 mb-4">Social Links</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="gitHub" className="block text-sm font-medium text-gray-700 mb-1">GitHub:</label>
              <input
                type="text"
                id="gitHub"
                name="gitHub"
                value={formData?.gitHub}
                onChange={handleChange}
                className={`w-full p-3 bg-gray-50 border ${errors.gitHub ? 'border-red-500' : 'border-gray-200'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition`}
                placeholder="github.com/username"
              />
              {errors.gitHub && (
                <p className="mt-1 text-sm text-red-500">{errors.gitHub}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="linkedIn" className="block text-sm font-medium text-gray-700 mb-1">LinkedIn:</label>
              <input
                type="text"
                id="linkedIn"
                name="linkedIn"
                value={formData.linkedIn}
                onChange={handleChange}
                className={`w-full p-3 bg-gray-50 border ${errors.linkedIn ? 'border-red-500' : 'border-gray-200'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition`}
                placeholder="linkedin.com/in/username"
              />
              {errors.linkedIn && (
                <p className="mt-1 text-sm text-red-500">{errors.linkedIn}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="twitter" className="block text-sm font-medium text-gray-700 mb-1">Twitter:</label>
              <input
                type="text"
                id="twitter"
                name="twitter"
                value={formData.twitter}
                onChange={handleChange}
                className={`w-full p-3 bg-gray-50 border ${errors.twitter ? 'border-red-500' : 'border-gray-200'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition`}
                placeholder="twitter.com/username"
              />
              {errors.twitter && (
                <p className="mt-1 text-sm text-red-500">{errors.twitter}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="web" className="block text-sm font-medium text-gray-700 mb-1">Web:</label>
              <input
                type="text"
                id="web"
                name="web"
                value={formData.web}
                onChange={handleChange}
                className={`w-full p-3 bg-gray-50 border ${errors.web ? 'border-red-500' : 'border-gray-200'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition`}
                placeholder="www.yourwebsite.com"
              />
              {errors.web && (
                <p className="mt-1 text-sm text-red-500">{errors.web}</p>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex justify-end space-x-4 pt-6">
          <button 
            onClick={() => navigate('/freelancer/profile')}
            type="button" 
            className="px-6 py-3 border border-red-300 text-red-500 rounded-lg hover:bg-red-50 font-medium transition-colors"
          >
            Cancel
          </button>
          <button 
            type="button"
            onClick={handleSubmit}
            className="px-8 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium shadow-md transition-colors cursor-pointer flex justify-center items-center" disabled={loading.update}
          >
             {loading.update?(
                <div className="h-5 w-5 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
              ):(
                "Update"
              )}           
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileUpdate;