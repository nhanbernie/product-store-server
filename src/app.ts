import express, { Request, Response } from 'express';
import cors from 'cors';
import productRoutes from './routers/product.routes.js';
import authRoutes from './routers/auth.routes.js';
import { errorHandler } from './middlewares/error.middleware.js';
import logger from './utils/logger.js';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import config from './config/index.js';

const app = express()

app.use(helmet())
app.use(cors())
app.use(express.json())

const limiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.max
})

app.use('/api/auth', authRoutes)
app.use('/api/products', productRoutes)

app.get('/product', (req: Request, res: Response) => {
  res.send('Server is running!')
})

app.use(errorHandler);

export default app
