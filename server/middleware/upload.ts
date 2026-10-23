import multer from "multer";
import path from "path";
import type { Request } from "express";

const storage = multer.memoryStorage();

const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback,
) => {
  const allowedExtensions = /\.(jpeg|jpg|png|webp|gif|heic)$/i;
  const allowedMimeTypes = /^image\/(jpeg|webp|jpg|png|gif|heic)$/i;

  const extname = path.extname(file.originalname).toLowerCase();
  const mimetype = file.mimetype;

  if (allowedExtensions.test(extname) || allowedMimeTypes.test(mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only image files (jpeg, jpg, png, webp, gif) are allowed!"));
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 15 * 1024 * 1024, // 15MB
  },
});

export default upload;
