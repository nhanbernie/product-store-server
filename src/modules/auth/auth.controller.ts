import { Request, Response } from 'express'
import jwt, { SignOptions } from 'jsonwebtoken'
import User from '../../models/user.model.js'
import logger from '../../utils/logger.js'
import { sendEmail } from '../../utils/email.js'
import config from '../../config/index.js'

const generateTokens = (userId: string) => {
  const jwtSecret = config.jwtSecret || 'fallback-secret-key'
  const jwtRefreshSecret = config.jwtRefreshSecret || 'fallback-refresh-secret-key'
  const jwtExpiresIn = config.jwtExpiresIn || '1h'
  const jwtRefreshExpiresIn = config.jwtRefreshExpiresIn || '7d'

  const accessToken = jwt.sign({ userId }, jwtSecret as string, { expiresIn: jwtExpiresIn as string } as SignOptions)
  const refreshToken = jwt.sign(
    { userId },
    jwtRefreshSecret as string,
    { expiresIn: jwtRefreshExpiresIn as string } as SignOptions
  )

  return { accessToken, refreshToken }
}

const createResponse = (statusCode: number, data: any, message: string) => ({
  statusCode,
  data,
  message,
  timestamp: new Date().toISOString()
})

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, name } = req.body

    const existingUser = await User.findOne({ email })
    if (existingUser) {
      res.status(400).json(createResponse(400, [], 'Email already exists'))
      return
    }

    const user = new User({ email, password, name })
    await user.save()

    const { accessToken, refreshToken } = generateTokens((user._id as any).toString())

    user.refreshToken = refreshToken
    await user.save()

    logger.info('User registered successfully', { userId: user._id })

    res.status(201).json(
      createResponse(
        201,
        [
          {
            user: {
              id: user._id,
              email: user.email,
              name: user.name,
              role: user.role
            },
            accessToken,
            refreshToken
          }
        ],
        'User registered successfully'
      )
    )
  } catch (error) {
    logger.error('Registration error', { error })
    res.status(500).json(createResponse(500, [], 'Registration failed'))
  }
}

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body

    const user = await User.findOne({ email })
    if (!user || !(await (user as any).comparePassword(password))) {
      res.status(401).json(createResponse(401, [], 'Invalid credentials'))
      return
    }

    const { accessToken, refreshToken } = generateTokens((user._id as any).toString())

    user.refreshToken = refreshToken
    await user.save()

    logger.info('User logged in successfully', { userId: user._id })

    res.json(
      createResponse(
        200,
        [
          {
            user: {
              id: user._id,
              email: user.email,
              name: user.name,
              role: user.role
            },
            accessToken,
            refreshToken
          }
        ],
        'Login successful'
      )
    )
  } catch (error) {
    logger.error('Login error', { error })
    res.status(500).json(createResponse(500, [], 'Login failed'))
  }
}

export const refreshToken = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body

    if (!refreshToken) {
      res.status(401).json(createResponse(401, [], 'Refresh token required'))
      return
    }

    const decoded = jwt.verify(refreshToken, config.jwtRefreshSecret) as { userId: string }
    const user = await User.findById(decoded.userId)

    if (!user || user.refreshToken !== refreshToken) {
      res.status(401).json(createResponse(401, [], 'Invalid refresh token'))
      return
    }

    const tokens = generateTokens((user._id as any).toString())
    user.refreshToken = tokens.refreshToken
    await user.save()

    res.json(createResponse(200, [tokens], 'Token refreshed successfully'))
  } catch (error) {
    logger.error('Token refresh error', { error })
    res.status(401).json(createResponse(401, [], 'Invalid refresh token'))
  }
}

export const logout = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId

    await User.findByIdAndUpdate(userId, { refreshToken: undefined })

    logger.info('User logged out successfully', { userId })

    res.json(createResponse(200, [], 'Logout successful'))
  } catch (error) {
    logger.error('Logout error', { error })
    res.status(500).json(createResponse(500, [], 'Logout failed'))
  }
}

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body

    const user = await User.findOne({ email })
    if (!user) {
      res.status(404).json(createResponse(404, [], 'User not found'))
      return
    }

    // Generate 6-digit reset code
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString()
    user.resetPasswordToken = resetCode
    user.resetPasswordExpires = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes
    await user.save()

    await sendEmail({
      to: user.email,
      subject: 'Password Reset Code',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Password Reset Request</h2>
          <p>You have requested to reset your password. Please use the following code:</p>
          <div style="background-color: #f5f5f5; padding: 20px; text-align: center; margin: 20px 0;">
            <h1 style="color: #007bff; font-size: 32px; margin: 0; letter-spacing: 5px;">${resetCode}</h1>
          </div>
          <p><strong>This code will expire in 10 minutes.</strong></p>
          <p>If you didn't request this password reset, please ignore this email.</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
          <p style="color: #666; font-size: 12px;">This is an automated message, please do not reply.</p>
        </div>
      `
    })

    logger.info('Password reset code sent', { userId: user._id as any, email: user.email })

    res.json(createResponse(200, [{ resetId: (user._id as any).toString() }], 'Password reset code sent to your email'))
  } catch (error) {
    logger.error('Forgot password error', { error })
    res.status(500).json(createResponse(500, [], 'Failed to send reset email'))
  }
}

export const verifyResetCode = async (req: Request, res: Response) => {
  try {
    const { resetId, resetCode } = req.body

    const user = await User.findOne({
      _id: resetId,
      resetPasswordToken: resetCode,
      resetPasswordExpires: { $gt: new Date() }
    })

    if (!user) {
      res.status(400).json(createResponse(400, [], 'Invalid or expired reset code'))
      return
    }

    logger.info('Reset code verified successfully', { userId: user._id as any })

    res.json(createResponse(200, [], 'Reset code verified successfully'))
  } catch (error) {
    logger.error('Verify reset code error', { error })
    res.status(500).json(createResponse(500, [], 'Failed to verify reset code'))
  }
}

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { resetId, resetCode, newPassword } = req.body

    const user = await User.findOne({
      _id: resetId,
      resetPasswordToken: resetCode,
      resetPasswordExpires: { $gt: new Date() }
    })

    if (!user) {
      res.status(400).json(createResponse(400, [], 'Invalid or expired reset code'))
      return
    }

    user.password = newPassword
    user.resetPasswordToken = undefined
    user.resetPasswordExpires = undefined
    user.refreshToken = undefined
    await user.save()

    logger.info('Password reset successfully', { userId: user._id as any })

    res.json(createResponse(200, [], 'Password reset successful'))
  } catch (error) {
    logger.error('Reset password error', { error })
    res.status(500).json(createResponse(500, [], 'Password reset failed'))
  }
}
