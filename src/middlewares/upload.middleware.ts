import multer from 'multer'
import path from 'path'
import { Request, Response, NextFunction } from 'express'

const createResponse = (statusCode: number, data: any, message: string) => ({
  statusCode,
  data,
  message,
  timestamp: new Date().toISOString()
})

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/temp') // Temporary storage before uploading to Cloudinary
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname))
  }
})

// File filter for images only
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif']
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(new Error('Only image files (JPEG, JPG, PNG, GIF) are allowed'))
  }
}

// Configure multer
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: fileFilter
})

// Middleware for single image upload
export const uploadSingle = (fieldName: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const uploadMiddleware = upload.single(fieldName)
    
    uploadMiddleware(req, res, (err: any) => {
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          res.status(400).json(createResponse(400, [], 'File size too large. Maximum size is 5MB'))
          return
        }
        res.status(400).json(createResponse(400, [], `Upload error: ${err.message}`))
        return
      } else if (err) {
        res.status(400).json(createResponse(400, [], err.message))
        return
      }
      next()
    })
  }
}

// Middleware for avatar upload
export const uploadAvatar = uploadSingle('avatar')
