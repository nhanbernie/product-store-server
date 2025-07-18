import express, { Request, Response } from 'express'
import cors from 'cors'
import productRoutes from './routers/product.routes.js'
import authRoutes from './routers/auth.routes.js'
import userRoutes from './routers/user.routes.js'
import profileRoutes from './routers/profile.routes.js'
import orderRoutes from './routers/order.routes.js'
import { errorHandler } from './middlewares/error.middleware.js'
import logger from './utils/logger.js'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import config from './config/index.js'

const app = express()

app.use(helmet())
app.use(cors())
app.use(express.json())

const limiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.max
})

// Apply rate limiting
app.use('/api', limiter)

// API Routes
app.use('/api/auth', authRoutes)
app.use('/api/products', productRoutes)
app.use('/api/users', userRoutes)
app.use('/api/profile', profileRoutes)
app.use('/api/orders', orderRoutes)

// Health check
app.get('/health', (_req: Request, res: Response) => {
  res.json({
    status: 'OK',
    message: 'Server is running!',
    timestamp: new Date().toISOString()
  })
})

app.use(errorHandler)

export default app
