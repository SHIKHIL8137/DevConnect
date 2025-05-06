import multer from "multer";
import {CloudinaryStorage } from 'multer-storage-cloudinary'
import cloudinary from "./cloudinary.js";

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'cropped-images',
    format: async () => 'jpeg',
    public_id: (req, file) => 'blob_' + Date.now(),
  },
});


const upload = multer({ storage });

export default upload;