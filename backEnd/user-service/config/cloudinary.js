// config/cloudinary.js
import pkg from 'cloudinary';
import dotenv from 'dotenv';
dotenv.config();

const { v2: cloudinary } = pkg;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


export const uploadToCloudinary = async (fileBuffer, folder) => {
  return await cloudinary.uploader.upload_stream({
    resource_type: "image",
    folder: folder,
  }, (error, result) => {
    if (error) throw error;
    return result;
  });
};

export const removeFromCloudinary = async (publicId) => {
  return await cloudinary.uploader.destroy(publicId);
};

export default cloudinary;
