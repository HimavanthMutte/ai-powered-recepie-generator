import multer from "multer";
import path from "path";

import { type Request } from "express"; // Importing the Request type from Express for type safety rather than browser level Request object

const storage = multer.memoryStorage();

// MIME - it is nothing but information provided to the server by browser which includes the details of data which being communicated over
// Normally included in headers - type/subtype format ex: image/png
const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: CallableFunction,
) => {
  const allowedExtensions = /\.(jpeg|jpg|webp)$/i;

  const allowedMimeTypes = /^image\/(jpeg|webp|jpg)$/i;

  const extname = path.extname(file.originalname);
  const mimetype = file.mimetype;

  const extTest = allowedExtensions.test(extname);
  const mimeTest = allowedMimeTypes.test(mimetype);

  console.log({
    originalname: file.originalname,
    extname,
    mimetype,
    extTest,
    mimeTest,
  });

  if (extTest && mimeTest) {
    cb(null, true);
  } else {
    cb(new Error("Only image files (jpeg, jpg, webp) are allowed!"));
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});

export default upload;
