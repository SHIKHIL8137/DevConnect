import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "./cloudinary.js";

const fileStorage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    const mimeToFormat = {
      "application/pdf": "pdf",
      "application/msword": "doc",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        "docx",
      "application/zip": "zip",
      "application/x-zip-compressed": "zip",
    };
    const format = mimeToFormat[file.mimetype] || "pdf";
    return {
      folder: "project-files",
      resource_type: "auto",
      format,
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
    "application/x-zip-compressed",
  ];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only PDF, DOC, DOCX, and ZIP files are allowed"), false);
  }
};

const fileUpload = multer({
  storage: fileStorage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 },
});

export default fileUpload;
