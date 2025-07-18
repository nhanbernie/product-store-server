import { Router } from 'express'
import { getProfile, updateProfile, uploadAvatar } from '../modules/profile/profile.controller.js'
import { authenticateToken } from '../middlewares/auth.middleware.js'
import { validateProfile } from '../middlewares/validation.middleware.js'
import { uploadAvatar as uploadAvatarMiddleware } from '../middlewares/upload.middleware.js'

const router = Router()

// Tất cả profile routes đều cần authentication
router.use(authenticateToken)

// GET /api/profile - Xem thông tin profile của user hiện tại
router.get('/', getProfile)

// PUT /api/profile - Cập nhật thông tin profile
router.put('/', validateProfile.update, updateProfile)

// POST /api/profile/avatar - Upload avatar
router.post('/avatar', uploadAvatarMiddleware, uploadAvatar)

export default router
