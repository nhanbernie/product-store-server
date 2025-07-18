import {
  register,
  login,
  logout,
  refreshToken,
  forgotPassword,
  verifyResetCode,
  resetPassword
} from '../modules/auth/auth.controller.js'
import { authenticateToken } from '../middlewares/auth.middleware.js'
import { validateAuth } from '../middlewares/validation.middleware.js'
import { Router } from 'express'

const router = Router()

router.post('/register', validateAuth.register, register)
router.post('/login', validateAuth.login, login)
router.post('/logout', authenticateToken, logout)
router.post('/refresh-token', validateAuth.refreshToken, refreshToken)
router.post('/forgot-password', validateAuth.forgotPassword, forgotPassword)
router.post('/verify-reset-code', validateAuth.verifyResetCode, verifyResetCode)
router.post('/reset-password', validateAuth.resetPassword, resetPassword)

export default router
