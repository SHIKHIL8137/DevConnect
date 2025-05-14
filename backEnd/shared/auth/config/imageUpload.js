import cloudinary from "./cloudinary";


export const uploadToCloudinary = async (fileBuffer, folder) => {
  return await cloudinary.uploader.upload_stream(
    {
      resource_type: "image",
      folder: folder,
    },
    (error, result) => {
      if (error) throw error;
      return result;
    }
  );
};

export const removeFromCloudinary = async (publicId) => {
  return await cloudinary.uploader.destroy(publicId);
};
