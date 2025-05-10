
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "./cloudinary.js";
import path from "path";

const fileStorage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    const ext = path.extname(file.originalname).replace('.', '');
    return {
      folder: "project-files",
      resource_type: "raw", 
      format: ext || 'pdf',
      public_id: `file_${Date.now()}`,
    };
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/zip",
    "application/x-zip-compressed"
  ];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only PDF, DOC, DOCX, and ZIP files are allowed"), false);
  }
};

const fileUpload = multer({ storage: fileStorage, fileFilter });

export default fileUpload;
