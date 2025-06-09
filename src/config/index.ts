import dotenv from 'dotenv'
import path from 'path'

// Load environment variables based on NODE_ENV
const envFile = process.env.NODE_ENV === 'production' ? '.env.production' : '.env'
dotenv.config({ path: path.resolve(process.cwd(), envFile) })

const config = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 1901,
  mongoUri: process.env.MONGO_URI as string,
  jwtSecret: process.env.JWT_SECRET as string,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    apiSecret: process.env.CLOUDINARY_API_SECRET
  },
  fileUpload: {
    maxSize: parseInt(process.env.MAX_FILE_SIZE || '5000000'),
    allowedTypes: (process.env.ALLOWED_FILE_TYPES || 'jpg,jpeg,png,gif').split(',')
  },
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'),
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100')
  }
}

export default config
