import { Router } from 'express'
import { authenticateToken, requireAdmin } from '../middlewares/auth.middleware.js'
import User from '../models/user.model.js'
import logger from '../utils/logger.js'

const router = Router()

const createResponse = (statusCode: number, data: any, message: string) => ({
  statusCode,
  data,
  message,
  timestamp: new Date().toISOString()
})

// GET /api/users - Xem danh sách users (chỉ admin)
router.get('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const users = await User.find({})
      .select('-password -refreshToken -resetPasswordToken -resetPasswordExpires')
      .sort({ createdAt: -1 })

    logger.info('Users fetched by admin', { 
      count: users.length, 
      adminId: (req as any).user.userId 
    })

    res.json(createResponse(200, users, 'Users fetched successfully'))
  } catch (error) {
    logger.error('Error fetching users', { error })
    res.status(500).json(createResponse(500, [], 'Error fetching users'))
  }
})

// PATCH /api/users/:id/role - Đổi role user (chỉ admin)
router.patch('/:id/role', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { role } = req.body
    const userId = req.params.id
    const adminId = (req as any).user.userId

    // Validate role
    if (!role || !['user', 'admin'].includes(role)) {
      res.status(400).json(createResponse(400, [], 'Invalid role. Must be "user" or "admin"'))
      return
    }

    // Không cho phép admin đổi role của chính mình
    if (userId === adminId) {
      res.status(403).json(createResponse(403, [], 'Cannot change your own role'))
      return
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { role },
      { new: true, runValidators: true }
    ).select('-password -refreshToken -resetPasswordToken -resetPasswordExpires')

    if (!user) {
      res.status(404).json(createResponse(404, [], 'User not found'))
      return
    }

    logger.info('User role updated by admin', { 
      userId, 
      newRole: role, 
      adminId,
      userEmail: user.email 
    })

    res.json(createResponse(200, [user], `User role updated to ${role} successfully`))
  } catch (error) {
    logger.error('Error updating user role', { error })
    res.status(500).json(createResponse(500, [], 'Error updating user role'))
  }
})

export default router
