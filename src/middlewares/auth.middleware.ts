import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import User from '../models/user.model.js'
import config from '../config/index.js'

export const authenticateToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization
    const token = authHeader && authHeader.split(' ')[1]

    if (!token) {
      res.status(401).json({
        statusCode: 401,
        data: [],
        message: 'Access token required',
        timestamp: new Date().toISOString()
      })
      return
    }

    const decoded = jwt.verify(token, config.jwtSecret) as { userId: string }
    const user = await User.findById(decoded.userId)

    if (!user) {
      res.status(401).json({
        statusCode: 401,
        data: [],
        message: 'Invalid token',
        timestamp: new Date().toISOString()
      })
      return
    }

    ;(req as any).user = { userId: user._id, role: user.role }
    next()
  } catch (error) {
    res.status(401).json({
      statusCode: 401,
      data: [],
      message: 'Invalid token',
      timestamp: new Date().toISOString()
    })
    return
  }
}

export const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
  if ((req as any).user.role !== 'admin') {
    res.status(403).json({
      statusCode: 403,
      data: [],
      message: 'Admin access required',
      timestamp: new Date().toISOString()
    })
    return
  }
  next()
}
