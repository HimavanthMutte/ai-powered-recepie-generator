import multer from "multer"
import path from "path"

import {type Request} from "express" // Importing the Request type from Express for type safety rather than browser level Request object

const storage = multer.memoryStorage()

// MIME - it is nothing but information provided to the server by browser which includes the details of data which being communicated over
// Normally included in headers - type/subtype format ex: image/png
const fileFilter = (req:Request, file:Express.Multer.File,cb:CallableFunction)=>{
    const allowedTypes = /jpeg|jpg|png|webp/;
    const extname = path.extname(file.originalname).toLocaleLowerCase()
    const extTest:boolean = allowedTypes.test(extname)
    const mimeTest:boolean = allowedTypes.test(file.mimetype)

    if (extTest && mimeTest) {
        cb(null,true)
    }

    else {
        cb(new Error("Only image files (jpeg, jpg, png, webp, gif) are allowed!"))
    }

}

const upload = multer({ 
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024
    }
})

export default upload